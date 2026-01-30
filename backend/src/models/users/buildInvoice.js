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
      headingFont: { type: String,enum: ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Arial', 'Times New Roman', 'Georgia', 'Courier New'], default: "Inter" },
      bodyFont: { type: String, enum: ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Arial', 'Times New Roman', 'Georgia', 'Courier New'], default: "Inter" },
      headingSize: { type: String, default: "24px" },
      bodySize: { type: String, default: "14px" },
    },

    /* ---------------- CONTENT ---------------- */
    content: {
  logoText: { type: String, default: 'LOGO' },
  logoImage: { type: String, default: '' },
  invoiceTitle: { type: String, default: 'INVOICE' },
  invoiceNumberLabel: { type: String, default: 'Invoice #:' },
  invoiceNumber: { type: String, default: 'INV-001' },
  dateLabel: { type: String, default: 'Date:' },
  invoiceDate: { type: String, default: 'Jan 29, 2026' },
  poNumberLabel: { type: String, default: 'PO #:' },
  poNumber: { type: String, default: 'PO-12345' },
  dueDateLabel: { type: String, default: 'Due Date:' },
  dueDate: { type: String, default: 'Feb 28, 2026' },
  fromLabel: { type: String, default: 'From' },
  businessName: { type: String, default: 'Your Business Name' },
  businessAddress1: { type: String, default: '123 Business St' },
  businessAddress2: { type: String, default: 'City, State 12345' },
  billToLabel: { type: String, default: 'Bill To' },
  clientName: { type: String, default: 'Client Name' },
  clientAddress1: { type: String, default: '456 Client Ave' },
  clientAddress2: { type: String, default: 'City, State 67890' },
  shipToLabel: { type: String, default: 'Ship To' },
  shipToName: { type: String, default: 'Ship To Name' },
  shipToAddress1: { type: String, default: '789 Shipping St' },
  shipToAddress2: { type: String, default: 'City, State 11111' },
  descriptionLabel: { type: String, default: 'Description' },
  qtyLabel: { type: String, default: 'Qty' },
  rateLabel: { type: String, default: 'Rate' },
  amountLabel: { type: String, default: 'Amount' },
  item1Desc: { type: String, default: 'Sample Item 1' },
  item1Qty: { type: String, default: '2' },
  item1Rate: { type: String, default: '$50.00' },
  item1Amount: { type: String, default: '$100.00' },
  item2Desc: { type: String, default: 'Sample Item 2' },
  item2Qty: { type: String, default: '1' },
  item2Rate: { type: String, default: '$75.00' },
  item2Amount: { type: String, default: '$75.00' },
  subtotalLabel: { type: String, default: 'Subtotal:' },
  subtotal: { type: String, default: '$175.00' },
  taxLabel: { type: String, default: 'Tax (10%):' },
  tax: { type: String, default: '$17.50' },
  totalLabel: { type: String, default: 'Total:' },
  total: { type: String, default: '$192.50' },
  termsLabel: { type: String, default: 'Terms & Conditions' },
  terms: { type: String, default: 'Payment is due within 30 days. Thank you for your business!' },
  paymentInfoLabel: { type: String, default: 'PAYMENT INFORMATION' },
  bankLabel: { type: String, default: 'Bank:' },
  bankName: { type: String, default: 'Bank of America' },
  accountLabel: { type: String, default: 'Account:' },
  accountNumber: { type: String, default: '****1234' },
  ifscLabel: { type: String, default: 'IFSC/Routing:' },
  ifscCode: { type: String, default: 'BOFA0001234' },
  qrCodeImage: { type: String, default: '' },
  qrCodeText: { type: String, default: 'Scan to Pay' },
  signatureImage: { type: String, default: '' },
  signatureLabel: { type: String, default: 'Authorized Signature' },
  emailLabel: { type: String, default: 'EMAIL' },
  footerEmail: { type: String, default: 'contact@business.com' },
  phoneLabel: { type: String, default: 'PHONE' },
  footerPhone: { type: String, default: '+1 (555) 123-4567' },
  websiteLabel: { type: String, default: 'WEBSITE' },
  footerWebsite: { type: String, default: 'www.business.com' }
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
    // positioning
      logoPosition: { type: positionSchema, default: { x: 50, y: 200, width: 300, height: 40 } },
      invoiceMetaPosition: { type: positionSchema, default: { x: 500, y: 50, width: 200, height: 120 } },
      businessInfoPosition: { type: positionSchema, default: { x: 50, y: 260, width: 220, height: 150 } },
      clientInfoPosition: { type: positionSchema, default: { x: 290, y: 260, width: 220, height: 120 } },
      shipToPosition: { type: positionSchema, default: { x: 530, y: 260, width: 220, height: 120 } },
      itemsTablePosition: { type: positionSchema, default: { x: 50, y: 430, width: 700, height: 200 } },
      totalsPosition: { type: positionSchema, default: { x: 500, y: 650, width: 250, height: 120 } },
      termsPosition: { type: positionSchema, default: { x: 50, y: 650, width: 400, height: 120 } },
      paymentInfoPosition: { type: positionSchema, default: { x: 50, y: 780, width: 300, height: 120 } },
      qrCodePosition: { type: positionSchema, default: { x: 380, y: 780, width: 190, height: 100 } },
      signaturePosition: { type: positionSchema, default: { x: 560, y: 780, width: 190, height: 100 } },
      footerPosition: { type: positionSchema, default: { x: 50, y: 950, width: 700, height: 60 } },
      invoiceTitlePosition: { type: positionSchema, default: { x: 50, y: 200, width: 300, height: 40 } },

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
