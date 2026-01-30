import express from "express";
import { createOrUpdateTemplate12, getTemplate12ByName } from "../../controller/admin/template12.js";

const router = express.Router();    

router.post("/create", createOrUpdateTemplate12);
router.get("/:name", getTemplate12ByName);

export default router;