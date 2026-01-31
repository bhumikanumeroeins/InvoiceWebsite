import mongoose from "mongoose";

const template11Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    layout: {
      header: {
        x: { type: Number, default: 30 },
        y: { type: Number, default: 50 }
      },
      invoiceInfo: {
        x: { type: Number, default: 500 },
        y: { type: Number, default: 120 }
      },
      party: {
        x: { type: Number, default: 30 },
        y: { type: Number, default: 350 }
      },
      items: {
        x: { type: Number, default: 110 },
        y: { type: Number, default: 220 }
      },
      terms: {
        x: { type: Number, default: 180 },
        y: { type: Number, default: 350 }
      },
      totals: { 
        x: { type: Number, default: 350 },
        y: { type: Number, default: 350 }
      },
      payment: {
        x: { type: Number, default: 180 },
        y: { type: Number, default: 450 }
      },
      qr: {
        x: { type: Number, default: 350 },
        y: { type: Number, default: 450 }
      },
      footer: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 700 }
      }
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const template11 = mongoose.model("Template11", template11Schema);

export default template11;