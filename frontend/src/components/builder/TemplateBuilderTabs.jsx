import { Mail, FileText } from 'lucide-react';

const TemplateBuilderTabs = ({ 
  activeTab, 
  emailData, 
  setEmailData, 
  templateConfig, 
  sendingEmail, 
  onSendEmail, 
  onCancel 
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">Send Custom Invoice</h2>
              <p className="text-slate-400 text-sm">Email this custom invoice to your client</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">From</label>
            <input
              type="email"
              value={emailData.from}
              onChange={(e) => setEmailData({ ...emailData, from: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">To *</label>
            <input
              type="email"
              value={emailData.to}
              onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="client@email.com"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="sendCopy"
              checked={emailData.sendCopy}
              onChange={(e) => setEmailData({ ...emailData, sendCopy: e.target.checked })}
              className="rounded border-slate-300"
            />
            <label htmlFor="sendCopy" className="text-sm text-slate-600">
              Send a copy to myself
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
            <input
              type="text"
              value={emailData.subject}
              onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
            <textarea
              value={emailData.message}
              onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Attachments Card */}
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 p-6">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">Attachments</h4>
            <p className="text-xs text-slate-400 mb-4">Custom invoice PDF will be attached automatically</p>

            {/* Invoice Preview Thumbnail */}
            <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-slate-200">
              <div className="w-20 h-28 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden flex-shrink-0">
                <div className="transform scale-[0.08] origin-top-left w-[1250%] h-[1250%]">
                  <div 
                    style={{
                      backgroundColor: templateConfig.backgroundColor,
                      fontFamily: templateConfig.typography.bodyFont,
                      fontSize: templateConfig.typography.bodySize,
                      color: templateConfig.textColor,
                      width: '850px',
                      minHeight: '1123px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      color: templateConfig.primaryColor,
                      fontSize: '48px',
                      fontWeight: 'bold'
                    }}>
                      {templateConfig.content.invoiceTitle}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-slate-700 truncate">
                    {templateConfig.templateName || 'Custom-Invoice'}.pdf
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">PDF • Auto-attached</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                  <span className="text-xs text-emerald-600">Will be generated and attached</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onCancel}
              className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={onSendEmail}
              disabled={sendingEmail || !emailData.to}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50"
            >
              <Mail className="w-4 h-4" />
              {sendingEmail ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateBuilderTabs;
