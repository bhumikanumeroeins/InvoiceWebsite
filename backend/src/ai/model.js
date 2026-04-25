import { GoogleGenerativeAI } from "@google/generative-ai";

let client;

const getClient = () => {
  if (client) {
    return client;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("AI provider is not configured");
  }

  client = new GoogleGenerativeAI(apiKey);
  return client;
};

export const getJsonModel = ({
  task = "extract",
  systemInstruction,
  responseSchema,
}) => {
  const model =
    process.env.GEMINI_EXTRACT_MODEL ||
    process.env.GEMINI_MODEL ||
    "gemini-2.5-flash";
  const cachedContent =
    (task === "refine"
      ? process.env.GEMINI_REFINE_CACHED_CONTENT
      : process.env.GEMINI_EXTRACT_CACHED_CONTENT) || undefined;

  return getClient().getGenerativeModel({
    model,
    systemInstruction,
    cachedContent,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema,
      temperature: task === "refine" ? 0.1 : 0.2,
      topP: 0.8,
      maxOutputTokens: task === "refine" ? 2048 : 3072,
    },
  });
};

export const parseJsonModelResponse = (result, label) => {
  const rawText = result?.response?.text?.()?.trim?.() || "";
  const sanitized = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  const tryParse = (value) => {
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  };

  const parsedDirect = tryParse(sanitized);
  if (parsedDirect !== null) {
    return parsedDirect;
  }

  const extractFirstJsonBlock = (text) => {
    const starts = ["{", "["];
    for (let startIndex = 0; startIndex < text.length; startIndex += 1) {
      if (!starts.includes(text[startIndex])) {
        continue;
      }

      const opening = text[startIndex];
      const closing = opening === "{" ? "}" : "]";
      let depth = 0;
      let inString = false;
      let escaped = false;

      for (let index = startIndex; index < text.length; index += 1) {
        const char = text[index];
        if (inString) {
          if (escaped) {
            escaped = false;
          } else if (char === "\\") {
            escaped = true;
          } else if (char === '"') {
            inString = false;
          }
          continue;
        }

        if (char === '"') {
          inString = true;
          continue;
        }

        if (char === opening) depth += 1;
        if (char === closing) depth -= 1;

        if (depth === 0) {
          return text.slice(startIndex, index + 1);
        }
      }
    }

    return "";
  };

  const extracted = extractFirstJsonBlock(sanitized);
  const parsedExtracted = tryParse(extracted);
  if (parsedExtracted !== null) {
    return parsedExtracted;
  }

  console.error(`${label} returned invalid JSON`, {
    length: rawText.length,
    preview: sanitized.slice(0, 200),
  });
  throw new Error("AI returned invalid JSON");
};
