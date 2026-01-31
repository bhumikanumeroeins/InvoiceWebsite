import Template11 from "../../models/admin/template11.js";
import { createError, createResult } from "../../utils/utils.js";

export const createOrUpdateTemplate11 = async (req, res) => {
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
    const newTemplate = new Template11({
      name,
      layout: parsedLayout,
      isActive: typeof isActive !== "undefined" ? isActive : true,
    });

    await newTemplate.save();

    return res
      .status(200)
      .json(createResult(newTemplate, "Template11 saved successfully"));
  } catch (error) {
    return res.status(500).json(createError(error.message));
  }
};


// get template11 by name
export const getTemplate11ByName = async (req, res) => {
  try {
    const { name } = req.params;    
    const template = await Template11.findOne({ name, isActive: true });

    if (!template) {
      return res.status(404).json(createError("Template not found"));
    }   

    return res
      .status(200)
      .json(createResult(template, "Template11 fetched successfully"));
  } catch (error) {
    return res.status(500).json(createError(error.message));
  }
};

