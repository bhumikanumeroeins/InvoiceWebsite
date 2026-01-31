import InvoiceTemplate from "../../models/admin/invoiceTemplate.js";
import bcrypt from "bcryptjs";

// POST create or update invoice template
export const createInvoiceTemplate = async (req, res) => {
  try {
    const { name, layout } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Template name is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Background image is required" });
    }

    const background = `/uploads/${req.file.filename}`;
    const parsedLayout = layout ? JSON.parse(layout) : {};

    // Use findOneAndUpdate with upsert to update existing or create new
    const template = await InvoiceTemplate.findOneAndUpdate(
      { name, isActive: true }, // Find by name and isActive
      {
        name,
        background,
        layout: parsedLayout,
        isActive: true,
      },
      {
        new: true, // Return the updated document
        upsert: true, // Create if doesn't exist
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: template.isNew ? "Invoice template created" : "Invoice template updated",
      data: template,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const getInvoiceTemplate = async (req, res) => {
  try {
    const template = await InvoiceTemplate.findOne({
      name: req.params.name,
      isActive: true,
    });    
    
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    res.status(200).json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


