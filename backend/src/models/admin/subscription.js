import mongoose from "mongoose";

const subscriptionPlanSchema = new mongoose.Schema({
  planName: {
    type: String,
    required: true,
    unique: true
  },

  price: {
    type: String, // "$0", "$15", "$25"
    required: true
  },

  durationMonths: {
    type: Number, // 0 = free, 1 = monthly, 6, 12 etc.
    required: true
  },

  invoiceLimit: {
    type: Number,
    default: -1 // -1 = unlimited
  },

  description: String,

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export default mongoose.model("SubscriptionPlan", subscriptionPlanSchema);
