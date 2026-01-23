import express from "express";
import {
  createRecurringInvoice,
  getRecurringInvoice,
  getAllRecurringInvoices,
  updateRecurringInvoice,
  deleteRecurringInvoice,
  getInvoicesDueForGeneration,
  processRecurringInvoice,
  processAllDueRecurringInvoices
} from "../../controller/recurring/recurringInvoice.js";
import { authenticateUser } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Create or update recurring invoice schedule for a specific invoice
router.post("/:invoiceId", authenticateUser, createRecurringInvoice);

// Get recurring invoice schedule for a specific invoice
router.get("/invoice/:invoiceId", authenticateUser, getRecurringInvoice);

// Get all recurring invoices for the authenticated user
router.get("/", authenticateUser, getAllRecurringInvoices);

// Update recurring invoice schedule by ID
router.put("/:id", authenticateUser, updateRecurringInvoice);

// Delete/deactivate recurring invoice schedule by ID
router.delete("/:id", authenticateUser, deleteRecurringInvoice);

// Get invoices due for generation (for cron job/admin use)
router.get("/admin/due", authenticateUser, getInvoicesDueForGeneration);

// Process a specific recurring invoice (for cron job/admin use)
router.post("/admin/process/:recurringId", authenticateUser, processRecurringInvoice);

// Process all due recurring invoices (for manual trigger/testing)
router.post("/admin/process-all", authenticateUser, processAllDueRecurringInvoices);

export default router;