import InvoiceTaxForm from "../../models/forms/invoiceTaxForm.js";

import { parseDDMMYYYY } from "../../utils/utils.js";


// create invoice


export const createInvoice = async (req, res) => {
  try {
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
      const parsedInvoiceDate = parseDDMMYYYY(
        data.invoiceMeta.invoiceDate
      );

      if (!parsedInvoiceDate) {
        return res.status(400).json({
          success: false,
          message: "invoiceDate must be in DD-MM-YYYY format"
        });
      }

      data.invoiceMeta.invoiceDate = parsedInvoiceDate;
    }

    if (data.invoiceMeta?.dueDate) {
      const parsedDueDate = parseDDMMYYYY(
        data.invoiceMeta.dueDate
      );

      if (!parsedDueDate) {
        return res.status(400).json({
          success: false,
          message: "dueDate must be in DD-MM-YYYY format"
        });
      }

      data.invoiceMeta.dueDate = parsedDueDate;
    }

    /* ---------------- ATTACH FILES ---------------- */
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

    /* ---------------- FORCE DEFAULTS ---------------- */
    data.paymentStatus = "unpaid";
    data.createdBy = req.user.userId; // 👈 from token

    /* ---------------- SAVE ---------------- */
    const invoice = await InvoiceTaxForm.create(data);

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



// get all invoices
export const getAllInvoices = async (req, res) => {
  try {
    const userId = req.user.userId; // 👈 from token

    const invoices = await InvoiceTaxForm
      .find({ createdBy: userId })
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


// get invoice by id
export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId; // 👈 from token

    const invoice = await InvoiceTaxForm.findOne({
      _id: id,
      createdBy: userId
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
export const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId; // 👈 from token

    /* ---------------- DELETE WITH OWNERSHIP CHECK ---------------- */
    const invoice = await InvoiceTaxForm.findOneAndDelete({
      _id: id,
      createdBy: userId
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found or access denied"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Invoice deleted successfully"
    });

  } catch (error) {
    console.error("DELETE INVOICE ERROR 👉", error);

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
