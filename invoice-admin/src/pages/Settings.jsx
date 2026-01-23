import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('company');

  const tabs = [
    { id: 'company', name: 'Company Profile' },
    { id: 'logo', name: 'Logo Upload' },
    { id: 'footer', name: 'Invoice Footer' },
    { id: 'payment', name: 'Payment Details' },
    { id: 'bank', name: 'Bank Info' },
    { id: 'upi', name: 'UPI QR' },
    { id: 'email', name: 'Email SMTP' },
    { id: 'colors', name: 'Brand Colors' },
    { id: 'template', name: 'Default Template' },
    { id: 'currency', name: 'Currency' },
    { id: 'timezone', name: 'Timezone' },
    { id: 'reminders', name: 'Reminder Defaults' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'company':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Company Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Company Name</label>
                <input type="text" className="w-full p-2 border rounded" placeholder="Enter company name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Email</label>
                <input type="email" className="w-full p-2 border rounded" placeholder="Enter email" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input type="tel" className="w-full p-2 border rounded" placeholder="Enter phone" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Website</label>
                <input type="url" className="w-full p-2 border rounded" placeholder="Enter website" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea className="w-full p-2 border rounded" rows="3" placeholder="Enter address"></textarea>
            </div>
          </div>
        );
      case 'logo':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Logo Upload</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input type="file" accept="image/*" className="hidden" id="logo-upload" />
              <label htmlFor="logo-upload" className="cursor-pointer">
                <div className="text-gray-500">Click to upload logo</div>
                <div className="text-sm text-gray-400 mt-1">PNG, JPG up to 2MB</div>
              </label>
            </div>
          </div>
        );
      case 'footer':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Invoice Footer</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Footer Text</label>
              <textarea className="w-full p-2 border rounded" rows="4" placeholder="Enter footer text for invoices"></textarea>
            </div>
          </div>
        );
      case 'payment':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Payment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Payment Terms</label>
                <select className="w-full p-2 border rounded">
                  <option>Net 30</option>
                  <option>Net 15</option>
                  <option>Due on Receipt</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Late Fee (%)</label>
                <input type="number" className="w-full p-2 border rounded" placeholder="1.5" />
              </div>
            </div>
          </div>
        );
      case 'bank':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Bank Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Bank Name</label>
                <input type="text" className="w-full p-2 border rounded" placeholder="Enter bank name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Account Number</label>
                <input type="text" className="w-full p-2 border rounded" placeholder="Enter account number" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">IFSC Code</label>
                <input type="text" className="w-full p-2 border rounded" placeholder="Enter IFSC code" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Account Holder</label>
                <input type="text" className="w-full p-2 border rounded" placeholder="Enter account holder name" />
              </div>
            </div>
          </div>
        );
      case 'upi':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">UPI QR Code</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input type="file" accept="image/*" className="hidden" id="upi-upload" />
              <label htmlFor="upi-upload" className="cursor-pointer">
                <div className="text-gray-500">Upload UPI QR Code</div>
                <div className="text-sm text-gray-400 mt-1">PNG, JPG up to 2MB</div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">UPI ID</label>
              <input type="text" className="w-full p-2 border rounded" placeholder="yourname@upi" />
            </div>
          </div>
        );
      case 'email':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Email SMTP Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">SMTP Host</label>
                <input type="text" className="w-full p-2 border rounded" placeholder="smtp.gmail.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">SMTP Port</label>
                <input type="number" className="w-full p-2 border rounded" placeholder="587" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input type="email" className="w-full p-2 border rounded" placeholder="your-email@gmail.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input type="password" className="w-full p-2 border rounded" placeholder="Enter password" />
              </div>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="tls" className="mr-2" />
              <label htmlFor="tls" className="text-sm">Use TLS</label>
            </div>
          </div>
        );
      case 'colors':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Brand Colors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Primary Color</label>
                <input type="color" className="w-full h-10 border rounded" defaultValue="#3B82F6" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Secondary Color</label>
                <input type="color" className="w-full h-10 border rounded" defaultValue="#10B981" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Accent Color</label>
                <input type="color" className="w-full h-10 border rounded" defaultValue="#F59E0B" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Text Color</label>
                <input type="color" className="w-full h-10 border rounded" defaultValue="#1F2937" />
              </div>
            </div>
          </div>
        );
      case 'template':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Default Template</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Select Default Template</label>
              <select className="w-full p-2 border rounded">
                <option>Minimal</option>
                <option>Corporate</option>
                <option>Modern</option>
                <option>Bold</option>
                <option>GST</option>
                <option>Export</option>
              </select>
            </div>
          </div>
        );
      case 'currency':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Currency Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Currency</label>
                <select className="w-full p-2 border rounded">
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>INR (₹)</option>
                  <option>GBP (£)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Currency Symbol Position</label>
                <select className="w-full p-2 border rounded">
                  <option>Before amount</option>
                  <option>After amount</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 'timezone':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Timezone Settings</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Timezone</label>
              <select className="w-full p-2 border rounded">
                <option>UTC</option>
                <option>Asia/Kolkata</option>
                <option>America/New_York</option>
                <option>Europe/London</option>
              </select>
            </div>
          </div>
        );
      case 'reminders':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Reminder Defaults</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Reminder (days)</label>
                <input type="number" className="w-full p-2 border rounded" placeholder="7" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Second Reminder (days)</label>
                <input type="number" className="w-full p-2 border rounded" placeholder="14" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Final Reminder (days)</label>
                <input type="number" className="w-full p-2 border rounded" placeholder="30" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Auto Send Reminders</label>
                <select className="w-full p-2 border rounded">
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-1/4">
                <div className="bg-white rounded-lg shadow p-4">
                  <nav className="space-y-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left px-3 py-2 rounded ${
                          activeTab === tab.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {tab.name}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
              <div className="lg:w-3/4">
                <div className="bg-white rounded-lg shadow p-6">
                  {renderTabContent()}
                  <div className="mt-6 flex justify-end">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;