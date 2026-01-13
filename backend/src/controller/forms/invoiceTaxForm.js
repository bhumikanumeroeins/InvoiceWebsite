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

    /* ---------------- DATE VALIDATION (DD-MM-YYYY ONLY) ---------------- */
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

    /* ---------------- SAVE INVOICE ---------------- */
    const invoice = await InvoiceTaxForm.create(data);

    /* ---------------- RESPONSE ---------------- */
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
    const invoices = await InvoiceTaxForm
      .find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: invoices
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// get invoice by id
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await InvoiceTaxForm.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found"
      });
    }

    res.json({
      success: true,
      data: invoice
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// update invoice
export const updateInvoice = async (req, res) => {
  try {
    /* ---------------- PARAMS ---------------- */
    console.log("📌 req.params:", req.params);
    const { invoiceId } = req.params;

    if (!invoiceId) {
      return res.status(400).json({
        success: false,
        message: "invoiceId is required"
      });
    }

    /* ---------------- BODY ---------------- */
    const data = JSON.parse(req.body.data || "{}");
    console.log("📌 parsed data:", data);

    /* ---------------- FILES ---------------- */
    console.log("📌 req.files:", req.files);

    /* ---------------- CHECK INVOICE ---------------- */
    const existingInvoice = await InvoiceTaxForm.findById(invoiceId);

    if (!existingInvoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found"
      });
    }

    /* ---------------- DATE VALIDATION (DD-MM-YYYY ONLY IF SENT) ---------------- */

    if (
      data.invoiceMeta &&
      Object.prototype.hasOwnProperty.call(data.invoiceMeta, "invoiceDate")
    ) {
      const value = data.invoiceMeta.invoiceDate;

      if (value !== undefined && value !== null && value !== "") {
        const parsedInvoiceDate = parseDDMMYYYY(value);

        if (!parsedInvoiceDate) {
          return res.status(400).json({
            success: false,
            message: "invoiceDate must be in DD-MM-YYYY format"
          });
        }

        data.invoiceMeta.invoiceDate = parsedInvoiceDate;
      } else {
        // prevent overwriting existing value
        delete data.invoiceMeta.invoiceDate;
      }
    }

    if (
      data.invoiceMeta &&
      Object.prototype.hasOwnProperty.call(data.invoiceMeta, "dueDate")
    ) {
      const value = data.invoiceMeta.dueDate;

      if (value !== undefined && value !== null && value !== "") {
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
    const updatedInvoice = await InvoiceTaxForm.findByIdAndUpdate(
      invoiceId,
      { $set: data },
      { new: true, runValidators: true }
    );

    /* ---------------- RESPONSE ---------------- */
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
    const invoice = await InvoiceTaxForm.findByIdAndDelete(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found"
      });
    }

    res.json({
      success: true,
      message: "Invoice deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
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
