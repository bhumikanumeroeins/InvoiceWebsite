import express from "express";
import { createOrUpdateTemplate8, getTemplate8ByName } from "../../controller/admin/template8.js";

const router = express.Router();    

router.post("/create", createOrUpdateTemplate8);
router.get("/:name", getTemplate8ByName);

export default router;