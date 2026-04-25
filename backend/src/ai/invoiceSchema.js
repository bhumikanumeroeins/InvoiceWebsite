import { SchemaType } from "@google/generative-ai";

export const SUPPORTED_CURRENCIES = [
  "USD",
  "INR",
  "EUR",
  "GBP",
  "AUD",
  "CAD",
  "SGD",
  "AED",
  "JPY",
  "CNY",
];

export const ITEM_LIMIT = 4;
export const ITEM_INDICES = [1, 2, 3, 4];

export const INVOICE_FIELD_KEYS = [
  "currency",
  "invoiceTitle",
  "invoiceNumber",
  "invoiceDate",
  "dueDate",
  "poNumber",
  "businessName",
  "businessAddress1",
  "businessAddress2",
  "clientName",
  "clientAddress1",
  "clientAddress2",
  "shipToName",
  "shipToAddress1",
  "shipToAddress2",
  "item1Desc",
  "item1Qty",
  "item1Rate",
  "item1Amount",
  "item2Desc",
  "item2Qty",
  "item2Rate",
  "item2Amount",
  "item3Desc",
  "item3Qty",
  "item3Rate",
  "item3Amount",
  "item4Desc",
  "item4Qty",
  "item4Rate",
  "item4Amount",
  "taxLabel",
  "subtotal",
  "tax",
  "total",
  "terms",
  "bankName",
  "accountNumber",
  "ifscCode",
  "footerEmail",
  "footerPhone",
  "footerWebsite",
  "templateName",
];

export const PLACEHOLDER_TRACKED_FIELDS = [
  "currency",
  "invoiceNumber",
  "invoiceDate",
  "dueDate",
  "businessAddress1",
  "businessAddress2",
  "clientAddress1",
  "clientAddress2",
  "taxLabel",
  "terms",
  "templateName",
];

export const CANONICAL_REQUIRED_CHAT_FIELDS = [
  "business.name",
  "client.name",
  "items.0.description",
  "items.0.rate",
];

const stringField = (description) => ({
  type: SchemaType.STRING,
  description,
  nullable: true,
});

const contactBlockField = (description) => ({
  type: SchemaType.OBJECT,
  description,
  nullable: true,
  properties: {
    name: stringField("Name"),
    address1: stringField("Primary address line"),
    address2: stringField("Secondary address line"),
  },
});

const invoiceItemField = () => ({
  type: SchemaType.OBJECT,
  nullable: true,
  properties: {
    description: stringField("Item description"),
    quantity: stringField("Quantity as a numeric string"),
    rate: stringField("Rate as a numeric string"),
  },
});

const paymentField = {
  type: SchemaType.OBJECT,
  nullable: true,
  properties: {
    bankName: stringField("Bank name"),
    accountNumber: stringField("Account number"),
    ifscCode: stringField("IFSC or routing code"),
  },
};

const footerField = {
  type: SchemaType.OBJECT,
  nullable: true,
  properties: {
    email: stringField("Footer email"),
    phone: stringField("Footer phone"),
    website: stringField("Footer website"),
  },
};

const canonicalInvoiceProperties = {
  currency: stringField(
    `ISO 4217 currency code. Supported values: ${SUPPORTED_CURRENCIES.join(", ")}`,
  ),
  invoiceTitle: stringField("Invoice title"),
  invoiceNumber: stringField("Invoice number"),
  invoiceDate: stringField('Invoice date like "Jan 29, 2026"'),
  dueDate: stringField('Due date like "Feb 28, 2026"'),
  poNumber: stringField("PO number"),
  taxRate: stringField("Tax percentage as a numeric string like 18 or 0"),
  terms: stringField("Payment terms"),
  templateName: stringField("Short invoice or template name"),
  business: contactBlockField("Invoice issuer"),
  client: contactBlockField("Invoice recipient"),
  shipTo: contactBlockField("Ship-to recipient"),
  items: {
    type: SchemaType.ARRAY,
    nullable: true,
    minItems: 0,
    maxItems: ITEM_LIMIT,
    items: invoiceItemField(),
  },
  payment: paymentField,
  footer: footerField,
};

export const CANONICAL_INVOICE_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: canonicalInvoiceProperties,
};

export const EXTRACT_RESPONSE_SCHEMA = CANONICAL_INVOICE_SCHEMA;
export const GENERATE_RESPONSE_SCHEMA = CANONICAL_INVOICE_SCHEMA;
export const REFINE_RESPONSE_SCHEMA = CANONICAL_INVOICE_SCHEMA;
