import { useState, useEffect } from "react";
import {
  User,
  Settings,
  BarChart3,
  Lock,
  Save,
  Mail,
  Globe,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { getCurrentUser } from "../services/authService";

const tabs = [
  { id: "nameEmail", label: "My Name & Email", icon: User },
  { id: "languageRegion", label: "Language & Region", icon: Globe },
  { id: "changePassword", label: "Security", icon: Lock },
  { id: "emailReports", label: "Email Reports", icon: BarChart3 },
];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("nameEmail");
  const [searchParams, setSearchParams] = useSearchParams();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, []);

  useEffect(() => {
    const user = getCurrentUser();
    if (user?.email) setUserEmail(user.email);
  }, []);

  const changeTab = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white">
        {/* HERO */}
        <div className="bg-slate-900 relative overflow-hidden py-12">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Account Settings
            </h1>
            <p className="text-slate-400 max-w-xl mx-auto">
              Manage profile details, preferences, security and reports.
            </p>

            {/* TAB PILLS */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => changeTab(tab.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      active
                        ? "bg-gradient-to-r from-indigo-600 to-emerald-500 text-white shadow-lg"
                        : "bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white border border-white/10"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">

            {/* ================= PROFILE ================= */}
            {activeTab === "nameEmail" && (
              <div className="p-8 space-y-8">
                <h2 className="text-xl font-semibold text-slate-800">
                  Profile Information
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase">
                      Name
                    </label>
                    <input
                      placeholder="Your name"
                      className="mt-2 w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase">
                      Email
                    </label>
                    <input
                      value={userEmail}
                      disabled
                      className="mt-2 w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ================= LANGUAGE ================= */}
            {activeTab === "languageRegion" && (
              <div className="p-8 space-y-8">
                <h2 className="text-xl font-semibold text-slate-800">
                  Language & Region
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                  {["Language", "Region", "Units"].map((label) => (
                    <div key={label}>
                      <label className="text-xs font-semibold text-slate-500 uppercase">
                        {label}
                      </label>
                      <select className="mt-2 w-full px-4 py-3 bg-white border border-slate-200 rounded-xl">
                        <option>English</option>
                        <option>India</option>
                        <option>Metric</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= PASSWORD ================= */}
            {activeTab === "changePassword" && (
              <div className="p-8 space-y-8">
                <h2 className="text-xl font-semibold text-slate-800">
                  Security
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                  <input
                    type="password"
                    placeholder="Current Password"
                    className="px-4 py-3 border border-slate-200 rounded-xl"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    className="px-4 py-3 border border-slate-200 rounded-xl"
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="px-4 py-3 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* ================= REPORTS ================= */}
            {activeTab === "emailReports" && (
              <div className="p-8 space-y-6">
                <h2 className="text-xl font-semibold text-slate-800">
                  Email Reports
                </h2>

                {["Weekly", "Monthly", "Never"].map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
                  >
                    <input type="radio" name="reports" />
                    {opt}
                  </label>
                ))}
              </div>
            )}

            {/* FOOTER ACTION BAR */}
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-200">
              <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-3">
                <Save className="w-5 h-5" />
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
