import cron from 'node-cron';
import Registration from '../models/users/registration.js';
import InvoiceTaxForm from '../models/forms/invoiceTaxForm.js';
import { sendInvoiceEmail } from '../utils/emailService.js';

const isMonday = () => {
  const today = new Date();
  return today.getDay() === 1; 
};

const isFirstOfMonth = () => {
  const today = new Date();
  return today.getDate() === 1;
};

const getDateRange = (frequency) => {
  const endDate = new Date();
  const startDate = new Date();

  if (frequency === 'weekly') {
    startDate.setDate(endDate.getDate() - 7);
  } else if (frequency === 'monthly') {
    startDate.setMonth(endDate.getMonth() - 1);
  }

  return { startDate, endDate };
};

const generateReportData = async (userId, frequency) => {
  const { startDate, endDate } = getDateRange(frequency);

  const invoices = await InvoiceTaxForm.find({
    createdBy: userId,
    createdAt: { $gte: startDate, $lte: endDate }
  });

  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(inv => inv.paymentStatus === 'paid');
  const partialInvoices = invoices.filter(inv => inv.paymentStatus === 'partial');
  const unpaidInvoices = invoices.filter(inv => inv.paymentStatus === 'unpaid');
  
  const totalAmount = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const paidAmount = paidInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const pendingAmount = totalAmount - paidAmount;

  const today = new Date();
  const overdueInvoices = invoices.filter(inv => 
    inv.paymentStatus !== 'paid' && 
    inv.dueDate && 
    new Date(inv.dueDate) < today
  );

  return {
    period: frequency === 'weekly' ? 'Weekly' : 'Monthly',
    startDate: startDate.toLocaleDateString(),
    endDate: endDate.toLocaleDateString(),
    totalInvoices,
    paidCount: paidInvoices.length,
    partialCount: partialInvoices.length,
    unpaidCount: unpaidInvoices.length,
    overdueCount: overdueInvoices.length,
    totalAmount: totalAmount.toFixed(2),
    paidAmount: paidAmount.toFixed(2),
    pendingAmount: pendingAmount.toFixed(2)
  };
};

const generateEmailHTML = (userName, reportData) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; }
        .stat-card { background: white; border-radius: 8px; padding: 20px; margin: 15px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .stat-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .stat-label { font-weight: 600; color: #6b7280; }
        .stat-value { font-weight: bold; color: #111827; }
        .highlight { color: #667eea; font-size: 24px; }
        .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📊 Your ${reportData.period} Invoice Report</h1>
          <p>${reportData.startDate} - ${reportData.endDate}</p>
        </div>
        
        <div class="content">
          <p>Hi ${userName},</p>
          <p>Here's your ${reportData.period.toLowerCase()} invoice summary:</p>
          
          <div class="stat-card">
            <h3>📈 Overview</h3>
            <div class="stat-row">
              <span class="stat-label">Total Invoices</span>
              <span class="stat-value highlight">${reportData.totalInvoices}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Paid Invoices</span>
              <span class="stat-value" style="color: #10b981;">${reportData.paidCount}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Partially Paid</span>
              <span class="stat-value" style="color: #f59e0b;">${reportData.partialCount}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Unpaid Invoices</span>
              <span class="stat-value" style="color: #ef4444;">${reportData.unpaidCount}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Overdue Invoices</span>
              <span class="stat-value" style="color: #dc2626;">${reportData.overdueCount}</span>
            </div>
          </div>
          
          <div class="stat-card">
            <h3>💰 Financial Summary</h3>
            <div class="stat-row">
              <span class="stat-label">Total Amount</span>
              <span class="stat-value">₹${reportData.totalAmount}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Amount Received</span>
              <span class="stat-value" style="color: #10b981;">₹${reportData.paidAmount}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Pending Amount</span>
              <span class="stat-value" style="color: #ef4444;">₹${reportData.pendingAmount}</span>
            </div>
          </div>
          
          <center>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" class="button">
              View Dashboard
            </a>
          </center>
          
          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            💡 Tip: Keep track of overdue invoices and send reminders to improve cash flow.
          </p>
        </div>
        
        <div class="footer">
          <p>This is an automated ${reportData.period.toLowerCase()} report from InvoicePro</p>
          <p style="font-size: 12px;">To change your email preferences, visit Settings in your dashboard</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const processEmailReports = async () => {
  try {
    console.log('📧 Starting email report processing...');

    const shouldSendWeekly = isMonday();
    const shouldSendMonthly = isFirstOfMonth();

    if (!shouldSendWeekly && !shouldSendMonthly) {
      console.log('⏭️  No reports scheduled for today');
      return { success: true, message: 'No reports scheduled for today' };
    }

    const frequencyFilter = [];
    if (shouldSendWeekly) frequencyFilter.push('weekly');
    if (shouldSendMonthly) frequencyFilter.push('monthly');

    const users = await Registration.find({
      emailReportFrequency: { $in: frequencyFilter }
    }).select('_id email name emailReportFrequency lastReportSentAt');

    console.log(`📊 Found ${users.length} users to send reports to`);

    let successCount = 0;
    let failCount = 0;

    for (const user of users) {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (user.lastReportSentAt) {
          const lastSent = new Date(user.lastReportSentAt);
          lastSent.setHours(0, 0, 0, 0);
          
          if (lastSent.getTime() === today.getTime()) {
            console.log(`⏭️  Report already sent to ${user.email} today`);
            continue;
          }
        }

        const reportData = await generateReportData(user._id, user.emailReportFrequency);

        const emailHTML = generateEmailHTML(user.name || 'User', reportData);

        await sendInvoiceEmail({
          to: user.email,
          subject: `Your ${reportData.period} Invoice Report - InvoicePro`,
          message: emailHTML,
          pdfBuffer: null
        });

        await Registration.findByIdAndUpdate(user._id, {
          lastReportSentAt: new Date()
        });

        console.log(`✅ Report sent to ${user.email}`);
        successCount++;

      } catch (error) {
        console.error(`❌ Failed to send report to ${user.email}:`, error.message);
        failCount++;
      }
    }

    const result = {
      success: true,
      message: `Processed ${users.length} reports, ${successCount} sent, ${failCount} failed`,
      data: {
        total: users.length,
        sent: successCount,
        failed: failCount
      }
    };

    console.log('✅ Email report processing completed:', result.message);
    return result;

  } catch (error) {
    console.error('❌ Email report cron error:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

export const initEmailReportCron = () => {
  cron.schedule('0 9 * * *', async () => {
    console.log('⏰ Email report cron job triggered');
    await processEmailReports();
  });

  console.log('✅ Email report cron job initialized (runs daily at 9 AM)');
};
