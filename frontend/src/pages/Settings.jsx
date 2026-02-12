import { useState, useEffect } from "react";
import {
  User,
  BarChart3,
  Lock,
  Save,
  Globe,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { getCurrentUser, authAPI } from "../services/authService";

const tabs = [
  { id: "nameEmail", label: "My Name & Email", icon: User },
  { id: "changePassword", label: "Security", icon: Lock },
  { id: "emailReports", label: "Email Reports", icon: BarChart3 },
];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("nameEmail");
  const [searchParams, setSearchParams] = useSearchParams();
  const [userEmail, setUserEmail] = useState("");
  
  // Profile state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bussinessName: '',
    phone: '',
    address: '',
    websiteLink: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [emailReportFrequency, setEmailReportFrequency] = useState('never');
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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
    setMessage({ type: '', text: '' });
    setSaving(true);
    
    try {
      const response = await authAPI.updateProfile({
        name: profileData.name,
        bussinessName: profileData.bussinessName,
        phone: profileData.phone,
        address: profileData.address,
        websiteLink: profileData.websiteLink
      });
      
      // Backend returns { success: true, message: '...' }
      if (response.success || response.status === 'success') {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: response.message || response.data?.message || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setMessage({ type: '', text: '' });
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    
    setSaving(true);
    
    try {
      const response = await authAPI.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.status === 'success' || response.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: response.message || response.data?.message || 'Failed to change password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to change password' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEmailReportFrequency = async () => {
    setMessage({ type: '', text: '' });
    setSaving(true);
    
    try {
      const response = await authAPI.updateEmailReportFrequency({
        emailReportFrequency
      });
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Email report preference updated successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to update preference' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update preference' });
    } finally {
      setSaving(false);
    }
  };

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

                {loading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                    <span className="ml-2 text-slate-600">Loading profile...</span>
                  </div>
                ) : (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase">
                          Name
                        </label>
                        <input
                          name="name"
                          value={profileData.name}
                          onChange={handleProfileChange}
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

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase">
                          Phone Number
                        </label>
                        <input
                          name="phone"
                          type="tel"
                          value={profileData.phone}
                          onChange={handleProfileChange}
                          placeholder="+1 (555) 123-4567"
                          className="mt-2 w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase">
                          Website
                        </label>
                        <input
                          name="websiteLink"
                          type="url"
                          value={profileData.websiteLink}
                          onChange={handleProfileChange}
                          placeholder="https://yourwebsite.com"
                          className="mt-2 w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase">
                          Business Name
                        </label>
                        <input
                          name="bussinessName"
                          value={profileData.bussinessName}
                          onChange={handleProfileChange}
                          placeholder="Your business name"
                          className="mt-2 w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase">
                          Billing Address
                        </label>
                        <input
                          name="address"
                          value={profileData.address}
                          onChange={handleProfileChange}
                          placeholder="Your billing address"
                          className="mt-2 w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                    </div>
                  </>
                )}
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
                    name="oldPassword"
                    type="password"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    placeholder="Current Password"
                    className="px-4 py-3 border border-slate-200 rounded-xl"
                  />
                  <input
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="New Password"
                    className="px-4 py-3 border border-slate-200 rounded-xl"
                  />
                  <input
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm Password"
                    className="px-4 py-3 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* ================= REPORTS ================= */}
            {activeTab === "emailReports" && (
              <div className="p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-800 mb-2">
                    Email Reports
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Choose how often you'd like to receive automated invoice reports via email
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { value: 'weekly', label: 'Weekly', desc: 'Receive reports every Monday' },
                    { value: 'monthly', label: 'Monthly', desc: 'Receive reports on the 1st of each month' },
                    { value: 'never', label: 'Never', desc: 'Don\'t send me email reports' }
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        emailReportFrequency === opt.value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reports"
                        value={opt.value}
                        checked={emailReportFrequency === opt.value}
                        onChange={(e) => setEmailReportFrequency(e.target.value)}
                        className="mt-1 w-4 h-4 text-indigo-600"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-slate-800">{opt.label}</div>
                        <div className="text-sm text-slate-500 mt-1">{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex gap-3">
                    <BarChart3 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">What's included in the report?</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-700">
                        <li>Total invoices created</li>
                        <li>Paid, unpaid, and overdue counts</li>
                        <li>Total revenue and pending amounts</li>
                        <li>Quick link to your dashboard</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FOOTER ACTION BAR */}
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-200">
              {/* Message Display */}
              {message.text && (
                <div className={`mb-4 p-4 rounded-xl flex items-center gap-3 ${
                  message.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {message.type === 'success' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <span>{message.text}</span>
                </div>
              )}
              
              <button 
                onClick={
                  activeTab === 'changePassword' 
                    ? handleChangePassword 
                    : activeTab === 'emailReports'
                    ? handleSaveEmailReportFrequency
                    : handleSaveProfile
                }
                disabled={saving}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {activeTab === 'changePassword' ? 'Change Password' : 'Save Settings'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
