import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { currencyService } from '../../services/currencyService';
import {
  Plus,
  Trash2,
  Upload,
  X,
  FileText,
  Building2,
  User,
  Calendar,
  Hash,
  Receipt,
  PenTool,
  CreditCard,
  QrCode,
  Loader2,
  LogIn,
} from "lucide-react";
import { Link } from "react-router-dom";
import TaxModal from "./TaxModal";
import SignatureModal from "./SignatureModal";
import SavedItemsModal from "./SavedItemsModal";
import FooterLabelModal from "./FooterLabelModal";
import { invoiceAPI, taxAPI, itemAPI } from "../../services/invoiceService";
import { isAuthenticated } from "../../services/authService";
import { getUploadsUrl } from "../../services/apiConfig";

const documentConfig = {
  invoice: {
    fromLabel: "From",
    toLabel: "Bill To",
    numberLabel: "Invoice #",
    dateLabel: "Invoice Date",
    showDueDate: true,
    showTax: true,
  },
  "tax-invoice": {
    fromLabel: "From",
    toLabel: "Bill To",
    numberLabel: "Tax Invoice #",
    dateLabel: "Invoice Date",
    showDueDate: true,
    showTax: true,
    showGST: true,
  },
  "proforma-invoice": {
    fromLabel: "From",
    toLabel: "Bill To",
    numberLabel: "Proforma Invoice #",
    dateLabel: "Date",
    showDueDate: true,
    showTax: true,
  },
  receipt: {
    fromLabel: "Received From",
    toLabel: "Received By",
    numberLabel: "Receipt #",
    dateLabel: "Receipt Date",
    showDueDate: false,
    showTax: false,
  },
  "sales-receipt": {
    fromLabel: "From",
    toLabel: "Sold To",
    numberLabel: "Sales Receipt #",
    dateLabel: "Date",
    showDueDate: false,
    showTax: true,
  },
  // "cash-receipt": {
  //   fromLabel: "Received From",
  //   toLabel: "Received By",
  //   numberLabel: "Cash Receipt #",
  //   dateLabel: "Date",
  //   showDueDate: false,
  //   showTax: false,
  //   showPaymentMethod: true,
  //   itemLabel: "For",
  // },
  quote: {
    fromLabel: "From",
    toLabel: "Quote For",
    numberLabel: "Quote #",
    dateLabel: "Quote Date",
    showDueDate: true,
    dueDateLabel: "Valid Until",
    showTax: true,
  },
  estimate: {
    fromLabel: "From",
    toLabel: "Estimate For",
    numberLabel: "Estimate #",
    dateLabel: "Date",
    showDueDate: true,
    dueDateLabel: "Valid Until",
    showTax: true,
  },
  "credit-memo": {
    fromLabel: "From",
    toLabel: "Credit To",
    numberLabel: "Credit Memo #",
    dateLabel: "Date",
    showDueDate: false,
    showTax: true,
  },
  "credit-note": {
    fromLabel: "From",
    toLabel: "Credit To",
    numberLabel: "Credit Note #",
    dateLabel: "Date",
    showDueDate: false,
    showTax: true,
  },
  "purchase-order": {
    fromLabel: "From",
    toLabel: "Vendor",
    numberLabel: "PO #",
    dateLabel: "PO Date",
    showDueDate: true,
    dueDateLabel: "Delivery Date",
    showTax: true,
  },
  "delivery-note": {
    fromLabel: "Delivery From",
    toLabel: "Deliver To",
    numberLabel: "Delivery Note #",
    dateLabel: "Delivery Date",
    showDueDate: false,
    showTax: true,
  },
};

