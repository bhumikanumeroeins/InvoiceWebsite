import app from "./app.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import path from "path";
import { processAllDueRecurringInvoices } from "./controller/recurring/recurringInvoice.js";
import { initReminderCron } from "./services/reminderCron.js";
import { initEmailReportCron } from "./services/emailReportCron.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();

// Simple recurring invoice scheduler - runs every hour
const startRecurringScheduler = () => {
  console.log('⏰ Starting recurring invoice scheduler...');
  
  // Run every hour (3600000 ms)
  setInterval(async () => {
    try {
      console.log('🔍 Checking for due recurring invoices...');
      // Create a mock request/response for the function
      const mockReq = {};
      const mockRes = {
        status: () => mockRes,
        json: (data) => {
          if (data.success) {
            console.log(`✅ Scheduler: ${data.message}`);
          } else {
            console.error(`❌ Scheduler error: ${data.message}`);
          }
          return mockRes;
        }
      };
      
      await processAllDueRecurringInvoices(mockReq, mockRes);
    } catch (error) {
      console.error('❌ Scheduler error:', error);
    }
  }, 3600000); // 1 hour
};

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  
  // Start the recurring invoice scheduler
  startRecurringScheduler();
  
  // Start the payment reminder cron job
  initReminderCron();
  
  // Start the email report cron job
  initEmailReportCron();
});
