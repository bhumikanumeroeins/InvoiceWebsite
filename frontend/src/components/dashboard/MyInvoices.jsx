import { useState, useEffect } from 'react';
import { FileText, Filter, Loader2 } from 'lucide-react';
import { invoiceAPI, getUploadsUrl } from '../../services/api';

const MyInvoices = ({ onInvoiceClick }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [invoiceFilter, setInvoiceFilter] = useState('all');

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await invoiceAPI.getAll();
      
      // Transform backend data to frontend format
      const transformedInvoices = (response.data || []).map(inv => ({
        id: inv._id,
        _id: inv._id,
        customer: inv.client?.name || '',
        number: inv.invoiceMeta?.invoiceNo || '',
        date: inv.invoiceMeta?.invoiceDate 
          ? new Date(inv.invoiceMeta.invoiceDate).toLocaleDateString('en-GB') 
          : '',
        dueDate: inv.invoiceMeta?.dueDate 
          ? new Date(inv.invoiceMeta.dueDate).toLocaleDateString('en-GB') 
          : '',
        paid: 0, // Backend doesn't track payments yet
        total: inv.totals?.grandTotal || 0,
        status: 'unpaid', // Backend doesn't track status yet
        // Data for preview
        logo: inv.business?.logo ? `${getUploadsUrl()}/uploads/${inv.business.logo}` : null,
        companyName: inv.business?.name || '',
        companyAddress: `${inv.business?.address || ''}\n${inv.business?.phone || ''}, ${inv.business?.email || ''}`,
        billTo: {
          name: inv.client?.name || '',
          address: `${inv.client?.address || ''}\n${inv.client?.email || ''}`,
        },
        shipTo: inv.shipTo?.shippingAddress ? {
          name: '',
          address: inv.shipTo.shippingAddress,
        } : null,
        invoiceNumber: inv.invoiceMeta?.invoiceNo || '',
        invoiceDate: inv.invoiceMeta?.invoiceDate 
          ? new Date(inv.invoiceMeta.invoiceDate).toLocaleDateString('en-GB') 
          : '',
        items: (inv.items || []).map(item => ({
          qty: item.quantity || 1,
          description: item.description || '',
          unitPrice: item.rate || 0,
          amount: item.amount || 0,
        })),
        terms: (inv.terms || []).map(t => t.text),
        subtotal: inv.totals?.subtotal || 0,
        taxAmount: inv.totals?.taxTotal || 0,
        paymentInfo: {
          bankName: inv.payment?.bankName || '',
          accountNo: inv.payment?.accountNo || '',
          ifscCode: inv.payment?.ifscCode || '',
        },
        signature: inv.signature ? `${getUploadsUrl()}/uploads/${inv.signature}` : null,
        qrCode: inv.payment?.qrCode ? `${getUploadsUrl()}/uploads/${inv.payment.qrCode}` : null,
      }));
      
      setInvoices(transformedInvoices);
    } catch (err) {
      console.error('Fetch invoices error:', err);
      setError('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const getFilteredInvoices = () => {
    switch (invoiceFilter) {
      case 'paid': return invoices.filter(inv => inv.status === 'paid');
      case 'unpaid': return invoices.filter(inv => inv.status === 'unpaid');
      case 'partial': return invoices.filter(inv => inv.status === 'partial');
      case 'overdue': return invoices.filter(inv => inv.status === 'overdue');
      case 'sent': return invoices.filter(inv => inv.status === 'sent');
      case 'trash': return invoices.filter(inv => inv.status === 'trash');
      default: return invoices;
    }
  };

  const getFilterCounts = () => ({
    all: invoices.length,
    overdue: invoices.filter(inv => inv.status === 'overdue').length,
    partial: invoices.filter(inv => inv.status === 'partial').length,
    unpaid: invoices.filter(inv => inv.status === 'unpaid').length,
    paid: invoices.filter(inv => inv.status === 'paid').length,
    sent: invoices.filter(inv => inv.status === 'sent').length,
    trash: invoices.filter(inv => inv.status === 'trash').length,
  });

  const filterCounts = getFilterCounts();
  const filteredInvoices = getFilteredInvoices();

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidAmount = invoices.reduce((sum, inv) => sum + inv.paid, 0);
  const balanceDue = totalAmount - paidAmount;

  const invoiceFilters = [
    { id: 'all', label: 'All Invoices', color: 'bg-slate-500' },
    { id: 'overdue', label: 'Overdue', color: 'bg-orange-500' },
    { id: 'partial', label: 'Partially Paid', color: 'bg-amber-500' },
    { id: 'unpaid', label: 'Unpaid', color: 'bg-blue-500' },
    { id: 'paid', label: 'Paid', color: 'bg-emerald-500' },
    { id: 'sent', label: 'Sent by Email', color: 'bg-indigo-500' },
    { id: 'trash', label: 'Trash', color: 'bg-slate-500' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-400 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">My Invoices</h2>
              <p className="text-slate-400 text-sm">Manage and track all your invoices</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Filter className="w-4 h-4" />
            <span className="text-sm">{filteredInvoices.length} invoices</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-2 flex-wrap">
          {invoiceFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setInvoiceFilter(filter.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                invoiceFilter === filter.id
                  ? 'bg-gradient-to-r from-indigo-600 to-emerald-500 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                invoiceFilter === filter.id 
                  ? 'bg-white/20 text-white' 
                  : `${filter.color} text-white`
              }`}>
                {filterCounts[filter.id]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <span className="ml-3 text-slate-500">Loading invoices...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchInvoices}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <FileText className="w-16 h-16 text-slate-300 mb-4" />
          <p className="text-slate-500">No invoices found</p>
        </div>
      ) : (
        <>
          {/* Invoice Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-left w-10">
                    <input type="checkbox" className="rounded border-slate-300" />
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Customer</th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Number</th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Paid</th>
                  <th className="p-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice, index) => (
                  <tr 
                    key={invoice.id}
                    onClick={() => onInvoiceClick && onInvoiceClick(invoice)}
                    className={`border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${
                      index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                    }`}
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="rounded border-slate-300" />
                    </td>
                    <td className="p-4 text-sm text-slate-700 font-medium">{invoice.customer || '—'}</td>
                    <td className="p-4 text-sm text-slate-600">{invoice.number}</td>
                    <td className="p-4 text-sm text-slate-600">{invoice.date}</td>
                    <td className="p-4 text-sm">
                      <span className={`font-medium ${invoice.paid > 0 ? 'text-emerald-600' : 'text-orange-500'}`}>
                        ₹ {invoice.paid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-700 text-right font-medium">
                      ₹ {invoice.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-br from-slate-50 to-white p-6 border-t border-slate-200">
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Total</p>
                <p className="text-xl font-bold text-slate-800">₹ {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Paid Amount</p>
                <p className="text-xl font-bold text-emerald-600">₹ {paidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Balance Due</p>
                <p className="text-xl font-bold text-orange-500">₹ {balanceDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyInvoices;
