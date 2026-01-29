import { useState, useRef, useEffect } from 'react';
import { CreditCard, RefreshCw, Download, Mail, Calendar, Paperclip, FileText, Upload, X, Copy, ArrowRight, Loader2, Trash2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { templateAPI } from '../../services/templateService';
const getCurrencySymbol = (currency = 'INR') => {
  return currencyService.getSymbol(currency);
};

const formatAmount = (amount, currency = 'INR') => { 
  // Use basic formatting since we don't have locale config
  return Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 });
};

const formatCurrency = (amount, currency = 'INR') => {
  const symbol = getCurrencySymbol(currency);
  const formattedAmount = formatAmount(amount, currency);
  return `${symbol}${formattedAmount}`;
};

import Template1 from '../templates/Template1/Template1';
import Template2 from '../templates/Template2/Template2';
import Template3 from '../templates/Template3/Template3';
import Template4 from '../templates/Template4/Template4';
import Template5 from '../templates/Template5';
import Template6 from '../templates/Template6';
import Template7 from '../templates/Template7';
import Template8 from '../templates/Template8';
import Template9 from '../templates/Template9';
import Template10 from '../templates/Template10';
import Template11 from '../templates/Template11';
import Template12 from '../templates/Template12';
import InvoiceForm from '../invoice/InvoiceForm';
import InvoiceActionTabs from '../invoice/InvoiceActionTabs';
import { invoiceAPI } from '../../services/invoiceService';
import { paymentAPI } from '../../services/paymentService';
import { getCurrentUser } from '../../services/authService';
import { createRecurringInvoice, getRecurringInvoice } from '../../services/recurringService';
import { currencyService } from '../../services/currencyService';

const templates = {
  1: Template1,
  2: Template2,
  3: Template3,
  4: Template4,
  5: Template5,
  6: Template6,
  7: Template7,
  8: Template8,
  9: Template9,
  10: Template10,
  11: Template11,
  12: Template12,
};

