import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';

const Reminders = () => {
  const [reminders, setReminders] = useState([
    {
      id: 1,
      daysBefore: 8,
      enabled: true,
      subject: 'Invoice Due in 8 Days - {invoice_number}',
      message: `Dear {customer_name},

This is a friendly reminder that your invoice #{invoice_number} for ${'{amount}'} is due on {due_date}.

Please ensure payment is made by the due date to avoid any late fees.

If you have already made the payment, please disregard this notice.

Thank you for your business!

Best regards,
{company_name}`,
      attachInvoice: true
    },
    {
      id: 2,
      daysBefore: 3,
      enabled: true,
      subject: 'Invoice Due in 3 Days - {invoice_number}',
      message: `Dear {customer_name},

Your invoice #{invoice_number} for ${'{amount}'} is due in 3 days on {due_date}.

Please arrange payment immediately to avoid late payment charges.

Contact us if you need to discuss payment terms.

Thank you!

Best regards,
{company_name}`,
      attachInvoice: true
    },
    {
      id: 3,
      daysBefore: 0,
      enabled: true,
      subject: 'Invoice Due Today - {invoice_number}',
      message: `Dear {customer_name},

Your invoice #{invoice_number} for ${'{amount}'} is due TODAY.

Please make payment immediately to avoid additional charges.

If payment has already been made, please provide confirmation.

Contact us immediately if there are any issues.

Best regards,
{company_name}`,
      attachInvoice: true
    }
  ]);

  const [selectedReminder, setSelectedReminder] = useState(reminders[0]);
  const [previewData, setPreviewData] = useState({
    customer_name: 'John Smith',
    invoice_number: 'INV-001',
    amount: '$2,500.00',
    due_date: 'January 30, 2026',
    company_name: 'Your Company Name'
  });

  const handleReminderChange = (id, field, value) => {
    setReminders(prev => prev.map(reminder =>
      reminder.id === id ? { ...reminder, [field]: value } : reminder
    ));

    if (selectedReminder.id === id) {
      setSelectedReminder(prev => ({ ...prev, [field]: value }));
    }
  };

  const getPreviewText = (text) => {
    return text
      .replace(/{customer_name}/g, previewData.customer_name)
      .replace(/{invoice_number}/g, previewData.invoice_number)
      .replace(/{amount}/g, previewData.amount)
      .replace(/{due_date}/g, previewData.due_date)
      .replace(/{company_name}/g, previewData.company_name);
  };

  const getTimelineLabel = (daysBefore) => {
    if (daysBefore === 0) return 'On due date';
    if (daysBefore === 1) return '1 day before';
    return `${daysBefore} days before`;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">📬 Reminder Settings</h1>
                <p className="text-gray-600 mt-1">Configure automated email reminders for invoice due dates</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Panel - Settings */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Invoice Due Date Timeline</h2>

                  {reminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className={`border rounded-lg p-4 mb-4 cursor-pointer transition-all ${
                        selectedReminder.id === reminder.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedReminder(reminder)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${
                            reminder.enabled ? 'bg-green-500' : 'bg-gray-300'
                          }`}></div>
                          <span className="font-medium text-gray-900">
                            📅 {getTimelineLabel(reminder.daysBefore)}
                          </span>
                        </div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={reminder.enabled}
                            onChange={(e) => handleReminderChange(reminder.id, 'enabled', e.target.checked)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-600">Enabled</span>
                        </label>
                      </div>

                      {reminder.enabled && (
                        <div className="mt-3 text-sm text-gray-600">
                          Subject: {reminder.subject.length > 50 ? reminder.subject.substring(0, 50) + '...' : reminder.subject}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Edit Form */}
                {selectedReminder && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Edit Reminder: {getTimelineLabel(selectedReminder.daysBefore)}
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Subject
                        </label>
                        <input
                          type="text"
                          value={selectedReminder.subject}
                          onChange={(e) => handleReminderChange(selectedReminder.id, 'subject', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Enter email subject..."
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Use placeholders: {'{invoice_number}'}, {'{customer_name}'}, {'{amount}'}, {'{due_date}'}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Message Body
                        </label>
                        <textarea
                          rows={8}
                          value={selectedReminder.message}
                          onChange={(e) => handleReminderChange(selectedReminder.id, 'message', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Enter email message..."
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Available placeholders: {'{customer_name}'}, {'{invoice_number}'}, {'{amount}'}, {'{due_date}'}, {'{company_name}'}
                        </p>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="attachInvoice"
                          checked={selectedReminder.attachInvoice}
                          onChange={(e) => handleReminderChange(selectedReminder.id, 'attachInvoice', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="attachInvoice" className="ml-2 text-sm text-gray-700">
                          Attach invoice PDF to email
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Panel - Preview */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📧 Email Preview</h3>

                  {selectedReminder ? (
                    <div className="border border-gray-200 rounded-lg">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">To:</span> {previewData.customer_name} &lt;customer@example.com&gt;
                        </div>
                        <div className="text-sm mt-1">
                          <span className="font-medium text-gray-900">Subject:</span> {getPreviewText(selectedReminder.subject)}
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="text-sm text-gray-800 whitespace-pre-line">
                          {getPreviewText(selectedReminder.message)}
                        </div>

                        {selectedReminder.attachInvoice && (
                          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <div className="flex items-center text-sm text-blue-800">
                              <span className="mr-2">📎</span>
                              Invoice PDF attached
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Select a reminder to preview
                    </div>
                  )}
                </div>

                {/* Preview Data */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🎭 Preview Data</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                        <input
                          type="text"
                          value={previewData.customer_name}
                          onChange={(e) => setPreviewData(prev => ({ ...prev, customer_name: e.target.value }))}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                        <input
                          type="text"
                          value={previewData.invoice_number}
                          onChange={(e) => setPreviewData(prev => ({ ...prev, invoice_number: e.target.value }))}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Amount</label>
                        <input
                          type="text"
                          value={previewData.amount}
                          onChange={(e) => setPreviewData(prev => ({ ...prev, amount: e.target.value }))}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Due Date</label>
                        <input
                          type="text"
                          value={previewData.due_date}
                          onChange={(e) => setPreviewData(prev => ({ ...prev, due_date: e.target.value }))}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Company Name</label>
                        <input
                          type="text"
                          value={previewData.company_name}
                          onChange={(e) => setPreviewData(prev => ({ ...prev, company_name: e.target.value }))}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>
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

export default Reminders;