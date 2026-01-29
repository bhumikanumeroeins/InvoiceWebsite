import InvoiceTemplate from "../../models/admin/invoiceTemplate.js";
import bcrypt from "bcryptjs";

// POST create new invoice template
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

    const newTemplate = new InvoiceTemplate({
      name,
      background,
      layout: layout ? JSON.parse(layout) : {},
    });

    await newTemplate.save();

    return res.status(201).json({
      message: "Invoice template created",
      template: newTemplate,
    });
  } catch (error) {
    return res.status(500).json({
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
