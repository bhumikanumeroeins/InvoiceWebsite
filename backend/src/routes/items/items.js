import express from "express";
import { authenticateUser } from "../../middleware/auth.middleware.js";
import {
    createItem,
    getItems,
    deleteItem

}from "../../controller/items/items.js";
const router = express.Router();
router.post("/create", authenticateUser, createItem);
router.get("/list", authenticateUser, getItems);
router.delete("/delete/:id", authenticateUser, deleteItem);

export default router;