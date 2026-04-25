import {
  applyInvoiceRefinement,
  buildAiMessage,
  buildInvoiceDefaults,
  derivePlaceholderFields,
  extractDeterministicRefinement,
  extractHeuristicInvoiceData,
  getMissingRequiredFields,
  hasRequiredInvoiceFields,
  mergeCanonicalInvoices,
  normalizeCanonicalInvoice,
  normalizeInvoiceData,
} from "../../ai/invoiceData.js";
import {
  EXTRACT_RESPONSE_SCHEMA,
  GENERATE_RESPONSE_SCHEMA,
  REFINE_RESPONSE_SCHEMA,
} from "../../ai/invoiceSchema.js";
import { getJsonModel, parseJsonModelResponse } from "../../ai/model.js";
import {
  getOrCreatePublicSession,
  savePublicSession,
} from "../../ai/publicSession.js";
import {
  buildExtractPrompt,
  buildMissingRequiredFieldsQuestion,
  buildRefinePrompt,
  EXTRACT_SYSTEM_PROMPT,
  OPTIONAL_FIELD_LABELS,
  REFINE_SYSTEM_PROMPT,
} from "../../ai/prompts.js";
import {
  consumePublicUsageSlot,
  getPublicUsage,
  getPublicUsageKey,
  getRemainingPublicUsage,
  PUBLIC_LIMIT,
} from "../../ai/publicUsage.js";
import jwt from "jsonwebtoken";
import UserAiSession from "../../models/ai/userAiSession.js";

const GENERIC_FAILURE_MESSAGE =
  "Failed to process the AI request. Please try again.";

const getClientIp = (req) => req.ip || req.socket?.remoteAddress || "unknown";

const sanitizeText = (value, fallback = "") => {
  const text = typeof value === "string" ? value.trim() : "";
  return text || fallback;
};

const getLatestMessageText = (req) => {
  const directMessage = sanitizeText(req.body?.message);
  if (directMessage) {
    return directMessage;
  }

  const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index]?.role === "user") {
      const content = sanitizeText(messages[index]?.content);
      if (content) {
        return content;
      }
    }
  }

  return "";
};

const requestStructuredJson = async ({
  label,
  task,
  systemInstruction,
  responseSchema,
  prompt,
}) => {
  const model = getJsonModel({ task, systemInstruction, responseSchema });
  const result = await model.generateContent(prompt);
  return parseJsonModelResponse(result, label);
};

const buildDateContext = () => {
  const defaults = buildInvoiceDefaults(new Date());
  return {
    today: defaults.invoiceDate,
    dueDate: defaults.dueDate,
    defaults,
  };
};

const handleAiFailure = (label, error, res) => {
  console.error(`${label} error:`, error?.message || error);
  return res.status(500).json({
    success: false,
    message: GENERIC_FAILURE_MESSAGE,
  });
};

const incrementAndGetRemaining = async (ipAddress) => {
  const updatedUsage = await consumePublicUsageSlot(ipAddress);
  if (!updatedUsage) {
    return null;
  }
  return getRemainingPublicUsage(updatedUsage);
};

const saveSessionAndRespond = async ({
  session,
  knownContent,
  lastAction,
  res,
  payload,
  userId,
  userMessage,
  assistantPayload,
}) => {
  await savePublicSession(session, { knownContent, lastAction });

  // Persist to user session if authenticated
  if (userId && userMessage) {
    const newMessages = [
      { role: "user", content: userMessage },
      { role: "assistant", ...assistantPayload },
    ];
    const title = userMessage.slice(0, 60);
    await UserAiSession.findOneAndUpdate(
      { userId, sessionId: session.sessionId },
      {
        $set: { knownContent, lastAction, updatedAt: new Date() },
        $push: { messages: { $each: newMessages } },
        $setOnInsert: { title, userId, sessionId: session.sessionId },
      },
      { upsert: true, new: true },
    );
  }

  return res.status(200).json({
    success: true,
    sessionId: session.sessionId,
    ...payload,
  });
};

const sendLimitReached = (res) =>
  res.status(429).json({
    success: false,
    limitReached: true,
    message: `You've used all ${PUBLIC_LIMIT} free generations. Sign in to continue.`,
    remaining: 0,
  });

// Returns which optional field labels are already present in the canonical data
const getKnownOptionalFields = (canonical) => {
  const known = [];
  const addr1 = canonical?.business?.address1;
  if (addr1 && addr1 !== "[Your Business Address]")
    known.push(OPTIONAL_FIELD_LABELS.businessAddress);
  const clientAddr = canonical?.client?.address1;
  if (clientAddr && clientAddr !== "[Client Address]")
    known.push(OPTIONAL_FIELD_LABELS.clientAddress);
  if (canonical?.invoiceNumber) known.push(OPTIONAL_FIELD_LABELS.invoiceNumber);
  if (canonical?.taxRate && canonical.taxRate !== "0")
    known.push(OPTIONAL_FIELD_LABELS.tax);
  if (canonical?.terms) known.push(OPTIONAL_FIELD_LABELS.terms);
  if (canonical?.dueDate) known.push(OPTIONAL_FIELD_LABELS.dueDate);
  if (canonical?.payment?.bankName)
    known.push(OPTIONAL_FIELD_LABELS.bankDetails);
  return known;
};

