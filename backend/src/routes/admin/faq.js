import express from "express";
import {
  createFAQ,
  getAllFAQsAdmin,  
    updateFAQ,
    deleteFAQ,
    getContactUsMessages,
    deleteContactUsMessage,
    getContactUsMessageById
} from "../../controller/admin/faq.js";
import { authenticateAdmin } from "../../middleware/adminAuth.middleware.js";

console.log("✅ Admin FAQ routes loaded");  

const router = express.Router();
router.post("/create", createFAQ);
router.get("/all", getAllFAQsAdmin);
router.put("/update/:id", updateFAQ);
router.delete("/delete/:id", deleteFAQ); 
router.get("/contact-us-messages", getContactUsMessages);   
router.delete("/contact-us-messages/:id", deleteContactUsMessage);
router.get("/contact-us-messages/:id", getContactUsMessageById);   


export default router;