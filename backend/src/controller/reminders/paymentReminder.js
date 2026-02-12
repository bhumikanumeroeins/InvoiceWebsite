import PaymentReminder from "../../models/reminders/paymentReminder.js";
import InvoiceTaxForm from "../../models/forms/invoiceTaxForm.js";
import { sendInvoiceEmail } from "../../utils/emailService.js";

// Create reminders when invoice is created
export const createRemindersForInvoice = async (invoiceId) => {
  try {
    const invoice = await InvoiceTaxForm.findById(invoiceId);
    if (!invoice || !invoice.invoiceMeta?.dueDate || !invoice.client?.email) {
      return { success: false, message: "Invoice not found or missing required data" };
    }

    if (invoice.paymentStatus === 'paid') {
      return { success: false, message: "Invoice is already paid" };
    }

    const dueDate = new Date(invoice.invoiceMeta.dueDate);
    const now = new Date();

    // First reminder: 5 days before due date
    const firstReminderDate = new Date(dueDate);
    firstReminderDate.setDate(dueDate.getDate() - 5);

    // Second reminder: 3 days before due date
    const secondReminderDate = new Date(dueDate);
    secondReminderDate.setDate(dueDate.getDate() - 3);

    const remindersToCreate = [];

    if (firstReminderDate > now) {
      remindersToCreate.push({
        invoiceId: invoice._id,
        clientEmail: invoice.client.email,
        invoiceNumber: invoice.invoiceMeta.invoiceNo,
        dueDate: invoice.invoiceMeta.dueDate,
        reminderType: 'first',
        scheduledDate: firstReminderDate
      });
    }

    if (secondReminderDate > now) {
      remindersToCreate.push({
        invoiceId: invoice._id,
        clientEmail: invoice.client.email,
        invoiceNumber: invoice.invoiceMeta.invoiceNo,
        dueDate: invoice.invoiceMeta.dueDate,
        reminderType: 'second',
        scheduledDate: secondReminderDate
      });
    }

    if (remindersToCreate.length > 0) {
      await PaymentReminder.insertMany(remindersToCreate);
      return { success: true, message: `Created ${remindersToCreate.length} reminders` };
    }

    return { success: false, message: "No reminders needed" };

  } catch (error) {
    console.error("Error creating reminders:", error);
    return { success: false, message: error.message };
  }
};

// Process pending reminders (manual trigger for testing)
export const processPendingReminders = async (req, res) => {
  try {
    const now = new Date();
    
    const pendingReminders = await PaymentReminder.find({
      status: 'pending',
      scheduledDate: { $lte: now }
    }).populate('invoiceId');

    let processed = 0;
    let failed = 0;

    for (const reminder of pendingReminders) {
      try {
        // Check if invoice exists and is still unpaid
        if (reminder.invoiceId && reminder.invoiceId.paymentStatus === 'paid') {
          reminder.status = 'sent';
          reminder.sentAt = new Date();
          await reminder.save();
          processed++;
          continue;
        }

        // Use email from invoice.client.email (saved when invoice was sent)
        const recipientEmail = reminder.invoiceId?.client?.email || reminder.clientEmail;
        
        if (!recipientEmail) {
          console.error(`No email found for reminder ${reminder._id}`);
          reminder.status = 'failed';
          await reminder.save();
          failed++;
          continue;
        }

        const dueDate = new Date(reminder.dueDate).toLocaleDateString();
        const isFirstReminder = reminder.reminderType === 'first';
        
        const subject = isFirstReminder 
          ? `Payment Reminder: Invoice ${reminder.invoiceNumber} Due Soon`
          : `Final Payment Reminder: Invoice ${reminder.invoiceNumber}`;

        const totalAmount = reminder.invoiceId?.totals?.grandTotal || 'N/A';
        const currency = reminder.invoiceId?.invoiceMeta?.currency || 'INR';

        const message = isFirstReminder 
          ? `Dear Customer,

This is a friendly reminder that your invoice ${reminder.invoiceNumber} is due in 5 days.

Due Date: ${dueDate}
Amount: ${currency} ${totalAmount}

Please ensure payment is made by the due date.

Thank you for your business!`
          : `Dear Customer,

This is your final reminder that invoice ${reminder.invoiceNumber} is due in 3 days.

Due Date: ${dueDate}
Amount: ${currency} ${totalAmount}

Please make the payment immediately to avoid any late fees.

Thank you!`;

        await sendInvoiceEmail({
          to: recipientEmail,
          subject,
          message,
          pdfBuffer: null
        });

        reminder.status = 'sent';
        reminder.sentAt = new Date();
        await reminder.save();
        processed++;

      } catch (error) {
        console.error(`Failed to send reminder ${reminder._id}:`, error);
        reminder.status = 'failed';
        await reminder.save();
        failed++;
      }
    }

    res.json({
      success: true,
      message: `Processed ${processed} reminders, ${failed} failed`,
      data: { total: pendingReminders.length, processed, failed }
    });

  } catch (error) {
    console.error("Error processing reminders:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get reminders for a specific invoice
export const getInvoiceReminders = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const userId = req.user?.userId;

    // Verify invoice belongs to user
    const invoice = await InvoiceTaxForm.findOne({
      _id: invoiceId,
      createdBy: userId
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found or access denied"
      });
    }

    const reminders = await PaymentReminder.find({ invoiceId })
      .sort({ scheduledDate: 1 });

    return res.status(200).json({
      success: true,
      data: reminders
    });

  } catch (error) {
    console.error("Get invoice reminders error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create reminders for an invoice (user-triggered)
export const createInvoiceReminders = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const userId = req.user?.userId;

    // Verify invoice belongs to user
    const invoice = await InvoiceTaxForm.findOne({
      _id: invoiceId,
      createdBy: userId
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found or access denied"
      });
    }

    // Use existing createRemindersForInvoice function
    const result = await createRemindersForInvoice(invoiceId);

    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }

  } catch (error) {
    console.error("Create invoice reminders error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete a reminder
export const deleteReminder = async (req, res) => {
  try {
    const { reminderId } = req.params;
    const userId = req.user?.userId;

    // Find reminder and verify ownership through invoice
    const reminder = await PaymentReminder.findById(reminderId).populate('invoiceId');

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found"
      });
    }

    // Verify invoice belongs to user
    if (reminder.invoiceId.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    await PaymentReminder.findByIdAndDelete(reminderId);

    return res.status(200).json({
      success: true,
      message: "Reminder deleted successfully"
    });

  } catch (error) {
    console.error("Delete reminder error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update reminder status
export const updateReminderStatus = async (req, res) => {
  try {
    const { reminderId } = req.params;
    const { status } = req.body;
    const userId = req.user?.userId;

    if (!['pending', 'sent', 'failed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    // Find reminder and verify ownership through invoice
    const reminder = await PaymentReminder.findById(reminderId).populate('invoiceId');

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found"
      });
    }

    // Verify invoice belongs to user
    if (reminder.invoiceId.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    reminder.status = status;
    if (status === 'sent') {
      reminder.sentAt = new Date();
    }
    await reminder.save();

    return res.status(200).json({
      success: true,
      message: "Reminder status updated successfully",
      data: reminder
    });

  } catch (error) {
    console.error("Update reminder status error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
