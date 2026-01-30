import express from "express";
import { createOrUpdateTemplate7, getTemplate7ByName } from "../../controller/admin/template7.js";

const router = express.Router();    

router.post("/create", createOrUpdateTemplate7);
router.get("/:name", getTemplate7ByName);

export default router;