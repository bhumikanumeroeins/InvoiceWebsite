import { useState, useEffect, useRef } from 'react';
import { FileText, Edit, Layout, Mail, Copy, Trash2, CreditCard, RefreshCw, Download, X, Bell, MoreHorizontal, CheckCircle, PenLine } from 'lucide-react';

const InvoiceActionTabs = ({
  activeTab,
  onTabChange,
  onClose,
  loading = false,
  loadingAction = null,
  paymentStatus = 'unpaid',
}) => {
  const [showMore, setShowMore] = useState(false);
  const moreRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setShowMore(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const primaryActions = [
    { id: 'invoice', label: 'Preview', icon: FileText },
    { id: 'download', label: 'Download PDF', icon: Download },
    { id: 'email', label: 'Send Email', icon: Mail },
    {
      id: 'payments',
      label: paymentStatus === 'paid' ? 'Paid ✓' : 'Mark as Paid',
      icon: paymentStatus === 'paid' ? CheckCircle : CreditCard,
      highlight: paymentStatus !== 'paid',
    },
  ];

  const moreActions = [
    { id: 'inline-edit', label: 'Edit Inline (Live Preview)', icon: PenLine },
    { id: 'edit', label: 'Edit with Form', icon: Edit },
    { id: 'template', label: 'Change Template', icon: Layout },
    { id: 'copy', label: 'Duplicate', icon: Copy },
    { id: 'recurring', label: 'Recurring Schedule', icon: RefreshCw },
    { id: 'reminders', label: 'Payment Reminders', icon: Bell },
    { id: 'delete', label: 'Delete Invoice', icon: Trash2, danger: true },
  ];

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-2 flex-wrap">
      {/* Primary actions */}
      {primaryActions.map((action) => {
        const Icon = action.icon;
        const isActive = activeTab === action.id;
        const isLoading = loading && loadingAction === action.id;
        return (
          <button
            key={action.id}
            onClick={() => onTabChange(action.id)}
            disabled={isLoading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? 'bg-slate-900 text-white shadow'
                : action.highlight
                ? 'bg-gradient-to-r from-indigo-600 to-emerald-500 text-white hover:shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            } ${isLoading ? 'opacity-50' : ''}`}
          >
            <Icon className="w-4 h-4" />
            {isLoading ? `${action.label}...` : action.label}
          </button>
        );
      })}

      {/* More dropdown */}
      <div className="relative" ref={moreRef}>
        <button
          onClick={() => setShowMore((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            moreActions.some((a) => a.id === activeTab)
              ? 'bg-slate-900 text-white shadow'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <MoreHorizontal className="w-4 h-4" />
          More
        </button>
        {showMore && (
          <div className="absolute left-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 w-52 z-50">
            {moreActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => { onTabChange(action.id); setShowMore(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                    activeTab === action.id
                      ? 'bg-slate-100 font-medium text-slate-900'
                      : action.danger
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {action.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Close */}
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default InvoiceActionTabs;
