import express from "express";
import { createOrUpdateTemplate3, getTemplate3ByName } from "../../controller/admin/template3.js";

const router = express.Router();    

router.post("/create", createOrUpdateTemplate3);
router.get("/:name", getTemplate3ByName);

export default router;