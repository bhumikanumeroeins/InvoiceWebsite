import { useState, useEffect } from 'react';
import { Search, ChevronDown, Settings, LogOut, Plus, FileText, Users, BarChart3, UserPlus, X, Receipt, CreditCard, FileCheck, Truck, ShoppingCart, Eye, Edit, Palette } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import InvoiceForm from '../components/invoice/InvoiceForm';
import MyInvoices from '../components/dashboard/MyInvoices';
import MyCustomers from '../components/dashboard/MyCustomers';
import MyReports from '../components/dashboard/MyReports';
import NewCustomer from '../components/dashboard/NewCustomer';
import InvoicePreview from '../components/dashboard/InvoicePreview';
import { getCurrentUser, authAPI } from '../services/authService';

const documentTypes = [
  { id: 'invoice', label: 'New', icon: FileText },
  { id: 'custom-invoice', label: 'Custom Invoice', icon: Palette, isCustom: true },
  { id: 'tax-invoice', label: 'Tax Invoice', icon: Receipt },
  { id: 'proforma-invoice', label: 'Proforma Invoice', icon: FileCheck },
  { id: 'receipt', label: 'Receipt', icon: CreditCard },
  { id: 'sales-receipt', label: 'Sales Receipt', icon: ShoppingCart },
  { id: 'quote', label: 'Quote', icon: FileText },
  { id: 'estimate', label: 'Estimate', icon: FileCheck },
  { id: 'credit-memo', label: 'Credit Memo', icon: Receipt },
  { id: 'credit-note', label: 'Credit Note', icon: FileText },
  { id: 'purchase-order', label: 'Purchase Order', icon: ShoppingCart },
  { id: 'delivery-note', label: 'Delivery Note', icon: Truck },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
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

  const updateTab = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      const validTabs = ['myInvoices', 'myCustomers', 'myReports', 'newCustomer', 'invoicePreview', 'newInvoice'];
      if (validTabs.includes(tabFromUrl)) {
        setActiveTab(tabFromUrl);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const user = getCurrentUser();
    if (user && user.email) {
      setUserEmail(user.email);
    }
  }, []);

  const handleSignOut = () => {
    authAPI.logout();
    navigate('/');
  };

  const currentDoc = documentTypes.find(d => d.id === selectedDocType) || documentTypes[0];

  const baseTabs = [
    { id: 'myInvoices', label: 'My Invoices', icon: FileText },
    { id: 'myCustomers', label: 'My Customers', icon: Users },
    { id: 'myReports', label: 'My Reports', icon: BarChart3 },
  ];

  const getExtraTabs = () => {
    const tabs = [];
    if (selectedCustomer) {
      tabs.push({ 
        id: 'newCustomer', 
        label: selectedCustomer.client?.name || 'Customer', 
        icon: UserPlus, 
        closable: true 
      });
    }
    if (selectedInvoice) {
      tabs.push({ 
        id: 'invoicePreview', 
        label: selectedInvoice.number || 'Invoice Preview', 
        icon: Eye, 
        closable: true 
      });
    }
    if (activeTab === 'newInvoice' || showExtraTabs) {
      tabs.push({ 
        id: 'newInvoice', 
        label: editingInvoice ? `Edit ${editingInvoice.number || currentDoc.label}` : `New ${currentDoc.label}`, 
        icon: editingInvoice ? Edit : Plus, 
        closable: true 
      });
    }
    return tabs;
  };

  const extraTabs = getExtraTabs();
  const tabs = [...baseTabs, ...extraTabs];

  const handleDocTypeClick = (docId) => {
    // Check if it's custom invoice
    if (docId === 'custom-invoice') {
      navigate('/template-builder');
      return;
    }
    
    setSelectedDocType(docId);
    setShowExtraTabs(true);
    updateTab('newInvoice');
  };

  const handleBaseTabClick = (tabId) => {
    updateTab(tabId);
    if (tabId === 'myInvoices') {
      setInvoiceRefreshKey(prev => prev + 1);
    } else if (tabId === 'myCustomers') {
      setCustomerRefreshKey(prev => prev + 1);
    }
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
    if (tabId === 'newCustomer') {
      setSelectedCustomer(null);
      updateTab('myCustomers');
    } else if (tabId === 'newInvoice') {
      setShowExtraTabs(false);
      setEditingInvoice(null);
      updateTab('myInvoices');
    } else if (tabId === 'invoicePreview') {
      setSelectedInvoice(null);
      updateTab('myInvoices');
    }
  };

  const handleInvoiceSaved = (invoiceData, isUpdate = false) => {
    setSelectedInvoice(invoiceData);
    updateTab('invoicePreview');
    setShowExtraTabs(false);
    setEditingInvoice(null);
    setInvoiceRefreshKey(prev => prev + 1);
    setCustomerRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-emerald-500 flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-slate-900">InvoicePro</span>
          </Link>

          <div className="flex-1 max-w-xl mx-8">
            <div className="flex">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Customer, Address, or Item"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-l-md border border-slate-200 text-gray-800 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button 
                onClick={() => setSearchQuery(searchQuery)}
                className="bg-gradient-to-r from-indigo-600 to-emerald-500 hover:shadow-lg px-4 py-2 rounded-r-md text-sm font-medium text-white transition-all"
              >
                Search
              </button>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 hover:bg-slate-100 px-3 py-2 rounded text-slate-700"
            >
              <span className="text-sm">🇮🇳</span>
              <span className="text-sm">{userEmail}</span>
              <Settings className="w-4 h-4" />
              <ChevronDown className="w-4 h-4" />
            </button>
            {showUserDropdown && (
              <div className="absolute right-0 top-full mt-1 bg-white text-gray-800 rounded-md shadow-lg py-2 min-w-[180px] z-50 border border-slate-200">
                <Link to="/settings" className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Settings
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-red-600"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Invoice Type Options */}
      <div className="bg-slate-900 relative overflow-hidden py-12">
        {/* Decorative Background Circles */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex items-center gap-2 justify-center mb-2">
            {/* <button
              onClick={() => handleDocTypeClick('invoice')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-slate-300 border border-white/10 hover:bg-white/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              New:
            </button> */}

            {documentTypes.slice(0, 8).map((doc) => {
              const Icon = doc.icon;

              return (
                <button 
                  key={doc.id}
                  onClick={() => handleDocTypeClick(doc.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-300 ${
                    selectedDocType === doc.id
                      ? 'bg-gradient-to-r from-indigo-600 to-emerald-500 text-white shadow-lg'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white border border-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {doc.label}
                </button>
              );
            })}

          </div>
          <div className="flex items-center gap-2 justify-center">
            {documentTypes.slice(8).map((doc) => {
                const Icon = doc.icon;

                return (
                  <button
                    key={doc.id}
                    onClick={() => handleDocTypeClick(doc.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-300 ${
                      selectedDocType === doc.id
                        ? 'bg-gradient-to-r from-indigo-600 to-emerald-500 text-white shadow-lg'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white border border-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {doc.label}
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleBaseTabClick(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id ? 'bg-white text-gray-800 shadow' : 'bg-[#e8eef3] text-gray-600 hover:bg-[#dde5ec]'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.closable && (
                <X 
                  className="w-4 h-4 ml-1 hover:text-red-500" 
                  onClick={(e) => { e.stopPropagation(); handleCloseTab(tab.id); }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {activeTab === 'newInvoice' && (
          <div className="bg-white rounded-lg shadow p-6">
            <InvoiceForm 
              key={editingInvoice ? editingInvoice._id : selectedDocType} 
              documentType={selectedDocType} 
              documentLabel={currentDoc.label}
              onSave={handleInvoiceSaved}
              editInvoice={editingInvoice}
            />
          </div>
        )}

        {activeTab === 'myInvoices' && <MyInvoices onInvoiceClick={handleInvoiceClick} refreshKey={invoiceRefreshKey} searchQuery={searchQuery} />}

        {activeTab === 'myCustomers' && <MyCustomers onCustomerClick={handleCustomerClick} refreshKey={customerRefreshKey} searchQuery={searchQuery} />}

        {activeTab === 'myReports' && <MyReports onInvoiceClick={handleInvoiceClick} />}

        {activeTab === 'newCustomer' && <NewCustomer customer={selectedCustomer} onInvoiceClick={handleInvoiceClick} />}

        {activeTab === 'invoicePreview' && (
          <InvoicePreview 
            invoice={selectedInvoice} 
            onClose={() => handleCloseTab('invoicePreview')}
            onInvoiceUpdated={(updatedInvoice) => {
              setSelectedInvoice(updatedInvoice);
            }}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white mt-8 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 mb-4">
            <a href="/" className="hover:text-gray-700">Home</a>
            <a href="/templates" className="hover:text-gray-700">Invoice Templates</a>
            <a href="/features" className="hover:text-gray-700">Features</a>
            <a href="/pricing" className="hover:text-gray-700">Pricing</a>
            <a href="/testimonials" className="hover:text-gray-700">Testimonials</a>
            <a href="/faq" className="hover:text-gray-700">FAQ</a>
            <a href="/contact" className="hover:text-gray-700">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
