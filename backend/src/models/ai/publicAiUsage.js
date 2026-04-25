import mongoose from "mongoose";

const publicAiUsageSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    count: {
      type: Number,
      default: 0,
      min: 0,
    },
    resetAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

publicAiUsageSchema.index({ resetAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("PublicAiUsage", publicAiUsageSchema);
