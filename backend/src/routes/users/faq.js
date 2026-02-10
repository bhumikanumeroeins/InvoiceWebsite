import express from "express";
import {getAllFAQsUser} from "../../controller/users/faq.js";
import { authenticateUser } from "../../middleware/auth.middleware.js";

const router = express.Router();
router.get("/all", getAllFAQsUser);

export default router;  

  