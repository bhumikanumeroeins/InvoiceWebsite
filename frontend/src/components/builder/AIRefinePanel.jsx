import { useState } from 'react';
import { Sparkles, Send, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-toastify';
import { aiService } from '../../services/aiService';

const QUICK_ACTIONS = [
  'Change due date to 30 days from today',
  'Add 10% discount to all items',
  'Update tax to 18%',
  'Make terms Net 15',
];

const AIRefinePanel = ({ content, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRefine = async (text) => {
    const msg = text || instruction;
    if (!msg.trim()) return;

    setLoading(true);
    try {
      const res = await aiService.refine(content, msg);
      if (res.success && res.data) {
        onUpdate(res.data);
        setInstruction('');
        toast.success('Invoice updated by AI');
      } else {
        toast.error(res.message || 'Failed to refine');
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl overflow-hidden">
      {/* Toggle Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-4 hover:bg-indigo-50/50 transition"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-emerald-500 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-slate-800 text-sm">AI Refine</span>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Gemini</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          {/* Quick actions */}
          <div className="flex flex-wrap gap-1.5">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action}
                onClick={() => handleRefine(action)}
                disabled={loading}
                className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-full px-2.5 py-1 transition disabled:opacity-50"
              >
                {action}
              </button>
            ))}
          </div>

          {/* Free-text input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && handleRefine()}
              placeholder="e.g. Change client name to John Doe..."
              className="flex-1 text-sm px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
            <button
              onClick={() => handleRefine()}
              disabled={loading || !instruction.trim()}
              className="p-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-xl hover:shadow-md transition disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRefinePanel;
