import mongoose from "mongoose";

const itemMasterSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      default: 1
    },
    rate: {
      type: Number,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      default: 0
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("ItemMaster", itemMasterSchema);
