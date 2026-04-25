import mongoose from "mongoose";

const publicAiSessionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    usageKey: {
      type: String,
      required: true,
      index: true,
    },
    knownContent: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    lastAction: {
      type: String,
      enum: ["ask", "generate", ""],
      default: "",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

publicAiSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("PublicAiSession", publicAiSessionSchema);
