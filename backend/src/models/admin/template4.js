import mongoose from "mongoose";

const template4Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    layout: {
      header: {
        x: { type: Number, default: -50 },
        y: { type: Number, default: 100 }
      },
      partyTotals: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 600 }
      },
      details: {
        x: { type: Number, default: 550 },
        y: { type: Number, default: 90 }
      },
      items: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 200 }
      },
      termsQR: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 750 }
      },
      footer: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 780 }
      }
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Template4 = mongoose.model("Template4", template4Schema);

export default Template4;