import express from "express";
import { createOrUpdateTemplate9, getTemplate9ByName } from "../../controller/admin/template9.js";

const router = express.Router();    

router.post("/create", createOrUpdateTemplate9);
router.get("/:name", getTemplate9ByName);

export default router;