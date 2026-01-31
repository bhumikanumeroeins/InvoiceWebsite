import mongoose from "mongoose";

import UserTemplateLayout from "../../models/users/userTemplateLayout.js"; import { createError, createResult } from "../../utils/utils.js";

import InvoiceTemplate from "../../models/admin/invoiceTemplate.js";
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
  Template1: InvoiceTemplate,
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
    // fetch all active templates from all models
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
      InvoiceTemplate.find({ isActive: true }).select("name background layout isActive createdAt"),
      Template2.find({ isActive: true }).select("name layout isActive createdAt"),
      Template3.find({ isActive: true }).select("name layout isActive createdAt"),
      Template4.find({ isActive: true }).select("name layout isActive createdAt"),
      Template5.find({ isActive: true }).select("name layout isActive createdAt"),
      Template6.find({ isActive: true }).select("name layout isActive createdAt"),
      Template7.find({ isActive: true }).select("name layout isActive createdAt"),
      Template8.find({ isActive: true }).select("name layout isActive createdAt"),
      Template9.find({ isActive: true }).select("name layout isActive createdAt"),
      Template10.find({ isActive: true }).select("name layout isActive createdAt"),
      Template11.find({ isActive: true }).select("name layout isActive createdAt"),
      Template12.find({ isActive: true }).select("name layout isActive createdAt")
    ]);

    // merge all templates
    const templates = [
      ...template1.map((t) => ({ ...t.toObject(), templateNo: 1 })),
      ...template2.map((t) => ({ ...t.toObject(), templateNo: 2 })),
      ...template3.map((t) => ({ ...t.toObject(), templateNo: 3 })),
      ...template4.map((t) => ({ ...t.toObject(), templateNo: 4 })),
      ...template5.map((t) => ({ ...t.toObject(), templateNo: 5 })),
      ...template6.map((t) => ({ ...t.toObject(), templateNo: 6 })),
      ...template7.map((t) => ({ ...t.toObject(), templateNo: 7 })),
      ...template8.map((t) => ({ ...t.toObject(), templateNo: 8 })),
      ...template9.map((t) => ({ ...t.toObject(), templateNo: 9 })),
      ...template10.map((t) => ({ ...t.toObject(), templateNo: 10 })),
      ...template11.map((t) => ({ ...t.toObject(), templateNo: 11 })),
      ...template12.map((t) => ({ ...t.toObject(), templateNo: 12 }))
    ];

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
