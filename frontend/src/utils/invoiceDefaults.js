export const getInvoiceData = (data = {}) => {
  const BACKEND_URL = 'http://localhost:5000';
  
  const getImageUrl = (filename) => {
    if (!filename) return null;
    if (filename.startsWith('http')) return filename; 
    if (filename.startsWith('blob:')) return filename; 
    return `${BACKEND_URL}/uploads/${filename}`; 
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-GB'); 
    } catch {
      return dateStr;
    }
  };

  const buildAddress = (addressObj) => {
    if (!addressObj) return '';
    const parts = [
      addressObj.address,
      [addressObj.city, addressObj.state, addressObj.zip].filter(Boolean).join(' ')
    ].filter(Boolean);
    return parts.join('\n');
  };

  const companyAddress = data.business 
    ? buildAddress(data.business)
    : (data.companyAddress || '');
    
  const billToAddress = data.client
    ? buildAddress(data.client)
    : (data.billTo?.address || '');

  const terms = Array.isArray(data.terms)
    ? data.terms.map(t => typeof t === 'string' ? t : (t.text || ''))
    : [];

  const items = (data.items || []).map(item => ({
    quantity: item.quantity || 1,
    description: item.description || '',
    rate: item.rate || 0,
    amount: item.amount || 0,
  }));

  return {
    logo: getImageUrl(data.logo || data.business?.logo),
    companyName: data.companyName || data.business?.name || '',
    companyAddress,
    billToName: data.billTo?.name || data.client?.name || '',
    billToAddress,
    shipToName: data.shipTo?.name || '',
    shipToAddress: data.shipTo?.address || data.shipTo?.shippingAddress || '',
    invoiceNumber: data.invoiceNumber || data.invoiceMeta?.invoiceNo || '',
    invoiceDate: formatDate(data.invoiceDate || data.invoiceMeta?.invoiceDate),
    poNumber: data.poNumber || '',
    dueDate: formatDate(data.dueDate || data.invoiceMeta?.dueDate),
    items,
    terms,
    subtotal: data.subtotal || data.totals?.subtotal || 0,
    taxAmount: data.taxAmount || data.totals?.taxTotal || 0,
    total: data.total || data.totals?.grandTotal || 0,
    bankName: data.paymentInfo?.bankName || data.payment?.bankName || '',
    accountNo: data.paymentInfo?.accountNo || data.payment?.accountNo || '',
    ifscCode: data.paymentInfo?.ifscCode || data.payment?.ifscCode || '',
    upiId: data.paymentInfo?.upiId || data.payment?.upiId || '',
    signature: getImageUrl(data.signature),
    qrCode: getImageUrl(data.qrCode),
    email: data.business?.email || data.buisness?.email || '',
    phone: data.business?.phone || data.buisness?.phone || '',
    website: data.website || '',
  };
};