const extractWithModelIfNeeded = async ({
  input,
  knownContent,
  today,
  dueDate,
  defaults,
}) => {
  const heuristicData = extractHeuristicInvoiceData(input);
  let mergedCanonical = mergeCanonicalInvoices(knownContent, heuristicData);

  if (!hasRequiredInvoiceFields(mergedCanonical)) {
    const modelData = await requestStructuredJson({
      label: "AI extract",
      task: "extract",
      systemInstruction: EXTRACT_SYSTEM_PROMPT,
      responseSchema: EXTRACT_RESPONSE_SCHEMA,
      prompt: buildExtractPrompt({
        input,
        today,
        dueDate,
        knownData: normalizeCanonicalInvoice(knownContent, {
          defaults,
          partial: true,
        }),
      }),
    });

    mergedCanonical = mergeCanonicalInvoices(mergedCanonical, modelData);
  }

  return mergedCanonical;
};

export const refineInvoice = async (req, res) => {
  try {
    const instruction = sanitizeText(req.body?.instruction);
    const currentContent = req.body?.currentContent;

    if (instruction.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please provide a refinement instruction",
      });
    }

    if (
      !currentContent ||
      typeof currentContent !== "object" ||
      Array.isArray(currentContent)
    ) {
      return res.status(400).json({
        success: false,
        message: "Current invoice content is required",
      });
    }

    const { today, dueDate, defaults } = buildDateContext();
    const deterministicDiff = extractDeterministicRefinement(
      instruction,
      currentContent,
      { defaults },
    );
    if (deterministicDiff) {
      return res.status(200).json({
        success: true,
        data: deterministicDiff,
      });
    }

    const rawUpdates = await requestStructuredJson({
      label: "AI refine",
      task: "refine",
      systemInstruction: REFINE_SYSTEM_PROMPT,
      responseSchema: REFINE_RESPONSE_SCHEMA,
      prompt: buildRefinePrompt({
        currentData: normalizeCanonicalInvoice(currentContent, {
          defaults,
          partial: false,
        }),
        instruction,
        today,
        dueDate,
      }),
    });

    const normalizedUpdates = applyInvoiceRefinement(
      currentContent,
      rawUpdates,
      defaults,
    );

    return res.status(200).json({
      success: true,
      data: normalizedUpdates,
    });
  } catch (error) {
    return handleAiFailure("AI refine", error, res);
  }
};

