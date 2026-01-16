import express from "express";
import { upload } from "../../config/multer.js";
import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  copyInvoice,
  updatePaymentStatus,
  getTrashInvoices,
  restoreInvoice,
  permanentDeleteInvoice,
  sendInvoiceEmailController
} from "../../controller/forms/invoiceTaxForm.js";

import { authenticateUser } from "../../middleware/auth.middleware.js";

const router = express.Router();

/* 🔹 CREATE INVOICE WITH IMAGES */
router.post(
  "/create",authenticateUser,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
    { name: "qrCode", maxCount: 1 }
  ]),
  createInvoice
);

/* ---------------- INVOICE CRUD ---------------- */
router.get("/list", authenticateUser, getAllInvoices);
router.get("/list/:id", authenticateUser, getInvoiceById);
router.put("/update/:invoiceId",authenticateUser, upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
    { name: "qrCode", maxCount: 1 }
  ]),
  updateInvoice
);

router.delete("/delete/:id", authenticateUser, deleteInvoice);
router.patch(
  "/invoices/:invoiceId/payment-status",
  updatePaymentStatus
);
router.post("/copy/:id", authenticateUser, copyInvoice);
router.post("/send-email/:id", authenticateUser, sendInvoiceEmailController);

/* ---------------- TRASH ROUTES ---------------- */
router.get("/trash", authenticateUser, getTrashInvoices);
router.patch("/restore/:id", authenticateUser, restoreInvoice);
router.delete("/permanent/:id", authenticateUser, permanentDeleteInvoice);

export default router;
