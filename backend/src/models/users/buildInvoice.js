import mongoose from "mongoose";

const positionSchema = new mongoose.Schema(
  {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    width: { type: Number, default: 100 },
    height: { type: Number, default: 50 },
  },
  { _id: false }
);

const invoiceCustomizationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registeration",
      required: true,
      index: true,
    },

    templateName: {
      type: String,
      required: true,
    },

    /* ---------------- COLORS ---------------- */
    primaryColor: { type: String, default: "#4F46E5" },
    secondaryColor: { type: String, default: "#10B981" },
    textColor: { type: String, default: "#1F2937" },
    backgroundColor: { type: String, default: "#FFFFFF" },
    borderColor: { type: String, default: "#E5E7EB" },

    /* ---------------- TYPOGRAPHY ---------------- */
    typography: {
      headingFont: { type: String, default: "Inter" },
      bodyFont: { type: String, default: "Inter" },
      headingSize: { type: String, default: "24px" },
      bodySize: { type: String, default: "14px" },
    },

    /* ---------------- CONTENT ---------------- */
    content: {
      logoText: { type: String, default: "LOGO" },
      logoImage: { type: String, default: "" },

      invoiceTitle: { type: String, default: "INVOICE" },
      invoiceNumberLabel: { type: String, default: "Invoice #:" },
      invoiceNumber: { type: String, default: "INV-001" },

      dateLabel: { type: String, default: "Date:" },
      invoiceDate: { type: String, default: "Jan 29, 2026" },

      dueDateLabel: { type: String, default: "Due Date:" },
      dueDate: { type: String, default: "Feb 28, 2026" },

      fromLabel: { type: String, default: "From" },
      businessName: { type: String, default: "Your Business Name" },
      businessAddress1: { type: String, default: "123 Business St" },
      businessAddress2: { type: String, default: "City, State 12345" },
      businessEmail: { type: String, default: "business@email.com" },
      businessPhone: { type: String, default: "+1 (555) 123-4567" },

      billToLabel: { type: String, default: "Bill To" },
      clientName: { type: String, default: "Client Name" },
      clientAddress1: { type: String, default: "456 Client Ave" },
      clientAddress2: { type: String, default: "City, State 67890" },

      subtotalLabel: { type: String, default: "Subtotal:" },
      subtotal: { type: String, default: "$175.00" },
      taxLabel: { type: String, default: "Tax (10%):" },
      tax: { type: String, default: "$17.50" },
      totalLabel: { type: String, default: "Total:" },
      total: { type: String, default: "$192.50" },

      termsLabel: { type: String, default: "Terms & Conditions" },
      terms: {
        type: String,
        default: "Payment is due within 30 days. Thank you for your business!",
      },
    },

    /* ---------------- SECTION VISIBILITY ---------------- */
    visibility: {
      businessInfo: { type: Boolean, default: true },
      clientInfo: { type: Boolean, default: true },
      shipTo: { type: Boolean, default: true },
      invoiceMeta: { type: Boolean, default: true },
      itemsTable: { type: Boolean, default: true },
      totals: { type: Boolean, default: true },
      terms: { type: Boolean, default: true },
      paymentInfo: { type: Boolean, default: true },
      signature: { type: Boolean, default: true },
      qrCodeSection: { type: Boolean, default: true },
      logoSection: { type: Boolean, default: true },
    },

    /* ---------------- POSITIONS ---------------- */
    positions: {
      logo: { type: positionSchema, default: { x: 50, y: 200, width: 300, height: 40 } },
      invoiceMeta: { type: positionSchema, default: { x: 500, y: 50, width: 200, height: 120 } },
      businessInfo: { type: positionSchema, default: { x: 50, y: 260, width: 220, height: 150 } },
      clientInfo: { type: positionSchema, default: { x: 290, y: 260, width: 220, height: 120 } },
      itemsTable: { type: positionSchema, default: { x: 50, y: 430, width: 700, height: 200 } },
      totals: { type: positionSchema, default: { x: 500, y: 650, width: 250, height: 120 } },
      footer: { type: positionSchema, default: { x: 50, y: 950, width: 700, height: 60 } },
    },

    /* ---------------- BACKGROUND ---------------- */
    backgroundPattern: {
      type: String,
      enum: [
        "none",
        "waves1",
        "waves2",
        "curves",
        "geometric",
        "diagonal",
        "circles",
        "abstract",
        "minimal",
        "gradient",
      ],
      default: "none",
    },

    backgroundHeaderColor: { type: String, default: "#4F46E5" },
    backgroundFooterColor: { type: String, default: "#4F46E5" },
  },
  { timestamps: true }
);

export default mongoose.model(
  "InvoiceCustomization",
  invoiceCustomizationSchema
);
