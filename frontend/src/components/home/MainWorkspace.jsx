import { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowUp, Loader2, CheckCircle2 } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { isAuthenticated } from '../../services/authService';
import InvoiceLivePreview from './InvoiceLivePreview';
import AuthModal from './AuthModal';
import TopBar from './TopBar';
import ToolGrid from './ToolGrid';
import TemplatePicker from './TemplatePicker';

const FREE_LIMIT = 10;
const STORAGE_KEY = 'ip_prompt_count';

const getLocalCount = () => parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
const incLocalCount = () => localStorage.setItem(STORAGE_KEY, String(getLocalCount() + 1));

const suggestions = [
  'Invoice for web design, client Acme Corp, logo $500, landing page $1200, 18% GST',
  'Freelance consulting, 10 hrs at $150/hr, client John Smith',
  'Invoice from TechSolutions to Global Retail, software dev $3000, testing $800',
  'Photography session $800, client Sarah Lee, no tax',
];

const MainWorkspace = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(1);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const confirmationShownRef = useRef(false); // track if confirmation already fired
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authReason, setAuthReason] = useState('');
  const [localCount, setLocalCount] = useState(getLocalCount());
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Re-focus input after every AI response and on mount
  useEffect(() => {
    if (!loading) {
      textareaRef.current?.focus();
    }
  }, [loading, messages]);

  const remaining = Math.max(0, FREE_LIMIT - localCount);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    if (!loggedIn && localCount >= FREE_LIMIT) {
      setAuthReason(`You've used all ${FREE_LIMIT} free generations. Sign in to continue.`);
      setShowAuthModal(true);
      return;
    }

    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await aiService.chat(newMessages.map(m => ({ role: m.role, content: m.content })));

      if (res.limitReached) {
        setAuthReason(res.message);
        setShowAuthModal(true);
        setLoading(false);
        return;
      }

      if (!res.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: res.message || 'Something went wrong.' }]);
        setLoading(false);
        return;
      }

      if (res.action === 'ask') {
        // AI needs required fields — store extracted data but DON'T show preview yet
        if (res.extracted && Object.keys(res.extracted).length > 0) {
          setAiData(res.extracted);
          // intentionally NOT setting showPreview here
        }
        setMessages(prev => [...prev, { role: 'assistant', content: res.question }]);
      } else if (res.action === 'generate') {
        incLocalCount();
        setLocalCount(getLocalCount());
        setAiData(res.data);

        const isRefinement = showPreview; // preview already open = refinement

        if (isRefinement) {
          // Just update data — keep preview open, no template picker
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: res.message || 'Done! Your invoice has been updated.',
          }]);
        } else {
          // First generation — show template picker
          setShowPreview(false);
          setShowTemplatePicker(true);
          confirmationShownRef.current = false;

          const confirmationMsg = res.message || 'Your invoice is ready!';
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: 'Got all the details! Now pick a template to preview your invoice:',
            aiData: res.data,
            showTemplatePicker: true,
            confirmationMsg,
          }]);
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: err.message || 'Something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAuthSuccess = () => {
    setLoggedIn(true);
    setShowAuthModal(false);
  };

  const openAuthModal = (reason = '') => {
    setAuthReason(reason);
    setShowAuthModal(true);
  };

  const isFirstMessage = messages.length === 0;

  // Shared input box — rendered in two different positions
  const InputBox = (
    <div className={isFirstMessage ? 'w-full max-w-xl' : 'w-full'}>
      {!loggedIn && (
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs text-gray-400">
            {remaining > 0 ? `${remaining} free generation${remaining !== 1 ? 's' : ''} remaining` : 'Free limit reached'}
          </span>
          {remaining <= 3 && remaining > 0 && (
            <button
              onClick={() => openAuthModal('Sign in for unlimited invoice generations.')}
              className="text-xs text-indigo-600 font-medium hover:underline"
            >
              Sign in for unlimited →
            </button>
          )}
        </div>
      )}
      <div className="relative bg-white border border-gray-200 rounded-2xl shadow-sm focus-within:border-indigo-400 focus-within:shadow-md transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isFirstMessage ? 'Describe your invoice...' : 'Ask a follow-up or refine...'}
          rows={2}
          className="w-full px-4 pt-3.5 pb-12 text-sm text-gray-800 placeholder-gray-400 bg-transparent resize-none focus:outline-none"
        />
        <div className="absolute bottom-3 left-4 right-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-indigo-600 bg-indigo-50 rounded-lg font-medium select-none">
            <Sparkles className="w-3 h-3" />
            AI
          </span>
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
              input.trim() && !loading
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <p className="text-center text-xs text-gray-400 mt-2">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      <TopBar loggedIn={loggedIn} onSignIn={() => openAuthModal()} />

      <div className="flex-1 flex overflow-hidden">

        {/* ── LEFT: Chat panel ── */}
        <div className={`flex flex-col ${showPreview ? 'w-1/2 border-r border-gray-200' : 'w-full'} transition-all duration-300 overflow-hidden`}>

          {isFirstMessage ? (
            /* ── CENTERED welcome + input ── */
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 overflow-y-auto">
              <h1 className="text-[28px] font-bold text-gray-900 flex items-center gap-2 mb-1">
                InvoicePro Workspace
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              </h1>
              <p className="text-gray-400 text-sm mb-8">
                Describe your invoice — AI fills in the details instantly
              </p>

              {/* Input centered */}
              {InputBox}

              {/* Suggestion chips */}
              <div className="w-full max-w-xl space-y-2 mt-5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="mt-10 w-full flex justify-center">
                <ToolGrid />
              </div>
            </div>
          ) : (
            /* ── CHAT mode: messages scroll + input pinned bottom ── */
            <>
              <div className="flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto w-full px-6 py-6 space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'assistant' && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-emerald-500 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                          <Sparkles className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                      <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-sm'
                          : 'bg-gray-50 border border-gray-200 text-gray-800 rounded-tl-sm'
                      }`}>
                        {msg.content.split('\n').map((line, li) => (
                          <p key={li} className={li > 0 ? 'mt-1' : ''}>
                            {line.split(/\*\*(.*?)\*\*/g).map((part, pi) =>
                              pi % 2 === 1 ? <strong key={pi}>{part}</strong> : part
                            )}
                          </p>
                        ))}
                        {msg.aiData && (
                          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                            Invoice data ready — pick a template below
                          </div>
                        )}
                        {msg.showTemplatePicker && (
                          <TemplatePicker
                            selectedId={selectedTemplateId}
                            onSelect={(t) => {
                              setSelectedTemplateId(t.id);
                              setShowPreview(true);
                              // Only fire confirmation message once
                              if (!confirmationShownRef.current && msg.confirmationMsg) {
                                confirmationShownRef.current = true;
                                setMessages(prev => [...prev, {
                                  role: 'assistant',
                                  content: msg.confirmationMsg,
                                }]);
                              }
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-emerald-500 flex items-center justify-center mr-2 mt-1">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3">
                        <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input pinned to bottom */}
              <div className="border-t border-gray-100 bg-white px-6 py-4 flex-shrink-0">
                {InputBox}
              </div>
            </>
          )}
        </div>

        {/* ── RIGHT: Live invoice preview ── */}
        {showPreview && aiData && (
          <div className="w-1/2 flex flex-col bg-gray-50 overflow-hidden">
            <InvoiceLivePreview
              aiData={aiData}
              templateId={selectedTemplateId}
              isLoggedIn={loggedIn}
              onSignInClick={() => openAuthModal('Sign in to edit, download, and save your invoice.')}
            />
          </div>
        )}
      </div>

      {showAuthModal && (
        <AuthModal
          reason={authReason}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
};

export default MainWorkspace;
