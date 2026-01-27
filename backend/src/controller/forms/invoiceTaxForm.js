import mongoose from "mongoose";
import InvoiceTaxForm from "../../models/forms/invoiceTaxForm.js";

import { parseISODate } from "../../utils/utils.js";
import { sendInvoiceEmail } from "../../utils/emailService.js";
import ItemMaster from "../../models/items/items.js";
import { createRemindersForInvoice } from "../reminders/paymentReminder.js";

/* ---------------- ADDRESS PARSING HELPERS ---------------- */
const parseAddress = (addressText) => {
  if (!addressText || typeof addressText !== 'string') {
    return { address: '', city: '', state: '', zip: '' };
  }

  const lines = addressText.trim().split('\n').map(line => line.trim()).filter(line => line);
  
  if (lines.length === 0) {
    return { address: '', city: '', state: '', zip: '' };
  }

  let address = '', city = '', state = '', zip = '';
  
  // If single line, try to parse city/zip from it
  if (lines.length === 1) {
    const fullText = lines[0];
    const zipMatch = fullText.match(/\b(\d{5,6})\b/);
    
    if (zipMatch) {
      zip = zipMatch[0];
      const beforeZip = fullText.substring(0, fullText.indexOf(zip)).trim();
      
      // Split by comma to separate address from city/state
      const parts = beforeZip.split(',').map(p => p.trim()).filter(p => p);
      
      if (parts.length >= 2) {
        // First part is address, last part is city (and maybe state)
        address = parts[0];
        const cityStatePart = parts[parts.length - 1];
        const cityStateParts = cityStatePart.split(/\s+/).filter(p => p);
        
        if (cityStateParts.length >= 2) {
          state = cityStateParts[cityStateParts.length - 1];
          city = cityStateParts.slice(0, -1).join(' ');
        } else {
          city = cityStatePart;
        }
      } else if (parts.length === 1) {
        // Try to split by spaces to find city before ZIP
        const words = beforeZip.split(/\s+/).filter(w => w);
        if (words.length >= 2) {
          city = words[words.length - 1];
          address = words.slice(0, -1).join(' ');
        } else {
          address = beforeZip;
        }
      }
    } else {
      // No ZIP found, just use as address
      address = fullText;
    }
  } else {
    // Multiple lines - first line is address
    address = lines[0];
    
    // Try to parse city, state, zip from remaining lines
    if (lines.length > 1) {
      const lastLine = lines[lines.length - 1];
      const zipMatch = lastLine.match(/\b(\d{5,6})\b/);
      
      if (zipMatch) {
        zip = zipMatch[0];
        const beforeZip = lastLine.substring(0, lastLine.indexOf(zip)).trim();
        
        const parts = beforeZip.split(/[,\s]+/).filter(part => part);
        if (parts.length >= 2) {
          state = parts[parts.length - 1];
          city = parts.slice(0, -1).join(' ');
        } else if (parts.length === 1) {
          city = parts[0];
        }
      } else {
        // No zip found, try to split city and state
        const parts = lastLine.split(/[,\s]+/).filter(part => part);
        if (parts.length >= 2) {
          city = parts.slice(0, -1).join(' ');
          state = parts[parts.length - 1];
        } else if (parts.length === 1) {
          city = parts[0];
        }
      }
    }
  }

  return { address, city, state, zip };
};

const parseShippingAddress = (shippingText) => {
  if (!shippingText || typeof shippingText !== 'string') {
    return { shippingAddress: '', shippingCity: '', shippingState: '', shippingZip: '' };
  }

  const parsed = parseAddress(shippingText);
  return {
    shippingAddress: parsed.address,
    shippingCity: parsed.city,
    shippingState: parsed.state,
    shippingZip: parsed.zip
  };
};

