import { useState, useEffect } from 'react';
import { currencyService } from '../../services/currencyService';
import { FileText, Filter, Loader2, Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import { invoiceAPI } from '../../services/invoiceService';
import { getUploadsUrl } from '../../services/apiConfig';

const MyInvoices = ({ onInvoiceClick, refreshKey }) => {
  const [invoices, setInvoices] = useState([]);
  const [trashInvoices, setTrashInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [invoiceFilter, setInvoiceFilter] = useState('all');

  // Helper function to format currency amount
  const formatCurrency = (amount, currencyCode) => {
    const symbol = currencyService.getSymbol(currencyCode || 'INR');
    const locale = currencyCode === 'USD' ? 'en-US' : 'en-IN';
    return `${symbol} ${amount.toLocaleString(locale, { minimumFractionDigits: 2 })}`;
  };
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [restoring, setRestoring] = useState(false);

  // Transform invoice data from backend format
  const transformInvoice = (inv, isTrash = false) => {
    const statusMap = {
      'unpaid': 'unpaid',
      'partiallyPaid': 'partial',
      'paid': 'paid',
    };
    const status = isTrash ? 'trash' : (statusMap[inv.paymentStatus] || 'unpaid');
    
    const total = inv.totals?.grandTotal || 0;
    let paid = 0;
    if (status === 'paid') paid = total;
    else if (status === 'partial') paid = total * 0.5;
    
    return {
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
      deletedAt: inv.deletedAt 
        ? new Date(inv.deletedAt).toLocaleDateString('en-GB') 
        : '',
      paid: paid,
      total: total,
      currency: inv.invoiceMeta?.currency || 'INR',
      status: status,
      paymentStatus: inv.paymentStatus || 'unpaid',
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
        quantity: item.quantity || 1,
        description: item.description || '',
        rate: item.rate || 0,
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
      qrCode: inv.qrCode ? `${getUploadsUrl()}/uploads/${inv.qrCode}` : null,
    };
  };

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch both active and trash invoices
      const [activeResponse, trashResponse] = await Promise.all([
        invoiceAPI.getAll(),
        invoiceAPI.getTrash()
      ]);
      
      const transformedInvoices = (activeResponse.data || []).map(inv => transformInvoice(inv, false));
      const transformedTrash = (trashResponse.data || []).map(inv => transformInvoice(inv, true));
      
      setInvoices(transformedInvoices);
      setTrashInvoices(transformedTrash);
    } catch (err) {
      console.error('Fetch invoices error:', err);
      setError('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  // Refetch when component mounts or refreshKey changes
  useEffect(() => {
    fetchInvoices();
  }, [refreshKey]);

  // Handle checkbox selection
  const handleSelectInvoice = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    const currentIds = filteredInvoices.map(inv => inv.id);
    const allSelected = currentIds.every(id => selectedIds.includes(id));
    
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !currentIds.includes(id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...currentIds])]);
    }
  };

  // Move to trash (soft delete)
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    
    if (!confirm(`Are you sure you want to move ${selectedIds.length} invoice(s) to trash?`)) {
      return;
    }

    setDeleting(true);
    try {
      await Promise.all(selectedIds.map(id => invoiceAPI.delete(id)));
      
      // Move deleted invoices to trash state
      const deletedInvoices = invoices.filter(inv => selectedIds.includes(inv.id));
      const updatedTrash = [...deletedInvoices.map(inv => ({ ...inv, status: 'trash', deletedAt: new Date().toLocaleDateString('en-GB') })), ...trashInvoices];
      
      setInvoices(prev => prev.filter(inv => !selectedIds.includes(inv.id)));
      setTrashInvoices(updatedTrash);
      setSelectedIds([]);
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete some invoices. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  // Restore from trash
  const handleRestoreSelected = async () => {
    if (selectedIds.length === 0) return;

    setRestoring(true);
    try {
      await Promise.all(selectedIds.map(id => invoiceAPI.restore(id)));
      
      // Move restored invoices back to active
      const restoredInvoices = trashInvoices.filter(inv => selectedIds.includes(inv.id));
      const updatedInvoices = [...restoredInvoices.map(inv => ({ ...inv, status: inv.paymentStatus === 'paid' ? 'paid' : inv.paymentStatus === 'partiallyPaid' ? 'partial' : 'unpaid' })), ...invoices];
      
      setTrashInvoices(prev => prev.filter(inv => !selectedIds.includes(inv.id)));
      setInvoices(updatedInvoices);
      setSelectedIds([]);
    } catch (err) {
      console.error('Restore error:', err);
      alert('Failed to restore some invoices. Please try again.');
    } finally {
      setRestoring(false);
    }
  };

  // Permanent delete
  const handlePermanentDelete = async () => {
    if (selectedIds.length === 0) return;
    
    if (!confirm(`Are you sure you want to PERMANENTLY delete ${selectedIds.length} invoice(s)? This cannot be undone!`)) {
      return;
    }

    setDeleting(true);
    try {
      await Promise.all(selectedIds.map(id => invoiceAPI.permanentDelete(id)));
      
      setTrashInvoices(prev => prev.filter(inv => !selectedIds.includes(inv.id)));
      setSelectedIds([]);
    } catch (err) {
      console.error('Permanent delete error:', err);
      alert('Failed to permanently delete some invoices. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const getFilteredInvoices = () => {
    if (invoiceFilter === 'trash') {
      return trashInvoices;
    }
    switch (invoiceFilter) {
      case 'paid': return invoices.filter(inv => inv.status === 'paid');
      case 'unpaid': return invoices.filter(inv => inv.status === 'unpaid');
      case 'partial': return invoices.filter(inv => inv.status === 'partial');
      case 'overdue': return invoices.filter(inv => inv.status === 'overdue');
      case 'sent': return invoices.filter(inv => inv.status === 'sent');
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
    trash: trashInvoices.length,
  });

  const filterCounts = getFilterCounts();
  const filteredInvoices = getFilteredInvoices();
  const isTrashView = invoiceFilter === 'trash';

  // Calculate totals from FILTERED invoices, not all invoices
  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidAmount = filteredInvoices.reduce((sum, inv) => sum + inv.paid, 0);
  const balanceDue = totalAmount - paidAmount;

  const invoiceFilters = [
    { id: 'all', label: 'All Invoices', color: 'bg-slate-500' },
    { id: 'overdue', label: 'Overdue', color: 'bg-orange-500' },
    { id: 'partial', label: 'Partially Paid', color: 'bg-amber-500' },
    { id: 'unpaid', label: 'Unpaid', color: 'bg-blue-500' },
    { id: 'paid', label: 'Paid', color: 'bg-emerald-500' },
    { id: 'sent', label: 'Sent by Email', color: 'bg-indigo-500' },
    { id: 'trash', label: 'Trash', color: 'bg-red-500' },
  ];

  // Clear selection when switching filters
  useEffect(() => {
    setSelectedIds([]);
  }, [invoiceFilter]);

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isTrashView ? 'bg-gradient-to-br from-red-500 to-orange-400' : 'bg-gradient-to-br from-indigo-500 to-emerald-400'}`}>
              {isTrashView ? <Trash2 className="w-5 h-5 text-white" /> : <FileText className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">{isTrashView ? 'Trash' : 'My Invoices'}</h2>
              <p className="text-slate-400 text-sm">{isTrashView ? 'Deleted invoices can be restored or permanently deleted' : 'Manage and track all your invoices'}</p>
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
                  ? filter.id === 'trash' 
                    ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg'
                    : 'bg-gradient-to-r from-indigo-600 to-emerald-500 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter.id === 'trash' && <Trash2 className="w-4 h-4" />}
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
        
        {/* Action Buttons */}
        {selectedIds.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
            {isTrashView ? (
              <>
                <button
                  onClick={handleRestoreSelected}
                  disabled={restoring}
                  className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                >
                  <RotateCcw className="w-4 h-4" />
                  {restoring ? 'Restoring...' : `Restore Selected (${selectedIds.length})`}
                </button>
                <button
                  onClick={handlePermanentDelete}
                  disabled={deleting}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                >
                  <AlertTriangle className="w-4 h-4" />
                  {deleting ? 'Deleting...' : `Delete Forever (${selectedIds.length})`}
                </button>
              </>
            ) : (
              <button
                onClick={handleDeleteSelected}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {deleting ? 'Moving to trash...' : `Move to Trash (${selectedIds.length})`}
              </button>
            )}
          </div>
        )}
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
          {isTrashView ? (
            <>
              <Trash2 className="w-16 h-16 text-slate-300 mb-4" />
              <p className="text-slate-500">Trash is empty</p>
            </>
          ) : (
            <>
              <FileText className="w-16 h-16 text-slate-300 mb-4" />
              <p className="text-slate-500">No invoices found</p>
            </>
          )}
        </div>
      ) : (
        <>
          {/* Invoice Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-left w-10">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300"
                      checked={filteredInvoices.length > 0 && filteredInvoices.every(inv => selectedIds.includes(inv.id))}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Customer</th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Number</th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{isTrashView ? 'Deleted On' : 'Date'}</th>
                  {!isTrashView && <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Paid</th>}
                  <th className="p-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice, index) => (
                  <tr 
                    key={invoice.id}
                    onClick={() => !isTrashView && onInvoiceClick && onInvoiceClick(invoice)}
                    className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${!isTrashView ? 'cursor-pointer' : ''} ${
                      index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                    }`}
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300"
                        checked={selectedIds.includes(invoice.id)}
                        onChange={() => handleSelectInvoice(invoice.id)}
                      />
                    </td>
                    <td className="p-4 text-sm text-slate-700 font-medium">{invoice.customer || '—'}</td>
                    <td className="p-4 text-sm text-slate-600">{invoice.number}</td>
                    <td className="p-4 text-sm text-slate-600">{isTrashView ? invoice.deletedAt : invoice.date}</td>
                    {!isTrashView && (
                      <td className="p-4 text-sm">
                        <span className={`font-medium ${invoice.paid > 0 ? 'text-emerald-600' : 'text-orange-500'}`}>
                          {formatCurrency(invoice.paid, invoice.currency)}
                        </span>
                      </td>
                    )}
                    <td className="p-4 text-sm text-slate-700 text-right font-medium">
                      {formatCurrency(invoice.total, invoice.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary - only show for non-trash view */}
          {!isTrashView && (
            <div className="bg-gradient-to-br from-slate-50 to-white p-6 border-t border-slate-200">
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Total</p>
                  <p className="text-xl font-bold text-slate-800">{formatCurrency(totalAmount, 'INR')}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Paid Amount</p>
                  <p className="text-xl font-bold text-emerald-600">{formatCurrency(paidAmount, 'INR')}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Balance Due</p>
                  <p className="text-xl font-bold text-orange-500">{formatCurrency(balanceDue, 'INR')}</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyInvoices;
