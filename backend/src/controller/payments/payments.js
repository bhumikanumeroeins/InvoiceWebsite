import InvoiceTaxForm from '../../models/forms/invoiceTaxForm.js';
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
        message: 'Payment status is required'
      });
    }

    // If setting as paid or partially paid, validate payment details
    if ((paymentStatus === 'paid' || paymentStatus === 'partiallyPaid') && (!paidAmount || !paidDate || !paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Paid amount, date, and payment method are required for paid status'
      });
    }

    // Validate payment amount
    if ((paymentStatus === 'paid' || paymentStatus === 'partiallyPaid') && paidAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount must be greater than 0'
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
        message: 'Invoice not found'
      });
    }

    // Calculate balance due
    const grandTotal = invoice.totals?.grandTotal || 0;
    let balanceDue = grandTotal;

    if (paymentStatus === 'paid' || paymentStatus === 'partiallyPaid') {
      balanceDue = Math.max(0, grandTotal - parseFloat(paidAmount));
    }

    // Update invoice payment fields
    const updateFields = {
      paymentStatus,
      updatedAt: new Date()
    };

    if (paymentStatus === 'paid' || paymentStatus === 'partiallyPaid') {
      updateFields.paidAmount = parseFloat(paidAmount);
      updateFields.paidDate = new Date(paidDate);
      updateFields.paymentMethod = paymentMethod;
      updateFields.paymentNote = paymentNote || '';
      updateFields.balanceDue = balanceDue;
    } else if (paymentStatus === 'unpaid') {
      // Clear payment fields when setting as unpaid
      updateFields.paidAmount = 0;
      updateFields.paidDate = null;
      updateFields.paymentMethod = null;
      updateFields.paymentNote = null;
      updateFields.balanceDue = grandTotal;
    }

    // Update the invoice
    const updatedInvoice = await InvoiceTaxForm.findByIdAndUpdate(
      invoiceId,
      { $set: updateFields },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: {
        invoice: updatedInvoice,
        paymentStatus: updatedInvoice.paymentStatus,
        paidAmount: updatedInvoice.paidAmount || 0,
        balanceDue: updatedInvoice.balanceDue || grandTotal
      }
    });

  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status',
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