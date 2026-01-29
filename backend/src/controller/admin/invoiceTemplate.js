import InvoiceTemplate from "../../models/admin/invoiceTemplate.js";
import bcrypt from "bcryptjs";

export const createInvoiceTemplate = async (req, res) => {
  try {
    const { name, background, layout } = req.body;

    const newTemplate = new InvoiceTemplate({
      name,
      background,
      layout,
    }); 
    await newTemplate.save();
    res.status(201).json({ message: "Invoice template created", template: newTemplate });
    } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET template by name (or id)
export const getInvoiceTemplate = async (req, res) => {
  try {
    const template = await InvoiceTemplate.findOne({
      name: req.params.name,
      isActive: true,
    });

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
