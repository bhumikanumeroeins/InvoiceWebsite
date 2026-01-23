import mongoose from "mongoose";

const paymentReminderSchema = new mongoose.Schema({
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InvoiceTaxForm",
    required: true
  },
  clientEmail: {
    type: String,
    required: true
  },
  invoiceNumber: String,
  dueDate: Date,
  reminderType: {
    type: String,
    enum: ['first', 'second'],
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending'
  },
  sentAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

paymentReminderSchema.index({ invoiceId: 1, reminderType: 1 }, { unique: true });
paymentReminderSchema.index({ scheduledDate: 1, status: 1 });

export default mongoose.model("PaymentReminder", paymentReminderSchema);