export const chatInvoice = async (req, res) => {
  try {
    const ipAddress = getClientIp(req);

    // Check if user is authenticated — skip quota for logged-in users
    let isAuthenticated = false;
    let authenticatedUserId = null;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        isAuthenticated = true;
        authenticatedUserId = decoded.userId;
      } catch {
        // invalid token — treat as public
      }
    }

    if (!isAuthenticated) {
      const usage = await getPublicUsage(ipAddress);
      if (usage.count >= PUBLIC_LIMIT) {
        return sendLimitReached(res);
      }
    }

    const message = getLatestMessageText(req);
    if (message.length < 1) {
      return res.status(400).json({
        success: false,
        message: "A user message is required",
      });
    }

    const usageKey = getPublicUsageKey(ipAddress);
    const session = await getOrCreatePublicSession({
      usageKey,
      sessionId: req.body?.sessionId,
    });

    const { today, dueDate, defaults } = buildDateContext();
    const knownCanonical = normalizeCanonicalInvoice(
      session.knownContent || {},
      {
        defaults,
        partial: session.lastAction !== "generate",
      },
    );

    if (hasRequiredInvoiceFields(knownCanonical)) {
      const deterministicDiff = extractDeterministicRefinement(
        message,
        normalizeInvoiceData(knownCanonical, { defaults, partial: false }),
        { defaults },
      );

      let updatedCanonical;

      if (deterministicDiff) {
        updatedCanonical = mergeCanonicalInvoices(
          knownCanonical,
          deterministicDiff,
        );
      } else {
        const rawUpdates = await requestStructuredJson({
          label: "AI chat refine",
          task: "refine",
          systemInstruction: REFINE_SYSTEM_PROMPT,
          responseSchema: REFINE_RESPONSE_SCHEMA,
          prompt: buildRefinePrompt({
            currentData: normalizeCanonicalInvoice(knownCanonical, {
              defaults,
              partial: false,
            }),
            instruction: message,
            today,
            dueDate,
          }),
        });

        updatedCanonical = mergeCanonicalInvoices(knownCanonical, rawUpdates);
      }

      const normalizedData = normalizeInvoiceData(updatedCanonical, {
        defaults,
      });
      const remaining = isAuthenticated
        ? null
        : await incrementAndGetRemaining(ipAddress);
      if (!isAuthenticated && remaining === null) {
        return sendLimitReached(res);
      }

      return saveSessionAndRespond({
        session,
        knownContent: normalizeCanonicalInvoice(updatedCanonical, {
          defaults,
          partial: false,
        }),
        lastAction: "generate",
        res,
        userId: isAuthenticated ? authenticatedUserId : null,
        userMessage: message,
        assistantPayload: {
          kind: "refined",
          content: buildAiMessage({ updated: true }),
        },
        payload: {
          action: "generate",
          data: normalizedData,
          extracted: null,
          question: null,
          message: buildAiMessage({ updated: true }),
          placeholders: [],
          remaining,
        },
      });
    }

    const mergedCanonical = await extractWithModelIfNeeded({
      input: message,
      knownContent: knownCanonical,
      today,
      dueDate,
      defaults,
    });

    if (hasRequiredInvoiceFields(mergedCanonical)) {
      const normalizedData = normalizeInvoiceData(mergedCanonical, {
        defaults,
      });
      const placeholders = derivePlaceholderFields(
        normalizedData,
        mergedCanonical,
        defaults,
      );
      const remaining = isAuthenticated
        ? null
        : await incrementAndGetRemaining(ipAddress);
      if (!isAuthenticated && remaining === null) {
        return sendLimitReached(res);
      }

      return saveSessionAndRespond({
        session,
        knownContent: normalizeCanonicalInvoice(mergedCanonical, {
          defaults,
          partial: false,
        }),
        lastAction: "generate",
        res,
        userId: isAuthenticated ? authenticatedUserId : null,
        userMessage: message,
        assistantPayload: {
          kind: "template-ready",
          content: buildAiMessage({ placeholders }),
        },
        payload: {
          action: "generate",
          data: normalizedData,
          extracted: null,
          question: null,
          message: buildAiMessage({ placeholders }),
          placeholders,
          remaining,
        },
      });
    }

    return saveSessionAndRespond({
      session,
      knownContent: normalizeCanonicalInvoice(mergedCanonical, {
        defaults,
        partial: true,
      }),
      lastAction: "ask",
      res,
      userId: isAuthenticated ? authenticatedUserId : null,
      userMessage: message,
      assistantPayload: {
        kind: "missing-fields",
        content: buildMissingRequiredFieldsQuestion(
          getMissingRequiredFields(mergedCanonical),
          getKnownOptionalFields(mergedCanonical),
        ),
      },
      payload: {
        action: "ask",
        data: null,
        extracted: normalizeInvoiceData(mergedCanonical, {
          defaults,
          partial: true,
        }),
        question: buildMissingRequiredFieldsQuestion(
          getMissingRequiredFields(mergedCanonical),
          getKnownOptionalFields(mergedCanonical),
        ),
        message: null,
        placeholders: [],
        remaining: isAuthenticated
          ? null
          : getRemainingPublicUsage(await getPublicUsage(ipAddress)),
      },
    });
  } catch (error) {
    return handleAiFailure("AI chat", error, res);
  }
};

export const generateInvoicePublic = async (req, res) => {
  try {
    const ipAddress = getClientIp(req);
    const usage = await getPublicUsage(ipAddress);
    if (usage.count >= PUBLIC_LIMIT) {
      return sendLimitReached(res);
    }

    const prompt = sanitizeText(req.body?.prompt);
    if (prompt.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Please provide a description of your invoice",
      });
    }

    const { today, dueDate, defaults } = buildDateContext();
    let canonicalData = extractHeuristicInvoiceData(prompt);

    if (!hasRequiredInvoiceFields(canonicalData)) {
      const modelData = await requestStructuredJson({
        label: "AI public generate",
        task: "extract",
        systemInstruction: EXTRACT_SYSTEM_PROMPT,
        responseSchema: GENERATE_RESPONSE_SCHEMA,
        prompt: buildExtractPrompt({ input: prompt, today, dueDate }),
      });

      canonicalData = mergeCanonicalInvoices(canonicalData, modelData);
    }

    const normalizedData = normalizeInvoiceData(canonicalData, { defaults });
    const remaining = await incrementAndGetRemaining(ipAddress);
    if (remaining === null) {
      return sendLimitReached(res);
    }

    return res.status(200).json({
      success: true,
      data: normalizedData,
      remaining,
    });
  } catch (error) {
    return handleAiFailure("AI public generate", error, res);
  }
};
