/**
 * Converts AI invoice data into the nested format expected by template components.
 *
 * Handles two input shapes:
 *
 * 1. FLAT  — produced by normalizeInvoiceData() during a live chat session
 *    e.g. { businessName, clientName, item1Desc, item1Qty, ... }
 *
 * 2. CANONICAL (nested) — stored in the DB as knownContent
 *    e.g. { business: { name, address1 }, client: { name }, items: [...], ... }
 */

const isCanonical = (data = {}) =>
  typeof data.business === "object" ||
  typeof data.client === "object" ||
  Array.isArray(data.items);

const fromFlat = (d = {}) => {
  const items = [];
  for (let i = 1; i <= 4; i++) {
    const desc = d[`item${i}Desc`];
    if (desc) {
      items.push({
        description: desc,
        quantity: parseFloat(d[`item${i}Qty`]) || 1,
        rate: parseFloat(d[`item${i}Rate`]) || 0,
        amount: parseFloat(d[`item${i}Amount`]) || 0,
      });
    }
  }

  return {
    business: {
      name: d.businessName || "",
      address: d.businessAddress1 || "",
      city: d.businessAddress2 || "",
    },
    client: {
      name: d.clientName || "",
      address: d.clientAddress1 || "",
      city: d.clientAddress2 || "",
    },
    shipTo: {
      shippingName: d.shipToName || "",
      shippingAddress: d.shipToAddress1 || "",
      shippingCity: d.shipToAddress2 || "",
    },
    invoiceMeta: {
      invoiceNo: d.invoiceNumber || "",
      invoiceDate: d.invoiceDate || "",
      dueDate: d.dueDate || "",
      poNumber: d.poNumber || "",
    },
    items,
    totals: {
      subtotal: parseFloat(d.subtotal) || 0,
      taxTotal: parseFloat(d.tax) || 0,
      grandTotal: parseFloat(d.total) || 0,
    },
    payment: {
      bankName: d.bankName || "",
      accountNo: d.accountNumber || "",
      ifscCode: d.ifscCode || "",
    },
    terms: d.terms ? [d.terms] : [],
    currency: d.currency || "USD",
    footer: {
      email: d.footerEmail || "",
      phone: d.footerPhone || "",
      website: d.footerWebsite || "",
    },
  };
};

const fromCanonical = (d = {}) => {
  // items array: [{ description, quantity, rate, amount? }]
  const items = Array.isArray(d.items)
    ? d.items
        .filter((it) => it?.description)
        .map((it) => ({
          description: it.description || "",
          quantity: parseFloat(it.quantity) || 1,
          rate: parseFloat(it.rate) || 0,
          amount:
            parseFloat(it.amount) ||
            (parseFloat(it.quantity) || 1) * (parseFloat(it.rate) || 0),
        }))
    : [];

  // Compute totals from items when not explicitly stored
  const subtotal = items.reduce((sum, it) => sum + it.amount, 0);
  const taxRate = parseFloat(d.taxRate) || 0;
  const taxTotal = parseFloat(d.tax) || (subtotal * taxRate) / 100;
  const grandTotal = parseFloat(d.total) || subtotal + taxTotal;

  return {
    business: {
      name: d.business?.name || "",
      address: d.business?.address1 || "",
      city: d.business?.address2 || "",
    },
    client: {
      name: d.client?.name || "",
      address: d.client?.address1 || "",
      city: d.client?.address2 || "",
    },
    shipTo: {
      shippingName: d.shipTo?.name || "",
      shippingAddress: d.shipTo?.address1 || "",
      shippingCity: d.shipTo?.address2 || "",
    },
    invoiceMeta: {
      invoiceNo: d.invoiceNumber || "",
      invoiceDate: d.invoiceDate || "",
      dueDate: d.dueDate || "",
      poNumber: d.poNumber || "",
    },
    items,
    totals: {
      subtotal,
      taxTotal,
      grandTotal,
    },
    payment: {
      bankName: d.payment?.bankName || "",
      accountNo: d.payment?.accountNumber || "",
      ifscCode: d.payment?.ifscCode || "",
    },
    terms: d.terms ? [d.terms] : [],
    currency: d.currency || "USD",
    footer: {
      email: d.footer?.email || "",
      phone: d.footer?.phone || "",
      website: d.footer?.website || "",
    },
  };
};

export const aiDataToTemplateFormat = (aiData = {}) =>
  isCanonical(aiData) ? fromCanonical(aiData) : fromFlat(aiData);
