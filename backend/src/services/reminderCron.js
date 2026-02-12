import cron from 'node-cron';
import PaymentReminder from '../models/reminders/paymentReminder.js';
import InvoiceTaxForm from '../models/forms/invoiceTaxForm.js';
import { sendInvoiceEmail } from '../utils/emailService.js';

const processPendingReminders = async () => {
  try {
    const now = new Date();
    
    const pendingReminders = await PaymentReminder.find({
      status: 'pending',
      scheduledDate: { $lte: now }
    }).populate('invoiceId');

    if (pendingReminders.length === 0) {
      return;
    }


    let processed = 0;
    let failed = 0;

    for (const reminder of pendingReminders) {
      try {
        if (!reminder.invoiceId) {
          reminder.status = 'failed';
          await reminder.save();
          failed++;
          continue;
        }

        if (reminder.invoiceId.paymentStatus === 'paid') {
          console.log(`✓ Invoice ${reminder.invoiceNumber} is already paid, skipping reminder`);
          reminder.status = 'sent';
          reminder.sentAt = new Date();
          await reminder.save();
          processed++;
          continue;
        }

        const recipientEmail = reminder.invoiceId?.client?.email || reminder.clientEmail;
        
        if (!recipientEmail) {
          console.error(`❌ No email found for reminder ${reminder._id}`);
          reminder.status = 'failed';
          await reminder.save();
          failed++;
          continue;
        }

        const dueDate = new Date(reminder.dueDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        const isFirstReminder = reminder.reminderType === 'first';
        
        const subject = isFirstReminder 
          ? `Payment Reminder: Invoice ${reminder.invoiceNumber} Due Soon`
          : `Final Payment Reminder: Invoice ${reminder.invoiceNumber}`;

        const totalAmount = reminder.invoiceId?.totals?.grandTotal || reminder.invoiceId?.total || 'N/A';
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
        console.error(`❌ Failed to send reminder ${reminder._id}:`, error.message);
        reminder.status = 'failed';
        await reminder.save();
        failed++;
      }
    }


  } catch (error) {
    console.error('❌ Error in reminder cron job:', error);
  }
};

export const initReminderCron = () => {
  
  cron.schedule('0 * * * *', processPendingReminders);
  
  
  
};
export { processPendingReminders };
