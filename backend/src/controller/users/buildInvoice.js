import Registration from "../../models/users/registration.js";
import InvoiceCustomization from "../../models/users/buildInvoice.js";

import { createError } from "../../utils/utils.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";



export const createOrUpdateInvoiceCustomization = async (req, res) => {
  try {
    const userId = req.user.userId; // from token middleware
    console.log("req.user:", req.user);
    console.log("req.user._id =>", req.user?._id);
    const data = req.body;

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

    // find existing customization
    const existing = await InvoiceCustomization.findOne({ userId });

    const payload = {
      ...data,
      userId,

      // if new file uploaded use it else keep old
      logo: logoUrl || existing?.logo || "",
      qrCode: qrCodeUrl || existing?.qrCode || "",
      authorizedSignature: signatureUrl || existing?.authorizedSignature || ""
    };

    const customization = await InvoiceCustomization.findOneAndUpdate(
      { userId, templateName: data.templateName }, // template wise
      payload,
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "Invoice customization saved successfully",
      data: customization
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// GET customization by id (only logged in user can access)
export const getCustomizedInvoiceById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const customization = await InvoiceCustomization.findOne({
      _id: id,
      userId
    });

    if (!customization) {
      return res.status(404).json({
        success: false,
        message: "Customization not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: customization
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
