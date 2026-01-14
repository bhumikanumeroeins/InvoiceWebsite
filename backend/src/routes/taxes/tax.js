import express from "express";
import { authenticateUser } from "../../middleware/auth.middleware.js";
import {
  createTax,
  deleteTax,
  getAllTaxes
} from "../../controller/taxes/tax.js";

const router = express.Router();

router.post("/create", authenticateUser, createTax);
router.get("/list", authenticateUser, getAllTaxes);
router.delete("/delete/:taxId", authenticateUser, deleteTax);

export default router;
