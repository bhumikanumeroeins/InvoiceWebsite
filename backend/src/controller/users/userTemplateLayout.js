import mongoose from "mongoose";

import UserTemplateLayout from "../../models/users/userTemplateLayout.js"; import { createError, createResult } from "../../utils/utils.js";

import Template1 from "../../models/admin/template1.js";
import Template2 from "../../models/admin/template2.js";
import Template3 from "../../models/admin/template3.js";
import Template4 from "../../models/admin/template4.js";
import Template5 from "../../models/admin/template5.js";
import Template6 from "../../models/admin/template6.js";
import Template7 from "../../models/admin/template7.js";
import Template8 from "../../models/admin/template8.js";
import Template9 from "../../models/admin/template9.js";
import Template10 from "../../models/admin/template10.js";
import Template11 from "../../models/admin/template11.js";
import Template12 from "../../models/admin/template12.js";

// ✅ map all template names to their models
const TEMPLATE_MODELS = {
  Template1: Template1,
  Template2: Template2,
  Template3: Template3,
  Template4: Template4,
  Template5: Template5,
  Template6: Template6,
  Template7: Template7,
  Template8: Template8,
  Template9: Template9,
  Template10: Template10,
  Template11: Template11,
  Template12: Template12
};

// ✅ helper
const getAdminTemplateByName = async (templateName) => {
  const Model = TEMPLATE_MODELS[templateName];

  if (!Model) return null;

  return await Model.findOne({ name: templateName, isActive: true });
};

/* -----------------------------------------------------------
   1) GET DEFAULT TEMPLATE LAYOUT (from admin template)
----------------------------------------------------------- */
export const getTemplateDefaultLayout = async (req, res) => {
  try {
    const { templateName } = req.params;

    const template = await getAdminTemplateByName(templateName);

    if (!template) {
      return res.status(404).json(createError("Template not found"));
    }

    return res
      .status(200)
      .json(createResult(template, "Default template fetched successfully"));
  } catch (error) {
    return res.status(500).json(createError(error.message));
  }
};

/* -----------------------------------------------------------
   2) SAVE / UPDATE USER CUSTOMIZED LAYOUT
----------------------------------------------------------- */
export const saveOrUpdateUserLayout = async (req, res) => {

  try {
    const userId = req.user.userId; // from token middleware
    const { templateName, layout } = req.body;

    if (!templateName) {
      return res.status(400).json(createError("templateName is required"));
    }

    if (!layout) {
      return res.status(400).json(createError("layout is required"));
    }

    const parsedLayout =
      typeof layout === "string" ? JSON.parse(layout) : layout;

    // ✅ Always create new document
    const saved = await UserTemplateLayout.create({
      userId,
      templateName,
      layout: parsedLayout
    });

    return res
      .status(201)
      .json(createResult(saved, "User template layout saved successfully"));
  } catch (error) {
    return res.status(500).json(createError(error.message));
  }
};


/* -----------------------------------------------------------
   3) GET USER SAVED LAYOUT (if not exists -> return default)
----------------------------------------------------------- */


// GET saved layout by ID (only logged in user)
export const getUserLayoutById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(createError("Invalid layout id"));
    }

    const layoutDoc = await UserTemplateLayout.findOne({
      _id: id,
      userId
    });

    if (!layoutDoc) {
      return res.status(404).json(createError("User layout not found"));
    }

    return res
      .status(200)
      .json(createResult(layoutDoc, "User layout fetched successfully"));
  } catch (error) {
    return res.status(500).json(createError(error.message));
  }
};

// fetch all templates for user
// GET all saved layouts of logged-in user
export const getAllUserSavedLayouts = async (req, res) => {
  try {
    const userId = req.user.userId;

    const layouts = await UserTemplateLayout.find({ userId })
      .sort({ createdAt: -1 }); // latest first

    return res.status(200).json(
      createResult(
        {
          total: layouts.length,
          layouts
        },
        "All user saved layouts fetched successfully"
      )
    );
  } catch (error) {
    return res.status(500).json(createError(error.message));
  }
};



export const getAllTemplatesForUser = async (req, res) => {
  try {
    // fetch only ONE (most recent) active template from each model
    const [
      template1,
      template2,
      template3,
      template4,
      template5,
      template6,
      template7,
      template8,
      template9,
      template10,
      template11,
      template12
    ] = await Promise.all([
      Template1.findOne({ isActive: true }).sort({ createdAt: -1 }).select("name background layout isActive createdAt"),
      Template2.findOne({ isActive: true }).sort({ createdAt: -1 }).select("name layout isActive createdAt"),
      Template3.findOne({ isActive: true }).sort({ createdAt: -1 }).select("name layout isActive createdAt"),
      Template4.findOne({ isActive: true }).sort({ createdAt: -1 }).select("name layout isActive createdAt"),
      Template5.findOne({ isActive: true }).sort({ createdAt: -1 }).select("name layout isActive createdAt"),
      Template6.findOne({ isActive: true }).sort({ createdAt: -1 }).select("name layout isActive createdAt"),
      Template7.findOne({ isActive: true }).sort({ createdAt: -1 }).select("name layout isActive createdAt"),
      Template8.findOne({ isActive: true }).sort({ createdAt: -1 }).select("name layout isActive createdAt"),
      Template9.findOne({ isActive: true }).sort({ createdAt: -1 }).select("name layout isActive createdAt"),
      Template10.findOne({ isActive: true }).sort({ createdAt: -1 }).select("name layout isActive createdAt"),
      Template11.findOne({ isActive: true }).sort({ createdAt: -1 }).select("name layout isActive createdAt"),
      Template12.findOne({ isActive: true }).sort({ createdAt: -1 }).select("name layout isActive createdAt")
    ]);

    // build array with only templates that exist
    const templates = [];
    if (template1) templates.push({ ...template1.toObject(), templateNo: 1 });
    if (template2) templates.push({ ...template2.toObject(), templateNo: 2 });
    if (template3) templates.push({ ...template3.toObject(), templateNo: 3 });
    if (template4) templates.push({ ...template4.toObject(), templateNo: 4 });
    if (template5) templates.push({ ...template5.toObject(), templateNo: 5 });
    if (template6) templates.push({ ...template6.toObject(), templateNo: 6 });
    if (template7) templates.push({ ...template7.toObject(), templateNo: 7 });
    if (template8) templates.push({ ...template8.toObject(), templateNo: 8 });
    if (template9) templates.push({ ...template9.toObject(), templateNo: 9 });
    if (template10) templates.push({ ...template10.toObject(), templateNo: 10 });
    if (template11) templates.push({ ...template11.toObject(), templateNo: 11 });
    if (template12) templates.push({ ...template12.toObject(), templateNo: 12 });

    return res.status(200).json(
      createResult(
        templates,
        "All templates fetched successfully"
      )
    );
  } catch (error) {
    return res.status(500).json(createError(error.message));
  }
};
