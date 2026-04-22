import { useState, useEffect } from 'react';
import { Search, ChevronDown, Settings, LogOut, Plus, FileText, Users, BarChart3, UserPlus, X, Receipt, CreditCard, FileCheck, Truck, ShoppingCart, Eye, Edit, Palette, Sparkles } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import InvoiceForm from '../components/invoice/InvoiceForm';
import MyInvoices from '../components/dashboard/MyInvoices';
import MyCustomers from '../components/dashboard/MyCustomers';
import MyReports from '../components/dashboard/MyReports';
import NewCustomer from '../components/dashboard/NewCustomer';
import InvoicePreview from '../components/dashboard/InvoicePreview';
import DashboardStats from '../components/dashboard/DashboardStats';
import { getCurrentUser, authAPI } from '../services/authService';
import useSessionExpiry from '../hooks/useSessionExpiry';

const documentTypes = [
  { id: 'invoice', label: 'Invoice', icon: FileText },
  { id: 'custom-invoice', label: 'Custom Invoice', icon: Palette, isCustom: true },
  { id: 'tax-invoice', label: 'GST Invoice', icon: Receipt },
  { id: 'proforma-invoice', label: 'Advance Invoice', icon: FileCheck },
  { id: 'receipt', label: 'Payment Receipt', icon: CreditCard },
  { id: 'sales-receipt', label: 'Instant Sale', icon: ShoppingCart },
  { id: 'quote', label: 'Proposal', icon: FileText },
  { id: 'estimate', label: 'Cost Estimate', icon: FileCheck },
  { id: 'credit-memo', label: 'Refund', icon: Receipt },
  { id: 'credit-note', label: 'Adjustment Note', icon: FileText },
  { id: 'purchase-order', label: 'Order Request', icon: ShoppingCart },
  { id: 'delivery-note', label: 'Shipment Note', icon: Truck },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  useSessionExpiry();

  const getInitialTab = () => {
    const tabFromUrl = searchParams.get('tab');
    const validTabs = ['myInvoices', 'myCustomers', 'myReports', 'newCustomer', 'invoicePreview', 'newInvoice'];
    return validTabs.includes(tabFromUrl) ? tabFromUrl : 'myInvoices';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [selectedDocType, setSelectedDocType] = useState('invoice');
  const [showExtraTabs, setShowExtraTabs] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [invoiceRefreshKey, setInvoiceRefreshKey] = useState(0);
  const [customerRefreshKey, setCustomerRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDocTypeMenu, setShowDocTypeMenu] = useState(false);

  const updateTab = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      const validTabs = ['myInvoices', 'myCustomers', 'myReports', 'newCustomer', 'invoicePreview', 'newInvoice'];
      if (validTabs.includes(tabFromUrl)) setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const user = getCurrentUser();
    if (user?.email) setUserEmail(user.email);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = () => {
      setShowUserDropdown(false);
      setShowDocTypeMenu(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const handleSignOut = () => {
    authAPI.logout();
    navigate('/');
  };

  const currentDoc = documentTypes.find((d) => d.id === selectedDocType) || documentTypes[0];

  const baseTabs = [
    { id: 'myInvoices', label: 'My Invoices', icon: FileText },
    { id: 'myCustomers', label: 'Clients', icon: Users },
    { id: 'myReports', label: 'Analytics', icon: BarChart3 },
  ];

  const getExtraTabs = () => {
    const tabs = [];
    if (selectedCustomer) {
      tabs.push({ id: 'newCustomer', label: selectedCustomer.client?.name || 'Customer', icon: UserPlus, closable: true });
    }
    if (selectedInvoice) {
      tabs.push({ id: 'invoicePreview', label: selectedInvoice.number || 'Invoice', icon: Eye, closable: true });
    }
    if (activeTab === 'newInvoice' || showExtraTabs) {
      tabs.push({
        id: 'newInvoice',
        label: editingInvoice ? `Edit ${editingInvoice.number || currentDoc.label}` : `New ${currentDoc.label}`,
        icon: editingInvoice ? Edit : Plus,
        closable: true,
      });
    }
    return tabs;
  };

  const extraTabs = getExtraTabs();
  const tabs = [...baseTabs, ...extraTabs];

  const handleDocTypeClick = (docId) => {
    if (docId === 'custom-invoice') {
      navigate('/template-builder');
      return;
    }
    setSelectedDocType(docId);
    setShowExtraTabs(true);
    setShowDocTypeMenu(false);
    updateTab('newInvoice');
  };

  const handleBaseTabClick = (tabId) => {
    updateTab(tabId);
    if (tabId === 'myInvoices') setInvoiceRefreshKey((prev) => prev + 1);
    else if (tabId === 'myCustomers') setCustomerRefreshKey((prev) => prev + 1);
  };

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    updateTab('newCustomer');
  };

  const handleInvoiceClick = (invoice) => {
    setSelectedInvoice(invoice);
    updateTab('invoicePreview');
  };

  const handleCloseTab = (tabId) => {
    if (tabId === 'newCustomer') { setSelectedCustomer(null); updateTab('myCustomers'); }
    else if (tabId === 'newInvoice') { setShowExtraTabs(false); setEditingInvoice(null); updateTab('myInvoices'); }
    else if (tabId === 'invoicePreview') { setSelectedInvoice(null); updateTab('myInvoices'); }
  };

  const handleInvoiceSaved = (invoiceData) => {
    setSelectedInvoice(invoiceData);
    updateTab('invoicePreview');
    setShowExtraTabs(false);
    setEditingInvoice(null);
    setInvoiceRefreshKey((prev) => prev + 1);
    setCustomerRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-emerald-500 flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-slate-900 hidden sm:block">InvoicePro</span>
          </Link>

          {/* Search */}
          <div className="flex flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by customer, number or item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-l-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              onClick={() => setSearchQuery(searchQuery)}
              className="bg-gradient-to-r from-indigo-600 to-emerald-500 px-4 py-2 rounded-r-lg text-sm font-medium text-white hover:shadow-md transition-all"
            >
              Search
            </button>
          </div>

          {/* Right: New Invoice + User */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* AI Generate button */}
            <button
              onClick={() => navigate('/ai-invoice')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              <Sparkles className="w-4 h-4" />
              AI Generate
            </button>
            {/* New Invoice button with dropdown */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowDocTypeMenu((v) => !v)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                New Invoice
                <ChevronDown className={`w-4 h-4 transition-transform ${showDocTypeMenu ? 'rotate-180' : ''}`} />
              </button>
              {showDocTypeMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 py-2 w-56 z-50">
                  <p className="px-4 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Document Type</p>
                  {documentTypes.map((doc) => {
                    const Icon = doc.icon;
                    return (
                      <button
                        key={doc.id}
                        onClick={() => handleDocTypeClick(doc.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-slate-50 transition-colors ${
                          selectedDocType === doc.id && activeTab === 'newInvoice' ? 'text-indigo-600 font-medium bg-indigo-50' : 'text-slate-700'
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        {doc.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowUserDropdown((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-400 flex items-center justify-center text-white text-xs font-bold">
                  {userEmail?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm hidden md:block max-w-[140px] truncate">{userEmail}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showUserDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-slate-200 py-2 min-w-[180px] z-50">
                  <Link
                    to="/settings"
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleBaseTabClick(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-white text-slate-800 shadow border border-slate-200'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.closable && (
                <X
                  className="w-3.5 h-3.5 ml-0.5 hover:text-red-500 transition-colors"
                  onClick={(e) => { e.stopPropagation(); handleCloseTab(tab.id); }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Stats — only on My Invoices tab */}
        {activeTab === 'myInvoices' && (
          <DashboardStats refreshKey={invoiceRefreshKey} />
        )}

        {/* Tab Contents */}
        {activeTab === 'newInvoice' && (
          <InvoiceForm
            key={editingInvoice ? editingInvoice._id : selectedDocType}
            documentType={editingInvoice?.documentType || selectedDocType}
            documentLabel={currentDoc.label}
            onSave={handleInvoiceSaved}
            editInvoice={editingInvoice}
          />
        )}

        {activeTab === 'myInvoices' && (
          <MyInvoices
            onInvoiceClick={handleInvoiceClick}
            onNewInvoice={() => handleDocTypeClick('invoice')}
            refreshKey={invoiceRefreshKey}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'myCustomers' && (
          <MyCustomers
            onCustomerClick={handleCustomerClick}
            refreshKey={customerRefreshKey}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'myReports' && <MyReports onInvoiceClick={handleInvoiceClick} />}

        {activeTab === 'newCustomer' && (
          <NewCustomer customer={selectedCustomer} onInvoiceClick={handleInvoiceClick} />
        )}

        {activeTab === 'invoicePreview' && (
          <InvoicePreview
            invoice={selectedInvoice}
            onClose={() => handleCloseTab('invoicePreview')}
            onInvoiceUpdated={(updatedInvoice) => setSelectedInvoice(updatedInvoice)}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white mt-8 py-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-4 text-sm text-slate-400">
          <Link to="/" className="hover:text-slate-600">Home</Link>
          <Link to="/faq" className="hover:text-slate-600">FAQ</Link>
          <Link to="/contact" className="hover:text-slate-600">Contact Us</Link>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
