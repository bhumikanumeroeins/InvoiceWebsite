import express from "express";
import { generateInvoice, refineInvoice, chatInvoice, generateInvoicePublic } from "../../controller/ai/aiInvoice.js";
import { authenticateUser } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Public (no auth) — rate limited by IP
router.post("/chat", chatInvoice);
router.post("/generate-public", generateInvoicePublic);

// Authenticated
router.post("/generate", authenticateUser, generateInvoice);
router.post("/refine", authenticateUser, refineInvoice);

export default router;
