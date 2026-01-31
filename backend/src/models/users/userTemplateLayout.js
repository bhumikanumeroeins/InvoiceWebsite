import mongoose from "mongoose";

const userTemplateLayoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: true
    },

    templateName: {
      type: String,
      required: true // ex: "Template2"
    },

    layout: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

// one user can save one layout per template
userTemplateLayoutSchema.index({ userId: 1, templateName: 1 }, { unique: true });

const UserTemplateLayout = mongoose.model(
  "UserTemplateLayout",
  userTemplateLayoutSchema
);

export default UserTemplateLayout;
