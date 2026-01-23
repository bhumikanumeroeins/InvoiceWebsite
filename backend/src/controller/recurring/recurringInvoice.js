import mongoose from "mongoose";
import RecurringInvoice from "../../models/recurring/recurringInvoice.js";
import InvoiceTaxForm from "../../models/forms/invoiceTaxForm.js";
import { sendInvoiceEmail } from "../../utils/emailService.js";

import Registration from "../../models/users/registration.js";


const generateInvoicePDF = async (invoice) => {
  const invoiceText = `
INVOICE

Invoice Number: ${invoice.invoiceMeta?.invoiceNo || 'N/A'}
Invoice Date: ${invoice.invoiceMeta?.invoiceDate || 'N/A'}
Due Date: ${invoice.invoiceMeta?.dueDate || 'N/A'}

Bill To:
${invoice.client?.name || 'N/A'}
${invoice.client?.email || 'N/A'}
${invoice.client?.address || 'N/A'}

Items:
${(invoice.items || []).map(item => 
  `${item.description || 'Item'} - Qty: ${item.quantity || 1} - Rate: ${item.rate || 0} - Amount: ${item.amount || 0}`
).join('\n')}

Subtotal: ${invoice.totals?.subtotal || 0}
Tax: ${invoice.totals?.taxTotal || 0}
Total: ${invoice.totals?.grandTotal || 0}

Thank you for your business!
`;

  return Buffer.from(invoiceText, 'utf8');
};

const calculateNextRunDate = (startDate, frequency, lastRunDate = null) => {
  const baseDate = lastRunDate ? new Date(lastRunDate) : new Date(startDate);
  const nextDate = new Date(baseDate);

  switch (frequency) {
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'biweekly':
      nextDate.setDate(nextDate.getDate() + 14);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'bimonthly':
      nextDate.setMonth(nextDate.getMonth() + 2);
      break;
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    default:
      return null;
  }

  return nextDate;
};

