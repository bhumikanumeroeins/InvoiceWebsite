import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  contactUs
} from "../../controller/users/registrationController.js";
import { authenticateUser } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authenticateUser, getProfile);
router.put("/updateProfile", authenticateUser, updateProfile);
router.put("/changePassword", authenticateUser, changePassword);  
router.post("/contact-us", contactUs);
export default router;
