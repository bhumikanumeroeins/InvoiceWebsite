import Registration from "../../models/users/registration.js";
import InvoiceCustomization from "../../models/users/buildInvoice.js";
import { sendInvoiceEmail } from "../../utils/emailService.js";
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


//get all cutomizations for a user
export const getAllCustomizationsForUser = async (req, res) => {
  try {
    const userId = req.user.userId; // coming from token middleware
    const customizations = await InvoiceCustomization.find({ userId });

    return res.status(200).json({ 
      success: true,
      message: "Customizations fetched successfully", 
      data: customizations 
    });
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }

};



 
export const sendCustomInvoiceEmail = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { to, subject, message, sendCopy, pdfBase64 } = req.body;
 
    /* ---------------- VALIDATION ---------------- */
    if (!to || !subject) {
      return res.status(400).json({
        success: false,
        message: "Recipient email and subject are required"
      });
    }

    if (!pdfBase64) {
      return res.status(400).json({
        success: false,
        message: "PDF data is required"
      });
    }
 
    /* ---------------- FIND CUSTOM INVOICE ---------------- */
    const customInvoice = await InvoiceCustomization.findOne({ 
      _id: id, 
      userId 
    });
 
    if (!customInvoice) {
      return res.status(404).json({
        success: false,
        message: "Custom invoice not found"
      });
    }
 
    /* ---------------- PREPARE PDF BUFFER ---------------- */
    let pdfBuffer = null;
    try {
      // Remove data URL prefix if present
      const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
      pdfBuffer = Buffer.from(base64Data, 'base64');
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid PDF data"
      });
    }
 
    /* ---------------- GET USER EMAIL FOR COPY ---------------- */
    const user = await Registration.findById(userId).select('email');
    const copyToEmail = sendCopy ? user?.email : null;
 
    /* ---------------- SEND RESPONSE IMMEDIATELY ---------------- */
    const templateName = customInvoice.templateName || 'Custom Invoice';
    res.status(200).json({
      success: true,
      message: "Email is being sent"
    });
 
    /* ---------------- SEND EMAIL IN BACKGROUND ---------------- */
    sendInvoiceEmail({
      to,
      subject,
      message: message || `Please find the attached custom invoice.`,
      pdfBuffer,
      pdfFilename: `${templateName}.pdf`,
      sendCopy: sendCopy || false,
      copyTo: copyToEmail,
    }).then(() => {
      console.log(`✅ Custom invoice email sent successfully to ${to}`);
    }).catch((err) => {
      console.error(`❌ Failed to send custom invoice email to ${to}:`, err.message);
    });
 
  } catch (error) {
    console.error("SEND CUSTOM INVOICE EMAIL ERROR 👉", error);
 
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send email"
    });
  }
};