import crypto from "node:crypto";
import PublicAiUsage from "../models/ai/publicAiUsage.js";

export const PUBLIC_LIMIT = 10;
export const RESET_HOURS = 24;

export const getPublicUsageKey = (ipAddress) =>
  crypto.createHash("sha256").update(String(ipAddress || "unknown")).digest("hex");

const buildResetAt = (now = new Date()) =>
  new Date(now.getTime() + RESET_HOURS * 60 * 60 * 1000);

export const getPublicUsage = async (ipAddress) => {
  const key = getPublicUsageKey(ipAddress);
  const now = new Date();
  let usage = await PublicAiUsage.findOne({ key });

  if (!usage || usage.resetAt <= now) {
    usage = await PublicAiUsage.findOneAndUpdate(
      { key },
      { key, count: 0, resetAt: buildResetAt(now) },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  return usage;
};

export const incrementPublicUsage = async (ipAddress) => {
  const usage = await getPublicUsage(ipAddress);

  return PublicAiUsage.findOneAndUpdate(
    { _id: usage._id },
    { $inc: { count: 1 } },
    { new: true }
  );
};

export const consumePublicUsageSlot = async (ipAddress) => {
  await getPublicUsage(ipAddress);
  const key = getPublicUsageKey(ipAddress);
  const now = new Date();

  return PublicAiUsage.findOneAndUpdate(
    {
      key,
      resetAt: { $gt: now },
      count: { $lt: PUBLIC_LIMIT },
    },
    { $inc: { count: 1 } },
    { new: true }
  );
};

export const getRemainingPublicUsage = (usage) =>
  Math.max(0, PUBLIC_LIMIT - Number(usage?.count || 0));
