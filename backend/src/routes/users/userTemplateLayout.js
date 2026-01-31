import express from "express";
import {
  getTemplateDefaultLayout,
  saveOrUpdateUserLayout,
  getUserLayoutById,
  getAllUserSavedLayouts,
  getAllTemplatesForUser
} from "../../controller/users/userTemplateLayout.js";

import { authenticateUser } from "../../middleware/auth.middleware.js";

const router = express.Router();

// user selects template -> fetch default layout
router.get("/default/:templateName", authenticateUser, getTemplateDefaultLayout);

// user saves customized layout
router.post("/save-layout", authenticateUser, saveOrUpdateUserLayout);

// get saved layout else default
router.get("/my-layout/:id", authenticateUser, getUserLayoutById);

// get all saved layouts of logged in user
router.get("/my-layouts", authenticateUser, getAllUserSavedLayouts);

//fetch all templates for user
router.get("/templates", authenticateUser, getAllTemplatesForUser);

export default router;
