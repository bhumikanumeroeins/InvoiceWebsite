import express from "express";
import cors from "cors";
import morgan from "morgan";

import invoiceRoutesUser from "./routes/users/registration.js";
import invoiceRoutes from "./routes/forms/invoiceTaxForm.js";
import customers from "./routes/customers/customers.js";
import tax from "./routes/taxes/tax.js";
import items from "./routes/items/items.js";
import reports from "./routes/reports/reports.js";
import payments from "./routes/payments/payments.js";
import contact from "./routes/contact/contact.js";
import currency from "./routes/currency/currency.js";
import recurring from "./routes/recurring/recurringInvoice.js";
import reminders from "./routes/reminders/paymentReminder.js";
import admin from "./routes/admin/admin_register.js";

import buildInvoice from "./routes/users/buildInvoice.js";


import adminFAQRoutes from "./routes/admin/faq.js";
import userFAQRoutes from "./routes/users/faq.js";


import path from "path";


const app = express();

app.use(cors());
// Increase body size limit for PDF attachments
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ✅ Morgan logger
app.use(morgan("dev"));

app.use("/api/invoices", invoiceRoutesUser);
app.use("/api/invoiceForms", invoiceRoutes);
app.use("/api/customers", customers);
app.use("/api/tax", tax);
app.use("/api/item", items);
app.use("/api/reports", reports);
app.use("/api/payments", payments);
app.use("/api/contact", contact);
app.use("/api/currencies", currency);
app.use("/api/recurring", recurring);
app.use("/api/reminders", reminders);
app.use("/api/admin", admin);
app.use("/api/build-invoice", buildInvoice);
app.use("/api/admin/faq", adminFAQRoutes);
app.use("/api/user/faq", userFAQRoutes);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

export default app;
