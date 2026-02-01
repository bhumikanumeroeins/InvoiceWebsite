import mongoose from "mongoose";

const template1Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    layout: {
      header: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 }
      },
    
      items: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 150 }
      },
  
      totals: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 400 }
      },

      payment:{
        x: { type: Number, default: 0 },
        y: { type: Number, default: 550 }
      },
      footer: {
        x: { type: Number, default: 0 },
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

const Template1 = mongoose.model("Template1", template1Schema);

export default Template1;