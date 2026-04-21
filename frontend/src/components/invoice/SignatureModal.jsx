import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { X, Upload, PenTool, Trash2 } from 'lucide-react';

const SignatureModal = ({ isOpen, onClose, onUpload }) => {
  const [tab, setTab] = useState('draw'); // 'draw' | 'upload'
  const sigCanvasRef = useRef(null);

  if (!isOpen) return null;

  const handleClear = () => sigCanvasRef.current?.clear();

  const handleSaveDraw = () => {
    if (sigCanvasRef.current?.isEmpty()) return;
    const dataUrl = sigCanvasRef.current.toDataURL('image/png');
    // Convert dataURL → File so existing upload flow works unchanged
    fetch(dataUrl)
      .then(r => r.blob())
      .then(blob => {
        const file = new File([blob], 'signature.png', { type: 'image/png' });
        const syntheticEvent = { target: { files: [file] } };
        onUpload(syntheticEvent);
        onClose();
      });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
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

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setTab('draw')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'draw' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Draw Signature
          </button>
          <button
            onClick={() => setTab('upload')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'upload' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Upload Image
          </button>
        </div>

        <div className="p-6">
          {tab === 'draw' ? (
            <>
              <p className="text-xs text-slate-400 mb-3 text-center">Draw your signature in the box below</p>
              <div className="border-2 border-dashed border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                <SignatureCanvas
                  ref={sigCanvasRef}
                  penColor="#1e293b"
                  canvasProps={{ width: 400, height: 160, className: 'w-full' }}
                  backgroundColor="transparent"
                />
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
                <button
                  onClick={handleSaveDraw}
                  className="flex-1 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  Use Signature
                </button>
              </div>
            </>
          ) : (
            <>
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group">
                  <div className="w-16 h-16 bg-slate-100 group-hover:bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <span className="text-slate-700 font-medium block mb-1">Upload Signature Image</span>
                  <span className="text-sm text-slate-400">PNG, JPG or SVG up to 2MB</span>
                </div>
                <input type="file" accept="image/*" onChange={(e) => { onUpload(e); onClose(); }} className="hidden" />
              </label>
              <p className="text-xs text-slate-400 text-center mt-4">Your signature will appear on the document</p>
            </>
          )}
        </div>

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
