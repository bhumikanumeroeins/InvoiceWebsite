import mongoose from "mongoose";

const template9Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    layout: {
      header: {
        x: { type: Number, default: 80 },
        y: { type: Number, default: -70 }
      },
      pill: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 90 }
      },
      party: {
        x: { type: Number, default: 80 },
        y: { type: Number, default: 200 }
      },
      items: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 220 }
      },
      termsTotals: {
        x: { type: Number, default: 80 },
        y: { type: Number, default: 510 }
      },
      paymentQR: {
        x: { type: Number, default: 80 },
        y: { type: Number, default: 630 }
      },
      footer: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 590 }
      }
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const template9 = mongoose.model("Template9", template9Schema);

export default template9;