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
      type: mongoose.Schema.Types.Mixed, // Allow any object structure
      default: {},
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
