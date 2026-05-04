import {
  Home,
  FileText,
  Users,
  BarChart3,
  LayoutTemplate,
  Settings,
  Plus,
  ChevronRight,
  MessageSquare,
  Trash2,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../../services/authService";
import { aiService } from "../../services/aiService";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: FileText, label: "Invoices", path: "/dashboard?tab=myInvoices" },
  { icon: LayoutTemplate, label: "Templates", path: "/template-builder" },
  { icon: Users, label: "Customers", path: "/dashboard?tab=myCustomers" },
  { icon: BarChart3, label: "Reports", path: "/dashboard?tab=myReports" },
];

const Sidebar = ({ expanded, onToggle, activeSessionId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (!loggedIn || !expanded) return;
    aiService
      .listSessions()
      .then((res) => {
        if (res?.sessions) setSessions(res.sessions);
      })
      .catch(() => {});
  }, [loggedIn, expanded, activeSessionId]);

  const handleDelete = async (e, sessionId) => {
    e.stopPropagation();
    await aiService.deleteSession(sessionId);
    setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
    if (sessionId === activeSessionId) navigate("/");
  };

  const handleNewChat = () => {
    navigate("/");
  };

  return (
    <aside
      className={`${expanded ? "w-52" : "w-14"} bg-white border-r border-gray-200 flex flex-col shrink-0 transition-all duration-300 ease-in-out`}
    >
      {/* Logo */}
      <div className="h-14 flex items-center justify-center border-b border-gray-100 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-emerald-500 flex items-center justify-center shadow-sm">
          <FileText className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Nav */}
      <nav className="px-2 space-y-0.5 pt-4">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive =
            path === "/"
              ? location.pathname === "/" ||
                location.pathname.startsWith("/chat/")
              : location.pathname + location.search === path ||
                location.pathname === path.split("?")[0];
          return (
            <Link
              key={path}
              to={path}
              title={label}
              className={`flex items-center gap-3 px-2 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {expanded && <span className="text-xs font-medium">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Chat sessions — only when logged in */}
      {loggedIn && (
        <div className="flex-1 flex flex-col min-h-0 mt-3 border-t border-gray-100 pt-3">
          {expanded && (
            <div className="px-3 flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                AI Chats
              </span>
              <button
                onClick={handleNewChat}
                title="New chat"
                className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          {!expanded && (
            <button
              onClick={handleNewChat}
              title="New chat"
              className="mx-auto mb-1 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
          <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
            {!activeSessionId && location.pathname === "/" && (
              <button className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left bg-indigo-50 text-indigo-700 cursor-default">
                <MessageSquare className="w-3.5 h-3.5 shrink-0 text-indigo-500" />
                {expanded && (
                  <span className="text-xs truncate flex-1 italic">
                    New chat
                  </span>
                )}
              </button>
            )}
            {sessions.map((s) => (
              <button
                key={s.sessionId}
                onClick={() => navigate(`/chat/${s.sessionId}`)}
                className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left transition-colors group ${
                  s.sessionId === activeSessionId
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                }`}
                title={s.title}
              >
                <MessageSquare
                  className={`w-3.5 h-3.5 shrink-0 ${s.sessionId === activeSessionId ? "text-indigo-500" : "text-gray-400"}`}
                />
                {expanded && (
                  <>
                    <span className="text-xs truncate flex-1">{s.title}</span>
                    <Trash2
                      className="w-3 h-3 shrink-0 text-gray-300 group-hover:text-red-400 transition-colors"
                      onClick={(e) => handleDelete(e, s.sessionId)}
                    />
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="px-2 pb-2 border-t border-gray-100 pt-2 shrink-0">
        <Link
          to="/settings"
          title="Settings"
          className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <Settings className="w-4 h-4 shrink-0" />
          {expanded && <span className="text-xs font-medium">Settings</span>}
        </Link>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="h-10 flex items-center justify-center border-t border-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors shrink-0"
      >
        <ChevronRight
          className={`w-3.5 h-3.5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
        />
      </button>
    </aside>
  );
};

export default Sidebar;
