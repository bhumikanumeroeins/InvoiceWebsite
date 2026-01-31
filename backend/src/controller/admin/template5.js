import Template5 from "../../models/admin/template5.js";
import { createError, createResult } from "../../utils/utils.js";

export const createOrUpdateTemplate5 = async (req, res) => {
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
    const newTemplate = new Template5({
      name,
      layout: parsedLayout,
      isActive: typeof isActive !== "undefined" ? isActive : true,
    });

    await newTemplate.save();

    return res
      .status(200)
      .json(createResult(newTemplate, "Template5 saved successfully"));
  } catch (error) {
    return res.status(500).json(createError(error.message));
  }
};


// get template5 by name
export const getTemplate5ByName = async (req, res) => {
  try {
    const { name } = req.params;    
    const template = await Template5.findOne({ name, isActive: true });

    if (!template) {
      return res.status(404).json(createError("Template not found"));
    }   

    return res
      .status(200)
      .json(createResult(template, "Template5 fetched successfully"));
  } catch (error) {
    return res.status(500).json(createError(error.message));
  }
};

