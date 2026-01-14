import express from "express";
import cors from "cors";
import morgan from "morgan";

import invoiceRoutesUser from "./routes/users/registration.js";
import invoiceRoutes from "./routes/forms/invoiceTaxForm.js";
import customers from "./routes/customers/customers.js";
import tax from "./routes/taxes/tax.js";
import items from "./routes/items/items.js";

import path from "path";


const app = express();

app.use(cors());
app.use(express.json());

// ✅ Morgan logger
app.use(morgan("dev"));

app.use("/api/invoices", invoiceRoutesUser);
app.use("/api/invoiceForms", invoiceRoutes);
app.use("/api/customers", customers);
app.use("/api/tax", tax);
app.use("/api/item", items);


app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

export default app;
