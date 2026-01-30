import template2 from "../../models/admin/template2.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createError, createResult } from "../../utils/utils.js";
import Registration from "../../models/users/registration.js";

// post create or update template2
export const createOrUpdateTemplate2 = async (req, res) => {
    try {
        const { userId } = req.user; // coming from token middleware
        const { name, layout } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Template name is required" });
        }

        const newTemplateData2  = new template2({
            name,
            layout: layout ? JSON.parse(layout) : {},
        });

        await newTemplateData2 .save();

        return res.status(201).json({
            message: "Template2 created or updated",
            template2: newTemplateData2 ,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};
