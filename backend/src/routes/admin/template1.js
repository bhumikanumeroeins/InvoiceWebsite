import express from "express";
import { createOrUpdateTemplate1, getTemplate1ByName } from "../../controller/admin/template1.js";

const router = express.Router();    

router.post("/create", createOrUpdateTemplate1);
router.get("/:name", getTemplate1ByName);

export default router;