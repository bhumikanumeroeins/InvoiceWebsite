import express from "express";
import {
  registerUser,
  loginUser,
  updateProfile,
  changePassword
} from "../../controller/users/registrationController.js";
import { authenticateUser } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/updateProfile", authenticateUser, updateProfile);
router.put("/changePassword", authenticateUser, changePassword);  

export default router;
