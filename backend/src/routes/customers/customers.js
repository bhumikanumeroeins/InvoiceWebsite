import express from "express";
import { upload } from "../../config/multer.js";
import {getCustomersList,getInvoicesByClientName
  
} from "../../controller/customers/customers.js";

import { authenticateUser } from "../../middleware/auth.middleware.js";

const router = express.Router();



router.get("/list",authenticateUser ,getCustomersList);
router.get("/invoices/:name",authenticateUser ,getInvoicesByClientName);

export default router;
