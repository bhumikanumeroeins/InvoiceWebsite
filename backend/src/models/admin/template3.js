import mongoose from "mongoose";

const template3Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    layout: {
      header: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 20 }
      },
      party: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 100 }
      },
      details: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 200 }
      },
      items: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 260 }
      },
      terms: {
        x: { type: Number, default: 50 },
        y: { type: Number, default: 440 }
      },
      totals: {
        x: { type: Number, default: 420 },
        y: { type: Number, default: 420 }
      },
      footer: {
        x: { type: Number, default: 50 },
        y: { type: Number, default: 650 }
      }
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Template3 = mongoose.model("Template3", template3Schema);

export default Template3;