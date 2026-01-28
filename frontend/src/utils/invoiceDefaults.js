let profileCache = null;
let profilePromise = null;

const fetchProfileData = async () => {
  if (profileCache) return profileCache;
  
  if (profilePromise) return profilePromise;
  
  profilePromise = (async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        profileCache = { email: '', phone: '', websiteLink: '' };
        return profileCache;
      }
      
      const response = await fetch('http://localhost:5000/api/invoices/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          profileCache = result.data;
          return result.data;
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
    
    profileCache = { email: '', phone: '', websiteLink: '' };
    return profileCache;
  })();
  
  const data = await profilePromise;
  profilePromise = null;
  return data;
};

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

  const buildShippingAddress = (shipTo) => {
    if (!shipTo) return '';
    const parts = [
      shipTo.shippingAddress,
      [shipTo.shippingCity, shipTo.shippingState, shipTo.shippingZip].filter(Boolean).join(' ')
    ].filter(Boolean);
    return parts.join('\n');
  };

  if (!profileCache) {
    fetchProfileData();
  }
  
  const profile = profileCache || { email: '', phone: '', websiteLink: '' };

  return {
    logo: getImageUrl(data.business?.logo),
    companyName: data.business?.name || '',
    companyAddress: buildAddress(data.business),
    
    billToName: data.client?.name || '',
    billToAddress: buildAddress(data.client),
    
    shipToName: data.shipTo?.shippingName || '',
    shipToAddress: buildShippingAddress(data.shipTo),
    
    invoiceNumber: data.invoiceMeta?.invoiceNo || '',
    invoiceDate: formatDate(data.invoiceMeta?.invoiceDate),
    dueDate: formatDate(data.invoiceMeta?.dueDate),
    
    items: (data.items || []).map(item => ({
      quantity: item.quantity || 1,
      description: item.description || '',
      rate: item.rate || 0,
      amount: item.amount || 0,
    })),
    
    terms: Array.isArray(data.terms)
      ? data.terms.map(t => typeof t === 'string' ? t : (t.text || ''))
      : [],
    
    subtotal: data.totals?.subtotal || 0,
    taxAmount: data.totals?.taxTotal || 0,
    total: data.totals?.grandTotal || 0,
    
    bankName: data.payment?.bankName || '',
    accountNo: data.payment?.accountNo || '',
    ifscCode: data.payment?.ifscCode || '',
    
    signature: getImageUrl(data.signature),
    qrCode: getImageUrl(data.qrCode),
    
    email: profile.email || '',
    phone: profile.phone || '',
    website: profile.websiteLink || '',
    
    poNumber: '',
    upiId: '',
  };
};
