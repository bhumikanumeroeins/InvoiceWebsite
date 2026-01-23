import express from "express";
import {
  getAllCurrencies,
  getCurrencyByCode
} from "../../controller/currency/currency.js";

const router = express.Router();

/* ---------------- PUBLIC ROUTES ---------------- */
// Get all active currencies (for dropdown)
router.get("/", getAllCurrencies);

// Get currency by code
router.get("/:code", getCurrencyByCode);

export default router;