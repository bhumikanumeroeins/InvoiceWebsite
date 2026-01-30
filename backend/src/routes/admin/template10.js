import express from "express";
import { createOrUpdateTemplate10, getTemplate10ByName } from "../../controller/admin/template10.js";

const router = express.Router();    

router.post("/create", createOrUpdateTemplate10);
router.get("/:name", getTemplate10ByName);

export default router;