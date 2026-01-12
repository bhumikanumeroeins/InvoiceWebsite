import InvoiceTaxForm from "../../models/forms/invoiceTaxForm.js";

/* ---------------- CREATE INVOICE ---------------- */
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

    /* ---------------- DATE PARSER (DD-MM-YYYY → Date) ---------------- */
    const parseDMY = (value) => {
      if (!value) return null;
      const [day, month, year] = value.split("-");
      return new Date(`${year}-${month}-${day}`);
    };

    /* ---------------- CONVERT DATES ---------------- */
    if (data.invoiceMeta?.invoiceDate) {
      data.invoiceMeta.invoiceDate = parseDMY(
        data.invoiceMeta.invoiceDate
      );
    }

    if (data.invoiceMeta?.dueDate) {
      data.invoiceMeta.dueDate = parseDMY(
        data.invoiceMeta.dueDate
      );
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
    const invoice = await InvoiceTaxForm.create({
      ...data
      // totals are already coming from frontend
    });

    /* ---------------- RESPONSE ---------------- */
    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: invoice
    });

  } catch (error) {
    console.error("CREATE INVOICE ERROR 👉", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/*--- add items in invoices---*/
// export const addItem = async (req, res) => {
//   try {
//     const invoice = await InvoiceTaxForm.findById(req.params.invoiceId);
//     if (!invoice) return res.status(404).json({ message: "Invoice not found" });

//     invoice.items.push(req.body);

//     // Recalculate totals
//     const subtotal = invoice.items.reduce((s, i) => s + Number(i.amount || 0), 0);
//     const taxTotal = invoice.items.reduce((s, i) => s + Number(i.tax || 0), 0);

//     invoice.totals = {
//       subtotal,
//       taxTotal,
//       grandTotal: subtotal + taxTotal
//     };

//     await invoice.save();

//     res.json({ success: true, data: invoice });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

/*----------- delete items-----------*/
// export const deleteItem = async (req, res) => {
//   try {
//     const invoice = await InvoiceTaxForm.findById(req.params.invoiceId);
//     if (!invoice) return res.status(404).json({ message: "Invoice not found" });

//     invoice.items = invoice.items.filter(
//       item => item._id.toString() !== req.params.itemId
//     );

//     const subtotal = invoice.items.reduce((s, i) => s + Number(i.amount || 0), 0);
//     const taxTotal = invoice.items.reduce((s, i) => s + Number(i.tax || 0), 0);

//     invoice.totals = {
//       subtotal,
//       taxTotal,
//       grandTotal: subtotal + taxTotal
//     };

//     await invoice.save();

//     res.json({ success: true, data: invoice });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

/* ---------------- GET ALL INVOICES ---------------- */
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

/* ---------------- GET SINGLE INVOICE ---------------- */
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

/* ---------------- UPDATE INVOICE ---------------- */
export const updateInvoice = async (req, res) => {
  try {
    const { items = [] } = req.body;

    // ✅ AGAIN: ONLY SUM, DO NOT RECALCULATE ITEM VALUES
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    const taxTotal = items.reduce(
      (sum, item) => sum + Number(item.tax || 0),
      0
    );

    const invoice = await InvoiceTaxForm.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        totals: {
          subtotal,
          taxTotal,
          grandTotal: subtotal + taxTotal
        }
      },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found"
      });
    }

    res.json({
      success: true,
      message: "Invoice updated successfully",
      data: invoice
    });

  } catch (error) {
    console.error("UPDATE INVOICE ERROR 👉", error);
    res.status(500).json({
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
