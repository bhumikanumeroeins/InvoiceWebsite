import express from "express";
import {
  createOrUpdateInvoiceCustomization,
  getCustomizedInvoiceById,
  getAllCustomizationsForUser,
  sendCustomInvoiceEmail,
  deleteCustomInvoice,
  restoreCustomInvoice,
  permanentDeleteCustomInvoice,
  getCustomTrashInvoices,
} from "../../controller/users/buildInvoice.js";
import { upload } from "../../config/multer.js";
import { authenticateUser } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/customize-invoice",
  authenticateUser,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "qrCode", maxCount: 1 },
    { name: "authorizedSignature", maxCount: 1 },
  ]),
  createOrUpdateInvoiceCustomization,
);

router.get("/customize-invoice", authenticateUser, getAllCustomizationsForUser);
router.get(
  "/customize-invoice/trash",
  authenticateUser,
  getCustomTrashInvoices,
);
router.get(
  "/customize-invoice/:id",
  authenticateUser,
  getCustomizedInvoiceById,
);
router.delete("/customize-invoice/:id", authenticateUser, deleteCustomInvoice);
router.patch(
  "/customize-invoice/:id/restore",
  authenticateUser,
  restoreCustomInvoice,
);
router.delete(
  "/customize-invoice/:id/permanent",
  authenticateUser,
  permanentDeleteCustomInvoice,
);
router.post("/send-email/:id", authenticateUser, sendCustomInvoiceEmail);

export default router;
