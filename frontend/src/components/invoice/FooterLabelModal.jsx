import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const FooterLabelModal = ({ isOpen, onClose, currentLabel, onUpdateLabel, hideLabel, onToggleHideLabel }) => {
  const [labelText, setLabelText] = useState(currentLabel);

  useEffect(() => {
    setLabelText(currentLabel);
  }, [currentLabel]);

  if (!isOpen) return null;

  const handleUpdate = () => {
    onUpdateLabel(labelText);
    onClose();
  };

  const handleReset = () => {
    setLabelText('Terms & Conditions');
    onUpdateLabel('Terms & Conditions');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Edit Footer Label</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Label Input */}
          <div className="flex items-center gap-3 mb-6">
            <input
              type="text"
              value={labelText}
              onChange={(e) => setLabelText(e.target.value)}
              placeholder="Enter label text"
              className="flex-1 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            <button
              onClick={handleUpdate}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
            >
              Update Label
            </button>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <button
              onClick={handleReset}
              className="text-indigo-600 hover:text-indigo-700 text-sm hover:underline block"
            >
              Reset to default "Terms & Conditions"
            </button>
            <button
              onClick={() => onToggleHideLabel(!hideLabel)}
              className="text-indigo-600 hover:text-indigo-700 text-sm hover:underline block"
            >
              {hideLabel ? 'Show label (label will be displayed)' : 'Hide label (label won\'t be displayed)'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FooterLabelModal;
