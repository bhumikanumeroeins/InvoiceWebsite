import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  description: String,
  quantity: {
    type: Number,
    default: 1
  },
  rate: Number,
  amount: Number,
  tax: Number
});

const invoiceSchema = new mongoose.Schema({
  // 🔹 FORM META
  formType: {
    type: String,
    enum: ["basic", "advanced"],
    default: "basic"
  },

  documentType: {
    type: String,
    enum: [
      "invoice",
      "taxInvoice",
      "proforma",
      "receipt",
      "salesReceipt",
      "cashReceipt",
      "quote",
      "estimate",
      "creditMemo",
      "creditNote",
      "purchaseOrder",
      "deliveryNote"
    ],
    required: true
  },

  // 🔹 BUSINESS
  business: {
    name: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    phone: String,
    email: String,
    logo: String
  },

  // 🔹 CLIENT
  client: {
    name: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    email: String
  },

  // 🔹 SHIP TO (ADVANCED ONLY)
  shipTo: {
    shippingAddress: String,
    shippingCity: String,
    shippingState: String,
    shippingZip: String
  },

  // 🔹 INVOICE META
  invoiceMeta: {
    invoiceNo: String,
    invoiceDate: Date,
    dueDate: Date,
    currency: {
      type: String,
      default: "INR"
    }
  },

  // 🔹 ITEMS
  items: [itemSchema],

  // 🔹 TERMS
  terms: [{ text: String }],

  // 🔹 PAYMENT
  payment: {
    bankName: String,
    accountNo: String,
    ifscCode: String,
    qrCode: String
  },

  signature: String,

  // 🔹 TOTALS (CALCULATED)
  totals: {
    subtotal: Number,
    taxTotal: Number,
    grandTotal: Number
  },

  paymentStatus: {
    type: String,
    enum: ["unpaid", "partiallyPaid", "paid", "overdue"],
    default: "unpaid"
  },

  createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Registration",
  required: true
},

  createdAt: {
    type: Date,
    default: Date.now
  }

  
});

export default mongoose.model("InvoiceTaxForm", invoiceSchema);
