import express from "express";
import { 
  processPendingReminders,
  getInvoiceReminders,
  createInvoiceReminders,
  deleteReminder,
  updateReminderStatus
} from "../../controller/reminders/paymentReminder.js";
import { authenticateUser } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Admin route to process pending reminders
router.post("/admin/process-pending", processPendingReminders);

// User routes
router.get("/invoice/:invoiceId", authenticateUser, getInvoiceReminders);
router.post("/create/:invoiceId", authenticateUser, createInvoiceReminders);
router.delete("/:reminderId", authenticateUser, deleteReminder);
router.patch("/:reminderId/status", authenticateUser, updateReminderStatus);

export default router;