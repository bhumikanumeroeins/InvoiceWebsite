import Registration from "../../models/users/registration.js";
import InvoiceCustomization from "../../models/users/buildInvoice.js";

import { createError } from "../../utils/utils.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";





// ✅ helper function: parse date safely
const parseDate = (value) => {
  if (!value) return null;

  // If already a Date object
  if (value instanceof Date) return value;

  // convert to string
  const str = String(value).trim();

  // ISO format (YYYY-MM-DD or full ISO)
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  }

  // DD-MM-YYYY format
  if (/^\d{2}-\d{2}-\d{4}$/.test(str)) {
    const [dd, mm, yyyy] = str.split("-");
    const d = new Date(`${yyyy}-${mm}-${dd}`);
    return isNaN(d.getTime()) ? null : d;
  }

  // fallback try
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
};

export const createOrUpdateInvoiceCustomization = async (req, res) => {
  try {
    const userId = req.user.userId; // from token middleware
    const data = req.body;

    console.log("req.user =>", req.user);
    console.log("userId =>", userId);

    if (typeof data.content === 'string') {
      try {
        data.content = JSON.parse(data.content);
      } catch (e) {
        console.error('Failed to parse content:', e);
      }
    }
 
    if (typeof data.typography === 'string') {
      try {
        data.typography = JSON.parse(data.typography);
      } catch (e) {
        console.error('Failed to parse typography:', e);
      }
    }
 
    if (typeof data.visibility === 'string') {
      try {
        data.visibility = JSON.parse(data.visibility);
      } catch (e) {
        console.error('Failed to parse visibility:', e);
      }
    }
 
    if (typeof data.items === 'string') {
      try {
        data.items = JSON.parse(data.items);
      } catch (e) {
        console.error('Failed to parse items:', e);
      }
    }
 
    if (typeof data.paymentInformation === 'string') {
      try {
        data.paymentInformation = JSON.parse(data.paymentInformation);
      } catch (e) {
        console.error('Failed to parse paymentInformation:', e);
      }
    }
 
    if (typeof data.termsAndConditions === 'string') {
      try {
        data.termsAndConditions = JSON.parse(data.termsAndConditions);
      } catch (e) {
        console.error('Failed to parse termsAndConditions:', e);
      }
    }

    // multer uploaded files
    const logo = req.files?.logo?.[0]?.filename;
    const qrCode = req.files?.qrCode?.[0]?.filename;
    const authorizedSignature = req.files?.authorizedSignature?.[0]?.filename;

    // build file urls
    const logoUrl = logo ? `/uploads/${logo}` : "";
    const qrCodeUrl = qrCode ? `/uploads/${qrCode}` : "";
    const signatureUrl = authorizedSignature
      ? `/uploads/${authorizedSignature}`
      : "";

    // find existing customization (optional)
    const existing = await InvoiceCustomization.findOne({ userId });

    // ✅ build payload
    const payload = {
      ...data,
      userId,

      // ✅ parse dates
      invoiceDate: parseDate(data.invoiceDate) || existing?.invoiceDate || null,
      dueDate: parseDate(data.dueDate) || existing?.dueDate || null,

      // ✅ upload fields
      logo: logoUrl || existing?.logo || "",
      qrCode: qrCodeUrl || existing?.qrCode || "",
      authorizedSignature: signatureUrl || existing?.authorizedSignature || ""
    };

    // ❗ templateName must exist
    if (!data.templateName) {
      return res.status(400).json({
        success: false,
        message: "templateName is required"
      });
    }

    // update template wise
    const customization = await InvoiceCustomization.findOneAndUpdate(
      { userId, templateName: data.templateName },
      payload,
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "Invoice customization saved successfully",
      data: customization
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// GET customization by id (only logged in user can access)
export const getCustomizedInvoiceById = async (req, res) => {
  try {
    const userId = req.user.userId; // coming from token middleware
    const { id } = req.params;

    // ✅ validate mongo id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customization id"
      });
    }

    // ✅ find only if belongs to logged-in user
    const customization = await InvoiceCustomization.findOne({
      _id: id,
      userId
    });

    if (!customization) {
      return res.status(404).json({
        success: false,
        message: "Customization not found for this user"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Customization fetched successfully",
      data: customization
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
