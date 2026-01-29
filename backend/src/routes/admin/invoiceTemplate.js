import express from "express";

import {createInvoiceTemplate, getInvoiceTemplate} from "../../controller/admin/invoiceTemplate.js";
// import {authenticateAdmin} from "../../middleware/adminAuth.middleware.js";
const router = express.Router();

router.post("/create-invoice-template", createInvoiceTemplate);
router.get("/:name", getInvoiceTemplate);


export default router;
