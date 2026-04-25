import express from "express";
import {
  refineInvoice,
  chatInvoice,
  generateInvoicePublic,
} from "../../controller/ai/aiInvoice.js";
import {
  listSessions,
  getSession,
  deleteSession,
  syncGuestSession,
} from "../../controller/ai/userSessions.js";
import { authenticateUser } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Public (no auth) — rate limited by IP
router.post("/chat", chatInvoice);
router.post("/generate-public", generateInvoicePublic);

// Authenticated
router.post("/refine", authenticateUser, refineInvoice);

// User chat sessions
router.get("/sessions", authenticateUser, listSessions);
router.get("/sessions/:sessionId", authenticateUser, getSession);
router.delete("/sessions/:sessionId", authenticateUser, deleteSession);
router.post("/sessions/sync", authenticateUser, syncGuestSession);

export default router;
