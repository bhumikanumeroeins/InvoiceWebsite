import mongoose from "mongoose";

const userAiSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
      index: true,
    },
    sessionId: { type: String, required: true, unique: true, index: true },
    title: { type: String, default: "New Invoice" },
    messages: { type: mongoose.Schema.Types.Mixed, default: [] },
    knownContent: { type: mongoose.Schema.Types.Mixed, default: {} },
    lastAction: { type: String, enum: ["ask", "generate", ""], default: "" },
    selectedTemplateId: { type: Number, default: 1 },
  },
  { timestamps: true },
);

export default mongoose.model("UserAiSession", userAiSessionSchema);
