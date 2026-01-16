import { useState, useEffect } from 'react';
import { Users, Filter, Loader2 } from 'lucide-react';
import { customerAPI } from '../../services/invoiceService';

const MyCustomers = ({ onCustomerClick, refreshKey }) => {
  const [customers, setCustomers] = useState([]);
  const [summary, setSummary] = useState({ totalAmount: 0, paidAmount: 0, balanceDue: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customerFilter, setCustomerFilter] = useState('all');

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await customerAPI.getAll();
      if (response.success) {
        setCustomers(response.data || []);
        setSummary(response.summary || { totalAmount: 0, paidAmount: 0, balanceDue: 0 });
      } else {
        setError(response.message || 'Failed to fetch customers');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [refreshKey]);

  const getFilteredCustomers = () => {
    switch (customerFilter) {
      case 'overdue': return customers.filter(c => c.paymentStatus === 'overdue');
      case 'unpaid': return customers.filter(c => c.paymentStatus === 'unpaid');
      case 'partial': return customers.filter(c => c.paymentStatus === 'partiallyPaid');
      case 'paid': return customers.filter(c => c.paymentStatus === 'paid');
      default: return customers;
    }
  };

  const getFilterCounts = () => ({
    all: customers.length,
    overdue: customers.filter(c => c.paymentStatus === 'overdue').length,
    unpaid: customers.filter(c => c.paymentStatus === 'unpaid').length,
    partial: customers.filter(c => c.paymentStatus === 'partiallyPaid').length,
    paid: customers.filter(c => c.paymentStatus === 'paid').length,
  });

  const filterCounts = getFilterCounts();
  const filteredCustomers = getFilteredCustomers();

  const { totalAmount, paidAmount, balanceDue } = summary;

  const customerFilters = [
    { id: 'all', label: 'All Customers', color: 'bg-slate-500' },
    { id: 'overdue', label: 'Overdue', color: 'bg-orange-500' },
    { id: 'unpaid', label: 'Unpaid', color: 'bg-blue-500' },
    { id: 'partial', label: 'Partially Paid', color: 'bg-amber-500' },
    { id: 'paid', label: 'Paid', color: 'bg-emerald-500' },
  ];

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'paid': return <span className="text-emerald-600 font-medium">Paid</span>;
      case 'unpaid': return <span className="text-orange-500 font-medium">Unpaid</span>;
      case 'partiallyPaid': return <span className="text-amber-500 font-medium">Partial</span>;
      case 'overdue': return <span className="text-red-500 font-medium">Overdue</span>;
      default: return <span className="text-slate-500">—</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-400 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">My Customers</h2>
              <p className="text-slate-400 text-sm">Manage and track all your customers</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Filter className="w-4 h-4" />
            <span className="text-sm">{filteredCustomers.length} customers</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-2 flex-wrap">
          {customerFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setCustomerFilter(filter.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                customerFilter === filter.id
                  ? 'bg-gradient-to-r from-indigo-600 to-emerald-500 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                customerFilter === filter.id 
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
          <span className="ml-3 text-slate-500">Loading customers...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchCustomers}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Users className="w-16 h-16 text-slate-300 mb-4" />
          <p className="text-slate-500">No customers found</p>
        </div>
      ) : (
        <>
          {/* Customer Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Customer</th>
                  <th className="p-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Documents</th>
                  <th className="p-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Payments</th>
                  <th className="p-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Paid Amount</th>
                  <th className="p-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer, index) => (
                  <tr 
                    key={customer.client?.email || index} 
                    onClick={() => onCustomerClick && onCustomerClick(customer)}
                    className={`border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${
                      index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                    }`}
                  >
                    <td className="p-4">
                      <div className="text-sm text-slate-700 font-medium">{customer.client?.name || '—'}</div>
                      {customer.client?.email && (
                        <div className="text-xs text-slate-400">{customer.client.email}</div>
                      )}
                    </td>
                    <td className="p-4 text-sm text-slate-600 text-center">{customer.documents || 0}</td>
                    <td className="p-4 text-sm text-center">{getPaymentBadge(customer.paymentStatus)}</td>
                    <td className="p-4 text-sm text-right">
                      <span className={customer.paidAmount > 0 ? 'text-emerald-600 font-medium' : 'text-slate-600'}>
                        ₹ {(customer.paidAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-700 text-right font-medium">
                      ₹ {(customer.totals?.grandTotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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

export default MyCustomers;
