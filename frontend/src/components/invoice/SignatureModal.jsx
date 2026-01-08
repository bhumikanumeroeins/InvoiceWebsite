import { X, Upload, PenTool } from 'lucide-react';

const SignatureModal = ({ isOpen, onClose, onUpload }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <PenTool className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Add Signature</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Upload Area */}
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group">
              <div className="w-16 h-16 bg-slate-100 group-hover:bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
                <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </div>
              <span className="text-slate-700 font-medium block mb-1">Upload Signature Image</span>
              <span className="text-sm text-slate-400">PNG, JPG or SVG up to 2MB</span>
            </div>
            <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
          </label>

          <p className="text-xs text-slate-400 text-center mt-4">
            Your signature will appear on the document
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6">
          <button onClick={onClose} className="w-full py-3 border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-all">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignatureModal;
