import mongoose from "mongoose";

const template8Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    layout: {
      header: {
        x: { type: Number, default: 80 },
        y: { type: Number, default: 50 }
      },
      invoiceTitle: {
        x: { type: Number, default: 80 },
        y: { type: Number, default: 200 }
      },
      items: {
        x: { type: Number, default: 80 },
        y: { type: Number, default: 220 }
      },
      termsTotals: {
        x: { type: Number, default: 80 },
        y: { type: Number, default: 600 }
      },
      paymentQR: {
        x: { type: Number, default: 80 },
        y: { type: Number, default: 700 }
      },
      footer: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 760 }
      }
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const template8 = mongoose.model("Template8", template8Schema);

export default template8;