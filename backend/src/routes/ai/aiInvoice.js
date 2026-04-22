import express from "express";
import { generateInvoice, refineInvoice } from "../../controller/ai/aiInvoice.js";
import { authenticateUser } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/generate", authenticateUser, generateInvoice);
router.post("/refine", authenticateUser, refineInvoice);

export default router;
