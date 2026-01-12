import { useState, useEffect } from 'react';
import { UserPlus, FileText, Filter, Loader2, Calendar, Search, Download } from 'lucide-react';

const NewCustomer = ({ customer }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('documents');
  
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [status, setStatus] = useState('all');
  const [documentType, setDocumentType] = useState('all');

  const customerName = customer?.customer || 'New Customer';

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const sampleData = customer ? [
        { id: 1, customer: customer.customer, number: 'BFA-222', date: '06/01/2026', paid: customer.paidAmount || 0, total: customer.total || 10584.00 },
      ] : [];
      setDocuments(sampleData);
    } catch (err) {
      setError('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [customer]);

  const totalAmount = documents.reduce((sum, d) => sum + d.total, 0);
  const paidAmount = documents.reduce((sum, d) => sum + d.paid, 0);
  const balanceDue = totalAmount - paidAmount;

  const handleSearch = () => {
    fetchDocuments();
  };

  const tabs = [
    { id: 'documents', label: "New Customer's Documents", count: documents.length, icon: FileText },
    { id: 'statement', label: 'Customer Statement', icon: FileText, isDownload: true },
  ];

  const handleDownloadStatement = () => {
    alert('Customer Statement PDF download - Coming soon after backend integration!');
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-400 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">{customerName}</h2>
              <p className="text-slate-400 text-sm">View customer documents and statements</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Filter className="w-4 h-4" />
            <span className="text-sm">{documents.length} documents</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            tab.isDownload ? (
              <button
                key={tab.id}
                onClick={handleDownloadStatement}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <Download className="w-4 h-4" />
                {tab.label}
              </button>
            ) : (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-emerald-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-400 text-white'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            )
          ))}
        </div>
      </div>

      {activeTab === 'documents' && (
        <>
          {/* Search Filters */}
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <div className="grid grid-cols-5 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Date From</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Date To</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">--All--</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="partial">Partially Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Document</label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">--All--</option>
                  <option value="invoice">Invoice</option>
                  <option value="tax-invoice">Tax Invoice</option>
                  <option value="quote">Quote</option>
                  <option value="receipt">Receipt</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              <span className="ml-3 text-slate-500">Loading documents...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-red-500 mb-4">{error}</p>
              <button 
                onClick={fetchDocuments}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Retry
              </button>
            </div>
          ) : documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FileText className="w-16 h-16 text-slate-300 mb-4" />
              <p className="text-slate-500">No documents found</p>
            </div>
          ) : (
            <>
              {/* Documents Table */}
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
                      <th className="p-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Paid</th>
                      <th className="p-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc, index) => (
                      <tr 
                        key={doc.id} 
                        className={`border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                        }`}
                      >
                        <td className="p-4">
                          <input type="checkbox" className="rounded border-slate-300" />
                        </td>
                        <td className="p-4 text-sm text-slate-700 font-medium">{doc.customer || '—'}</td>
                        <td className="p-4 text-sm text-slate-600">{doc.number}</td>
                        <td className="p-4 text-sm text-slate-600">{doc.date}</td>
                        <td className="p-4 text-sm text-right">
                          <span className={doc.paid > 0 ? 'text-emerald-600 font-medium' : 'text-orange-500'}>
                            ₹ {doc.paid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-700 text-right font-medium">
                          ₹ {doc.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-br from-slate-50 to-white p-6 border-t border-slate-200">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-slate-700 uppercase">Total</span>
                    <span className="font-bold text-slate-800">{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} INR</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-slate-700 uppercase">Paid Amount</span>
                    <span className="font-bold text-emerald-600">{paidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} INR</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-slate-700 uppercase">Balance Due</span>
                    <span className="font-bold text-orange-500">{balanceDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })} INR</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

    </div>
  );
};

export default NewCustomer;
