import mongoose from "mongoose";

const template12Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    layout: {
      header: {
        x: { type: Number, default: 100 },
        y: { type: Number, default: -50 }
      },
      party: {
        x: { type: Number, default: 140 },
        y: { type: Number, default: 110 }
      },
      title: {
        x: { type: Number, default: 470 },
        y: { type: Number, default: 180 }
      },
      meta: {
        x: { type: Number, default: 130 },
        y: { type: Number, default: 310 }
      },
      items: {
        x: { type: Number, default: 90 },
        y: { type: Number, default: 320 }
      },
      termsTotals: {
        x: { type: Number, default:120 },
        y: { type: Number, default:730 }  
      },
      payment: {
        x: { type: Number, default: 80 },
        y: { type: Number, default: 450 }
      },
      qr: {
        x: { type: Number, default: 600 },
        y: { type: Number, default: 850 }
      },
      thankYou: {
        x: { type: Number, default: 300 },
        y: { type: Number, default: 500 }
      },
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const template12 = mongoose.model("Template12", template12Schema);

export default template12;