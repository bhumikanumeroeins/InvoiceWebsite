import { useState, useEffect } from 'react';
import { currencyService } from '../../services/currencyService';
import { UserPlus, FileText, Filter, Loader2, Calendar, Search, Download } from 'lucide-react';
import { customerAPI } from '../../services/invoiceService';
import { getUploadsUrl } from '../../services/apiConfig';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const NewCustomer = ({ customer, onInvoiceClick }) => {
  const [documents, setDocuments] = useState([]);
  const [summary, setSummary] = useState({ totalAmount: 0, totalPaidAmount: 0, remainingAmount: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to format currency amount
  const formatCurrency = (amount, currencyCode) => {
    const symbol = currencyService.getSymbol(currencyCode || 'INR');
    const locale = currencyCode === 'USD' ? 'en-US' : 'en-IN';
    return `${symbol} ${amount.toLocaleString(locale, { minimumFractionDigits: 2 })}`;
  };
  const [activeTab, setActiveTab] = useState('documents');
  
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [status, setStatus] = useState('all');
  const [documentType, setDocumentType] = useState('all');

  const customerName = customer?.client?.name || 'Customer';

  // Transform invoice data from backend format to preview format
  const transformInvoice = (inv) => {
    const total = inv.totals?.grandTotal || 0;
    let paid = 0;
    if (inv.paymentStatus === 'paid') paid = total;
    else if (inv.paymentStatus === 'partiallyPaid') paid = total * 0.5;
    
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
      paid: paid,
      total: total,
      currency: inv.invoiceMeta?.currency || 'INR',
      paymentStatus: inv.paymentStatus || 'unpaid',
      logo: inv.business?.logo ? `${getUploadsUrl()}/uploads/${inv.business.logo}` : null,
      companyName: inv.business?.name || '',
      companyAddress: `${inv.business?.address || ''}\n${inv.business?.phone || ''}, ${inv.business?.email || ''}`,
      billTo: {
        name: inv.client?.name || '',
        address: `${inv.client?.address || ''}\n${inv.client?.email || ''}`,
        email: inv.client?.email || '',
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
      terms: (inv.terms || []).map(t => t.text || t),
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

  const handleInvoiceClick = (doc) => {
    if (onInvoiceClick) {
      const transformedInvoice = transformInvoice(doc);
      onInvoiceClick(transformedInvoice);
    }
  };

  const fetchDocuments = async () => {
    if (!customerName || customerName === 'Customer') {
      setError('Customer name not available.');
      setDocuments([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      // Build filter params
      const params = {};
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;
      if (status && status !== 'all') params.status = status;
      if (documentType && documentType !== 'all') params.documentType = documentType;

      const response = await customerAPI.getInvoices(customerName, params);
      if (response.success) {
        setDocuments(response.data || []);
        setSummary(response.summary || { totalAmount: 0, totalPaidAmount: 0, remainingAmount: 0 });
      } else {
        setError(response.message || 'Failed to fetch documents');
      }
    } catch (err) {
      console.error('Fetch documents error:', err);
      setError(err.message || 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [customerName]);

  const { totalAmount, totalPaidAmount, remainingAmount } = summary;

  const handleSearch = () => {
    fetchDocuments();
  };

  const tabs = [
    { id: 'documents', label: "New Customer's Documents", count: documents.length, icon: FileText },
    { id: 'statement', label: 'Customer Statement', icon: FileText, isDownload: true },
  ];

  const handleDownloadStatement = async () => {
    if (documents.length === 0) {
      alert('No documents available to generate statement');
      return;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Get company info from first document
      const firstDoc = documents[0];
      const companyName = firstDoc.business?.name || 'Company Name';
      const companyAddress = firstDoc.business?.address || '';
      const companyCity = firstDoc.business?.city || '';
      const companyZip = firstDoc.business?.zip || '';
      const fullAddress = `${companyAddress}${companyCity ? ', ' + companyCity : ''}${companyZip ? ' ' + companyZip : ''}`;
      const logoUrl = firstDoc.business?.logo ? `${getUploadsUrl()}/uploads/${firstDoc.business.logo}` : null;

      let yPosition = 20;

      // Add logo if available
      if (logoUrl) {
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = logoUrl;
          });
          doc.addImage(img, 'PNG', pageWidth - 50, 15, 35, 35);
        } catch (err) {
          console.error('Failed to load logo:', err);
        }
      }

      // Company info
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(companyName, 15, yPosition);
      yPosition += 5;
      doc.text(fullAddress, 15, yPosition);
      yPosition += 10;

      // Title
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(`Customer Statement for ${companyName} ${customerName}`, 15, yPosition);
      yPosition += 10;

      // Customer info
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(customerName, 15, yPosition);
      yPosition += 10;

      // Prepare table data
      const tableData = documents.map(doc => {
        const subtotal = doc.totals?.subtotal || 0;
        const tax = doc.totals?.taxTotal || 0;
        const total = doc.totals?.grandTotal || 0;
        const paid = doc.paidAmount || 0;
        const currency = doc.invoiceMeta?.currency || 'INR';
        const symbol = currencyService.getSymbol(currency);

        return [
          doc.invoiceMeta?.invoiceNo || '',
          doc.invoiceMeta?.invoiceDate 
            ? new Date(doc.invoiceMeta.invoiceDate).toLocaleDateString('en-GB')
            : '',
          subtotal.toFixed(2),
          tax.toFixed(2),
          paid.toFixed(2),
          `${symbol} ${total.toFixed(2)}`
        ];
      });

      // Add table
      autoTable(doc, {
        startY: yPosition,
        head: [['Number', 'Date', 'Subtotal', 'Tax', 'Paid Amount', 'Total']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: {
          fontSize: 9,
          cellPadding: 5
        },
        columnStyles: {
          0: { halign: 'left', cellWidth: 22 },
          1: { halign: 'center', cellWidth: 28 },
          2: { halign: 'right', cellWidth: 23 },
          3: { halign: 'right', cellWidth: 23 },
          4: { halign: 'right', cellWidth: 28 },
          5: { halign: 'right', cellWidth: 45 }
        }
      });

      // Summary section
      const finalY = doc.lastAutoTable.finalY + 10;
      const currency = documents[0]?.invoiceMeta?.currency || 'INR';
      const symbol = currencyService.getSymbol(currency);

      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text('Total', 15, finalY);
      doc.text(`${totalAmount.toFixed(2)} ${currency}`, pageWidth - 15, finalY, { align: 'right' });

      doc.setTextColor(0, 150, 255);
      doc.text('Paid Amount', 15, finalY + 7);
      doc.text(`${totalPaidAmount.toFixed(2)} ${currency}`, pageWidth - 15, finalY + 7, { align: 'right' });

      doc.setTextColor(0, 0, 0);
      doc.text('Balance Due', 15, finalY + 14);
      doc.text(`${remainingAmount.toFixed(2)} ${currency}`, pageWidth - 15, finalY + 14, { align: 'right' });

      // Save PDF
      doc.save(`Customer_Statement_${customerName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
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
                      <th className="p-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                      <th className="p-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Paid</th>
                      <th className="p-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc, index) => (
                      <tr 
                        key={doc._id} 
                        onClick={() => handleInvoiceClick(doc)}
                        className={`border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                        }`}
                      >
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" className="rounded border-slate-300" />
                        </td>
                        <td className="p-4 text-sm text-slate-700 font-medium">{doc.client?.name || '—'}</td>
                        <td className="p-4 text-sm text-slate-600">{doc.invoiceMeta?.invoiceNo || '—'}</td>
                        <td className="p-4 text-sm text-slate-600">
                          {doc.invoiceMeta?.invoiceDate 
                            ? new Date(doc.invoiceMeta.invoiceDate).toLocaleDateString('en-GB') 
                            : '—'}
                        </td>
                        <td className="p-4 text-sm text-center">
                          {doc.paymentStatus === 'paid' && <span className="text-emerald-600 font-medium">Paid</span>}
                          {doc.paymentStatus === 'unpaid' && <span className="text-orange-500 font-medium">Unpaid</span>}
                          {doc.paymentStatus === 'partiallyPaid' && <span className="text-amber-500 font-medium">Partial</span>}
                        </td>
                        <td className="p-4 text-sm text-right">
                          <span className={(doc.paidAmount || 0) > 0 ? 'text-emerald-600 font-medium' : 'text-orange-500'}>
                            {formatCurrency(doc.paidAmount || 0, doc.invoiceMeta?.currency)}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-700 text-right font-medium">
                          {formatCurrency(doc.totals?.grandTotal || 0, doc.invoiceMeta?.currency)}
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
                    <span className="font-bold text-slate-800">{formatCurrency(totalAmount, 'INR')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-slate-700 uppercase">Paid Amount</span>
                    <span className="font-bold text-emerald-600">{formatCurrency(totalPaidAmount, 'INR')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-slate-700 uppercase">Balance Due</span>
                    <span className="font-bold text-orange-500">{formatCurrency(remainingAmount, 'INR')}</span>
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
