import mongoose from "mongoose";

const template2Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    layout: {
      header: {
        x: { type: Number, default: 500 },
        y: { type: Number, default: -50 }
      },
      party: {
        x: { type: Number, default: 60 },
        y: { type: Number, default: 350 }
      },
      items: {
        x: { type: Number, default: 60 },
        y: { type: Number, default: 320 }
      },
      terms: {
        x: { type: Number, default: 60 },
        y: { type: Number, default: 700 }
      },
      totals: {
        x: { type: Number, default: 380 },
        y: { type: Number, default: 550 }
      },
      footer: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 830 }
      }
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Template2 = mongoose.model("Template2", template2Schema);

export default Template2;
