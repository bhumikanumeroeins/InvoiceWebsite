import { useState } from 'react';
import { FileText, Edit, Layout, Mail, Copy, Trash2, CreditCard, RefreshCw, Download, X } from 'lucide-react';
import Template1 from '../templates/Template1';
import Template2 from '../templates/Template2';
import Template3 from '../templates/Template3';
import Template4 from '../templates/Template4';
import Template5 from '../templates/Template5';

const templates = {
  1: Template1,
  2: Template2,
  3: Template3,
  4: Template4,
  5: Template5,
};

const InvoicePreview = ({ invoice, onClose, onEdit }) => {
  const [activeAction, setActiveAction] = useState('invoice');
  const [selectedTemplate, setSelectedTemplate] = useState(1);

  const actions = [
    { id: 'invoice', label: 'Invoice', icon: FileText },
    { id: 'edit', label: 'Edit', icon: Edit },
    { id: 'template', label: 'Select Template', icon: Layout },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'copy', label: 'Copy', icon: Copy },
    { id: 'delete', label: 'Delete', icon: Trash2, danger: true },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'recurring', label: 'Recurring', icon: RefreshCw },
    { id: 'download', label: 'Download', icon: Download },
  ];

  const handleAction = (actionId) => {
    setActiveAction(actionId);
    
    switch (actionId) {
      case 'edit':
        onEdit && onEdit(invoice);
        break;
      case 'copy':
        alert('Invoice copied! (Backend integration pending)');
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this invoice?')) {
          alert('Invoice deleted! (Backend integration pending)');
          onClose && onClose();
        }
        break;
      case 'email':
        alert('Email dialog will open (Backend integration pending)');
        break;
      case 'download':
        alert('PDF download will start (Backend integration pending)');
        break;
      default:
        break;
    }
  };

  // Sample invoice data for preview - use actual invoice data if available
  const previewData = invoice ? {
    logo: invoice.logo,
    companyName: invoice.companyName,
    companyAddress: invoice.companyAddress,
    billTo: invoice.billTo,
    shipTo: invoice.shipTo,
    invoiceNumber: invoice.invoiceNumber || invoice.number,
    invoiceDate: invoice.invoiceDate || invoice.date,
    dueDate: invoice.dueDate,
    items: invoice.items || [],
    terms: invoice.terms || [],
    subtotal: invoice.subtotal || 0,
    taxAmount: invoice.taxAmount || 0,
    total: invoice.total || 0,
    paymentInfo: invoice.paymentInfo,
    signature: invoice.signature,
    qrCode: invoice.qrCode,
    number: invoice.number || invoice.invoiceNumber,
    date: invoice.date || invoice.invoiceDate,
  } : {
    number: 'BFA-227',
    date: '12/01/2026',
    dueDate: '27/01/2026',
    companyName: 'infrabuild pvt ltd 12 bailey road, patna 800014',
    billTo: {
      name: 'infrabuild pvt ltd andheri east,',
      address: 'mumbai 400069'
    },
    items: [],
    total: 0.00,
    logo: null,
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
      {/* Action Tabs */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-1 flex-wrap">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleAction(action.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-all ${
                activeAction === action.id
                  ? 'bg-white text-slate-800 shadow border border-slate-200'
                  : action.danger
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-slate-600 hover:bg-white hover:shadow-sm'
              }`}
            >
              <action.icon className="w-4 h-4" />
              {action.label}
            </button>
          ))}
          {onClose && (
            <button
              onClick={onClose}
              className="ml-auto p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Invoice Preview Content */}
      {activeAction === 'invoice' && (
        <div className="p-6">
          {/* Invoice Preview Frame - Using actual template */}
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm flex justify-center">
            <div className="transform scale-[0.6] origin-top">
              {(() => {
                const TemplateComponent = templates[selectedTemplate];
                return <TemplateComponent data={previewData} />;
              })()}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-4 flex items-center justify-between">
            <a href="#" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
              <Download className="w-4 h-4" />
              First Page Preview Only, Click to Download PDF File
            </a>
            <a href="#" className="text-blue-600 text-sm hover:underline">
              Remove Powered by Invoice Home
            </a>
          </div>
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
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Payment History</h3>
          <div className="bg-slate-50 rounded-lg p-8 text-center">
            <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No payments recorded yet</p>
            <button className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-lg text-sm font-medium">
              Record Payment
            </button>
          </div>
        </div>
      )}

      {/* Recurring View */}
      {activeAction === 'recurring' && (
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recurring Invoice Settings</h3>
          <div className="bg-slate-50 rounded-lg p-8 text-center">
            <RefreshCw className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Set up recurring invoices</p>
            <button className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-lg text-sm font-medium">
              Enable Recurring
            </button>
          </div>
        </div>
      )}

      {/* Email View */}
      {activeAction === 'email' && (
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Send Invoice via Email</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">To</label>
              <input 
                type="email" 
                placeholder="customer@email.com"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
              <input 
                type="text" 
                defaultValue={`Invoice ${previewData.number}`}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
              <textarea 
                rows={4}
                placeholder="Add a message..."
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
            <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-lg font-medium flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              Send Email
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicePreview;