export const createRecurringInvoice = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { invoiceId } = req.params;
    
    const {
      frequency,
      startDate,
      startOption,
      stopOption,
      stopDate,
      emailTo,
      sendCopy,
      emailSubject,
      emailText
    } = req.body;

    if (!frequency || !startDate || !emailTo || !emailSubject || !emailText) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const invoice = await InvoiceTaxForm.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found"
      });
    }

    if (frequency === 'never') {
      await RecurringInvoice.updateMany(
        { originalInvoiceId: invoiceId, createdBy: userId },
        { isActive: false, frequency: 'never' }
      );
      
      return res.status(200).json({
        success: true,
        message: "Recurring invoice disabled"
      });
    }

    const nextRunDate = calculateNextRunDate(startDate, frequency);
    if (!nextRunDate) {
      return res.status(400).json({
        success: false,
        message: "Invalid frequency specified"
      });
    }

    let recurringInvoice = await RecurringInvoice.findOne({
      originalInvoiceId: invoiceId,
      createdBy: userId
    });

    if (recurringInvoice) {
      recurringInvoice.frequency = frequency;
      recurringInvoice.startDate = new Date(startDate);
      recurringInvoice.startOption = startOption || 'useThis';
      recurringInvoice.stopOption = stopOption || 'never';
      recurringInvoice.stopDate = stopDate ? new Date(stopDate) : null;
      recurringInvoice.emailTo = emailTo;
      recurringInvoice.sendCopy = sendCopy || false;
      recurringInvoice.emailSubject = emailSubject;
      recurringInvoice.emailText = emailText;
      recurringInvoice.isActive = true;
      recurringInvoice.nextRunDate = nextRunDate;
      
      await recurringInvoice.save();
    } else {
      recurringInvoice = new RecurringInvoice({
        originalInvoiceId: invoiceId,
        createdBy: userId,
        frequency,
        startDate: new Date(startDate),
        startOption: startOption || 'useThis',
        stopOption: stopOption || 'never',
        stopDate: stopDate ? new Date(stopDate) : null,
        emailTo,
        sendCopy: sendCopy || false,
        emailSubject,
        emailText,
        isActive: true,
        nextRunDate
      });
      
      await recurringInvoice.save();
    }

    try {
      const invoiceNumber = invoice.invoiceMeta?.invoiceNo || invoice.number || 'INV-001';
      
      let userEmail = null;
      if (sendCopy) {
        const user = await Registration.findById(userId);
        userEmail = user?.email;
      }
      
      const emailMessage = `Hello,

Your recurring invoice schedule has been set up successfully!

Invoice: ${invoiceNumber}
Frequency: ${frequency}
Start Date: ${new Date(startDate).toLocaleDateString('en-GB')}
Email: ${emailTo}
${stopOption === 'onDate' ? `Stop Date: ${new Date(stopDate).toLocaleDateString('en-GB')}` : 'No end date'}

Your invoices will be automatically generated and sent according to this schedule.

Thank you for using InvoicePro!

Best regards,
InvoicePro Team`;

      await sendInvoiceEmail({
        to: emailTo,
        subject: `Recurring Schedule Confirmed - ${emailSubject}`,
        message: emailMessage,
        sendCopy: sendCopy,
        copyTo: userEmail
      });

    } catch (emailError) {
      console.error('❌ Failed to send confirmation email:', emailError);
    }
    
    return res.status(200).json({
      success: true,
      message: "Recurring invoice settings saved and confirmation email sent successfully!",
      data: {
        id: recurringInvoice._id,
        invoiceId,
        userId,
        frequency,
        emailTo,
        emailSubject,
        nextRunDate,
        emailSent: true
      }
    });

  } catch (error) {
    console.error("❌ CREATE RECURRING INVOICE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getRecurringInvoice = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { invoiceId } = req.params;

    const recurringInvoice = await RecurringInvoice.findOne({
      originalInvoiceId: invoiceId,
      createdBy: userId,
      isActive: true
    }).populate('originalInvoiceId', 'invoiceMeta client totals');

    if (!recurringInvoice) {
      return res.status(200).json({
        success: true,
        data: null,
        message: "No recurring schedule found for this invoice"
      });
    }

    return res.status(200).json({
      success: true,
      data: recurringInvoice
    });

  } catch (error) {
    console.error("GET RECURRING INVOICE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllRecurringInvoices = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status = 'active' } = req.query;

    const matchConditions = {
      createdBy: new mongoose.Types.ObjectId(userId)
    };

    if (status === 'active') {
      matchConditions.isActive = true;
    } else if (status === 'inactive') {
      matchConditions.isActive = false;
    }

    const recurringInvoices = await RecurringInvoice.find(matchConditions)
      .populate('originalInvoiceId', 'invoiceMeta client totals business')
      .populate('lastGeneratedInvoiceId', 'invoiceMeta')
      .sort({ createdAt: -1 });

    const summary = {
      total: recurringInvoices.length,
      active: recurringInvoices.filter(r => r.isActive).length,
      inactive: recurringInvoices.filter(r => !r.isActive).length,
      totalInvoicesGenerated: recurringInvoices.reduce((sum, r) => sum + r.totalInvoicesGenerated, 0)
    };

    return res.status(200).json({
      success: true,
      data: recurringInvoices,
      summary
    });

  } catch (error) {
    console.error("GET ALL RECURRING INVOICES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateRecurringInvoice = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const updateData = req.body;

    const recurringInvoice = await RecurringInvoice.findOne({
      _id: id,
      createdBy: userId
    });

    if (!recurringInvoice) {
      return res.status(404).json({
        success: false,
        message: "Recurring invoice schedule not found"
      });
    }

    if (updateData.frequency && updateData.frequency !== recurringInvoice.frequency) {
      if (updateData.frequency === 'never') {
        updateData.isActive = false;
      } else {
        updateData.nextRunDate = calculateNextRunDate(
          updateData.startDate || recurringInvoice.startDate,
          updateData.frequency,
          recurringInvoice.lastRunDate
        );
      }
    }

    Object.assign(recurringInvoice, updateData);
    await recurringInvoice.save();

    await recurringInvoice.populate('originalInvoiceId', 'invoiceMeta client totals');

    return res.status(200).json({
      success: true,
      message: "Recurring invoice schedule updated successfully",
      data: recurringInvoice
    });

  } catch (error) {
    console.error("UPDATE RECURRING INVOICE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteRecurringInvoice = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const recurringInvoice = await RecurringInvoice.findOne({
      _id: id,
      createdBy: userId
    });

    if (!recurringInvoice) {
      return res.status(404).json({
        success: false,
        message: "Recurring invoice schedule not found"
      });
    }

    recurringInvoice.isActive = false;
    recurringInvoice.frequency = 'never';
    await recurringInvoice.save();

    return res.status(200).json({
      success: true,
      message: "Recurring invoice schedule deactivated successfully"
    });

  } catch (error) {
    console.error("DELETE RECURRING INVOICE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getInvoicesDueForGeneration = async (req, res) => {
  try {
    const now = new Date();
    
    const dueInvoices = await RecurringInvoice.find({
      isActive: true,
      nextRunDate: { $lte: now },
      $or: [
        { stopOption: 'never' },
        { stopOption: 'onDate', stopDate: { $gte: now } }
      ]
    }).populate('originalInvoiceId');

    return res.status(200).json({
      success: true,
      data: dueInvoices,
      count: dueInvoices.length
    });

  } catch (error) {
    console.error("GET INVOICES DUE FOR GENERATION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const processRecurringInvoice = async (req, res) => {
  try {
    const { recurringId } = req.params;

    const recurringInvoice = await RecurringInvoice.findById(recurringId)
      .populate('originalInvoiceId');

    if (!recurringInvoice || !recurringInvoice.isActive) {
      return res.status(404).json({
        success: false,
        message: "Recurring invoice not found or inactive"
      });
    }

    const originalInvoice = recurringInvoice.originalInvoiceId;

    const newInvoiceData = {
      ...originalInvoice.toObject(),
      _id: undefined,
      createdAt: new Date(),
      invoiceMeta: {
        ...originalInvoice.invoiceMeta,
        invoiceDate: new Date().toISOString().split('T')[0],
        invoiceNo: `${originalInvoice.invoiceMeta.invoiceNo}-R${recurringInvoice.totalInvoicesGenerated + 1}`
      }
    };

    const newInvoice = await InvoiceTaxForm.create(newInvoiceData);

    const nextRunDate = calculateNextRunDate(
      recurringInvoice.startDate,
      recurringInvoice.frequency,
      new Date()
    );

    recurringInvoice.lastRunDate = new Date();
    recurringInvoice.lastGeneratedInvoiceId = newInvoice._id;
    recurringInvoice.totalInvoicesGenerated += 1;
    recurringInvoice.nextRunDate = nextRunDate;

    if (recurringInvoice.stopOption === 'onDate' && 
        nextRunDate && nextRunDate > recurringInvoice.stopDate) {
      recurringInvoice.isActive = false;
    }

    await recurringInvoice.save();

    try {
      let userEmail = null;
      if (recurringInvoice.sendCopy) {
        const user = await Registration.findById(recurringInvoice.createdBy);
        userEmail = user?.email;
      }

      const pdfBuffer = await generateInvoicePDF(newInvoice);
      
      const emailSubject = recurringInvoice.emailSubject.replace(
        /#number/g, 
        newInvoice.invoiceMeta.invoiceNo
      );

      await sendInvoiceEmail({
        to: recurringInvoice.emailTo,
        subject: emailSubject,
        message: recurringInvoice.emailText,
        pdfBuffer: pdfBuffer,
        pdfFilename: `Invoice-${newInvoice.invoiceMeta.invoiceNo}.pdf`,
        sendCopy: recurringInvoice.sendCopy,
        copyTo: userEmail
      });

      console.log(`✅ Recurring invoice email sent successfully to ${recurringInvoice.emailTo}`);
    } catch (emailError) {
      console.error('❌ Failed to send recurring invoice email:', emailError);
    }

    return res.status(200).json({
      success: true,
      message: "Recurring invoice processed and emailed successfully",
      data: {
        newInvoice,
        recurringInvoice,
        emailSent: true
      }
    });

  } catch (error) {
    console.error("PROCESS RECURRING INVOICE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const processAllDueRecurringInvoices = async (req, res) => {
  try {
    const now = new Date();
    
    const dueInvoices = await RecurringInvoice.find({
      isActive: true,
      nextRunDate: { $lte: now },
      $or: [
        { stopOption: 'never' },
        { stopOption: 'onDate', stopDate: { $gte: now } }
      ]
    }).populate('originalInvoiceId');

    console.log(`📋 Found ${dueInvoices.length} due recurring invoices`);

    let processed = 0;
    let failed = 0;

    for (const recurringInvoice of dueInvoices) {
      try {
        const originalInvoice = recurringInvoice.originalInvoiceId;

        const newInvoiceData = {
          ...originalInvoice.toObject(),
          _id: undefined,
          createdAt: new Date(),
          invoiceMeta: {
            ...originalInvoice.invoiceMeta,
            invoiceDate: new Date().toISOString().split('T')[0],
            invoiceNo: `${originalInvoice.invoiceMeta.invoiceNo}-R${recurringInvoice.totalInvoicesGenerated + 1}`
          }
        };

        const newInvoice = await InvoiceTaxForm.create(newInvoiceData);

        const nextRunDate = calculateNextRunDate(
          recurringInvoice.startDate,
          recurringInvoice.frequency,
          new Date()
        );

        recurringInvoice.lastRunDate = new Date();
        recurringInvoice.lastGeneratedInvoiceId = newInvoice._id;
        recurringInvoice.totalInvoicesGenerated += 1;
        recurringInvoice.nextRunDate = nextRunDate;

        if (recurringInvoice.stopOption === 'onDate' && 
            nextRunDate && nextRunDate > recurringInvoice.stopDate) {
          recurringInvoice.isActive = false;
        }

        await recurringInvoice.save();

        try {
          let userEmail = null;
          if (recurringInvoice.sendCopy) {
            const user = await Registration.findById(recurringInvoice.createdBy);
            userEmail = user?.email;
          }

          const pdfBuffer = await generateInvoicePDF(newInvoice);
          
          const emailSubject = recurringInvoice.emailSubject.replace(
            /#number/g, 
            newInvoice.invoiceMeta.invoiceNo
          );

          await sendInvoiceEmail({
            to: recurringInvoice.emailTo,
            subject: emailSubject,
            message: recurringInvoice.emailText,
            pdfBuffer: pdfBuffer,
            pdfFilename: `Invoice-${newInvoice.invoiceMeta.invoiceNo}.pdf`,
            sendCopy: recurringInvoice.sendCopy,
            copyTo: userEmail
          });

          console.log(`✅ Email sent to ${recurringInvoice.emailTo} for invoice ${newInvoice.invoiceMeta.invoiceNo}`);
          processed++;
        } catch (emailError) {
          console.error('❌ Failed to send email:', emailError);
          failed++;
        }

      } catch (error) {
        console.error(`❌ Error processing recurring invoice ${recurringInvoice._id}:`, error);
        failed++;
      }
    }

    return res.status(200).json({
      success: true,
      message: `Processed ${processed} recurring invoices, ${failed} failed`,
      data: {
        total: dueInvoices.length,
        processed,
        failed
      }
    });

  } catch (error) {
    console.error("PROCESS ALL DUE RECURRING INVOICES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};