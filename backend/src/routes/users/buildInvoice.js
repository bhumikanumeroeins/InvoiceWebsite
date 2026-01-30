import express from "express";
import {createOrUpdateInvoiceCustomization} from "../../controller/users/buildInvoice.js";
import { upload } from "../../config/multer.js";

import { authenticateUser } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/customize-invoice", authenticateUser, upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "qrCode", maxCount: 1 },
    { name: "authorizedSignature", maxCount: 1 }
  ]),createOrUpdateInvoiceCustomization);

export default router;