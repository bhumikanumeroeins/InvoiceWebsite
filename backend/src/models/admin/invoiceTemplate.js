import mongoose from "mongoose" ;

const InvoiceTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    background: {
      type: String, // e.g. "1_1.jpg"
      required: true,
    },

    layout: {
      header: { x: Number, y: Number },
      items: { x: Number, y: Number },
      totals: { x: Number, y: Number },
      payment: { x: Number, y: Number },
      footer: { x: Number, y: Number },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const InvoiceTemplate = mongoose.model("InvoiceTemplate", InvoiceTemplateSchema);

export default InvoiceTemplate;
