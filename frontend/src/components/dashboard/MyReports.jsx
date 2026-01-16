import { useState, useEffect } from 'react';
import { BarChart3, Filter, Loader2, Calendar, FileText, Download, Printer, Search } from 'lucide-react';

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportFilter, setReportFilter] = useState('all');
  
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [status, setStatus] = useState('all');
  const [documentType, setDocumentType] = useState('all');

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
     
      const sampleData = [
        { id: 1, customer: 'infrabuild pvt ltd andheri easr, mumbai 400069', document: 'Invoice', number: 'BFA-221', date: '06/01/2026', subtotal: 9450.00, tax: 1134.00, paidAmount: 0.00, total: 10584.00 },
        { id: 2, customer: 'infrabuild pvt ltd andheri easr, mumbai 400069', document: 'Invoice', number: 'BFA-220', date: '06/01/2026', subtotal: 9450.00, tax: 1134.00, paidAmount: 0.00, total: 10584.00 },
        { id: 3, customer: '', document: 'Invoice', number: 'BFA-222', date: '06/01/2026', subtotal: 9450.00, tax: 1134.00, paidAmount: 10584.00, total: 10584.00 },
      ];
      setReports(sampleData);
    } catch (err) {
      setError('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const getFilteredReports = () => {
    let filtered = reports;
    
    if (reportFilter === 'lastMonth') {
      filtered = reports; 
    } else if (reportFilter === 'lastQuarter') {
      filtered = reports;
    }
    
    return filtered;
  };

  const filteredReports = getFilteredReports();

  const totalSubtotal = reports.reduce((sum, r) => sum + r.subtotal, 0);
  const totalTax = reports.reduce((sum, r) => sum + r.tax, 0);
  const totalPaidAmount = reports.reduce((sum, r) => sum + r.paidAmount, 0);
  const totalAmount = reports.reduce((sum, r) => sum + r.total, 0);

  const reportFilters = [
    { id: 'all', label: 'All Invoices', count: reports.length },
    { id: 'lastMonth', label: 'Last Month' },
    { id: 'lastQuarter', label: 'Last Quarter' },
  ];

  const handleSearch = () => {
    fetchReports();
  };

  const handleExportPDF = () => {
    alert('Export to PDF - Coming soon!');
  };

  const handleExportExcel = () => {
    alert('Export to Excel - Coming soon!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-400 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">My Reports</h2>
              <p className="text-slate-400 text-sm">View and export your invoice reports</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Filter className="w-4 h-4" />
            <span className="text-sm">{filteredReports.length} records</span>
          </div>
        </div>
      </div>

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

      {/* Filter Tabs & Export Buttons */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            {reportFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setReportFilter(filter.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  reportFilter === filter.id
                    ? 'bg-gradient-to-r from-indigo-600 to-emerald-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter.label}
                {filter.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    reportFilter === filter.id ? 'bg-white/20 text-white' : 'bg-slate-400 text-white'
                  }`}>
                    {filter.count}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
            >
              <FileText className="w-4 h-4 text-red-500" />
              Export to PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
            >
              <FileText className="w-4 h-4 text-emerald-500" />
              Export to Excel
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              Print
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <span className="ml-3 text-slate-500">Loading reports...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchReports}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <BarChart3 className="w-16 h-16 text-slate-300 mb-4" />
          <p className="text-slate-500">No reports found</p>
        </div>
      ) : (
        <>
          {/* Reports Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Customer</th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Document</th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Number</th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                  <th className="p-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Subtotal</th>
                  <th className="p-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Tax</th>
                  <th className="p-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Paid Amount</th>
                  <th className="p-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report, index) => (
                  <tr 
                    key={report.id} 
                    className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                    }`}
                  >
                    <td className="p-4 text-sm text-slate-700 font-medium max-w-[200px]">{report.customer || '—'}</td>
                    <td className="p-4 text-sm text-slate-600">{report.document}</td>
                    <td className="p-4 text-sm text-slate-600">{report.number}</td>
                    <td className="p-4 text-sm text-slate-600">{report.date}</td>
                    <td className="p-4 text-sm text-slate-700 text-right">
                      {report.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-sm text-slate-700 text-right">
                      {report.tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-sm text-right">
                      <span className={report.paidAmount > 0 ? 'text-emerald-600 font-medium' : 'text-slate-600'}>
                        {report.paidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-700 text-right font-medium">
                      {report.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Row */}
          <div className="bg-gradient-to-br from-slate-50 to-white p-4 border-t-2 border-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700 uppercase">Total INR</span>
              <div className="flex items-center gap-8">
                <span className="text-sm font-bold text-slate-700">
                  {totalSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-sm font-bold text-slate-700">
                  {totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-sm font-bold text-emerald-600">
                  {totalPaidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyReports;
