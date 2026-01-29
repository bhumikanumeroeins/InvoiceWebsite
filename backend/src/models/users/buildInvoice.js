import mongoose from "mongoose";
const buildInvoiceSchema = new mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId, ref: "Registration"},
    i
});