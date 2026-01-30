import mongoose from "mongoose" ;

// template 1 schema ----------
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


// template 2 schema ----------

const templateSchema2 = new mongoose.Schema(
  {
    name: {type: String},
    layouts: {
      header: { x: Number, y: Number },
      party: { x: Number, y: Number },
      items: { x: Number, y: Number },
      terms: { x: Number, y: Number },
      totals:{ x: Number, y: Number },
      footer: { x: Number, y: Number },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);  


export default InvoiceTemplate;
