import Template6 from "../../models/admin/template6.js";
import { createError, createResult } from "../../utils/utils.js";

export const createOrUpdateTemplate6 = async (req, res) => {
  try {
    const { name, layout, isActive } = req.body;

    if (!name) {
      return res.status(400).json(createError("Template name is required"));
    }

    let parsedLayout = {};
    if (layout) {
      parsedLayout = typeof layout === "string" ? JSON.parse(layout) : layout;
    }

    // create new template
    const newTemplate = new Template6({
      name,
      layout: parsedLayout,
      isActive: typeof isActive !== "undefined" ? isActive : true,
    });

    await newTemplate.save();
    return res
      .status(200)
      .json(createResult(newTemplate, "Template6 saved successfully"));
  } catch (error) {
    return res.status(500).json(createError(error.message));
  }
};


// get template5 by name
export const getTemplate6ByName = async (req, res) => {
  try {
    const { name } = req.params;    
    const template = await Template6.findOne({ name, isActive: true });

    if (!template) {
      return res.status(404).json(createError("Template not found"));
    }   

    return res
      .status(200)
      .json(createResult(template, "Template6 fetched successfully"));
  } catch (error) {
    return res.status(500).json(createError(error.message));
  }
};

