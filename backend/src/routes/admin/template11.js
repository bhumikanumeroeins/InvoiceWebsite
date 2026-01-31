import express from "express";
import { createOrUpdateTemplate11, getTemplate11ByName } from "../../controller/admin/template11.js";

const router = express.Router();    

router.post("/create", createOrUpdateTemplate11);
router.get("/:name", getTemplate11ByName);

export default router;