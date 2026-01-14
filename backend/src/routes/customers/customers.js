import express from "express";
import { upload } from "../../config/multer.js";
import {getCustomersList,getInvoicesByClientEmail
  
} from "../../controller/customers/customers.js";

import { authenticateUser } from "../../middleware/auth.middleware.js";

const router = express.Router();



router.get("/list",authenticateUser ,getCustomersList);
router.get("/invoices/:email",authenticateUser ,getInvoicesByClientEmail);

export default router;
