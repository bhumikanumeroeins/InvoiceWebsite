import mongoose from 'mongoose';
import InvoiceTaxForm from '../../models/forms/invoiceTaxForm.js';
import Payment from '../../models/payments/payment.js';
import { ObjectId } from 'mongodb';


// Update payment status for an invoice
export const updatePaymentStatus = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { paymentStatus, paidAmount, paidDate, paymentMethod, paymentNote } = req.body;
    const userId = req.user.userId;

    // Validate required fields
    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: "Payment status is required"
      });
    }

    // If setting as paid or partially paid, validate payment details
    if (
      (paymentStatus === "paid" || paymentStatus === "partiallyPaid") &&
      (!paidAmount || !paidDate || !paymentMethod)
    ) {
      return res.status(400).json({
        success: false,
        message: "Paid amount, date, and payment method are required for paid status"
      });
    }

    // Validate payment amount
    if (
      (paymentStatus === "paid" || paymentStatus === "partiallyPaid") &&
      Number(paidAmount) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment amount must be greater than 0"
      });
    }

    // Find the invoice
    const invoice = await InvoiceTaxForm.findOne({
      _id: new ObjectId(invoiceId),
      createdBy: userId,
      isDeleted: false
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found"
      });
    }

    const grandTotal = invoice.totals?.grandTotal || 0;
    let balanceDue = grandTotal;

    if (paymentStatus === "paid" || paymentStatus === "partiallyPaid") {
      balanceDue = Math.max(0, grandTotal - parseFloat(paidAmount));
    }

    // -----------------------------
    // SAVE / UPDATE PAYMENT DOCUMENT
    // -----------------------------
    let paymentDoc = null;

    if (paymentStatus === "paid" || paymentStatus === "partiallyPaid") {
      // If already payment exists -> update it, else create new
      if (invoice.paymentId) {
        paymentDoc = await Payment.findByIdAndUpdate(
          invoice.paymentId,
          {
            $set: {
              paymentStatus,
              paidAmount: parseFloat(paidAmount),
              paidDate: new Date(paidDate),
              paymentMethod,
              paymentNote: paymentNote || ""
            }
          },
          { new: true }
        );
      } else {
        paymentDoc = await Payment.create({
          invoiceId: invoice._id,
          userId,
          paymentStatus,
          paidAmount: parseFloat(paidAmount),
          paidDate: new Date(paidDate),
          paymentMethod,
          paymentNote: paymentNote || ""
        });
      }
    }

    // -----------------------------
    // UPDATE INVOICE PAYMENT FIELDS
    // -----------------------------
    const updateFields = {
      paymentStatus,
      updatedAt: new Date()
    };

    if (paymentStatus === "paid" || paymentStatus === "partiallyPaid") {
      updateFields.paidAmount = parseFloat(paidAmount);
      updateFields.paidDate = new Date(paidDate);
      updateFields.paymentMethod = paymentMethod;
      updateFields.paymentNote = paymentNote || "";
      updateFields.balanceDue = balanceDue;

      // save payment reference
      updateFields.paymentId = paymentDoc?._id;
    } else if (paymentStatus === "unpaid") {
      // Clear invoice payment fields
      updateFields.paidAmount = 0;
      updateFields.paidDate = null;
      updateFields.paymentMethod = null;
      updateFields.paymentNote = null;
      updateFields.balanceDue = grandTotal;

      // OPTIONAL: also remove payment record
      if (invoice.paymentId) {
        await Payment.findByIdAndDelete(invoice.paymentId);
      }

      updateFields.paymentId = null;
    }

    const updatedInvoice = await InvoiceTaxForm.findByIdAndUpdate(
      invoiceId,
      { $set: updateFields },
      { new: true }
    ).populate("paymentId");

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      data: {
        invoice: updatedInvoice,
        payment: updatedInvoice.paymentId || null,
        paymentStatus: updatedInvoice.paymentStatus,
        paidAmount: updatedInvoice.paidAmount || 0,
        balanceDue: updatedInvoice.balanceDue || grandTotal
      }
    });
  } catch (error) {
    console.error("Update payment status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update payment status",
      error: error.message
    });
  }
};


// Get payment details for an invoice
export const getPaymentDetails = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const userId = req.user.userId;

    // Find the invoice
    const invoice = await InvoiceTaxForm.findOne({
      _id: new ObjectId(invoiceId),
      createdBy: userId,
      isDeleted: false
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    const grandTotal = invoice.totals?.grandTotal || 0;
    const paidAmount = invoice.paidAmount || 0;
    const balanceDue = Math.max(0, grandTotal - paidAmount);

    res.status(200).json({
      success: true,
      data: {
        paymentStatus: invoice.paymentStatus || 'unpaid',
        paidAmount: paidAmount,
        paidDate: invoice.paidDate,
        paymentMethod: invoice.paymentMethod,
        paymentNote: invoice.paymentNote,
        balanceDue: balanceDue,
        grandTotal: grandTotal
      }
    });

  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment details',
      error: error.message
    });
  }
};