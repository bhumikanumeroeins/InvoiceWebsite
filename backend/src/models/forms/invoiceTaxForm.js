import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    description: String,
    quantity: {
      type: Number,
      default: 1
    },
    rate: Number,
    amount: Number,
    tax: Number
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema({
  // 🔹 FORM META
  formType: {type: String,enum: ["basic", "advanced"],default: "basic"},

  documentType: {type: String,
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

  // 🔹 CREATED BY (USER REFERENCE)
  createdBy: {type: mongoose.Schema.Types.ObjectId,ref: "Registration",required: true},

  // 🔹 SOFT DELETE FLAG
  isDeleted: {type: Boolean, default: false},

  // 🔹 BUSINESS
  business: {
    name: String,
    address: String,
    city: String,
    state: String,
    zip: String,
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

  // 🔹 SHIP TO
  shipTo: {
    shippingName: String,
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

  qrCode: String,

  // 🔹 TOTALS
  totals: {
    subtotal: Number,
    taxTotal: Number,
    grandTotal: Number
  },

  // 🔹 PAYMENT STATUS
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'partiallyPaid', 'paid', 'overdue'],
    default: 'unpaid'
  },
  paidAmount: {type: Number,default: 0},
  paidDate: Date,
  paymentMethod: String,
  paymentNote: String,
  balanceDue: Number,

  paymentId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Payment",
  default: null
},

  // 🔹 SELECTED TEMPLATE
  selectedTemplate: {
    type: Number,
    min: 1,
    max: 12,
    default: 1
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

});

// 🔐 UNIQUE INVOICE NO PER USER
invoiceSchema.index(
  { createdBy: 1, "invoiceMeta.invoiceNo": 1 },
  { unique: true }
);

export default mongoose.model("InvoiceTaxForm", invoiceSchema);
