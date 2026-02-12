import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  contactUs,
  getEmailReportFrequency,
  updateEmailReportFrequency,
  upgradeSubscription
} from "../../controller/users/registrationController.js";
import { authenticateUser } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authenticateUser, getProfile);
router.put("/updateProfile", authenticateUser, updateProfile);
router.put("/changePassword", authenticateUser, changePassword);  
router.post("/contact-us", contactUs);
router.get("/email-report-frequency", authenticateUser, getEmailReportFrequency);
router.put("/email-report-frequency", authenticateUser, updateEmailReportFrequency);


// upgrade-subscription

router.post('/upgrade-subscription',authenticateUser, upgradeSubscription)
export default router;
