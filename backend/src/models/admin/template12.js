import mongoose from "mongoose";

const template12Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    layout: {
      header: {
        x: { type: Number, default: 250 },
        y: { type: Number, default: 10 }
      },
      party: {
        x: { type: Number, default: 140 },
        y: { type: Number, default: 60 }
      },
      title: {
        x: { type: Number, default: 460 },
        y: { type: Number, default: 120 }
      },
      meta: {
        x: { type: Number, default: 130 },
        y: { type: Number, default: 220 }
      },
      items: {
        x: { type: Number, default: 90 },
        y: { type: Number, default: 290 }
      },
      termsTotals: {
        x: { type: Number, default:120 },
        y: { type: Number, default:420 }  
      },
      payment: {
        x: { type: Number, default: 120 },
        y: { type: Number, default: 500 }
      },
      qr: {
        x: { type: Number, default: 350 },
        y: { type: Number, default: 520 }
      },
      thankYou: {
        x: { type: Number, default: 250 },
        y: { type: Number, default: 680 }
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