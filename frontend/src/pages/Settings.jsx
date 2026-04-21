import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import {
  User,
  BarChart3,
  Lock,
  Save,
  Loader2,
  FileText,
  ArrowLeft,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { getCurrentUser, authAPI } from "../services/authService";

const tabs = [
  { id: "nameEmail", label: "My Name & Email", icon: User },
  { id: "changePassword", label: "Security", icon: Lock },
  { id: "emailReports", label: "Email Reports", icon: BarChart3 },
];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("nameEmail");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bussinessName: '',
    phone: '',
    address: '',
    websiteLink: '',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [emailReportFrequency, setEmailReportFrequency] = useState('never');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, []);

  useEffect(() => {
    const user = getCurrentUser();
    if (user?.email) setUserEmail(user.email);
    fetchProfile();
    fetchEmailReportFrequency();
  }, []);

  useEffect(() => {
    const handler = () => setShowUserDropdown(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await authAPI.getProfile();
      if (response.success) {
        setProfileData(response.data);
        setUserEmail(response.data.email);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailReportFrequency = async () => {
    try {
      const response = await authAPI.getEmailReportFrequency();
      if (response.success && response.data) {
        setEmailReportFrequency(response.data.emailReportFrequency || 'never');
      }
    } catch (error) {
      console.error('Failed to fetch email report frequency:', error);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await authAPI.updateProfile({
        name: profileData.name,
        bussinessName: profileData.bussinessName,
        phone: profileData.phone,
        address: profileData.address,
        websiteLink: profileData.websiteLink,
      });
      if (response.success || response.status === 'success') {
        toast.success('Profile updated successfully!');
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.warning('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.warning('Password must be at least 6 characters');
      return;
    }
    setSaving(true);
    try {
      const response = await authAPI.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      if (response.status === 'success' || response.success) {
        toast.success('Password changed successfully!');
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(response.message || 'Failed to change password');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEmailReportFrequency = async () => {
    setSaving(true);
    try {
      const response = await authAPI.updateEmailReportFrequency({ emailReportFrequency });
      if (response.success) {
        toast.success('Email report preference updated successfully!');
      } else {
        toast.error(response.message || 'Failed to update preference');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update preference');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    authAPI.logout();
    navigate('/');
  };

  const changeTab = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header — matches Dashboard */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-emerald-500 flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-slate-900 hidden sm:block">InvoicePro</span>
          </Link>

          {/* Back to Dashboard */}
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          {/* User menu */}
          <div className="relative flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowUserDropdown((v) => !v)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-400 flex items-center justify-center text-white text-xs font-bold">
                {userEmail?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm hidden md:block max-w-[140px] truncate">{userEmail}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showUserDropdown && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-slate-200 py-2 min-w-[180px] z-50">
                <Link
                  to="/settings"
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                >
                  <Settings className="w-4 h-4" /> Settings
                </Link>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Page content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Account Settings</h1>
          <p className="text-slate-500 text-sm">Manage your profile, security and notification preferences.</p>
        </div>

        {/* Tab pills */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => changeTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-slate-900 text-white shadow'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">

          {/* PROFILE */}
          {activeTab === "nameEmail" && (
            <div className="p-8 space-y-6">
              <h2 className="text-lg font-semibold text-slate-800">Profile Information</h2>
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                  <span className="ml-2 text-slate-600">Loading profile...</span>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</label>
                      <input name="name" value={profileData.name} onChange={handleProfileChange} placeholder="Your name"
                        className="mt-2 w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</label>
                      <input value={userEmail} disabled
                        className="mt-2 w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone Number</label>
                      <input name="phone" type="tel" value={profileData.phone} onChange={handleProfileChange} placeholder="+1 (555) 123-4567"
                        className="mt-2 w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Website</label>
                      <input name="websiteLink" type="url" value={profileData.websiteLink} onChange={handleProfileChange} placeholder="https://yourwebsite.com"
                        className="mt-2 w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Business Name</label>
                      <input name="bussinessName" value={profileData.bussinessName} onChange={handleProfileChange} placeholder="Your business name"
                        className="mt-2 w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Billing Address</label>
                      <input name="address" value={profileData.address} onChange={handleProfileChange} placeholder="Your billing address"
                        className="mt-2 w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* SECURITY */}
          {activeTab === "changePassword" && (
            <div className="p-8 space-y-6">
              <h2 className="text-lg font-semibold text-slate-800">Change Password</h2>
              <div className="grid md:grid-cols-3 gap-5">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Current Password</label>
                  <input name="oldPassword" type="password" value={passwordData.oldPassword} onChange={handlePasswordChange} placeholder="••••••••"
                    className="mt-2 w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">New Password</label>
                  <input name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} placeholder="••••••••"
                    className="mt-2 w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Confirm Password</label>
                  <input name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} placeholder="••••••••"
                    className="mt-2 w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
              </div>
            </div>
          )}

          {/* EMAIL REPORTS */}
          {activeTab === "emailReports" && (
            <div className="p-8 space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-1">Email Reports</h2>
                <p className="text-slate-500 text-sm">Choose how often you'd like to receive automated invoice reports.</p>
              </div>
              <div className="space-y-3">
                {[
                  { value: 'weekly', label: 'Weekly', desc: 'Receive reports every Monday' },
                  { value: 'monthly', label: 'Monthly', desc: 'Receive reports on the 1st of each month' },
                  { value: 'never', label: 'Never', desc: "Don't send me email reports" },
                ].map((opt) => (
                  <label key={opt.value} className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    emailReportFrequency === opt.value ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}>
                    <input type="radio" name="reports" value={opt.value} checked={emailReportFrequency === opt.value}
                      onChange={(e) => setEmailReportFrequency(e.target.value)} className="mt-1 w-4 h-4 text-indigo-600" />
                    <div>
                      <div className="font-medium text-slate-800">{opt.label}</div>
                      <div className="text-sm text-slate-500 mt-0.5">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Save button */}
          <div className="px-8 py-5 bg-slate-50 border-t border-slate-200">
            <button
              onClick={
                activeTab === 'changePassword' ? handleChangePassword
                  : activeTab === 'emailReports' ? handleSaveEmailReportFrequency
                  : handleSaveProfile
              }
              disabled={saving}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
                : <><Save className="w-5 h-5" />{activeTab === 'changePassword' ? 'Change Password' : 'Save Settings'}</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
