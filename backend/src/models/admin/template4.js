import mongoose from "mongoose";

const template4Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    layout: {
      header: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 80 }
      },
      partyTotals: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 450 }
      },
      details: {
        x: { type: Number, default: 430 },
        y: { type: Number, default: 90 }
      },
      items: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 280 }
      },
      termsQR: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 550 }
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