import express from "express";
import { createOrUpdateTemplate2, getTemplate2ByName } from "../../controller/admin/template2.js";

const router = express.Router();    

router.post("/create", createOrUpdateTemplate2);
router.get("/:name", getTemplate2ByName);

export default router;