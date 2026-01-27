import express from "express";
import {
  registerUser,
  loginUser,
  updateProfile,
  changePassword
} from "../../controller/users/registrationController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/updateProfile/:userId", updateProfile);
router.put("/changePassword/:userId", changePassword);  

export default router;
