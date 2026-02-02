import mongoose from "mongoose";

const template10Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    layout: {
      header: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 }
      },
      party: {
        x: { type: Number, default: 80 },
        y: { type: Number, default: 300 }
      },
      items: {
        x: { type: Number, default: 80 },
        y: { type: Number, default: 290 }
      },
      termsTotals: {
        x: { type: Number, default: 80 },
        y: { type: Number, default: 600 }
      },
      paymentQR: {
        x: { type: Number, default: 80 },
        y: { type: Number, default: 750 }
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

const template10 = mongoose.model("Template10", template10Schema);

export default template10;