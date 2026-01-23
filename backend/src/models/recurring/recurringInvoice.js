import mongoose from "mongoose";

const recurringInvoiceSchema = new mongoose.Schema({
  originalInvoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InvoiceTaxForm",
    required: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Registration",
    required: true
  },

  // Recurring settings
  frequency: {
    type: String,
    enum: ['never', 'weekly', 'biweekly', 'monthly', 'bimonthly', 'quarterly', 'yearly'],
    required: true,
    default: 'never'
  },

  // Schedule settings
  startDate: {
    type: Date,
    required: true
  },

  startOption: {
    type: String,
    enum: ['useThis', 'createNew'],
    default: 'useThis'
  },

  stopOption: {
    type: String,
    enum: ['never', 'onDate'],
    default: 'never'
  },

  stopDate: {
    type: Date,
    required: function() {
      return this.stopOption === 'onDate';
    }
  },

  // Email settings
  emailTo: {
    type: String,
    required: true,
    trim: true
  },

  sendCopy: {
    type: Boolean,
    default: false
  },

  emailSubject: {
    type: String,
    required: true,
    default: 'Invoice #number'
  },

  emailText: {
    type: String,
    required: true
  },

  // Status tracking
  isActive: {
    type: Boolean,
    default: true
  },

  // Next scheduled date (calculated field)
  nextRunDate: {
    type: Date,
    required: true
  },

  // Last run information
  lastRunDate: {
    type: Date
  },

  lastGeneratedInvoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InvoiceTaxForm"
  },

  // Statistics
  totalInvoicesGenerated: {
    type: Number,
    default: 0
  },

  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
recurringInvoiceSchema.pre('save', function() {
  this.updatedAt = new Date();
});

// Index for efficient queries
recurringInvoiceSchema.index({ createdBy: 1, isActive: 1 });
recurringInvoiceSchema.index({ nextRunDate: 1, isActive: 1 });
recurringInvoiceSchema.index({ originalInvoiceId: 1 });

export default mongoose.model("RecurringInvoice", recurringInvoiceSchema);