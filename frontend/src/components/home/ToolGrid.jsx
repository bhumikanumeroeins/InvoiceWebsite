import { Link } from 'react-router-dom';
import {
  FileText, Sparkles, LayoutTemplate, BarChart3,
  RefreshCw, Bell, Users, Settings, CreditCard, PenTool,
  Receipt, ShoppingCart, FileCheck, Truck,
} from 'lucide-react';

const tools = [
  { icon: Sparkles,       label: 'AI Invoice',      path: '/ai-invoice',              color: 'bg-violet-100 text-violet-600',  badge: 'AI'  },
  { icon: FileText,       label: 'Invoice',          path: '/create/invoice',          color: 'bg-indigo-100 text-indigo-600',  badge: null  },
  { icon: Receipt,        label: 'GST Invoice',      path: '/create/tax-invoice',      color: 'bg-blue-100 text-blue-600',      badge: null  },
  { icon: FileCheck,      label: 'Proforma',         path: '/create/proforma-invoice', color: 'bg-sky-100 text-sky-600',        badge: null  },
  { icon: CreditCard,     label: 'Receipt',          path: '/create/receipt',          color: 'bg-emerald-100 text-emerald-600',badge: null  },
  { icon: ShoppingCart,   label: 'Sales Receipt',    path: '/create/sales-receipt',    color: 'bg-teal-100 text-teal-600',      badge: null  },
  { icon: FileText,       label: 'Quote',            path: '/create/quote',            color: 'bg-amber-100 text-amber-600',    badge: null  },
  { icon: FileCheck,      label: 'Estimate',         path: '/create/estimate',         color: 'bg-orange-100 text-orange-600',  badge: null  },
  { icon: Truck,          label: 'Delivery Note',    path: '/create/delivery-note',    color: 'bg-slate-100 text-slate-600',    badge: null  },
  { icon: LayoutTemplate, label: 'Templates',        path: '/template-builder',        color: 'bg-pink-100 text-pink-600',      badge: null  },
  { icon: BarChart3,      label: 'Reports',          path: '/dashboard?tab=myReports', color: 'bg-rose-100 text-rose-600',      badge: null  },
  { icon: Users,          label: 'Customers',        path: '/dashboard?tab=myCustomers',color: 'bg-cyan-100 text-cyan-600',     badge: null  },
  { icon: Settings,       label: 'Settings',         path: '/settings',                color: 'bg-gray-100 text-gray-500',      badge: null  },
];

const ToolGrid = () => (
  <div className="flex flex-wrap justify-center gap-5">
    {tools.map(({ icon: Icon, label, path, color, badge }) => (
      <Link
        key={path + label}
        to={path}
        className="flex flex-col items-center gap-2 group w-16"
      >
        <div className="relative">
          <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200`}>
            <Icon className="w-6 h-6" />
          </div>
          {badge && (
            <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 text-[9px] font-bold bg-violet-600 text-white rounded-full leading-none">
              {badge}
            </span>
          )}
        </div>
        <p className="text-[11px] text-gray-500 text-center leading-tight">{label}</p>
      </Link>
    ))}
  </div>
);

export default ToolGrid;
