import template10 from "../../models/admin/template10.js";
import { createError, createResult } from "../../utils/utils.js";

export const createOrUpdateTemplate10 = async (req, res) => {
  try {
    const { name, layout, isActive } = req.body;

    if (!name) {
      return res.status(400).json(createError("Template name is required"));
    }

    let parsedLayout = {};
    if (layout) {
      parsedLayout = typeof layout === "string" ? JSON.parse(layout) : layout;
    }

    const updatedTemplate = await template10.findOneAndUpdate(
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
      .json(createResult(updatedTemplate, "Template10 saved successfully"));
  } catch (error) {
    return res.status(500).json(createError(error.message));
  }
};


// get template10 by name
export const getTemplate10ByName = async (req, res) => {
  try {
    const { name } = req.params;    
    const template = await template10.findOne({ name, isActive: true });

    if (!template) {
      return res.status(404).json(createError("Template not found"));
    }   

    return res
      .status(200)
      .json(createResult(template, "Template10 fetched successfully"));
  } catch (error) {
    return res.status(500).json(createError(error.message));
  }
};

