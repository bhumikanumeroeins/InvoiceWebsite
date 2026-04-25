import crypto from "node:crypto";
import PublicAiSession from "../models/ai/publicAiSession.js";

const SESSION_TTL_DAYS = 7;

const buildSessionExpiry = (now = new Date()) => {
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + SESSION_TTL_DAYS);
  return expiresAt;
};

const sanitizeSessionId = (value) => {
  const text = String(value || "").trim();
  if (/^[a-zA-Z0-9_-]{8,128}$/.test(text)) {
    return text;
  }
  return crypto.randomBytes(16).toString("hex");
};

const buildSessionKey = (usageKey, sessionId) =>
  crypto.createHash("sha256").update(`${usageKey}:${sessionId}`).digest("hex");

export const getOrCreatePublicSession = async ({ usageKey, sessionId }) => {
  const sanitizedSessionId = sanitizeSessionId(sessionId);
  const key = buildSessionKey(usageKey, sanitizedSessionId);
  const expiresAt = buildSessionExpiry();

  const session = await PublicAiSession.findOneAndUpdate(
    { key },
    {
      $setOnInsert: {
        key,
        sessionId: sanitizedSessionId,
        usageKey,
        knownContent: {},
        lastAction: "",
      },
      $set: {
        expiresAt,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return session;
};

export const savePublicSession = async (session, updates = {}) => {
  session.knownContent = updates.knownContent ?? session.knownContent;
  session.lastAction = updates.lastAction ?? session.lastAction;
  session.expiresAt = buildSessionExpiry();
  await session.save();
  return session;
};
