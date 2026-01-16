import { FileText, Edit, Layout, Mail, Copy, Trash2, CreditCard, RefreshCw, Download, X } from 'lucide-react';

const defaultActions = [
  { id: 'invoice', label: 'Invoice', icon: FileText },
  { id: 'edit', label: 'Edit', icon: Edit },
  { id: 'template', label: 'Select Template', icon: Layout },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'copy', label: 'Copy', icon: Copy },
  { id: 'delete', label: 'Delete', icon: Trash2, danger: true },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'recurring', label: 'Recurring', icon: RefreshCw },
  { id: 'download', label: 'Download', icon: Download },
];

const InvoiceActionTabs = ({ 
  activeTab, 
  onTabChange, 
  onClose,
  actions = defaultActions,
  loading = false,
  loadingAction = null,
}) => {
  return (
    <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
      <div className="flex items-center gap-1 flex-wrap">
        {actions.map((action) => {
          const isLoading = loading && loadingAction === action.id;
          return (
            <button
              key={action.id}
              onClick={() => onTabChange(action.id)}
              disabled={isLoading}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-all ${
                activeTab === action.id
                  ? 'bg-white text-slate-800 shadow border border-slate-200'
                  : action.danger
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-slate-600 hover:bg-white hover:shadow-sm'
              } ${isLoading ? 'opacity-50' : ''}`}
            >
              <action.icon className="w-4 h-4" />
              {isLoading ? `${action.label}...` : action.label}
            </button>
          );
        })}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default InvoiceActionTabs;
export { defaultActions };