/* ---------------- QR CODE MIGRATION HELPER ---------------- */
const migrateQRCodeIfNeeded = async (invoice) => {
  if (invoice.payment?.qrCode && !invoice.qrCode) {
    try {
      await InvoiceTaxForm.updateOne(
        { _id: invoice._id },
        {
          $set: { qrCode: invoice.payment.qrCode },
          $unset: { "payment.qrCode": "" }
        }
      );
      
      // Update the current invoice object
      invoice.qrCode = invoice.payment.qrCode;
      if (invoice.payment) {
        delete invoice.payment.qrCode;
      }
      
      return true; // Migration successful
    } catch (error) {
      console.error(`❌ QR migration failed for invoice ${invoice._id}:`, error.message);
      return false; // Migration failed but continue
    }
  }
  return false; // No migration needed
};

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
      const parsedInvoiceDate = parseISODate(data.invoiceMeta.invoiceDate);
      if (!parsedInvoiceDate) {
        return res.status(400).json({
          success: false,
          message: "invoiceDate must be in YYYY-MM-DD format"
        });
      }
      data.invoiceMeta.invoiceDate = parsedInvoiceDate;
    }

    if (data.invoiceMeta?.dueDate) {
      const parsedDueDate = parseISODate(data.invoiceMeta.dueDate);
      if (!parsedDueDate) {
        return res.status(400).json({
          success: false,
          message: "dueDate must be in YYYY-MM-DD format"
        });
      }
      data.invoiceMeta.dueDate = parsedDueDate;
    }

    /* ---------------- CURRENCY VALIDATION ---------------- */
    if (data.invoiceMeta?.currency) {
      const currencyRegex = /^[A-Z]{3}$/;
      if (!currencyRegex.test(data.invoiceMeta.currency.toUpperCase())) {
        return res.status(400).json({
          success: false,
          message: "Currency must be a valid 3-letter code (e.g., USD, INR)"
        });
      }
      data.invoiceMeta.currency = data.invoiceMeta.currency.toUpperCase();
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
      data.qrCode = req.files.qrCode[0].filename;
    }

    /* ---------------- ADDRESS PARSING ---------------- */
    if (data.business?.address && typeof data.business.address === 'string') {
      const parsed = parseAddress(data.business.address);
      data.business = {
        ...data.business,
        city: data.business.city || parsed.city,
        state: data.business.state || parsed.state,
        zip: data.business.zip || parsed.zip,
        address: parsed.address || data.business.address
      };
    }

    if (data.client?.address && typeof data.client.address === 'string') {
      const parsed = parseAddress(data.client.address);
      data.client = {
        ...data.client,
        city: data.client.city || parsed.city,
        state: data.client.state || parsed.state,
        zip: data.client.zip || parsed.zip,
        address: parsed.address || data.client.address
      };
    }

    if (data.shipTo?.shippingAddress && typeof data.shipTo.shippingAddress === 'string') {
      const parsed = parseShippingAddress(data.shipTo.shippingAddress);
      data.shipTo = {
        ...data.shipTo,
        shippingCity: data.shipTo.shippingCity || parsed.shippingCity,
        shippingState: data.shipTo.shippingState || parsed.shippingState,
        shippingZip: data.shipTo.shippingZip || parsed.shippingZip,
        shippingAddress: parsed.shippingAddress || data.shipTo.shippingAddress
      };
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

    /* ---------------- CREATE PAYMENT REMINDERS ---------------- */
    try {
      if (invoice.invoiceMeta?.dueDate && invoice.client?.email && invoice.paymentStatus === 'unpaid') {
        await createRemindersForInvoice(invoice._id);
      }
    } catch (reminderError) {
      console.error("Failed to create payment reminders:", reminderError);
    }

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
    const userId = req.user.userId;

    const invoices = await InvoiceTaxForm
      .find({
        createdBy: userId,
        $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]
      })
      .sort({ createdAt: -1 });

    /* ---------------- AUTO-MIGRATE QR CODES ---------------- */
    let migratedCount = 0;
    for (const invoice of invoices) {
      const migrated = await migrateQRCodeIfNeeded(invoice);
      if (migrated) migratedCount++;
    }

    if (migratedCount > 0) {
      console.log(`✅ Auto-migrated ${migratedCount} QR codes`);
    }

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
    const userId = req.user.userId;

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

    /* ---------------- AUTO-MIGRATE QR CODE ---------------- */
    const migrated = await migrateQRCodeIfNeeded(invoice);
    if (migrated) {
      console.log(`✅ Auto-migrated QR code for invoice ${invoice._id}`);
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
        const parsedInvoiceDate = parseISODate(value);
        if (!parsedInvoiceDate) {
          return res.status(400).json({
            success: false,
            message: "invoiceDate must be in YYYY-MM-DD format"
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
        const parsedDueDate = parseISODate(value);
        if (!parsedDueDate) {
          return res.status(400).json({
            success: false,
            message: "dueDate must be in YYYY-MM-DD format"
          });
        }
        data.invoiceMeta.dueDate = parsedDueDate;
      } else {
        delete data.invoiceMeta.dueDate;
      }
    }

    /* ---------------- CURRENCY VALIDATION ---------------- */
    if (
      data.invoiceMeta &&
      Object.prototype.hasOwnProperty.call(data.invoiceMeta, "currency")
    ) {
      const value = data.invoiceMeta.currency;

      if (value) {
        // Basic currency code validation (3 characters, uppercase)
        const currencyRegex = /^[A-Z]{3}$/;
        if (!currencyRegex.test(value.toUpperCase())) {
          return res.status(400).json({
            success: false,
            message: "Currency must be a valid 3-letter code (e.g., USD, INR)"
          });
        }
        data.invoiceMeta.currency = value.toUpperCase();
      } else {
        delete data.invoiceMeta.currency;
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
      data.qrCode = req.files.qrCode[0].filename;
    }

    /* ---------------- ADDRESS PARSING ---------------- */
    // Parse business address if it's a single string
    if (data.business?.address && typeof data.business.address === 'string') {
      const parsed = parseAddress(data.business.address);
      data.business = {
        ...data.business,
        ...parsed
      };
    }

    // Parse client address if it's a single string
    if (data.client?.address && typeof data.client.address === 'string') {
      const parsed = parseAddress(data.client.address);
      data.client = {
        ...data.client,
        ...parsed
      };
    }

    // Parse shipping address if it's a single string
    if (data.shipTo?.shippingAddress && typeof data.shipTo.shippingAddress === 'string') {
      const parsed = parseShippingAddress(data.shipTo.shippingAddress);
      data.shipTo = {
        ...data.shipTo,
        ...parsed
      };
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
