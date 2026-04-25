/**
 * Converts flat AI-generated invoice data into the nested format
 * expected by template components via getInvoiceData()
 */
export const aiDataToTemplateFormat = (aiData = {}) => {
  const items = [];
  for (let i = 1; i <= 4; i++) {
    const desc = aiData[`item${i}Desc`];
    if (desc) {
      items.push({
        description: desc,
        quantity: parseFloat(aiData[`item${i}Qty`]) || 1,
        rate: parseFloat(aiData[`item${i}Rate`]) || 0,
        amount: parseFloat(aiData[`item${i}Amount`]) || 0,
      });
    }
  }

  return {
    business: {
      name: aiData.businessName || "",
      address: aiData.businessAddress1 || "",
      city: aiData.businessAddress2 || "",
    },
    client: {
      name: aiData.clientName || "",
      address: aiData.clientAddress1 || "",
      city: aiData.clientAddress2 || "",
    },
    shipTo: {
      shippingName: aiData.shipToName || "",
      shippingAddress: aiData.shipToAddress1 || "",
      shippingCity: aiData.shipToAddress2 || "",
    },
    invoiceMeta: {
      invoiceNo: aiData.invoiceNumber || "",
      invoiceDate: aiData.invoiceDate || "",
      dueDate: aiData.dueDate || "",
      poNumber: aiData.poNumber || "",
    },
    items,
    totals: {
      subtotal: parseFloat(aiData.subtotal) || 0,
      taxTotal: parseFloat(aiData.tax) || 0,
      grandTotal: parseFloat(aiData.total) || 0,
    },
    payment: {
      bankName: aiData.bankName || "",
      accountNo: aiData.accountNumber || "",
      ifscCode: aiData.ifscCode || "",
    },
    terms: aiData.terms ? [aiData.terms] : [],
    currency: aiData.currency || "USD",
    footer: {
      email: aiData.footerEmail || "",
      phone: aiData.footerPhone || "",
      website: aiData.footerWebsite || "",
    },
  };
};