const InvoicePreview = ({ invoice, onClose, onInvoiceUpdated }) => {
  const [activeAction, setActiveAction] = useState('invoice');
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [currentInvoice, setCurrentInvoice] = useState(invoice);
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);
  const [templateMeta, setTemplateMeta] = useState(null);
  const templateRef = useRef(null);
  
  // Update currentInvoice when invoice prop changes
  useEffect(() => {
    const fetchFullInvoice = async () => {
      if (invoice?._id || invoice?.id) {
        try {
          setLoading(true);
          const response = await invoiceAPI.getById(invoice._id || invoice.id);
          
          if (response.success && response.data) {
            setCurrentInvoice(response.data);
          } else {
            setCurrentInvoice(invoice);
          }
        } catch (error) {
          console.error('Failed to fetch full invoice:', error);
          setCurrentInvoice(invoice);
        } finally {
          setLoading(false);
        }
      } else {
        setCurrentInvoice(invoice);
      }
    };
    
    fetchFullInvoice();
  }, [invoice]);

  useEffect(() => {
  const loadTemplate = async () => {
    try {
      const res = await templateAPI.getByName(
        `Template${selectedTemplate}`
      );

      setTemplateMeta(res);
      console.log("🔥 TEMPLATE META FROM API:", res.data);

    } catch (err) {
      console.error("Template fetch failed", err);
    }
  };

  loadTemplate();
}, [selectedTemplate]);

  
  // Payment state
  const [paymentTab, setPaymentTab] = useState('manual'); // 'manual' or 'cards'
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentData, setPaymentData] = useState({
    paidDate: new Date().toISOString().split('T')[0],
    paidAmount: '',
    paymentMethod: 'Other',
    note: '',
  });
  const [savingPayment, setSavingPayment] = useState(false);

  const [recurringData, setRecurringData] = useState({
    frequency: 'weekly',
    startDate: new Date().toISOString().split('T')[0],
    startOption: 'useThis', 
    stopOption: 'never', 
    stopDate: '',
    emailTo: '',
    sendCopy: false,
    emailSubject: 'Invoice',
    emailText: `Dear Customer,

Please find the attached invoice.

Thank you!

If you need assistance or have any questions, please email: support@invoicepro.com`,
  });
  const [savingRecurring, setSavingRecurring] = useState(false);
  const [hasExistingRecurring, setHasExistingRecurring] = useState(false);
  const [loadingRecurringData, setLoadingRecurringData] = useState(false);

  const currentUser = getCurrentUser();
  const userEmail = currentUser?.email || '';

  const clientEmail = currentInvoice?.billTo?.email || currentInvoice?.client?.email || '';

  // Load existing recurring data when invoice changes
  useEffect(() => {
    // Temporarily disabled to prevent multiple calls
    // if (currentInvoice?._id) {
    //   loadRecurringData();
    // }
  }, [currentInvoice?._id]);

  // Set default email to client email if available and no email is set
  useEffect(() => {
    if (clientEmail && !recurringData.emailTo) {
      setRecurringData(prev => ({ ...prev, emailTo: clientEmail }));
    }
  }, [clientEmail, recurringData.emailTo]);

  // Update emailData.to when clientEmail changes (after invoice is sent and email is saved)
  useEffect(() => {
    if (clientEmail) {
      setEmailData(prev => ({ ...prev, to: clientEmail }));
    }
  }, [clientEmail]);

  // Update email subject with actual invoice number when invoice changes
  useEffect(() => {
    if (currentInvoice && currentInvoice._id) {
      const invoiceNumber = currentInvoice?.invoiceNumber || 
                           currentInvoice?.invoiceMeta?.invoiceNo || 
                           currentInvoice?.number || 
                           currentInvoice?.invoiceMeta?.number ||
                           'INV-001';
      
      setRecurringData(prev => ({
        ...prev,
        emailSubject: `Invoice ${invoiceNumber}`
      }));
    }
  }, [currentInvoice?._id]); // Only depend on _id to avoid multiple calls

  // Load existing recurring data
  const loadRecurringData = async () => {
    const invoiceToUse = currentInvoice || invoice;
    const invoiceId = invoiceToUse?._id || invoiceToUse?.id;
    
    if (!invoiceId || loadingRecurringData) {
      return;
    }
    
    setLoadingRecurringData(true);
    try {
      const response = await getRecurringInvoice(invoiceId);
      if (response.success && response.data) {
        const recurringInvoice = response.data;
        setRecurringData({
          frequency: recurringInvoice.frequency,
          startDate: new Date(recurringInvoice.startDate).toISOString().split('T')[0],
          startOption: recurringInvoice.startOption,
          stopOption: recurringInvoice.stopOption,
          stopDate: recurringInvoice.stopDate ? new Date(recurringInvoice.stopDate).toISOString().split('T')[0] : '',
          emailTo: recurringInvoice.emailTo,
          sendCopy: recurringInvoice.sendCopy,
          emailSubject: recurringInvoice.emailSubject,
          emailText: recurringInvoice.emailText
        });
        setHasExistingRecurring(true);
      } else {
        setHasExistingRecurring(false);
      }
    } catch (error) {
      console.error('Failed to load recurring data:', error);
      setHasExistingRecurring(false);
    } finally {
      setLoadingRecurringData(false);
    }
  };

  // Handle recurring invoice save
  const handleSaveRecurring = async () => {
    const invoiceToUse = currentInvoice || invoice;
    const invoiceId = invoiceToUse?._id || invoiceToUse?.id;
    
    if (!invoiceId) {
      alert('Invoice not found. Please try again.');
      return;
    }
    
    if (!recurringData.emailTo.trim()) {
      alert('Please enter an email address');
      return;
    }

    if (recurringData.frequency === 'never') {
      // Just save the "never" setting to disable recurring
      setSavingRecurring(true);
      try {
        await createRecurringInvoice(invoiceId, { frequency: 'never' });
        alert('Recurring invoice disabled successfully');
        // Refresh the recurring data to update status
        await loadRecurringData();
      } catch (error) {
        console.error('Failed to disable recurring:', error);
        alert('Failed to disable recurring invoice: ' + error.message);
      } finally {
        setSavingRecurring(false);
      }
      return;
    }

    // Validate required fields for active recurring
    if (!recurringData.startDate) {
      alert('Please select a start date');
      return;
    }

    if (!recurringData.emailSubject.trim()) {
      alert('Please enter an email subject');
      return;
    }

    if (!recurringData.emailText.trim()) {
      alert('Please enter an email message');
      return;
    }

    if (recurringData.stopOption === 'onDate' && !recurringData.stopDate) {
      alert('Please select a stop date');
      return;
    }

    if (recurringData.stopOption === 'onDate' && 
        new Date(recurringData.stopDate) <= new Date(recurringData.startDate)) {
      alert('Stop date must be after start date');
      return;
    }

    setSavingRecurring(true);
    try {
      const response = await createRecurringInvoice(invoiceId, recurringData);
      if (response.success) {
        alert('Recurring invoice settings saved successfully!');
        // Refresh the recurring data to update status
        await loadRecurringData();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to save recurring settings:', error);
      alert('Failed to save recurring settings: ' + error.message);
    } finally {
      setSavingRecurring(false);
    }
  };
  
  const invoiceNum = currentInvoice?.invoiceNumber || currentInvoice?.invoiceMeta?.invoiceNo || currentInvoice?.number || '';

  const [emailData, setEmailData] = useState({
    from: userEmail, 
    to: clientEmail,
    sendCopy: false,
    subject: `Invoice ${invoiceNum}`,
    message: `Dear Customer,

Please find the attached invoice for your reference.

Thank you for your business!

Best regards`,
    attachments: [],
  });
  const [sendingEmail, setSendingEmail] = useState(false);
  const [copying, setCopying] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const paymentMethods = ['Cash', 'Check', 'Credit Card', 'Debit Card', 'Bank Transfer', 'UPI', 'Other'];
  
  const frequencyOptions = [
    { value: 'never', label: 'Never (disable recurring)' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Biweekly (every 2 weeks)' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'bimonthly', label: 'Bimonthly (every 2 months)' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  const handleTabChange = async (actionId) => {
    if (actionId === 'delete') {
      setActiveAction('delete');
      return;
    }
    
    if (actionId === 'copy') {
      setActiveAction('copy');
      return;
    }
    
    if (actionId === 'download') {
      setActiveAction('download');
      return;
    }
    
    if (actionId === 'payments') {
      setActiveAction('payments');
      await loadPaymentDetails();
      return;
    }
    
    setActiveAction(actionId);
  };

  const loadPaymentDetails = async () => {
    const invoiceId = currentInvoice?._id || currentInvoice?.id;
    if (!invoiceId) {
      return;
    }

    try {
      const response = await paymentAPI.getPaymentDetails(invoiceId);
      
      if (response && response.success) {
        const paymentDetails = response.data;
        
        const updatedInvoice = {
          ...currentInvoice,
          paymentStatus: paymentDetails.paymentStatus,
          paidAmount: paymentDetails.paidAmount,
          paidDate: paymentDetails.paidDate,
          paymentMethod: paymentDetails.paymentMethod,
          paymentNote: paymentDetails.paymentNote,
          balanceDue: paymentDetails.balanceDue
        };
        
        setCurrentInvoice(updatedInvoice);
      }
    } catch (error) {
    }
  };

  const handleDeleteInvoice = async () => {
    setDeleting(true);
    try {
      await invoiceAPI.delete(currentInvoice._id || currentInvoice.id);
      onClose && onClose();
    } catch (err) {
      alert('Failed to delete invoice: ' + err.message);
      setDeleting(false);
    }
  };

  const handleDownloadPDF = async () => {
    setLoading(true);
    setLoadingAction('download');
    
    try {
      await generatePDF(true);
    } catch (error) {
      alert('Failed to generate PDF: ' + error.message);
    } finally {
      setLoading(false);
      setLoadingAction(null);
    }
  };

  const generatePDF = async (forDownload = false) => {
    if (!templateRef.current) return null;
    
    try {
      const canvas = await html2canvas(templateRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      if (forDownload) {
        const invoiceNumber = previewData.number || previewData.invoiceNumber || 'INV-001';
        const filename = `Invoice-${invoiceNumber}.pdf`;
        
        pdf.save(filename);
        return true;
      } else {
        return pdf.output('datauristring');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleSendEmail = async () => {
    const invoiceId = currentInvoice?._id || currentInvoice?.id || invoice?._id || invoice?.id;
    
    if (!invoiceId) {
      alert('Invoice not found. Please try again.');
      return;
    }

    if (!emailData.to) {
      alert('Please enter recipient email address.');
      return;
    }

    setSendingEmail(true);
    
    try {
      let pdfBase64 = null;
      try {
        const pdfDataUri = await generatePDF(false); // false = for email (base64)
        if (pdfDataUri) {
          pdfBase64 = `data:application/pdf;base64,${pdfDataUri.split(',')[1]}`;
        }
      } catch (pdfError) {
      }
      
      const response = await invoiceAPI.sendEmail(invoiceId, {
        to: emailData.to,
        subject: emailData.subject,
        message: emailData.message,
        sendCopy: emailData.sendCopy,
        pdfBase64,
      });
      
      if (response && response.success) {
        // Refresh invoice data to get the saved email
        try {
          const updatedInvoice = await invoiceAPI.getById(invoiceId);
          if (updatedInvoice.success && updatedInvoice.data) {
            setCurrentInvoice(updatedInvoice.data);
            if (onInvoiceUpdated) {
              onInvoiceUpdated(updatedInvoice.data);
            }
          }
        } catch (refreshError) {
          console.error('Failed to refresh invoice:', refreshError);
        }
        setActiveAction('invoice');
      } else {
        alert('Failed to send email: ' + (response?.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to send email: ' + (err?.message || 'Unknown error'));
    } finally {
      setSendingEmail(false);
    }
  };

  const handleInvoiceSaved = (updatedInvoice) => {
    setCurrentInvoice(updatedInvoice);
    setActiveAction('invoice');
    onInvoiceUpdated && onInvoiceUpdated(updatedInvoice);
  };

  const handleSavePayment = async () => {
    if (!paymentData.paidAmount || parseFloat(paymentData.paidAmount) <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    const invoiceId = currentInvoice?._id || currentInvoice?.id;
    if (!invoiceId) {
      alert('Invoice not found. Please try again.');
      return;
    }

    setSavingPayment(true);
    
    try {
      const paidAmount = parseFloat(paymentData.paidAmount);
      const totalAmount = currentInvoice?.total || currentInvoice?.totals?.grandTotal || 0;
      
      let paymentStatus = 'unpaid';
      if (paidAmount >= totalAmount) {
        paymentStatus = 'paid';
      } else if (paidAmount > 0) {
        paymentStatus = 'partiallyPaid';
      }

      const response = await paymentAPI.updatePaymentStatus(invoiceId, {
        paymentStatus,
        paidAmount,
        paidDate: paymentData.paidDate,
        paymentMethod: paymentData.paymentMethod,
        paymentNote: paymentData.note
      });

      if (response && response.success) {
        const updatedInvoice = {
          ...currentInvoice,
          paymentStatus: response.data.paymentStatus || paymentStatus,
          paidAmount: response.data.paidAmount || paidAmount,
          paidDate: paymentData.paidDate,
          balanceDue: response.data.balanceDue || Math.max(0, totalAmount - paidAmount),
          paymentMethod: paymentData.paymentMethod,
          paymentNote: paymentData.note
        };

        setCurrentInvoice(updatedInvoice);
        
        if (onInvoiceUpdated) {
          onInvoiceUpdated(updatedInvoice);
        }

        setShowPaymentForm(false);
      } else {
        throw new Error(response?.message || 'Failed to save payment');
      }
    } catch (error) {
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        alert('Payment API not available. Please check if the server is running and try again.');
      } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        alert('You are not authorized to perform this action. Please log in again.');
      } else {
        alert('Failed to save payment: ' + error.message);
      }
    } finally {
      setSavingPayment(false);
    }
  };

  const handleEditPayment = () => {
    setPaymentData({
      paidDate: currentInvoice?.paidDate ? new Date(currentInvoice.paidDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      paidAmount: currentInvoice?.paidAmount?.toString() || '',
      paymentMethod: currentInvoice?.paymentMethod || 'Other',
      note: currentInvoice?.paymentNote || '',
    });
    setShowPaymentForm(true);
  };

  const handleSetAsUnpaid = async () => {
    if (!confirm('Are you sure you want to set this invoice as unpaid? This will remove the payment record.')) {
      return;
    }

    const invoiceId = currentInvoice?._id || currentInvoice?.id;
    if (!invoiceId) {
      alert('Invoice not found. Please try again.');
      return;
    }

    try {
      const response = await paymentAPI.updatePaymentStatus(invoiceId, {
        paymentStatus: 'unpaid'
      });

      if (response && response.success) {
        const updatedInvoice = {
          ...currentInvoice,
          paymentStatus: 'unpaid',
          paidAmount: 0,
          paidDate: null,
          balanceDue: currentInvoice?.total || currentInvoice?.totals?.grandTotal || 0,
          paymentMethod: null,
          paymentNote: null
        };

        setCurrentInvoice(updatedInvoice);
        
        if (onInvoiceUpdated) {
          onInvoiceUpdated(updatedInvoice);
        }

        setPaymentData({
          paidDate: new Date().toISOString().split('T')[0],
          paidAmount: '',
          paymentMethod: 'Other',
          note: '',
        });
        setShowPaymentForm(false);
      } else {
        throw new Error(response?.message || 'Failed to set as unpaid');
      }
    } catch (error) {
      // Check if it's a network/server error
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        alert('Payment API not available. Please check if the server is running and try again.');
      } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        alert('You are not authorized to perform this action. Please log in again.');
      } else {
        alert('Failed to set as unpaid: ' + error.message);
      }
    }
  };

  // Pass currentInvoice directly to templates - invoiceDefaults.js handles the mapping
  const previewData = currentInvoice || {
    number: 'INV-001',
    date: new Date().toLocaleDateString('en-GB'),
    items: [],
    total: 0,
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
      {/* Action Tabs */}
      <InvoiceActionTabs
        activeTab={activeAction}
        onTabChange={handleTabChange}
        onClose={onClose}
        loading={loading}
        loadingAction={loadingAction}
      />

      {/* Invoice Preview Content */}
      {activeAction === 'invoice' && (
        <div className="p-6">
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm flex justify-center">
            <div
                className="origin-top"
                style={{
                  transform: activeAction === "invoice" ? "scale(0.6)" : "scale(1)",
                }}
              >
              {(() => {
                const TemplateComponent = templates[selectedTemplate];
                return (
                  <TemplateComponent
                    data={previewData}
                    editorMode
                    backendLayout={templateMeta?.layout}
                    background={templateMeta?.background}
                    templateId={templateMeta?._id}
                  />
                );

              })()}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <a href="#" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
              <Download className="w-4 h-4" />
              First Page Preview Only, Click to Download PDF File
            </a>
          </div>
        </div>
      )}

      {/* Edit View - Shows InvoiceForm inline */}
      {activeAction === 'edit' && (
        <div className="p-4">
          <InvoiceForm 
            documentType="invoice"
            documentLabel="Invoice"
            editInvoice={currentInvoice}
            onSave={handleInvoiceSaved}
          />
        </div>
      )}

      {/* Select Template View */}
      {activeAction === 'template' && (
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Select a Template</h3>
          <div className="grid grid-cols-3 gap-5 max-h-[70vh] overflow-y-auto pr-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
              const TemplateComponent = templates[num];
              return (
                <div 
                  key={num}
                  onClick={() => {
                    setSelectedTemplate(num);
                    setActiveAction('invoice');
                  }}
                  className={`rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-xl bg-white ${
                    selectedTemplate === num 
                      ? 'ring-3 ring-indigo-500 shadow-lg' 
                      : 'shadow-md hover:ring-2 hover:ring-indigo-300'
                  }`}
                  style={{ width: '220px', height: '340px' }}
                >
                  <div 
                    className="overflow-hidden"
                    style={{ width: '220px', height: '311px' }}
                  >
                    <div 
                      style={{ 
                        transform: 'scale(0.277)', 
                        transformOrigin: 'top left', 
                        width: '794px', 
                        height: '1123px' 
                      }}
                    >
                      <TemplateComponent
                        data={previewData}
                        editorMode={true}
                        backendLayout={templateMeta?.layout}
                        background={templateMeta?.background}
                      />
                    </div>
                  </div>
                  <p className={`text-center text-sm py-2 font-medium ${
                    selectedTemplate === num 
                      ? 'bg-indigo-500 text-white' 
                      : 'bg-slate-50 text-slate-600'
                  }`}>
                    Template {num} {selectedTemplate === num && '(Current)'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Payments View */}
      {activeAction === 'payments' && (
        <div>
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-semibold text-lg">Payment Management</h2>
                  <p className="text-slate-400 text-sm">Record and track payments for this invoice</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sub Tabs */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPaymentTab('manual')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  paymentTab === 'manual'
                    ? 'bg-gradient-to-r from-indigo-600 to-emerald-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Manual Payments
              </button>
              <button
                onClick={() => setPaymentTab('cards')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  paymentTab === 'cards'
                    ? 'bg-gradient-to-r from-indigo-600 to-emerald-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Start Accepting Cards
                <span className="flex gap-1">
                  <span className="w-6 h-4 bg-blue-700 rounded text-white text-[6px] flex items-center justify-center font-bold">VISA</span>
                  <span className="w-6 h-4 bg-orange-500 rounded text-white text-[6px] flex items-center justify-center font-bold">MC</span>
                </span>
              </button>
            </div>
          </div>

          {paymentTab === 'manual' ? (
            <div className="p-6">
              {/* Payment Status Display */}
              {currentInvoice?.paymentStatus === 'paid' ? (
                <div className="text-center">
                  <p className="text-lg font-medium text-emerald-700 mb-4">
                    This invoice of {formatCurrency(currentInvoice?.total || currentInvoice?.totals?.grandTotal || 0, currentInvoice?.currency || currentInvoice?.invoiceMeta?.currency || 'INR')} was paid on {currentInvoice?.paidDate ? new Date(currentInvoice.paidDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')}.
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={handleEditPayment}
                      className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors"
                    >
                      Edit Payment
                    </button>
                    <span className="text-slate-400">|</span>
                    <button
                      onClick={handleSetAsUnpaid}
                      className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors"
                    >
                      Set as Unpaid
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`rounded-xl border p-6 mb-6 ${
                  currentInvoice?.paymentStatus === 'partiallyPaid' 
                    ? 'bg-amber-50 border-amber-200' 
                    : 'bg-slate-50 border-slate-200'
                }`}>
                  <p className={`text-lg font-medium text-center ${
                    currentInvoice?.paymentStatus === 'partiallyPaid' ? 'text-amber-700' : 'text-slate-700'
                  }`}>
                    This invoice of {formatCurrency(currentInvoice?.total || currentInvoice?.totals?.grandTotal || 0, currentInvoice?.currency || currentInvoice?.invoiceMeta?.currency || 'INR')} is {currentInvoice?.paymentStatus || 'unpaid'}.
                    {currentInvoice?.invoiceMeta?.dueDate && (
                      <span> It's due on {new Date(currentInvoice.invoiceMeta.dueDate).toLocaleDateString('en-GB')}.</span>
                    )}
                  </p>
                  
                  <div className="text-center mt-4">
                    <button
                      onClick={() => setShowPaymentForm(!showPaymentForm)}
                      className="text-slate-700 font-medium underline hover:text-indigo-600 transition-colors"
                    >
                      {showPaymentForm ? 'Hide Form' : 'Set as Paid'}
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Form Card */}
              {showPaymentForm && (
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                      {currentInvoice?.paymentStatus === 'paid' ? 'Edit Payment' : 'Record Payment'}
                    </h4>
                    <button
                      onClick={() => setShowPaymentForm(false)}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Paid Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="date"
                          value={paymentData.paidDate}
                          onChange={(e) => setPaymentData({ ...paymentData, paidDate: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Paid Amount</label>
                      <input
                        type="number"
                        value={paymentData.paidAmount}
                        onChange={(e) => setPaymentData({ ...paymentData, paidAmount: e.target.value })}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Payment Method</label>
                      <select
                        value={paymentData.paymentMethod}
                        onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      >
                        {paymentMethods.map((method) => (
                          <option key={method} value={method}>{method}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Note (Optional)</label>
                      <input
                        type="text"
                        value={paymentData.note}
                        onChange={(e) => setPaymentData({ ...paymentData, note: e.target.value })}
                        placeholder="Payment note"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-6">
                    <button
                      onClick={handleSavePayment}
                      disabled={savingPayment || !paymentData.paidAmount}
                      className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-emerald-500 hover:shadow-lg disabled:opacity-50 text-white font-medium rounded-lg transition-all"
                    >
                      {savingPayment ? 'Saving...' : 'Save Payment'}
                    </button>
                    <button
                      onClick={() => setShowPaymentForm(false)}
                      className="px-6 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6">
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Accept Card Payments</h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                  Enable your customers to pay invoices directly with credit/debit cards via Stripe or Razorpay.
                </p>
                <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
                  Setup Payment Gateway
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recurring View */}
      {activeAction === 'recurring' && (
        <div>
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-semibold text-lg">Recurring Invoice</h2>
                  <p className="text-slate-400 text-sm">Schedule automatic invoice generation</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm ${
                hasExistingRecurring && recurringData.frequency !== 'never' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-slate-700 text-slate-300'
              }`}>
                {hasExistingRecurring && recurringData.frequency !== 'never' ? 'Active' : 'Inactive'}
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Frequency Card */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 p-6 mb-6">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">Frequency</h4>
              <p className="text-xs text-slate-400 mb-4">How often should this invoice repeat?</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {frequencyOptions.map((option) => (
                  <label 
                    key={option.value} 
                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                      recurringData.frequency === option.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="frequency"
                      value={option.value}
                      checked={recurringData.frequency === option.value}
                      onChange={(e) => setRecurringData({ ...recurringData, frequency: e.target.value })}
                      className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {recurringData.frequency !== 'never' && (
              <>
                {/* Schedule Card */}
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 p-6 mb-6">
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Schedule</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Start Date */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Start Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="date"
                          value={recurringData.startDate}
                          onChange={(e) => setRecurringData({ ...recurringData, startDate: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                      </div>
                      <div className="mt-3 space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="startOption"
                            value="useThis"
                            checked={recurringData.startOption === 'useThis'}
                            onChange={(e) => setRecurringData({ ...recurringData, startOption: e.target.value })}
                            className="w-4 h-4 text-indigo-600"
                          />
                          <span className="text-sm text-slate-600">Use this invoice on start date</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="startOption"
                            value="createNew"
                            checked={recurringData.startOption === 'createNew'}
                            onChange={(e) => setRecurringData({ ...recurringData, startOption: e.target.value })}
                            className="w-4 h-4 text-indigo-600"
                          />
                          <span className="text-sm text-slate-600">Create new invoice on start date</span>
                        </label>
                      </div>
                    </div>

                    {/* Stop Date */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Stop Date</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="stopOption"
                            value="never"
                            checked={recurringData.stopOption === 'never'}
                            onChange={(e) => setRecurringData({ ...recurringData, stopOption: e.target.value })}
                            className="w-4 h-4 text-indigo-600"
                          />
                          <span className="text-sm text-slate-600">Never (repeat indefinitely)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="stopOption"
                            value="onDate"
                            checked={recurringData.stopOption === 'onDate'}
                            onChange={(e) => setRecurringData({ ...recurringData, stopOption: e.target.value })}
                            className="w-4 h-4 text-indigo-600"
                          />
                          <span className="text-sm text-slate-600">On a specific date</span>
                        </label>
                      </div>
                      {recurringData.stopOption === 'onDate' && (
                        <div className="mt-3">
                          <input
                            type="date"
                            value={recurringData.stopDate}
                            onChange={(e) => setRecurringData({ ...recurringData, stopDate: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Email Template Card */}
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 p-6 mb-6">
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">Email Template</h4>
                  <p className="text-xs text-slate-400 mb-4">This email will be sent with every recurring invoice</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">To</label>
                      <input
                        type="text"
                        value={recurringData.emailTo}
                        onChange={(e) => setRecurringData({ ...recurringData, emailTo: e.target.value })}
                        placeholder="customer@email.com, another@email.com"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                      <label className="flex items-center gap-2 mt-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={recurringData.sendCopy}
                          onChange={(e) => setRecurringData({ ...recurringData, sendCopy: e.target.checked })}
                          className="w-4 h-4 text-indigo-600 rounded"
                        />
                        <span className="text-sm text-slate-600">Send me a copy</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Subject</label>
                      <input
                        type="text"
                        value={recurringData.emailSubject}
                        onChange={(e) => setRecurringData({ ...recurringData, emailSubject: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                      <p className="text-xs text-slate-400 mt-1">The invoice number is automatically included in the subject</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Message</label>
                      <textarea
                        value={recurringData.emailText}
                        onChange={(e) => setRecurringData({ ...recurringData, emailText: e.target.value })}
                        rows={5}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-emerald-600">
                      <span className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                      PDF invoice will be attached automatically
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={handleSaveRecurring}
                  disabled={savingRecurring || (recurringData.frequency !== 'never' && !recurringData.emailTo)}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {savingRecurring ? 'Saving...' : (recurringData.frequency === 'never' ? 'Disable Recurring' : 'Set as Recurring')}
                </button>
              </>
            )}

            {recurringData.frequency === 'never' && (
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-200 flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Recurring is Disabled</h3>
                <p className="text-slate-500">Select a frequency above to enable automatic invoice generation.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Email View */}
      {activeAction === 'email' && (
        <div>
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg">Send Invoice</h2>
                <p className="text-slate-400 text-sm">Email this invoice to your customer</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* From & To Card */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 p-6 mb-6">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Recipients</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">From</label>
                  <input
                    type="email"
                    value={emailData.from}
                    disabled
                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-400 mt-1">Email will be sent from your registered account</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">To</label>
                  <input
                    type="email"
                    value={emailData.to}
                    onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                    placeholder="customer@email.com"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <label className="flex items-center gap-2 mt-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailData.sendCopy}
                      onChange={(e) => setEmailData({ ...emailData, sendCopy: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-600">Send me a copy</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Subject & Message Card */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 p-6 mb-6">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Email Content</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Subject</label>
                  <input
                    type="text"
                    value={emailData.subject}
                    onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Message</label>
                  <textarea
                    value={emailData.message}
                    onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Attachments Card */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 p-6 mb-6">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">Attachments</h4>
              <p className="text-xs text-slate-400 mb-4">Invoice PDF will be attached automatically</p>

              {/* Invoice Preview Thumbnail */}
              <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-slate-200 mb-4">
                <div className="w-20 h-28 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden flex-shrink-0">
                  <div className="transform scale-[0.08] origin-top-left w-[1250%] h-[1250%]">
                    {(() => {
                      const TemplateComponent = templates[selectedTemplate];
                      return (
                        <TemplateComponent
                          data={previewData}
                          editorMode={true}
                          backendLayout={templateMeta?.layout}
                          background={templateMeta?.background}
                          templateId={templateMeta?._id}
                        />
                      );
                    })()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-slate-700 truncate">
                      Invoice-{previewData.number || 'INV-001'}.pdf
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">PDF • Auto-attached</p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    <span className="text-xs text-emerald-600">Will be generated and attached</span>
                  </div>
                </div>
              </div>

              {/* Additional Attachments */}
              {emailData.attachments.length > 0 && (
                <div className="space-y-2 mb-4">
                  {emailData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-700">{file.name}</span>
                        <span className="text-xs text-slate-400">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button
                        onClick={() => {
                          const newAttachments = [...emailData.attachments];
                          newAttachments.splice(index, 1);
                          setEmailData({ ...emailData, attachments: newAttachments });
                        }}
                        className="p-1 hover:bg-slate-100 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all">
                <Upload className="w-5 h-5 text-slate-400" />
                <span className="text-sm text-slate-500">Add more attachments</span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setEmailData({ ...emailData, attachments: [...emailData.attachments, ...files] });
                    e.target.value = '';
                  }}
                />
              </label>
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendEmail}
              disabled={sendingEmail || !emailData.to}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {sendingEmail ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Send Email
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Copy View */}
      {activeAction === 'copy' && (
        <div className="p-6">
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 p-12 text-center">
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Duplicate this invoice to create a new one
            </h3>
            <p className="text-slate-500 mb-8">
              Change the customer or items afterwards
            </p>
            
            {/* Document Icons */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-20 bg-white border-2 border-slate-300 rounded-lg shadow-sm flex items-center justify-center">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <ArrowRight className="w-6 h-6 text-slate-400" />
              <div className="w-16 h-20 bg-white border-2 border-indigo-500 rounded-lg shadow-md flex items-center justify-center relative">
                <FileText className="w-8 h-8 text-indigo-500" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">+</span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={async () => {
                  setCopying(true);
                  try {
                    const response = await invoiceAPI.copy(currentInvoice._id || currentInvoice.id);
                    if (response.success) {
                      alert('Invoice copied successfully! You can find it in My Invoices.');
                      onClose && onClose();
                    }
                  } catch (err) {
                    alert('Failed to copy invoice: ' + err.message);
                  } finally {
                    setCopying(false);
                  }
                }}
                disabled={copying}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {copying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Copying...
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy Now
                  </>
                )}
              </button>
              <span className="text-slate-400">or</span>
              <button
                onClick={() => setActiveAction('invoice')}
                className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete View */}
      {activeAction === 'delete' && (
        <div className="p-6">
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 p-12 text-center">
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Delete this invoice
            </h3>
            <p className="text-slate-500 mb-8">
              Invoice will be moved to the Trash, okay?
            </p>
            
            {/* Document to Trash Icons */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-20 bg-white border-2 border-red-300 rounded-lg shadow-sm flex items-center justify-center">
                <FileText className="w-8 h-8 text-red-400" />
              </div>
              <ArrowRight className="w-6 h-6 text-slate-400" />
              <div className="w-16 h-20 bg-white border-2 border-slate-300 rounded-lg shadow-sm flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-slate-400" />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleDeleteInvoice}
                disabled={deleting}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    Delete Now
                  </>
                )}
              </button>
              <span className="text-slate-400">or</span>
              <button
                onClick={() => setActiveAction('invoice')}
                className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download View */}
      {activeAction === 'download' && (
        <div className="p-6">
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 p-12 text-center">
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Download Invoice PDF
            </h3>
            <p className="text-slate-500 mb-8">
              Generate and download a PDF copy of this invoice
            </p>
            
            {/* Document to Download Icons */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-20 bg-white border-2 border-slate-300 rounded-lg shadow-sm flex items-center justify-center">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <ArrowRight className="w-6 h-6 text-slate-400" />
              <div className="w-16 h-20 bg-white border-2 border-green-500 rounded-lg shadow-md flex items-center justify-center relative">
                <FileText className="w-8 h-8 text-green-500" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <Download className="w-2 h-2 text-white" />
                </div>
              </div>
            </div>
            
            {/* File Info */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 mb-8 max-w-sm mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-red-500" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-800">Invoice-{previewData.number || 'INV-001'}.pdf</p>
                  <p className="text-sm text-slate-500">PDF Document • A4 Size</p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleDownloadPDF}
                disabled={loading && loadingAction === 'download'}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading && loadingAction === 'download' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download PDF
                  </>
                )}
              </button>
              <span className="text-slate-400">or</span>
              <button
                onClick={() => setActiveAction('invoice')}
                className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Template for PDF Generation */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={templateRef}>
          {(() => {
            const TemplateComponent = templates[selectedTemplate];
              return (
                <TemplateComponent
                  data={previewData}
                  editorMode={false}
                  backendLayout={templateMeta?.layout}
                  background={templateMeta?.background}
                />
              );
          })()}
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
