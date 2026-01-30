import express from "express";
import { createOrUpdateTemplate4, getTemplate4ByName } from "../../controller/admin/template4.js";

const router = express.Router();    

router.post("/create", createOrUpdateTemplate4);
router.get("/:name", getTemplate4ByName);

export default router;