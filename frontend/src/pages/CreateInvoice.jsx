import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import InvoiceForm from '../components/invoice/InvoiceForm';
import { FileText, Receipt, CreditCard, FileCheck, Truck, ShoppingCart } from 'lucide-react';

const documentTypes = [
  { id: 'invoice', label: 'Invoice', icon: FileText, color: 'indigo' },
  { id: 'tax-invoice', label: 'Tax Invoice', icon: Receipt, color: 'violet' },
  { id: 'proforma-invoice', label: 'Proforma', icon: FileCheck, color: 'blue' },
  { id: 'receipt', label: 'Receipt', icon: CreditCard, color: 'emerald' },
  { id: 'sales-receipt', label: 'Sales Receipt', icon: ShoppingCart, color: 'teal' },
  // { id: 'cash-receipt', label: 'Cash Receipt', icon: CreditCard, color: 'green' },
  { id: 'quote', label: 'Quote', icon: FileText, color: 'amber' },
  { id: 'estimate', label: 'Estimate', icon: FileCheck, color: 'orange' },
  { id: 'credit-memo', label: 'Credit Memo', icon: Receipt, color: 'rose' },
  { id: 'credit-note', label: 'Credit Note', icon: FileText, color: 'pink' },
  { id: 'purchase-order', label: 'Purchase Order', icon: ShoppingCart, color: 'cyan' },
  { id: 'delivery-note', label: 'Delivery Note', icon: Truck, color: 'slate' },
];

const CreateInvoice = () => {
  const { type } = useParams();
  const currentType = type || 'invoice';
  const [isLoading, setIsLoading] = useState(false);
  const [activeType, setActiveType] = useState(currentType);
  
  const currentDoc = documentTypes.find(d => d.id === currentType) || documentTypes[0];

  useEffect(() => {
    if (currentType !== activeType) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setActiveType(currentType);
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentType, activeType]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white">
        {/* Hero Header */}
        <div className="bg-slate-900 relative overflow-hidden py-12">
          {/* Decorative Background Circles */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Create {currentDoc.label}
              </h1>
              <p className="text-slate-400 max-w-xl mx-auto">
                Professional documents in minutes. Choose a type below or start creating.
              </p>
            </div>

            {/* Document Type Pills */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {documentTypes.map((doc) => {
                const Icon = doc.icon;
                const isActive = currentType === doc.id;
                return (
                  <Link
                    key={doc.id}
                    to={`/create/${doc.id}`}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-emerald-500 text-white shadow-lg'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white border border-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {doc.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {isLoading ? (
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-16 flex flex-col items-center justify-center min-h-[400px]">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-slate-200 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              </div>
              <p className="text-slate-500 text-lg mt-6">Loading {currentDoc.label}...</p>
            </div>
          ) : (
            <InvoiceForm key={activeType} documentType={activeType} documentLabel={currentDoc.label} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CreateInvoice;
