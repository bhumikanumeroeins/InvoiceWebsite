import express from "express";
import {createOrUpdateInvoiceCustomization, getCustomizedInvoiceById, getAllCustomizationsForUser,sendCustomInvoiceEmail} from "../../controller/users/buildInvoice.js";
import { upload } from "../../config/multer.js";

import { authenticateUser } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/customize-invoice", authenticateUser, upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "qrCode", maxCount: 1 },
    { name: "authorizedSignature", maxCount: 1 }
  ]),createOrUpdateInvoiceCustomization);

router.get("/customize-invoice/:id", authenticateUser, getCustomizedInvoiceById);
router.get("/customize-invoice", authenticateUser, getAllCustomizationsForUser);

router.post("/send-invoice-email", authenticateUser, sendCustomInvoiceEmail);

export default router;