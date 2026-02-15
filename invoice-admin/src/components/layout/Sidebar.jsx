import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  Users,
  Package,
  UserCheck,
  LogOut,
  CreditCard,
  HelpCircle,
  MessageSquare,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Invoices", path: "/invoices", icon: FileText },
    { name: "Customers", path: "/customers", icon: Users },
    { name: "Users", path: "/users", icon: UserCheck },
    { name: "Subscribers", path: "/subscriptions", icon: CreditCard },
    { name: "Plans", path: "/plans", icon: Package },
    { name: "FAQ", path: "/faq", icon: HelpCircle },
    { name: "Contact Us", path: "/contact-us", icon: MessageSquare },
  ];

  return (
    <aside className="flex flex-col h-screen w-64 bg-white border-r border-gray-200 shadow-sm">
      
      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-100">
        <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">
          Invoice Admin
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Management Panel
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? "text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
              style={
                isActive
                  ? {
                      background:
                        "linear-gradient(135deg, #00bc7c, #2563eb, #7c3aed)",
                    }
                  : {}
              }
            >
              <Icon
                size={20}
                className={`transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-gray-400 group-hover:text-blue-600"
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-5 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
