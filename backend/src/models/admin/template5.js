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
        y: { type: Number, default: 40 }
      },
      details: {
        x: { type: Number, default: 90 },
        y: { type: Number, default: 210 }
      },
      items: {
        x: { type: Number, default: 80 },
        y: { type: Number, default: 330 }
      },
      termsTotals: {
        x: { type: Number, default: 80 },
        y: { type: Number, default: 440 }
      },
      paymentQR: {
        x: { type: Number, default: 80 },
        y: { type: Number, default: 530 }
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