import { useState } from 'react';
import { CreditCard, RefreshCw, Download, Mail, Calendar, Paperclip, FileText, Upload, X } from 'lucide-react';
import Template1 from '../templates/Template1';
import Template2 from '../templates/Template2';
import Template3 from '../templates/Template3';
import Template4 from '../templates/Template4';
import Template5 from '../templates/Template5';
import InvoiceForm from '../invoice/InvoiceForm';
import InvoiceActionTabs from '../invoice/InvoiceActionTabs';
import { invoiceAPI } from '../../services/invoiceService';

const templates = {
  1: Template1,
  2: Template2,
  3: Template3,
  4: Template4,
  5: Template5,
};

const InvoicePreview = ({ invoice, onClose, onInvoiceUpdated }) => {
  const [activeAction, setActiveAction] = useState('invoice');
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [currentInvoice, setCurrentInvoice] = useState(invoice);
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);
  
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
    emailSubject: 'Invoice #number',
    emailText: `Dear Customer,

Please find the attached invoice.

Thank you!

If you need assistance or have any questions, please email: support@invoicepro.com`,
  });
  const [savingRecurring, setSavingRecurring] = useState(false);

  const [emailData, setEmailData] = useState({
    from: 'user@example.com', 
    to: currentInvoice?.billTo?.email || '',
    sendCopy: false,
    subject: `Invoice ${currentInvoice?.invoiceNumber || currentInvoice?.number || ''}`,
    message: `Dear Customer,

Please find the attached invoice for your reference.

Thank you for your business!

Best regards`,
    attachments: [],
  });
  const [sendingEmail, setSendingEmail] = useState(false);

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
      if (confirm('Are you sure you want to move this invoice to trash?')) {
        setLoading(true);
        setLoadingAction('delete');
        try {
          await invoiceAPI.delete(currentInvoice._id || currentInvoice.id);
          onClose && onClose();
        } catch (err) {
          alert('Failed to delete invoice: ' + err.message);
        } finally {
          setLoading(false);
          setLoadingAction(null);
        }
      }
      return;
    }
    
    if (actionId === 'copy') {
      alert('Invoice copied! (Backend integration pending)');
      return;
    }
    
    if (actionId === 'download') {
      alert('PDF download will start (Backend integration pending)');
      return;
    }
    
    setActiveAction(actionId);
  };

  const handleInvoiceSaved = (updatedInvoice) => {
    setCurrentInvoice(updatedInvoice);
    setActiveAction('invoice');
    onInvoiceUpdated && onInvoiceUpdated(updatedInvoice);
  };

  const previewData = currentInvoice ? {
    logo: currentInvoice.logo || currentInvoice.business?.logo,
    companyName: currentInvoice.companyName || currentInvoice.business?.name || '',
    companyAddress: currentInvoice.companyAddress || currentInvoice.business?.address || '',
    billTo: currentInvoice.billTo || {
      name: currentInvoice.client?.name || '',
      address: currentInvoice.client?.address || '',
      email: currentInvoice.client?.email || '',
    },
    shipTo: currentInvoice.shipTo || (currentInvoice.shipTo?.shippingAddress ? {
      address: currentInvoice.shipTo.shippingAddress,
    } : null),
    invoiceNumber: currentInvoice.invoiceNumber || currentInvoice.invoiceMeta?.invoiceNo || currentInvoice.number || '',
    invoiceDate: currentInvoice.invoiceDate || currentInvoice.invoiceMeta?.invoiceDate || currentInvoice.date || '',
    dueDate: currentInvoice.dueDate || currentInvoice.invoiceMeta?.dueDate || '',
    items: (currentInvoice.items || []).map(item => ({
      qty: item.qty || item.quantity || 1,
      description: item.description || '',
      unitPrice: item.unitPrice || item.rate || 0,
      amount: item.amount || 0,
    })),
    terms: Array.isArray(currentInvoice.terms) 
      ? currentInvoice.terms.map(t => typeof t === 'string' ? t : t.text)
      : [],
    subtotal: currentInvoice.subtotal || currentInvoice.totals?.subtotal || 0,
    taxAmount: currentInvoice.taxAmount || currentInvoice.totals?.taxTotal || 0,
    total: currentInvoice.total || currentInvoice.totals?.grandTotal || 0,
    paymentInfo: currentInvoice.paymentInfo || currentInvoice.payment || {},
    signature: currentInvoice.signature,
    qrCode: currentInvoice.qrCode || currentInvoice.payment?.qrCode,
    number: currentInvoice.number || currentInvoice.invoiceMeta?.invoiceNo || currentInvoice.invoiceNumber || '',
    date: currentInvoice.date || currentInvoice.invoiceMeta?.invoiceDate || currentInvoice.invoiceDate || '',
  } : {
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
            <div className="transform scale-[0.6] origin-top">
              {(() => {
                const TemplateComponent = templates[selectedTemplate];
                return <TemplateComponent data={previewData} />;
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
          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <div 
                key={num}
                onClick={() => {
                  setSelectedTemplate(num);
                  setActiveAction('invoice');
                }}
                className={`border-2 rounded-lg p-2 cursor-pointer transition-all hover:shadow-lg ${
                  selectedTemplate === num ? 'border-indigo-500 shadow-md' : 'border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="aspect-[3/4] bg-slate-100 rounded overflow-hidden">
                  <div className="transform scale-[0.15] origin-top-left w-[667%] h-[667%]">
                    {(() => {
                      const TemplateComponent = templates[num];
                      return <TemplateComponent data={previewData} />;
                    })()}
                  </div>
                </div>
                <p className="text-center text-sm text-slate-600 mt-2">Template {num}</p>
              </div>
            ))}
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
              {/* Invoice Status Card */}
              <div className={`rounded-xl border p-6 mb-6 ${
                currentInvoice?.paymentStatus === 'paid' 
                  ? 'bg-emerald-50 border-emerald-200' 
                  : 'bg-amber-50 border-amber-200'
              }`}>
                <p className={`text-lg font-medium text-center ${
                  currentInvoice?.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  This invoice of ₹ {(currentInvoice?.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })} is {currentInvoice?.paymentStatus || 'unpaid'}.
                  {currentInvoice?.dueDate && currentInvoice?.paymentStatus !== 'paid' && (
                    <span> It's due on {currentInvoice.dueDate}.</span>
                  )}
                </p>
                
                {currentInvoice?.paymentStatus !== 'paid' && (
                  <div className="text-center mt-4">
                    <button
                      onClick={() => setShowPaymentForm(!showPaymentForm)}
                      className="text-slate-700 font-medium underline hover:text-indigo-600 transition-colors"
                    >
                      {showPaymentForm ? 'Hide Form' : 'Set as Paid'}
                    </button>
                  </div>
                )}
              </div>

              {/* Payment Form Card */}
              {showPaymentForm && currentInvoice?.paymentStatus !== 'paid' && (
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 p-6 mb-6">
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Record Payment</h4>
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
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        alert('Payment saved! (API integration pending)');
                        setShowPaymentForm(false);
                      }}
                      disabled={savingPayment || !paymentData.paidAmount}
                      className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-emerald-500 hover:shadow-lg disabled:opacity-50 text-white font-medium rounded-lg transition-all"
                    >
                      {savingPayment ? 'Saving...' : 'Save Payment'}
                    </button>
                  </div>
                </div>
              )}

              {/* Payment History */}
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Payment History</h4>
                </div>
                {currentInvoice?.payments && currentInvoice.payments.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {currentInvoice.payments.map((payment, index) => (
                      <div key={index} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-700">{payment.paymentMethod}</p>
                            <p className="text-xs text-slate-500">{payment.paidDate} {payment.note && `• ${payment.note}`}</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-emerald-600">
                          + ₹ {payment.paidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No payments recorded yet</p>
                  </div>
                )}
              </div>
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
              <div className="px-3 py-1 rounded-full bg-slate-700 text-slate-300 text-sm">
                {recurringData.frequency === 'never' ? 'Inactive' : 'Active'}
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
                      <p className="text-xs text-slate-400 mt-1">Tip: <span className="text-indigo-600">#number</span> will be replaced with invoice number</p>
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
                  onClick={() => {
                    alert('Recurring settings saved! (API integration pending)');
                  }}
                  disabled={savingRecurring || !recurringData.emailTo}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {savingRecurring ? 'Saving...' : 'Set as Recurring'}
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
                      return <TemplateComponent data={previewData} />;
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
              onClick={() => {
                setSendingEmail(true);
                setTimeout(() => {
                  alert('Email sent successfully! (API integration pending)');
                  setSendingEmail(false);
                }, 1000);
              }}
              disabled={sendingEmail || !emailData.to}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              {sendingEmail ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicePreview;
