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
import invoiceTemplate from "./routes/admin/invoiceTemplate.js";
import buildInvoice from "./routes/users/buildInvoice.js";
import invoiceTemplate2 from "./routes/admin/template2.js"; 
import invoiceTemplate3 from "./routes/admin/template3.js";
import invoiceTemplate4 from "./routes/admin/template4.js"; 
import invoiceTemplate5 from "./routes/admin/template5.js";
import invoiceTemplate6 from "./routes/admin/template6.js";
import invoiceTemplate7 from "./routes/admin/template7.js"; 
import invoiceTemplate8 from "./routes/admin/template8.js";
import invoiceTemplate9 from "./routes/admin/template9.js";
import invoiceTemplate10 from "./routes/admin/template10.js";
import invoieTemplate11 from "./routes/admin/template11.js";
import invoiceTemplate12 from "./routes/admin/template12.js";

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
app.use("/api/invoice-template", invoiceTemplate);
app.use("/api/build-invoice", buildInvoice);
app.use("/api/invoice-template2", invoiceTemplate2);
app.use("/api/invoice-template3", invoiceTemplate3);
app.use("/api/invoice-template4", invoiceTemplate4);
app.use("/api/invoice-template5", invoiceTemplate5);
app.use("/api/invoice-template6", invoiceTemplate6);
app.use("/api/invoice-template7", invoiceTemplate7);
app.use("/api/invoice-template8", invoiceTemplate8);
app.use("/api/invoice-template9", invoiceTemplate9);
app.use("/api/invoice-template10", invoiceTemplate10);
app.use("/api/invoice-template11", invoieTemplate11);
app.use("/api/invoice-template12", invoiceTemplate12);


app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

export default app;
