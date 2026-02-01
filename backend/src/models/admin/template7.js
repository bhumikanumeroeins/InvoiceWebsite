import mongoose from "mongoose";

const template7Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    layout: {
      header: {
        x: { type: Number, default: 90 },
        y: { type: Number, default: 0 }
      },
      party: {
        x: { type: Number, default: 90 },
        y: { type: Number, default: 230 }
      },
      items: {
        x: { type: Number, default: 90 },
        y: { type: Number, default: 300 }
      },
      termsTotals: {
        x: { type: Number, default: 90 },
        y: { type: Number, default: 750 }
      },
      payment: {
        x: { type: Number, default: 90 },
        y: { type: Number, default: 450 }
      },
      footer: {
        x: { type: Number, default: 200 },
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

const template7 = mongoose.model("Template7", template7Schema);

export default template7;