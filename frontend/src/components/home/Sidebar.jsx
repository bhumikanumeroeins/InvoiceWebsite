import { Home, FileText, Users, BarChart3, LayoutTemplate, Sparkles, Settings, Plus, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { icon: Home,          label: 'Home',      path: '/' },
  { icon: FileText,      label: 'Invoices',  path: '/dashboard?tab=myInvoices' },
  { icon: Sparkles,      label: 'AI Invoice',path: '/ai-invoice' },
  { icon: LayoutTemplate,label: 'Templates', path: '/template-builder' },
  { icon: Users,         label: 'Customers', path: '/dashboard?tab=myCustomers' },
  { icon: BarChart3,     label: 'Reports',   path: '/dashboard?tab=myReports' },
];

const Sidebar = ({ expanded, onToggle }) => {
  const location = useLocation();

  return (
    <aside className={`${expanded ? 'w-52' : 'w-14'} bg-white border-r border-gray-200 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out`}>
      {/* Logo */}
      <div className="h-14 flex items-center justify-center border-b border-gray-100 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-emerald-500 flex items-center justify-center shadow-sm">
          <FileText className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* New button */}
      <div className="px-2 pt-4 pb-2">
        <button
          className="w-full flex items-center justify-center gap-2 px-2 py-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          title="New"
        >
          <Plus className="w-4 h-4 flex-shrink-0" />
          {expanded && <span className="text-xs font-medium">New</span>}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-0.5">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path.split('?')[0] && path === '/'
            ? location.pathname === '/'
            : location.pathname + location.search === path || location.pathname === path.split('?')[0];
          return (
            <Link
              key={path}
              to={path}
              title={label}
              className={`flex items-center gap-3 px-2 py-2.5 rounded-lg transition-colors ${
                isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {expanded && <span className="text-xs font-medium">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="px-2 pb-2 border-t border-gray-100 pt-2">
        <Link
          to="/settings"
          title="Settings"
          className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          {expanded && <span className="text-xs font-medium">Settings</span>}
        </Link>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="h-10 flex items-center justify-center border-t border-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors flex-shrink-0"
      >
        <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
      </button>
    </aside>
  );
};

export default Sidebar;
