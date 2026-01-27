import { useState, useEffect } from 'react';
import { currencyService } from '../../services/currencyService';
import { BarChart3, Filter, Loader2, Calendar, FileText, Printer, Search } from 'lucide-react';
import { reportsAPI } from '../../services/reportsService';
import jsPDF from 'jspdf';

const MyReports = ({ onInvoiceClick }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportFilter, setReportFilter] = useState('all');

  // Helper function to get currency symbol
  const getCurrencySymbol = (currencyCode) => {
    return currencyService.getSymbol(currencyCode || 'INR');
  };

  // Helper function to format currency amount
  const formatCurrency = (amount, currencyCode) => {
    const symbol = getCurrencySymbol(currencyCode);
    const locale = currencyCode === 'USD' ? 'en-US' : 'en-IN';
    return `${symbol} ${amount.toLocaleString(locale, { minimumFractionDigits: 2 })}`;
  };
  const [totals, setTotals] = useState({
    subtotal: 0,
    tax: 0,
    paidAmount: 0,
    total: 0,
    count: 0
  });
  
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [status, setStatus] = useState('all');
  const [documentType, setDocumentType] = useState('all');

  const fetchReports = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await reportsAPI.getReports({
        dateFrom: filters.dateFrom || dateFrom,
        dateTo: filters.dateTo || dateTo,
        status: filters.status || status,
        documentType: filters.documentType || documentType,
        quickFilter: filters.quickFilter || null,
        page: 1,
        limit: 50
      });

      if (response.success) {
        setReports(response.data.reports);
        setTotals(response.data.totals);
      } else {
        throw new Error(response.message || 'Failed to fetch reports');
      }
    } catch (err) {
      console.error('Fetch reports error:', err);
      setError(err.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleQuickFilter = (filterId) => {
    setReportFilter(filterId);
    
    if (filterId === 'all') {
      // Clear date filters for "All Invoices"
      setDateFrom('');
      setDateTo('');
      fetchReports({ quickFilter: null });
    } else {
      // Use quick filter
      fetchReports({ quickFilter: filterId });
    }
  };

  const handleSearch = () => {
    fetchReports({
      dateFrom,
      dateTo,
      status,
      documentType
    });
  };

  const totalSubtotal = totals.subtotal || 0;
  const totalTax = totals.tax || 0;
  const totalPaidAmount = totals.paidAmount || 0;
  const totalAmount = totals.total || 0;

  const reportFilters = [
    { id: 'all', label: 'All Invoices', count: totals.count },
    { id: 'lastMonth', label: 'Last Month' },
    { id: 'lastQuarter', label: 'Last Quarter' },
  ];

  const handleExportPDF = async () => {
    try {
      const response = await reportsAPI.exportReports({
        dateFrom,
        dateTo,
        status,
        documentType,
        quickFilter: reportFilter !== 'all' ? reportFilter : null
      }, 'json');

      if (response.success) {
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Invoice Reports', 20, 25);
        
        // Add filter info
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        let yPos = 40;
        
        if (dateFrom || dateTo) {
          const dateRange = `Date Range: ${dateFrom || 'Start'} to ${dateTo || 'End'}`;
          doc.text(dateRange, 20, yPos);
          yPos += 6;
        }
        
        if (status !== 'all') {
          doc.text(`Status: ${status}`, 20, yPos);
          yPos += 6;
        }
        
        if (documentType !== 'all') {
          doc.text(`Document Type: ${documentType}`, 20, yPos);
          yPos += 6;
        }
        
        if (reportFilter !== 'all') {
          const filterLabel = reportFilters.find(f => f.id === reportFilter)?.label || reportFilter;
          doc.text(`Quick Filter: ${filterLabel}`, 20, yPos);
          yPos += 6;
        }
        
        yPos += 10;
        
        // Table headers
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        const headers = ['Customer', 'Type', 'Number', 'Date', 'Due Date', 'Subtotal', 'Tax', 'Paid', 'Total', 'Status'];
        const colWidths = [35, 20, 25, 20, 20, 20, 15, 20, 20, 20];
        let xPos = 20;
        
        // Draw header row
        headers.forEach((header, index) => {
          doc.text(header, xPos, yPos);
          xPos += colWidths[index];
        });
        
        yPos += 8;
        doc.setFont('helvetica', 'normal');
        
        // Draw data rows
        response.data.forEach((report, rowIndex) => {
          if (yPos > 270) { // Start new page if needed
            doc.addPage();
            yPos = 20;
          }
          
          xPos = 20;
          const rowData = [
            (report.customerName || '').substring(0, 15),
            (report.documentType || 'invoice').substring(0, 8),
            (report.invoiceNumber || '').substring(0, 12),
            report.invoiceDate ? new Date(report.invoiceDate).toLocaleDateString('en-GB') : '',
            report.dueDate ? new Date(report.dueDate).toLocaleDateString('en-GB') : '',
            getCurrencySymbol(report.currency) + (report.subtotal || 0).toFixed(2),
            getCurrencySymbol(report.currency) + (report.taxAmount || 0).toFixed(2),
            getCurrencySymbol(report.currency) + (report.paidAmount || 0).toFixed(2),
            getCurrencySymbol(report.currency) + (report.total || 0).toFixed(2),
            (report.paymentStatus || 'unpaid').substring(0, 8)
          ];
          
          rowData.forEach((cell, index) => {
            doc.text(String(cell), xPos, yPos);
            xPos += colWidths[index];
          });
          
          yPos += 6;
        });
        
        // Add summary
        yPos += 10;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Summary:', 20, yPos);
        
        yPos += 10;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Total Records: ${response.data.length}`, 20, yPos);
        yPos += 6;
        doc.text(`Total Subtotal: ${formatCurrency(totalSubtotal, 'INR')}`, 20, yPos);
        yPos += 6;
        doc.text(`Total Tax: ${formatCurrency(totalTax, 'INR')}`, 20, yPos);
        yPos += 6;
        doc.text(`Total Paid: ${formatCurrency(totalPaidAmount, 'INR')}`, 20, yPos);
        yPos += 6;
        doc.text(`Grand Total: ${formatCurrency(totalAmount, 'INR')}`, 20, yPos);
        
        // Add footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.text(`Generated on ${new Date().toLocaleDateString('en-GB')} | Page ${i} of ${pageCount}`, 20, 285);
          doc.text('InvoicePro Reports', 150, 285);
        }
        
        // Save the PDF
        const filename = `invoice_reports_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);
        
      }
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Failed to export PDF: ' + error.message);
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await reportsAPI.exportReports({
        dateFrom,
        dateTo,
        status,
        documentType
      }, 'csv');

      if (response.success) {
        const csvContent = reportsAPI.convertToCSV(response.data);
        const filename = `reports_${new Date().toISOString().split('T')[0]}.csv`;
        reportsAPI.downloadCSV(csvContent, filename);
      }
    } catch (error) {
      alert('Failed to export Excel: ' + error.message);
    }
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
            <span className="text-sm">{reports.length} records</span>
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
              <option value="partiallyPaid">Partially Paid</option>
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
              <option value="taxInvoice">Tax Invoice</option>
              <option value="proforma">Proforma Invoice</option>
              <option value="quote">Quote</option>
              <option value="receipt">Receipt</option>
              <option value="salesReceipt">Sales Receipt</option>
              <option value="cashReceipt">Cash Receipt</option>
              <option value="estimate">Estimate</option>
              <option value="creditMemo">Credit Memo</option>
              <option value="creditNote">Credit Note</option>
              <option value="purchaseOrder">Purchase Order</option>
              <option value="deliveryNote">Delivery Note</option>
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
                onClick={() => handleQuickFilter(filter.id)}
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
      ) : reports.length === 0 ? (
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
                {reports.map((report, index) => (
                  <tr 
                    key={report.id} 
                    onClick={() => onInvoiceClick && onInvoiceClick(report)}
                    className={`border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${
                      index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                    }`}
                  >
                    <td className="p-4 text-sm text-slate-700 font-medium max-w-[200px]">
                      {report.customerName ? `${report.customerName}${report.customerAddress ? `, ${report.customerAddress}` : ''}` : '—'}
                    </td>
                    <td className="p-4 text-sm text-slate-600">{report.documentType}</td>
                    <td className="p-4 text-sm text-slate-600">{report.number}</td>
                    <td className="p-4 text-sm text-slate-600">
                      {report.date ? new Date(report.date).toLocaleDateString('en-GB') : '—'}
                    </td>
                    <td className="p-4 text-sm text-slate-700 text-right">
                      {formatCurrency(report.subtotal, report.currency)}
                    </td>
                    <td className="p-4 text-sm text-slate-700 text-right">
                      {formatCurrency(report.tax, report.currency)}
                    </td>
                    <td className="p-4 text-sm text-right">
                      <span className={report.paidAmount > 0 ? 'text-emerald-600 font-medium' : 'text-slate-600'}>
                        {formatCurrency(report.paidAmount, report.currency)}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-700 text-right font-medium">
                      {formatCurrency(report.total, report.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gradient-to-br from-slate-50 to-white border-t-2 border-slate-300">
                  <td className="p-4 text-sm font-bold text-slate-700 uppercase">Total</td>
                  <td className="p-4"></td>
                  <td className="p-4"></td>
                  <td className="p-4"></td>
                  <td className="p-4 text-sm font-bold text-slate-700 text-right">
                    {formatCurrency(totalSubtotal, 'INR')}
                  </td>
                  <td className="p-4 text-sm font-bold text-slate-700 text-right">
                    {formatCurrency(totalTax, 'INR')}
                  </td>
                  <td className="p-4 text-sm font-bold text-emerald-600 text-right">
                    {formatCurrency(totalPaidAmount, 'INR')}
                  </td>
                  <td className="p-4 text-sm font-bold text-slate-800 text-right">
                    {formatCurrency(totalAmount, 'INR')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default MyReports;
