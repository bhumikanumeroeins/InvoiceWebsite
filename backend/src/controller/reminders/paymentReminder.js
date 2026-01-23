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

// Process pending reminders
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
          to: reminder.clientEmail,
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