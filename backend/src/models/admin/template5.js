import mongoose from "mongoose";

const template5Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    layout: {
      header: {
        x: { type: Number, default: 80 },
        y: { type: Number, default: 0 }
      },
      details: {
        x: { type: Number, default: 100 },
        y: { type: Number, default: 250 }
      },
      items: {
        x: { type: Number, default: 80 },
        y: { type: Number, default: 330 }
      },
      termsTotals: {
        x: { type: Number, default: 30 },
        y: { type: Number, default: 600 }
      },
      paymentQR: {
        x: { type: Number, default: 200 },
        y: { type: Number, default: 690 }
      },
      footer: {
        x: { type: Number, default: 80 },
        y: { type: Number, default: 750 }
      }
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Template5 = mongoose.model("Template5", template5Schema);

export default Template5;