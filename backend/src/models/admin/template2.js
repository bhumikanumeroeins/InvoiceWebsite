import mongoose from "mongoose";

const template2Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    layout: {
      header: {
        x: { type: Number, default: 380 },
        y: { type: Number, default: 30 }
      },
      party: {
        x: { type: Number, default: 60 },
        y: { type: Number, default: 250 }
      },
      items: {
        x: { type: Number, default: 60 },
        y: { type: Number, default: 320 }
      },
      terms: {
        x: { type: Number, default: 60 },
        y: { type: Number, default: 550 }
      },
      totals: {
        x: { type: Number, default: 380 },
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

const Template2 = mongoose.model("Template2", template2Schema);

export default Template2;
