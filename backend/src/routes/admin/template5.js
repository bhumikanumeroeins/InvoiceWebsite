import express from "express";
import { createOrUpdateTemplate5, getTemplate5ByName } from "../../controller/admin/template5.js";

const router = express.Router();    

router.post("/create", createOrUpdateTemplate5);
router.get("/:name", getTemplate5ByName);

export default router;