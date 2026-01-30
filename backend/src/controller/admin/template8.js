import Template8 from "../../models/admin/template8.js";
import { createError, createResult } from "../../utils/utils.js";

export const createOrUpdateTemplate8 = async (req, res) => {
  try {
    const { name, layout, isActive } = req.body;

    if (!name) {
      return res.status(400).json(createError("Template name is required"));
    }

    let parsedLayout = {};
    if (layout) {
      parsedLayout = typeof layout === "string" ? JSON.parse(layout) : layout;
    }

    const updatedTemplate = await Template8.findOneAndUpdate(
      { name },
      {
        name,
        ...(layout && { layout: parsedLayout }),
        ...(typeof isActive !== "undefined" && { isActive })
      },
      { new: true, upsert: true }
    );

    return res
      .status(200)
      .json(createResult(updatedTemplate, "Template7 saved successfully"));
  } catch (error) {
    return res.status(500).json(createError(error.message));
  }
};


// get template8 by name
export const getTemplate8ByName = async (req, res) => {
  try {
    const { name } = req.params;    
    const template = await Template8.findOne({ name, isActive: true });

    if (!template) {
      return res.status(404).json(createError("Template not found"));
    }   

    return res
      .status(200)
      .json(createResult(template, "Template7 fetched successfully"));
  } catch (error) {
    return res.status(500).json(createError(error.message));
  }
};

