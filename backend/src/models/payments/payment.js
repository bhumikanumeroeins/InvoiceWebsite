import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InvoiceTaxForm",
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ["paid", "partiallyPaid", "unpaid"],
      required: true
    },

    paidAmount: {
      type: Number,
      default: 0
    },

    paidDate: {
      type: Date,
      default: null
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "Check", "Credit Card", "Debit Card", "Bank Transfer", "UPI", "Other"],
      default: null
    },

    paymentNote: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
