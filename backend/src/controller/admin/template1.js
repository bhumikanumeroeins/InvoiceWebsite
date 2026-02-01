import Template1 from "../../models/admin/template1.js";
import { createError, createResult } from "../../utils/utils.js";

export const createOrUpdateTemplate1 = async (req, res) => {
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
    const newTemplate = new Template1({
      name,
      layout: parsedLayout,
      isActive: typeof isActive !== "undefined" ? isActive : true,
    });

    await newTemplate.save();


    return res
      .status(200)
      .json(createResult(newTemplate, "Template2 saved successfully"));
  } catch (error) {
    return res.status(500).json(createError(error.message));
  }
};


// get template1 by name
export const getTemplate1ByName = async (req, res) => {
  try {
    const { name } = req.params;    
    const template = await Template1.findOne({ name, isActive: true });

    if (!template) {
      return res.status(404).json(createError("Template not found"));
    }   

    return res
      .status(200)
      .json(createResult(template, "Template1 fetched successfully"));
  } catch (error) {
    return res.status(500).json(createError(error.message));
  }
};

