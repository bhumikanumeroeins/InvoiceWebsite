import express from "express";
import { upload } from "../../config/multer.js";
import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  updatePaymentStatus
} from "../../controller/forms/invoiceTaxForm.js";

const router = express.Router();

/* 🔹 CREATE INVOICE WITH IMAGES */
router.post(
  "/create",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
    { name: "qrCode", maxCount: 1 }
  ]),
  createInvoice
);

/* ---------------- INVOICE CRUD ---------------- */
router.get("/list", getAllInvoices);
router.get("/list/:id", getInvoiceById);
router.put("/update/:invoiceId",upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
    { name: "qrCode", maxCount: 1 }
  ]),
  updateInvoice
);

router.delete("/delete/:id", deleteInvoice);
router.patch(
  "/invoices/:invoiceId/payment-status",
  updatePaymentStatus
);

export default router;
