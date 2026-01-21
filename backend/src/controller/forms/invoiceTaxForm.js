import mongoose from "mongoose";
import InvoiceTaxForm from "../../models/forms/invoiceTaxForm.js";

import { parseDDMMYYYY } from "../../utils/utils.js";
import { sendInvoiceEmail } from "../../utils/emailService.js";



import ItemMaster from "../../models/items/items.js";

// create invoice



export const createInvoice = async (req, res) => {
  try {
    /* ---------------- AUTH CHECK ---------------- */
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    /* ---------------- PARSE JSON ---------------- */
    const data = JSON.parse(req.body.data || "{}");

    /* ---------------- REQUIRED FIELD CHECK ---------------- */
    if (!data.documentType) {
      return res.status(400).json({
        success: false,
        message: "documentType is required"
      });
    }

    /* ---------------- DATE VALIDATION ---------------- */
    if (data.invoiceMeta?.invoiceDate) {
      const parsedInvoiceDate = parseDDMMYYYY(data.invoiceMeta.invoiceDate);
      if (!parsedInvoiceDate) {
        return res.status(400).json({
          success: false,
          message: "invoiceDate must be in DD-MM-YYYY format"
        });
      }
      data.invoiceMeta.invoiceDate = parsedInvoiceDate;
    }

    if (data.invoiceMeta?.dueDate) {
      const parsedDueDate = parseDDMMYYYY(data.invoiceMeta.dueDate);
      if (!parsedDueDate) {
        return res.status(400).json({
          success: false,
          message: "dueDate must be in DD-MM-YYYY format"
        });
      }
      data.invoiceMeta.dueDate = parsedDueDate;
    }

    /* ---------------- FILE UPLOADS ---------------- */
    if (req.files?.logo?.[0]) {
      data.business = data.business || {};
      data.business.logo = req.files.logo[0].filename;
    }

    if (req.files?.signature?.[0]) {
      data.signature = req.files.signature[0].filename;
    }

    if (req.files?.qrCode?.[0]) {
      data.payment = data.payment || {};
      data.payment.qrCode = req.files.qrCode[0].filename;
    }

    /* ---------------- ITEMS VALIDATION ---------------- */
    if (!Array.isArray(data.items) || data.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one item is required"
      });
    }

    const itemIds = data.items.map(i => i.itemId || i);

    const masterItems = await ItemMaster.find({
      _id: { $in: itemIds },
      createdBy: req.user.userId
    });

    if (!masterItems.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid items selected"
      });
    }

    data.items = masterItems.map(item => ({
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
      amount: item.amount,
      tax: item.tax
    }));

    /* ---------------- FORCE SYSTEM FIELDS ---------------- */
    data.createdBy = new mongoose.Types.ObjectId(req.user.userId);
    data.isDeleted = false;
    data.paymentStatus = "unpaid";

    /* ---------------- SAVE INVOICE ---------------- */
    const invoice = await InvoiceTaxForm.create(data);

    /* ---------------- POPULATE USER ---------------- */
    await invoice.populate("createdBy", "email");

    return res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: invoice
    });

  } catch (error) {
    console.error("CREATE INVOICE ERROR 👉", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};




// get all invoices (only active ones)
export const getAllInvoices = async (req, res) => {
  try {
    const userId = req.user.userId; // 👈 from token

    const invoices = await InvoiceTaxForm
      .find({
        createdBy: userId,
        $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices
    });

  } catch (error) {
    console.error("GET INVOICES ERROR 👉", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// get invoice by id (only active invoices)
export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId; // 👈 from token

    const invoice = await InvoiceTaxForm.findOne({
      _id: id,
      createdBy: userId,
      $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found or access denied"
      });
    }

    return res.status(200).json({
      success: true,
      data: invoice
    });

  } catch (error) {
    console.error("GET INVOICE BY ID ERROR 👉", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// update invoice
export const updateInvoice = async (req, res) => {
  try {
    /* ---------------- PARAMS ---------------- */
    const { invoiceId } = req.params;
    const userId = req.user.userId; // 👈 from token

    if (!invoiceId) {
      return res.status(400).json({
        success: false,
        message: "invoiceId is required"
      });
    }

    /* ---------------- BODY ---------------- */
    const data = JSON.parse(req.body.data || "{}");

    /* ---------------- CHECK OWNERSHIP ---------------- */
    const existingInvoice = await InvoiceTaxForm.findOne({
      _id: invoiceId,
      createdBy: userId
    });

    if (!existingInvoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found or access denied"
      });
    }

    /* ---------------- DATE VALIDATION ---------------- */
    if (
      data.invoiceMeta &&
      Object.prototype.hasOwnProperty.call(data.invoiceMeta, "invoiceDate")
    ) {
      const value = data.invoiceMeta.invoiceDate;

      if (value) {
        const parsedInvoiceDate = parseDDMMYYYY(value);
        if (!parsedInvoiceDate) {
          return res.status(400).json({
            success: false,
            message: "invoiceDate must be in DD-MM-YYYY format"
          });
        }
        data.invoiceMeta.invoiceDate = parsedInvoiceDate;
      } else {
        delete data.invoiceMeta.invoiceDate;
      }
    }

    if (
      data.invoiceMeta &&
      Object.prototype.hasOwnProperty.call(data.invoiceMeta, "dueDate")
    ) {
      const value = data.invoiceMeta.dueDate;

      if (value) {
        const parsedDueDate = parseDDMMYYYY(value);
        if (!parsedDueDate) {
          return res.status(400).json({
            success: false,
            message: "dueDate must be in DD-MM-YYYY format"
          });
        }
        data.invoiceMeta.dueDate = parsedDueDate;
      } else {
        delete data.invoiceMeta.dueDate;
      }
    }

    /* ---------------- FILE HANDLING ---------------- */
    if (req.files?.logo?.[0]) {
      data.business = data.business || {};
      data.business.logo = req.files.logo[0].filename;
    }

    if (req.files?.signature?.[0]) {
      data.signature = req.files.signature[0].filename;
    }

    if (req.files?.qrCode?.[0]) {
      data.payment = data.payment || {};
      data.payment.qrCode = req.files.qrCode[0].filename;
    }

    /* ---------------- CLEAN EMPTY OBJECTS ---------------- */
    if (data.invoiceMeta && Object.keys(data.invoiceMeta).length === 0) {
      delete data.invoiceMeta;
    }

    /* ---------------- UPDATE ---------------- */
    const updatedInvoice = await InvoiceTaxForm.findOneAndUpdate(
      { _id: invoiceId, createdBy: userId },
      { $set: data },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Invoice updated successfully",
      data: updatedInvoice
    });

  } catch (error) {
    console.error("🔥 UPDATE INVOICE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/* ---------------- DELETE INVOICE ---------------- */
// soft delete invoice
export const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId; // 👈 from token

    /* ---------------- SOFT DELETE WITH OWNERSHIP CHECK ---------------- */
    const invoice = await InvoiceTaxForm.findOneAndUpdate(
      {
        _id: id,
        createdBy: userId,
        isDeleted: false
      },
      {
        $set: { isDeleted: true }
      },
      {
        new: true
      }
    );

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found or access denied"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Invoice moved to trash successfully"
    });

  } catch (error) {
    console.error("DELETE INVOICE ERROR 👉", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ---------------- GET TRASH INVOICES ---------------- */
export const getTrashInvoices = async (req, res) => {
  try {
    const userId = req.user.userId; // 👈 from token

    const invoices = await InvoiceTaxForm
      .find({ createdBy: userId, isDeleted: true })
      .sort({ deletedAt: -1 });

    return res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices
    });

  } catch (error) {
    console.error("GET TRASH INVOICES ERROR 👉", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ---------------- RESTORE INVOICE FROM TRASH ---------------- */
export const restoreInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId; // 👈 from token

    const invoice = await InvoiceTaxForm.findOneAndUpdate(
      { _id: id, createdBy: userId, isDeleted: true },
      { isDeleted: false, deletedAt: null },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found in trash or access denied"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Invoice restored successfully",
      data: invoice
    });

  } catch (error) {
    console.error("RESTORE INVOICE ERROR 👉", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ---------------- PERMANENT DELETE INVOICE ---------------- */
export const permanentDeleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId; // 👈 from token

    const invoice = await InvoiceTaxForm.findOneAndDelete({
      _id: id,
      createdBy: userId,
      isDeleted: true
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found in trash or access denied"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Invoice permanently deleted"
    });

  } catch (error) {
    console.error("PERMANENT DELETE INVOICE ERROR 👉", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// payment status update (optional)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { paymentStatus } = req.body;

    /* ---------------- VALIDATION ---------------- */
    const allowedStatuses = ["unpaid", "partiallyPaid", "paid"];

    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: "paymentStatus is required"
      });
    }

    if (!allowedStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid paymentStatus. Allowed values: ${allowedStatuses.join(", ")}`
      });
    }

    /* ---------------- UPDATE ---------------- */
    const invoice = await InvoiceTaxForm.findByIdAndUpdate(
      invoiceId,
      { paymentStatus },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found"
      });
    }

    /* ---------------- RESPONSE ---------------- */
    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      data: {
        invoiceId: invoice._id,
        paymentStatus: invoice.paymentStatus
      }
    });

  } catch (error) {
    console.error("UPDATE PAYMENT STATUS ERROR 👉", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};





/* ---------------- GENERATE NEXT INVOICE NO ---------------- */
const generateNextInvoiceNo = async (userId) => {
  const lastInvoice = await InvoiceTaxForm.findOne({
    createdBy: userId,
    isDeleted: false,
    "invoiceMeta.invoiceNo": { $regex: /^INV-\d+$/ }
  })
    .sort({ "invoiceMeta.invoiceNo": -1 }) // 👈 KEY FIX
    .select("invoiceMeta.invoiceNo");

  if (!lastInvoice) {
    return "INV-001";
  }

  const lastNo = lastInvoice.invoiceMeta.invoiceNo; // INV-009
  const number = parseInt(lastNo.split("-")[1], 10) + 1;

  return `INV-${String(number).padStart(3, "0")}`;
};

/* ================= COPY INVOICE ================= */
export const copyInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    /* ---------------- FIND ORIGINAL INVOICE ---------------- */
    const originalInvoice = await InvoiceTaxForm.findOne({
      _id: id,
      createdBy: userId,
      isDeleted: false
    });

    if (!originalInvoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found or access denied"
      });
    }

    /* ---------------- GENERATE NEW INVOICE NO ---------------- */
    const newInvoiceNo = await generateNextInvoiceNo(userId);

    /* ---------------- CLONE INVOICE ---------------- */
    const invoiceData = originalInvoice.toObject();

    delete invoiceData._id;
    delete invoiceData.createdAt;
    delete invoiceData.__v;

    /* ---------------- RESET FIELDS ---------------- */
    invoiceData.createdBy = new mongoose.Types.ObjectId(userId);
    invoiceData.isDeleted = false;

    invoiceData.invoiceMeta.invoiceNo = newInvoiceNo;
    invoiceData.invoiceMeta.invoiceDate = new Date();
    invoiceData.invoiceMeta.dueDate = undefined;

    /* ---------------- SAVE NEW INVOICE ---------------- */
    const newInvoice = await InvoiceTaxForm.create(invoiceData);

    return res.status(201).json({
      success: true,
      message: "Invoice copied successfully",
      data: newInvoice
    });

  } catch (error) {
    console.error("COPY INVOICE ERROR 👉", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/* ================= SEND INVOICE EMAIL ================= */
export const sendInvoiceEmailController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { to, subject, message, sendCopy, pdfBase64 } = req.body;

    /* ---------------- VALIDATION ---------------- */
    if (!to || !subject) {
      return res.status(400).json({
        success: false,
        message: "Recipient email and subject are required"
      });
    }

    /* ---------------- FIND INVOICE ---------------- */
    const invoice = await InvoiceTaxForm.findOne({
      _id: id,
      createdBy: userId,
      isDeleted: false
    }).populate("createdBy", "email");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found or access denied"
      });
    }

    /* ---------------- PREPARE PDF BUFFER ---------------- */
    let pdfBuffer = null;
    if (pdfBase64) {
      // Remove data URL prefix if present
      const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
      pdfBuffer = Buffer.from(base64Data, 'base64');
    }

    /* ---------------- SEND EMAIL ASYNCHRONOUSLY ---------------- */
    const invoiceNo = invoice.invoiceMeta?.invoiceNo || 'Invoice';
    const copyToEmail = sendCopy ? invoice.createdBy?.email : null;
    
    // Send response immediately, email will be sent in background
    res.status(200).json({
      success: true,
      message: "Email is being sent"
    });

    // Send email in background (don't await)
    sendInvoiceEmail({
      to,
      subject,
      message: message || `Please find the attached invoice ${invoiceNo}.`,
      pdfBuffer,
      pdfFilename: `${invoiceNo}.pdf`,
      sendCopy: sendCopy || false,
      copyTo: copyToEmail,
    }).then(() => {
      console.log(`✅ Email sent successfully to ${to}`);
    }).catch((err) => {
      console.error(`❌ Failed to send email to ${to}:`, err.message);
    });

  } catch (error) {
    console.error("SEND EMAIL ERROR 👉", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send email"
    });
  }
};
