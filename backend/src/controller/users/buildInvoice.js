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
    const userId = req.user.userId;
    const data = req.body;

    console.log("req.user =>", req.user);
    console.log("userId =>", userId);

    if (typeof data.content === "string") {
      try {
        data.content = JSON.parse(data.content);
      } catch (e) {
        console.error("Failed to parse content:", e);
      }
    }
    if (typeof data.typography === "string") {
      try {
        data.typography = JSON.parse(data.typography);
      } catch (e) {
        console.error("Failed to parse typography:", e);
      }
    }
    if (typeof data.visibility === "string") {
      try {
        data.visibility = JSON.parse(data.visibility);
      } catch (e) {
        console.error("Failed to parse visibility:", e);
      }
    }
    if (typeof data.items === "string") {
      try {
        data.items = JSON.parse(data.items);
      } catch (e) {
        console.error("Failed to parse items:", e);
      }
    }
    if (typeof data.paymentInformation === "string") {
      try {
        data.paymentInformation = JSON.parse(data.paymentInformation);
      } catch (e) {
        console.error("Failed to parse paymentInformation:", e);
      }
    }
    if (typeof data.termsAndConditions === "string") {
      try {
        data.termsAndConditions = JSON.parse(data.termsAndConditions);
      } catch (e) {
        console.error("Failed to parse termsAndConditions:", e);
      }
    }

    if (data.selectedTemplateId !== undefined) {
      const parsed = Number(data.selectedTemplateId);
      data.selectedTemplateId = isNaN(parsed) ? 0 : parsed;
    }

    if (!data.templateName) {
      return res
        .status(400)
        .json({ success: false, message: "templateName is required" });
    }

    // Find the specific existing document for this user + templateName
    const existing = await InvoiceCustomization.findOne({
      userId,
      templateName: data.templateName,
    });

    // Subscription limit check — only for new invoices (not updates)
    if (!existing) {
      const user = await Registration.findById(userId).select(
        "subscription totalInvoices",
      );
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });

      // Expire subscription if needed
      if (
        user.subscription?.endDate &&
        new Date() > new Date(user.subscription.endDate)
      ) {
        await Registration.updateOne(
          { _id: userId },
          {
            $set: {
              subscription: {
                planName: "Free",
                price: "$0",
                invoiceLimit: 2,
                startDate: new Date(),
                endDate: null,
                isActive: true,
              },
            },
          },
        );
        user.subscription.invoiceLimit = 2;
      }

      const limit = user.subscription?.invoiceLimit ?? 2;
      if (limit !== -1 && user.totalInvoices >= limit) {
        return res.status(403).json({
          success: false,
          message:
            "Invoice limit reached. Please upgrade your subscription plan.",
        });
      }
    }

    // multer uploaded files
    const logo = req.files?.logo?.[0]?.filename;
    const qrCode = req.files?.qrCode?.[0]?.filename;
    const authorizedSignature = req.files?.authorizedSignature?.[0]?.filename;

    const payload = {
      ...data,
      userId,
      isDeleted: false,
      invoiceDate: parseDate(data.invoiceDate) || existing?.invoiceDate || null,
      dueDate: parseDate(data.dueDate) || existing?.dueDate || null,
      logo: logo ? `/uploads/${logo}` : existing?.logo || "",
      qrCode: qrCode ? `/uploads/${qrCode}` : existing?.qrCode || "",
      authorizedSignature: authorizedSignature
        ? `/uploads/${authorizedSignature}`
        : existing?.authorizedSignature || "",
    };

    const customization = await InvoiceCustomization.findOneAndUpdate(
      { userId, templateName: data.templateName },
      payload,
      { new: true, upsert: true },
    );

    // Increment totalInvoices only for new documents
    if (!existing) {
      await Registration.updateOne(
        { _id: userId },
        { $inc: { totalInvoices: 1 } },
      );
    }

    return res.status(200).json({
      success: true,
      message: "Invoice customization saved successfully",
      data: customization,
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCustomInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const invoice = await InvoiceCustomization.findOneAndUpdate(
      { _id: id, userId, isDeleted: { $ne: true } },
      { $set: { isDeleted: true } },
      { new: true },
    );

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found or access denied",
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Invoice moved to trash successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const restoreCustomInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const invoice = await InvoiceCustomization.findOneAndUpdate(
      { _id: id, userId, isDeleted: true },
      { $set: { isDeleted: false } },
      { new: true },
    );

    if (!invoice) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found in trash" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Invoice restored successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const permanentDeleteCustomInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const invoice = await InvoiceCustomization.findOneAndDelete({
      _id: id,
      userId,
      isDeleted: true,
    });

    if (!invoice) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found in trash" });
    }

    // Decrement totalInvoices
    await Registration.updateOne(
      { _id: userId },
      { $inc: { totalInvoices: -1 } },
    );

    return res
      .status(200)
      .json({ success: true, message: "Invoice permanently deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCustomTrashInvoices = async (req, res) => {
  try {
    const userId = req.user.userId;
    const invoices = await InvoiceCustomization.find({
      userId,
      isDeleted: true,
    }).sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const getCustomizedInvoiceById = async (req, res) => {
  try {
    const userId = req.user.userId; // coming from token middleware
    const { id } = req.params;

    // ✅ validate mongo id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customization id",
      });
    }

    // ✅ find only if belongs to logged-in user
    const customization = await InvoiceCustomization.findOne({
      _id: id,
      userId,
    });

    if (!customization) {
      return res.status(404).json({
        success: false,
        message: "Customization not found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Customization fetched successfully",
      data: customization,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get all cutomizations for a user
export const getAllCustomizationsForUser = async (req, res) => {
  try {
    const userId = req.user.userId; // coming from token middleware
    const customizations = await InvoiceCustomization.find({
      userId,
      isDeleted: { $ne: true },
    });

    return res.status(200).json({
      success: true,
      message: "Customizations fetched successfully",
      data: customizations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
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
        message: "Recipient email and subject are required",
      });
    }

    if (!pdfBase64) {
      return res.status(400).json({
        success: false,
        message: "PDF data is required",
      });
    }

    /* ---------------- FIND CUSTOM INVOICE ---------------- */
    const customInvoice = await InvoiceCustomization.findOne({
      _id: id,
      userId,
    });

    if (!customInvoice) {
      return res.status(404).json({
        success: false,
        message: "Custom invoice not found",
      });
    }

    /* ---------------- PREPARE PDF BUFFER ---------------- */
    let pdfBuffer = null;
    try {
      // Remove data URL prefix if present
      const base64Data = pdfBase64.replace(
        /^data:application\/pdf;base64,/,
        "",
      );
      pdfBuffer = Buffer.from(base64Data, "base64");
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid PDF data",
      });
    }

    /* ---------------- GET USER EMAIL FOR COPY ---------------- */
    const user = await Registration.findById(userId).select("email");
    const copyToEmail = sendCopy ? user?.email : null;

    /* ---------------- SEND RESPONSE IMMEDIATELY ---------------- */
    const templateName = customInvoice.templateName || "Custom Invoice";
    res.status(200).json({
      success: true,
      message: "Email is being sent",
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
    })
      .then(() => {
        console.log(`✅ Custom invoice email sent successfully to ${to}`);
      })
      .catch((err) => {
        console.error(
          `❌ Failed to send custom invoice email to ${to}:`,
          err.message,
        );
      });
  } catch (error) {
    console.error("SEND CUSTOM INVOICE EMAIL ERROR 👉", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send email",
    });
  }
};
