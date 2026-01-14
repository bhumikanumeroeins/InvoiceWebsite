import mongoose from "mongoose";

const taxSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    rate: {
      type: Number,
      required: true,
      min: 0
    },

    isCompound: {
      type: Boolean,
      default: false
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Tax", taxSchema);
