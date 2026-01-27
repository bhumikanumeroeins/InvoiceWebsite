import express from "express";
import { processPendingReminders } from "../../controller/reminders/paymentReminder.js";

const router = express.Router();

// Admin route to process pending reminders
router.post("/admin/process-pending", processPendingReminders);

export default router;