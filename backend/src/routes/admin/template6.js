import express from "express";
import { createOrUpdateTemplate6, getTemplate6ByName } from "../../controller/admin/template6.js";

const router = express.Router();    

router.post("/create", createOrUpdateTemplate6);
router.get("/:name", getTemplate6ByName);

export default router;