import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  Users,
  Package,
  Receipt,
  UserCheck,
  Bell,
  Image,
  Settings,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Invoices", path: "/invoices", icon: FileText },
    { name: "Customers", path: "/customers", icon: Users },
    { name: "Users", path: "/users", icon: UserCheck },
    { name: "Templates", path: "/templates", icon: Image },
    { name: "Reminders", path: "/reminders", icon: Bell },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <aside className="relative h-screen w-64 bg-white shadow-xl border-r border-gray-200">
      {/* Logo */}
      <div className="px-6 py-6 text-xl font-bold text-gray-900">
        Invoice Admin
      </div>

      {/* Menu */}
      <nav className="px-3 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                isActive
                  ? "text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
              style={
                isActive
                  ? {
                      background:
                        "linear-gradient(135deg, #00bc7c, rgb(78 56 245))",
                    }
                  : {}
              }
            >
              <Icon
                size={20}
                className={`${
                  isActive
                    ? "text-white"
                    : "text-gray-400 group-hover:text-indigo-500"
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