const InvoiceForm = ({
  documentType = "invoice",
  documentLabel = "Invoice",
  onSave,
  editInvoice = null, 
}) => {
  const isEditMode = !!editInvoice;
  const config = documentConfig[documentType] || documentConfig["invoice"];
  const [saving, setSaving] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);
  const [invoiceData, setInvoiceData] = useState({
    fromName: "",
    fromAddress: "",
    billTo: "",
    shipTo: "",
    invoiceNumber: "001",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    currency: "INR",
    bankName: "",
    accountNo: "",
    ifscCode: "",
  });
  const [items, setItems] = useState([
    {
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
      taxIds: [],
      paymentMethod: "Other",
      paymentNote: "",
      itemId: null, 
    },
  ]);
  const [terms, setTerms] = useState(["Payment is due within 15 days"]);
  
  const [savedTaxes, setSavedTaxes] = useState([]);
  const [taxesLoading, setTaxesLoading] = useState(false);
  
  const [savedItems, setSavedItems] = useState([]);
  const [savedItemsLoading, setSavedItemsLoading] = useState(false);
  const [showSavedItemsModal, setShowSavedItemsModal] = useState(false);
  
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showFooterLabelModal, setShowFooterLabelModal] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(null);
  const [signature, setSignature] = useState(null);
  const [logo, setLogo] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);
  const [qrCodeFile, setQrCodeFile] = useState(null);
  const [footerLabel, setFooterLabel] = useState('Terms & Conditions');
  const [hideFooterLabel, setHideFooterLabel] = useState(false);

  // Load currencies on component mount
  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        setLoadingCurrencies(true);
        const response = await currencyService.getAll();
        if (response.success) {
          setCurrencies(response.data);
        }
      } catch (error) {
        console.error('Failed to load currencies:', error);
      } finally {
        setLoadingCurrencies(false);
      }
    };

    loadCurrencies();
  }, []);

  useEffect(() => {
    if (editInvoice) {
      const parseDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
      };

      // Reconstruct full address from separate fields
      const buildAddress = (addressObj) => {
        if (!addressObj) return '';
        const parts = [
          addressObj.address,
          [addressObj.city, addressObj.state, addressObj.zip].filter(Boolean).join(' ')
        ].filter(Boolean);
        return parts.join('\n');
      };

      const buildClientAddress = (client) => {
        if (!client) return '';
        const parts = [
          client.name,
          client.address,
          [client.city, client.state, client.zip].filter(Boolean).join(' ')
        ].filter(Boolean);
        return parts.join('\n');
      };

      const fromAddress = buildAddress(editInvoice.business);
      const billTo = buildClientAddress(editInvoice.client);

      // Build shipTo with name, address, city, state, zip
      const buildShipTo = (shipTo) => {
        if (!shipTo) return '';
        const parts = [
          shipTo.shippingName,
          shipTo.shippingAddress,
          [shipTo.shippingCity, shipTo.shippingState, shipTo.shippingZip].filter(Boolean).join(' ')
        ].filter(Boolean);
        return parts.join('\n');
      };

      setInvoiceData({
        fromName: editInvoice.companyName || editInvoice.business?.name || '',
        fromAddress,
        billTo,
        shipTo: buildShipTo(editInvoice.shipTo),
        invoiceNumber: editInvoice.invoiceNumber || editInvoice.invoiceMeta?.invoiceNo || '',
        invoiceDate: parseDate(editInvoice.invoiceDate || editInvoice.invoiceMeta?.invoiceDate),
        dueDate: parseDate(editInvoice.dueDate || editInvoice.invoiceMeta?.dueDate),
        currency: editInvoice.invoiceMeta?.currency || 'INR',
        bankName: editInvoice.payment?.bankName || '',
        accountNo: editInvoice.payment?.accountNo || '',
        ifscCode: editInvoice.payment?.ifscCode || '',
      });

      if (editInvoice.items && editInvoice.items.length > 0) {
        const loadedItems = editInvoice.items.map(item => ({
          description: item.description || '',
          quantity: item.quantity || 1,
          rate: item.rate || 0,
          amount: item.amount || 0,
          taxIds: [],
          paymentMethod: 'Other',
          paymentNote: '',
        }));
        setItems(loadedItems);
      }

      if (editInvoice.terms && editInvoice.terms.length > 0) {
        const termsArray = Array.isArray(editInvoice.terms) 
          ? editInvoice.terms.map(t => typeof t === 'string' ? t : t.text)
          : [];
        if (termsArray.length > 0) {
          setTerms(termsArray);
        }
      }

      if (editInvoice.logo) {
        const logoUrl = editInvoice.logo.startsWith('http') 
          ? editInvoice.logo 
          : `${getUploadsUrl()}/uploads/${editInvoice.logo}`;
        setLogo(logoUrl);
      }
      if (editInvoice.signature) {
        const signatureUrl = editInvoice.signature.startsWith('http') 
          ? editInvoice.signature 
          : `${getUploadsUrl()}/uploads/${editInvoice.signature}`;
        setSignature(signatureUrl);
      }
      if (editInvoice.qrCode) {
        const qrCodeUrl = editInvoice.qrCode.startsWith('http') 
          ? editInvoice.qrCode 
          : `${getUploadsUrl()}/uploads/${editInvoice.qrCode}`;
        setQrCode(qrCodeUrl);
      }
      
      // Also check business.logo for backward compatibility
      if (!editInvoice.logo && editInvoice.business?.logo) {
        const logoUrl = editInvoice.business.logo.startsWith('http') 
          ? editInvoice.business.logo 
          : `${getUploadsUrl()}/uploads/${editInvoice.business.logo}`;
        setLogo(logoUrl);
      }
    }
  }, [editInvoice]);

  useEffect(() => {
    const fetchTaxes = async () => {
      if (!isAuthenticated()) return;
      
      setTaxesLoading(true);
      try {
        const response = await taxAPI.getAll();
        if (response.success) {
          const taxes = (response.data || []).map(tax => ({
            id: tax._id,
            _id: tax._id,
            name: tax.name,
            rate: tax.rate,
            isCompound: tax.isCompound || false,
          }));
          setSavedTaxes(taxes);
        }
      } catch (err) {
        console.error('Failed to fetch taxes:', err);
      } finally {
        setTaxesLoading(false);
      }
    };
    
    fetchTaxes();
  }, []);

  // Fetch saved items from ItemMaster API
  useEffect(() => {
    const fetchSavedItems = async () => {
      if (!isAuthenticated()) return;
      
      setSavedItemsLoading(true);
      try {
        const response = await itemAPI.getAll();
        if (response.success) {
          const items = (response.data || []).map(item => ({
            id: item._id,
            _id: item._id,
            description: item.description,
            quantity: item.quantity || 1,
            rate: item.rate,
            amount: item.amount,
            tax: item.tax || 0,
          }));
          setSavedItems(items);
        }
      } catch (err) {
        console.error('Failed to fetch saved items:', err);
      } finally {
        setSavedItemsLoading(false);
      }
    };
    
    fetchSavedItems();
  }, []);

  const paymentMethods = [
    "Cash",
    "Check",
    "Credit Card",
    "Debit Card",
    "Bank Transfer",
    "UPI",
    "Other",
  ];
  
  const getCurrencySymbol = () => {
    const currency = currencies.find(c => c.code === invoiceData.currency);
    if (currency) {
      return currency.symbol;
    }
    
    return currencyService.getSymbol(invoiceData.currency);
  };
  
  const handleInputChange = (e) =>
    setInvoiceData({ ...invoiceData, [e.target.name]: e.target.value });

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    if (field === "quantity" || field === "rate") {
      newItems[index][field] = parseFloat(value) || 0;
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    } else if (field === "amount") {
      newItems[index][field] = parseFloat(value) || 0;
    } else {
      newItems[index][field] = value;
    }
    setItems(newItems);
  };

  const addItem = () =>
    setItems([
      ...items,
      {
        description: "",
        quantity: 1,
        rate: 0,
        amount: 0,
        taxIds: [],
        paymentMethod: "Other",
        paymentNote: "",
        itemId: null,
      },
    ]);
  const removeItem = (index) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== index));
  };
  
  const addSavedItemToInvoice = (savedItem) => {
    setItems([
      ...items,
      {
        description: savedItem.description,
        quantity: savedItem.quantity || 1,
        rate: savedItem.rate || savedItem.amount,
        amount: savedItem.amount,
        taxIds: [],
        paymentMethod: "Other",
        paymentNote: "",
        itemId: savedItem._id || savedItem.id, 
      },
    ]);
    setShowSavedItemsModal(false);
  };
  
  const saveCurrentItemToLibrary = async (index) => {
    const item = items[index];
    if (item.description && (item.amount > 0 || item.rate > 0)) {
      try {
        const response = await itemAPI.create({
          description: item.description,
          quantity: item.quantity || 1,
          rate: item.rate || item.amount || 0,
          tax: 0,
        });
        
        if (response.success) {
          const newSavedItem = {
            id: response.data._id,
            _id: response.data._id,
            description: response.data.description,
            quantity: response.data.quantity,
            rate: response.data.rate,
            amount: response.data.amount,
            tax: response.data.tax || 0,
          };
          setSavedItems(prev => [...prev, newSavedItem]);
          
          const newItems = [...items];
          newItems[index].itemId = response.data._id;
          setItems(newItems);
        }
      } catch (err) {
        console.error('Failed to save item:', err);
        toast.error('Failed to save item: ' + err.message);
      }
    }
  };
  
  const deleteSavedItem = async (id) => {
    try {
      const response = await itemAPI.delete(id);
      if (response.success) {
        setSavedItems(prev => prev.filter(item => item.id !== id && item._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete item:', err);
      toast.error('Failed to delete item: ' + err.message);
    }
  };
  const openTaxModal = (index) => {
    setCurrentItemIndex(index);
    setShowTaxModal(true);
  };
  
  const handleSaveTax = async (newTax) => {
    try {
      const response = await taxAPI.create({
        name: newTax.name,
        rate: newTax.rate,
        isCompound: newTax.isCompound || false,
      });
      
      if (response.success) {
        const savedTax = {
          id: response.data._id,
          _id: response.data._id,
          name: response.data.name,
          rate: response.data.rate,
          isCompound: response.data.isCompound || false,
        };
        setSavedTaxes(prev => [...prev, savedTax]);
        return savedTax;
      }
    } catch (err) {
      console.error('Failed to save tax:', err);
      toast.error('Failed to save tax: ' + err.message);
    }
    return null;
  };
  
  const handleDeleteTax = async (taxId) => {
    try {
      const response = await taxAPI.delete(taxId);
      if (response.success) {
        setSavedTaxes(prev => prev.filter(t => t.id !== taxId && t._id !== taxId));
        setItems(items.map(item => ({
          ...item,
          taxIds: item.taxIds.filter(id => id !== taxId)
        })));
      }
    } catch (err) {
      console.error('Failed to delete tax:', err);
      toast.error('Failed to delete tax: ' + err.message);
    }
  };
  
  const handleToggleTax = (taxId) => {
    if (currentItemIndex === null) return;
    const newItems = [...items];
    const item = newItems[currentItemIndex];
    if (item.taxIds.includes(taxId)) {
      item.taxIds = item.taxIds.filter(id => id !== taxId);
    } else {
      item.taxIds = [...item.taxIds, taxId];
    }
    setItems(newItems);
  };
  const getItemTaxDisplay = (item) => {
    if (!item.taxIds || item.taxIds.length === 0) return null;
    const taxes = savedTaxes.filter(t => item.taxIds.includes(t.id));
    return taxes.map(t => t.name.includes('%') ? t.name : `${t.name} ${t.rate}%`).join(', ');
  };
  const getItemTaxAmount = (item) => {
    if (!item.taxIds || item.taxIds.length === 0) return 0;
    const taxes = savedTaxes.filter(t => item.taxIds.includes(t.id));
    return taxes.reduce((sum, t) => sum + (item.amount * t.rate / 100), 0);
  };
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
      setLogoFile(file);
    }
  };
  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSignature(URL.createObjectURL(file));
      setSignatureFile(file);
      setShowSignatureModal(false);
    }
  };
  const handleQrCodeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setQrCode(URL.createObjectURL(file));
      setQrCodeFile(file);
    }
  };

  const handleTermChange = (index, value) => {
    const newTerms = [...terms];
    newTerms[index] = value;
    setTerms(newTerms);
  };
  const addTerm = () => setTerms([...terms, ""]);
  const removeTerm = (index) => {
    if (terms.length > 1) setTerms(terms.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => {
    return sum + (item.quantity * item.rate);
  }, 0);
  
  const simpleTaxTotal = items.reduce(
    (sum, item) => {
      const itemAmount = item.quantity * item.rate;
      if (!item.taxIds || item.taxIds.length === 0) return sum;
      const simpleTaxes = savedTaxes.filter(t => item.taxIds.includes(t.id) && !t.isCompound);
      return sum + simpleTaxes.reduce((taxSum, t) => taxSum + (itemAmount * t.rate / 100), 0);
    },
    0
  );
  
  const compoundTaxTotal = items.reduce(
    (sum, item) => {
      const itemAmount = item.quantity * item.rate;
      if (!item.taxIds || item.taxIds.length === 0) return sum;
      const compoundTaxes = savedTaxes.filter(t => item.taxIds.includes(t.id) && t.isCompound);
      const itemSimpleTaxes = savedTaxes.filter(t => item.taxIds.includes(t.id) && !t.isCompound);
      const itemSimpleTaxAmount = itemSimpleTaxes.reduce((taxSum, t) => taxSum + (itemAmount * t.rate / 100), 0);
      const baseForCompound = itemAmount + itemSimpleTaxAmount;
      return sum + compoundTaxes.reduce((taxSum, t) => taxSum + (baseForCompound * t.rate / 100), 0);
    },
    0
  );
  
  const totalTax = simpleTaxTotal + compoundTaxTotal;
  const total = subtotal + totalTax;

  const getBackendDocType = () => {
    const typeMap = {
      'invoice': 'invoice',
      'tax-invoice': 'taxInvoice',
      'proforma-invoice': 'proforma',
      'receipt': 'receipt',
      'sales-receipt': 'salesReceipt',
      // 'cash-receipt': 'cashReceipt',
      'quote': 'quote',
      'estimate': 'estimate',
      'credit-memo': 'creditMemo',
      'credit-note': 'creditNote',
      'purchase-order': 'purchaseOrder',
      'delivery-note': 'deliveryNote',
    };
    return typeMap[documentType] || 'invoice';
  };

  const parseAddress = (addressStr) => {
    return {
      address: addressStr || '',
      phone: '',
      email: '',
    };
  };

  const parseClientAddress = (addressStr) => {
    const lines = addressStr.split('\n').filter(l => l.trim());
    return {
      name: lines[0] || '',
      address: lines.slice(1).join('\n') || '', 
      email: '',
    };
  };

  const handleSaveInvoice = async () => {
    if (!isAuthenticated()) {
      setShowLoginPrompt(true);
      return;
    }

    setSaving(true);
    setShowLoginPrompt(false);

    try {
      // Step 1: Save items to ItemMaster first and collect itemIds
      const itemIds = [];
      
      for (const item of items) {
        if (!item.description) continue;
        
        if (item.itemId) {
          itemIds.push({ itemId: item.itemId });
        } else {
          const itemAmount = item.quantity * item.rate;
          const itemTaxes = savedTaxes.filter(t => item.taxIds?.includes(t.id));
          const taxAmount = itemTaxes.reduce((sum, t) => sum + (itemAmount * t.rate / 100), 0);
          
          const response = await itemAPI.create({
            description: item.description,
            quantity: item.quantity || 1,
            rate: item.rate || 0,
            tax: taxAmount,
          });
          
          if (response.success && response.data._id) {
            itemIds.push({ itemId: response.data._id });
            
            const newSavedItem = {
              id: response.data._id,
              _id: response.data._id,
              description: response.data.description,
              quantity: response.data.quantity,
              rate: response.data.rate,
              amount: response.data.amount,
              tax: response.data.tax || 0,
            };
            setSavedItems(prev => [...prev, newSavedItem]);
          } else {
            throw new Error('Failed to save item to ItemMaster');
          }
        }
      }

      if (itemIds.length === 0) {
        throw new Error('At least one item is required');
      }

      const businessInfo = parseAddress(invoiceData.fromAddress);
      const clientInfo = parseClientAddress(invoiceData.billTo);

      const parseShipTo = (shipToStr) => {
        if (!shipToStr) return null;
        const lines = shipToStr.split('\n').filter(l => l.trim());
        return {
          shippingName: lines[0] || '',
          shippingAddress: lines.slice(1).join('\n') || '', // Send full address, backend will parse
        };
      };

      const shipToInfo = parseShipTo(invoiceData.shipTo);

      const getExistingFilename = (url) => {
        if (!url) return undefined;
        if (url.startsWith('blob:')) return undefined; 
        if (url.startsWith('http')) {
          const parts = url.split('/');
          return parts[parts.length - 1];
        }
        return url; 
      };

      // Step 2: Create invoice with itemIds
      const invoicePayload = {
        formType: 'advanced',
        documentType: getBackendDocType(),
        business: {
          name: invoiceData.fromName,
          ...businessInfo,
          ...(isEditMode && !logoFile && logo ? { logo: getExistingFilename(logo) } : {}),
        },
        client: clientInfo,
        shipTo: shipToInfo ? {
          shippingName: shipToInfo.shippingName,
          shippingAddress: shipToInfo.shippingAddress,
        } : undefined,
        invoiceMeta: {
          invoiceNo: invoiceData.invoiceNumber,
          invoiceDate: invoiceData.invoiceDate, 
          dueDate: invoiceData.dueDate,
          currency: invoiceData.currency,
        },
        items: itemIds, // Send itemIds instead of full item objects
        terms: terms.filter(t => t.trim()).map(text => ({ text })),
        payment: {
          bankName: invoiceData.bankName,
          accountNo: invoiceData.accountNo,
          ifscCode: invoiceData.ifscCode,
        },
        totals: {
          subtotal,
          taxTotal: totalTax,
          grandTotal: config.showTax ? total : subtotal,
        },
        ...(isEditMode && !signatureFile && signature ? { signature: getExistingFilename(signature) } : {}),
        ...(isEditMode && !qrCodeFile && qrCode ? { qrCode: getExistingFilename(qrCode) } : {}),
      };

      const formData = new FormData();
      formData.append('data', JSON.stringify(invoicePayload));
      
      if (logoFile) {
        formData.append('logo', logoFile);
      }
      if (signatureFile) {
        formData.append('signature', signatureFile);
      }
      if (qrCodeFile) {
        formData.append('qrCode', qrCodeFile);
      }

      let response;
      const invoiceId = editInvoice?._id || editInvoice?.id;
      if (isEditMode && invoiceId) {
        response = await invoiceAPI.update(invoiceId, formData);
      } else {
        response = await invoiceAPI.create(formData);
      }
      
      if (onSave && response.data) {
        // Pass the complete invoice data from backend
        onSave(response.data, isEditMode);
      }
    } catch (error) {
      console.error('Save invoice error:', error);
      toast.error(error.message || 'Failed to save invoice');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header with Tabs */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-400 flex items-center justify-center">
                <Receipt className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg">{isEditMode ? 'Edit' : ''} {documentLabel} Builder</h2>
                <p className="text-slate-400 text-sm">{isEditMode ? 'Update your document' : 'Create professional documents in minutes'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="p-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Sender & Recipient */}
            <div className="lg:col-span-2 space-y-6">
              {/* Sender Card */}
              <div className="group relative bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-indigo-200 transition-all">
                <div className="absolute top-0 left-6 -translate-y-1/2">
                  <span className="inline-flex items-center gap-2 bg-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                    <Building2 className="w-3.5 h-3.5" /> {config.fromLabel}
                  </span>
                </div>
                <div className="mt-4 space-y-4">
                  <input
                    type="text"
                    name="fromName"
                    value={invoiceData.fromName}
                    onChange={handleInputChange}
                    placeholder="Business / Your Name"
                    className="w-full px-0 py-2 text-lg font-semibold text-slate-800 placeholder-slate-400 border-0 border-b-2 border-transparent focus:border-indigo-500 focus:outline-none bg-transparent transition-all"
                  />
                  <textarea
                    name="fromAddress"
                    value={invoiceData.fromAddress}
                    onChange={handleInputChange}
                    placeholder="Address, City, State, ZIP"
                    rows={3}
                    className="w-full px-0 py-2 text-slate-600 placeholder-slate-400 border-0 border-b-2 border-transparent focus:border-indigo-500 focus:outline-none bg-transparent resize-none transition-all"
                  />
                </div>
              </div>

              {/* Recipient Card */}
              <div className="group relative bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-emerald-200 transition-all">
                <div className="absolute top-0 left-6 -translate-y-1/2">
                  <span className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                    <User className="w-3.5 h-3.5" /> {config.toLabel}
                  </span>
                </div>
                <div className="mt-4">
                  <textarea
                    name="billTo"
                    value={invoiceData.billTo}
                    onChange={handleInputChange}
                    placeholder="Client Name&#10;Client Address, City, State, ZIP"
                    rows={4}
                    className="w-full px-0 py-2 text-slate-600 placeholder-slate-400 border-0 border-b-2 border-transparent focus:border-emerald-500 focus:outline-none bg-transparent resize-none transition-all"
                  />
                </div>
                {/* Ship To */}
                <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                    Ship To (if different)
                  </label>
                  <textarea
                    name="shipTo"
                    value={invoiceData.shipTo}
                    onChange={handleInputChange}
                    placeholder="Recipient Name&#10;Shipping Address&#10;City, State, ZIP"
                    rows={3}
                    className="w-full px-0 py-2 text-slate-600 placeholder-slate-400 border-0 border-b-2 border-transparent focus:border-emerald-500 focus:outline-none bg-transparent resize-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Logo & Details */}
            <div className="space-y-6">
              {/* Logo Upload */}
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4 block">
                  Company Logo
                </label>
                {logo ? (
                  <div className="relative group">
                    <img
                      src={logo}
                      alt="Logo"
                      className="max-h-20 mx-auto rounded-lg"
                    />
                    <button
                      onClick={() => setLogo(null)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all">
                    <Upload className="w-6 h-6 text-slate-400 mb-1" />
                    <span className="text-sm text-slate-500">
                      Drop logo here
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Document Details */}
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 p-6 space-y-4 hover:shadow-lg transition-all">
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    <Hash className="w-3.5 h-3.5" /> {config.numberLabel}
                  </label>
                  <input
                    type="text"
                    name="invoiceNumber"
                    value={invoiceData.invoiceNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    <Calendar className="w-3.5 h-3.5" /> {config.dateLabel}
                  </label>
                  <input
                    type="date"
                    name="invoiceDate"
                    value={invoiceData.invoiceDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                {config.showDueDate && (
                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      <Calendar className="w-3.5 h-3.5" />{" "}
                      {config.dueDateLabel || "Due Date"}
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      value={invoiceData.dueDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                )}
                {/* Currency Selector */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={invoiceData.currency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    disabled={loadingCurrencies}
                  >
                    {loadingCurrencies ? (
                      <option>Loading currencies...</option>
                    ) : currencies.length > 0 ? (
                      currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.code} - {currency.name}
                        </option>
                      ))
                    ) : (
                      // Fallback to hardcoded options if API fails
                      <>
                        <option value="INR">₹ INR - Indian Rupee</option>
                        <option value="USD">$ USD - US Dollar</option>
                        <option value="EUR">€ EUR - Euro</option>
                        <option value="GBP">£ GBP - British Pound</option>
                        <option value="AUD">A$ AUD - Australian Dollar</option>
                        <option value="CAD">C$ CAD - Canadian Dollar</option>
                        <option value="SGD">S$ SGD - Singapore Dollar</option>
                        <option value="AED">د.إ AED - UAE Dirham</option>
                        <option value="JPY">¥ JPY - Japanese Yen</option>
                        <option value="CNY">¥ CNY - Chinese Yuan</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Line Items
              </h3>
              <span className="text-sm text-slate-500">
                {items.length} item{items.length > 1 ? "s" : ""}
              </span>
            </div>

            {/* Items Table */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
              {/* Table Header */}
              {config.showPaymentMethod ? (
                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  <div className="col-span-5">{config.itemLabel || "For"}</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-4">Payment Method</div>
                  <div className="col-span-1"></div>
                </div>
              ) : (
                <div
                  className="grid gap-4 px-6 py-3 bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wide grid-cols-12"
                >
                  <div className="col-span-4">Description</div>
                  <div className="col-span-1">Qty</div>
                  <div className="col-span-2">Rate</div>
                  <div className="col-span-2">Amount</div>
                  {config.showTax && <div className="col-span-2">Tax</div>}
                  <div className="col-span-1"></div>
                </div>
              )}

              {/* Item Rows */}
              <div className="divide-y divide-slate-200">
                {items.map((item, index) =>
                  config.showPaymentMethod ? (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-4 px-6 py-4 items-start hover:bg-white transition-colors"
                    >
                      <div className="col-span-5">
                        <textarea
                          value={item.description}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Description"
                          rows={2}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none transition-all text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          value={item.amount || ""}
                          onChange={(e) =>
                            handleItemChange(index, "amount", e.target.value)
                          }
                          placeholder="0.00"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                        />
                      </div>
                      <div className="col-span-4 space-y-2">
                        <select
                          value={item.paymentMethod}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "paymentMethod",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                        >
                          {paymentMethods.map((method) => (
                            <option key={method} value={method}>
                              {method}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={item.paymentNote || ""}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "paymentNote",
                              e.target.value
                            )
                          }
                          placeholder="Note"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                        />
                      </div>
                      <div className="col-span-1 flex justify-center pt-2">
                        <button
                          onClick={() => removeItem(index)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={index}
                      className="grid gap-4 px-6 py-4 items-center hover:bg-white transition-colors grid-cols-12"
                    >
                      <div className="col-span-4">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Item description"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                        />
                      </div>
                      <div className="col-span-1">
                        <input
                          type="number"
                          value={item.quantity || ""}
                          onChange={(e) =>
                            handleItemChange(index, "quantity", e.target.value)
                          }
                          placeholder="1"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-center"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          value={item.rate || ""}
                          onChange={(e) =>
                            handleItemChange(index, "rate", e.target.value)
                          }
                          placeholder="0.00"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium text-center">
                          {getCurrencySymbol()}{(item.quantity * item.rate).toFixed(2)}
                        </div>
                      </div>
                      {config.showTax && (
                        <div className="col-span-2">
                          <button
                            onClick={() => openTaxModal(index)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-left hover:border-indigo-300 hover:bg-indigo-50/50 transition-all truncate"
                          >
                            {getItemTaxDisplay(item) || "+ Tax"}
                          </button>
                        </div>
                      )}
                      <div className="col-span-1 flex justify-center">
                        <button
                          onClick={() => removeItem(index)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Add Item Buttons */}
              <div className="grid grid-cols-2 border-t border-slate-200">
                <button
                  onClick={() => setShowSavedItemsModal(true)}
                  className="py-4 text-indigo-600 font-medium hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 border-r border-slate-200"
                >
                  <FileText className="w-5 h-5" /> Add Saved Items
                </button>
                <button
                  onClick={addItem}
                  className="py-4 text-indigo-600 font-medium hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Add New Item
                </button>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end mt-6">
              <div className="w-80 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white">
                <div className="space-y-3">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal</span>
                    <span>{getCurrencySymbol()}{subtotal.toFixed(2)}</span>
                  </div>
                  {config.showTax && (
                    <div className="flex justify-between text-slate-300">
                      <span>Tax</span>
                      <span>{getCurrencySymbol()}{totalTax.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total ({invoiceData.currency})</span>
                      <span className="text-2xl font-bold text-emerald-400">
                        {getCurrencySymbol()}
                        {config.showTax
                          ? total.toFixed(2)
                          : subtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section - Terms, Signature, Payment Info & QR Code */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {/* Terms */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <FileText className="w-3.5 h-3.5" /> 
                  {hideFooterLabel ? <span className="line-through text-slate-400">{footerLabel}</span> : footerLabel}
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFooterLabelModal(true)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    Edit
                  </button>
                  <span className="text-xs text-slate-400">
                    {terms.length} term{terms.length > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                {terms.map((term, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-semibold mt-2 flex-shrink-0">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={term}
                      onChange={(e) => handleTermChange(index, e.target.value)}
                      placeholder="Enter term or condition"
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                    />
                    <button
                      onClick={() => removeTerm(index)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addTerm}
                  className="w-full py-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition-all flex items-center justify-center gap-2 border border-dashed border-slate-300 hover:border-indigo-300"
                >
                  <Plus className="w-4 h-4" /> Add Term
                </button>
              </div>
            </div>

            {/* Signature */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 p-6">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                <PenTool className="w-3.5 h-3.5" /> Authorized Signature
              </label>
              {signature ? (
                <div className="relative group h-24 flex items-center justify-center">
                  <img
                    src={signature}
                    alt="Signature"
                    className="max-h-20 rounded"
                  />
                  <button
                    onClick={() => setSignature(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSignatureModal(true)}
                  className="w-full h-24 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all"
                >
                  <PenTool className="w-6 h-6 mb-1" />
                  <span className="text-sm">Add Signature</span>
                </button>
              )}
            </div>

            {/* Payment Information */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 p-6">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
                <CreditCard className="w-3.5 h-3.5" /> Payment Information
              </label>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={invoiceData.bankName}
                    onChange={handleInputChange}
                    placeholder="e.g. State Bank of India"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Account No.</label>
                  <input
                    type="text"
                    name="accountNo"
                    value={invoiceData.accountNo}
                    onChange={handleInputChange}
                    placeholder="e.g. 123456789012"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">IFSC Code</label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={invoiceData.ifscCode}
                    onChange={handleInputChange}
                    placeholder="e.g. SBIN0005678"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            {/* QR Code for Payment */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 p-6">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                <QrCode className="w-3.5 h-3.5" /> Scan to Pay (QR Code)
              </label>
              {qrCode ? (
                <div className="relative group flex items-center justify-center">
                  <img
                    src={qrCode}
                    alt="Payment QR Code"
                    className="max-h-32 rounded-lg border border-slate-200"
                  />
                  <button
                    onClick={() => setQrCode(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all">
                  <QrCode className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-sm text-slate-500">Upload QR Code</span>
                  <span className="text-xs text-slate-400 mt-1">UPI / Payment QR</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQrCodeUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-200">
          {showLoginPrompt && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LogIn className="w-5 h-5 text-amber-600" />
                <span className="text-amber-800 font-medium">Please sign in to save your invoice</span>
              </div>
              <Link 
                to="/signin" 
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
              >
                Sign In
              </Link>
            </div>
          )}
          <button 
            onClick={handleSaveInvoice}
            disabled={saving}
            className="relative w-full py-4 bg-slate-900 text-white font-semibold rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-3 text-lg overflow-hidden disabled:opacity-50"
          >
            {/* Decorative Background */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/4 w-32 h-32 bg-indigo-500/30 rounded-full blur-2xl" />
              <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-emerald-500/30 rounded-full blur-2xl" />
            </div>
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 relative z-10 animate-spin" />
                <span className="relative z-10">Saving...</span>
              </>
            ) : (
              <>
                <FileText className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{isEditMode ? 'Update' : 'Save'} {documentLabel}, Print or Send</span>
              </>
            )}
          </button>
        </div>
      </div>

      <TaxModal
        isOpen={showTaxModal}
        onClose={() => setShowTaxModal(false)}
        savedTaxes={savedTaxes}
        onSaveTax={handleSaveTax}
        onDeleteTax={handleDeleteTax}
        selectedTaxes={currentItemIndex !== null ? items[currentItemIndex]?.taxIds || [] : []}
        onToggleTax={handleToggleTax}
      />
      <SignatureModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onUpload={handleSignatureUpload}
      />
      <SavedItemsModal
        isOpen={showSavedItemsModal}
        onClose={() => setShowSavedItemsModal(false)}
        savedItems={savedItems}
        onSelectItem={addSavedItemToInvoice}
        onDeleteItem={deleteSavedItem}
        loading={savedItemsLoading}
        onSaveNewItem={async (newItem) => {
          try {
            const response = await itemAPI.create({
              description: newItem.description,
              quantity: newItem.quantity || 1,
              rate: newItem.rate,
              tax: 0,
            });
            
            if (response.success) {
              const savedItem = {
                id: response.data._id,
                _id: response.data._id,
                description: response.data.description,
                quantity: response.data.quantity,
                rate: response.data.rate,
                amount: response.data.amount,
                tax: response.data.tax || 0,
              };
              setSavedItems(prev => [...prev, savedItem]);
            }
          } catch (err) {
            console.error('Failed to save item:', err);
            toast.error('Failed to save item: ' + err.message);
          }
        }}
      />
      <FooterLabelModal
        isOpen={showFooterLabelModal}
        onClose={() => setShowFooterLabelModal(false)}
        currentLabel={footerLabel}
        onUpdateLabel={setFooterLabel}
        hideLabel={hideFooterLabel}
        onToggleHideLabel={setHideFooterLabel}
      />
    </>
  );
};

export default InvoiceForm;
