import mongoose from "mongoose";

const template6Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    layout: {
      header: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: -80 }
      },
      party: {
        x: { type: Number, default: 50 },
        y: { type: Number, default: 230 }
      },
      items: {
        x: { type: Number, default: 50 },
        y: { type: Number, default: 270 }
      },
      termsTotals: {
        x: { type: Number, default: 50 },
        y: { type: Number, default: 650 }
      },
      paymentQR: {
        x: { type: Number, default: 50 },
        y: { type: Number, default: 750 }
      },
      thankyou: {
        x: { type: Number, default: 550 },
        y: { type: Number, default: 950 }
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

const template6 = mongoose.model("Template6", template6Schema);

export default template6;