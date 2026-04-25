import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowUp,
  Loader2,
  CheckCircle2,
  ListTodo,
  LayoutTemplate,
  FileCheck2,
} from "lucide-react";
import { aiService } from "../../services/aiService";
import { isAuthenticated } from "../../services/authService";
import InvoiceLivePreview from "./InvoiceLivePreview";
import AuthModal from "./AuthModal";
import TopBar from "./TopBar";
import ToolGrid from "./ToolGrid";
import TemplatePicker from "./TemplatePicker";

const FREE_LIMIT = 10;

const createChatSessionId = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID().replace(/-/g, "");
  }
  return `${Date.now()}${Math.random().toString(36).slice(2, 12)}`;
};

const STARTER_PROMPTS = [
  {
    label: "Services",
    prompts: [
      "Invoice for web design, client Acme Corp, logo $500, landing page $1200, 18% GST",
      "Freelance consulting, 10 hrs at $150/hr, client John Smith",
    ],
  },
];

const QUICK_FOLLOW_UPS = [
  "Update tax to 18%",
  "Change due date to 15 days from today",
  "Change currency to INR",
  "Add one more line item",
];

const SESSION_STORAGE_KEY = "invoicepro_ai_workspace_v1";

const MainWorkspace = ({ loadSessionId }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(1);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const confirmationShownRef = useRef(false); // track if confirmation already fired
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authReason, setAuthReason] = useState("");
  const [remainingQuota, setRemainingQuota] = useState(FREE_LIMIT);
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [requiredFields, setRequiredFields] = useState([]);
  const [requiredFieldValues, setRequiredFieldValues] = useState({});
  const [isRestoredSession, setIsRestoredSession] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const sessionIdRef = useRef(createChatSessionId());
  const hasHydratedSessionRef = useRef(false);

  const buildDefaultVisibilityFromAiData = (_data = {}) => ({
    businessInfo: true,
    clientInfo: true,
    shipTo: true,
    invoiceMeta: true,
    itemsTable: true,
    totals: true,
    terms: true,
    paymentInfo: true,
    signature: false,
    qrCodeSection: false,
    logoSection: true,
  });

  const getFlowStep = () => {
    if (showPreview && aiData) return 4;
    if (showTemplatePicker) return 3;
    if (requiredFields.length) return 2;
    if (messages.length > 0) return 1;
    return 0;
  };

  const getMissingFieldsFromQuestion = (question = "") =>
    question
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("- "))
      .map((line) => line.replace(/^-+\s*/, "").trim())
      .filter(Boolean);

  const serializeRequiredFields = (fields = []) =>
    fields.map((field) => field.toLowerCase().replace(/[^a-z0-9]+/g, "_"));

  const handleSubmitRequiredFields = () => {
    const payload = requiredFields
      .map((field, index) => {
        const key = serializeRequiredFields([field])[0] || `field_${index}`;
        const value = (requiredFieldValues[key] || "").trim();
        if (!value) return null;
        return `${field}: ${value}`;
      })
      .filter(Boolean)
      .join(", ");

    if (!payload) return;
    setRequiredFields([]);
    handleSend(payload);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Re-focus input after every AI response and on mount
  useEffect(() => {
    if (!loading) {
      textareaRef.current?.focus();
    }
  }, [loading, messages]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) {
        hasHydratedSessionRef.current = true;
        return;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.messages)) setMessages(parsed.messages);
      if (parsed.aiData) setAiData(parsed.aiData);
      if (typeof parsed.showPreview === "boolean")
        setShowPreview(parsed.showPreview);
      if (typeof parsed.showTemplatePicker === "boolean")
        setShowTemplatePicker(parsed.showTemplatePicker);
      if (typeof parsed.selectedTemplateId === "number")
        setSelectedTemplateId(parsed.selectedTemplateId);
      if (Array.isArray(parsed.requiredFields))
        setRequiredFields(parsed.requiredFields);
      if (
        parsed.requiredFieldValues &&
        typeof parsed.requiredFieldValues === "object"
      )
        setRequiredFieldValues(parsed.requiredFieldValues);
      if (typeof parsed.sessionId === "string" && parsed.sessionId.trim())
        sessionIdRef.current = parsed.sessionId;
      if ((parsed.messages?.length || 0) > 0 || parsed.aiData)
        setIsRestoredSession(true);
    } catch (error) {
      console.error("Failed to restore AI session", error);
    } finally {
      hasHydratedSessionRef.current = true;
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydratedSessionRef.current) return;
    const snapshot = {
      messages,
      aiData,
      showPreview,
      showTemplatePicker,
      selectedTemplateId,
      requiredFields,
      requiredFieldValues,
      sessionId: sessionIdRef.current,
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(snapshot));
  }, [
    messages,
    aiData,
    showPreview,
    showTemplatePicker,
    selectedTemplateId,
    requiredFields,
    requiredFieldValues,
  ]);

  // Load a session from the backend when sidebar item is clicked
  useEffect(() => {
    if (loadSessionId === undefined) return;

    if (loadSessionId === null) {
      // New chat — reset everything
      setMessages([]);
      setAiData(null);
      setShowPreview(false);
      setShowTemplatePicker(false);
      setRequiredFields([]);
      setRequiredFieldValues({});
      setIsRestoredSession(false);
      sessionIdRef.current = createChatSessionId();
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return;
    }

    aiService
      .getSession(loadSessionId)
      .then((res) => {
        if (!res?.session) return;
        const s = res.session;
        if (Array.isArray(s.messages)) setMessages(s.messages);
        if (s.knownContent && Object.keys(s.knownContent).length > 0)
          setAiData(s.knownContent);
        setShowPreview(false);
        setShowTemplatePicker(false);
        setRequiredFields([]);
        setRequiredFieldValues({});
        sessionIdRef.current = s.sessionId;
        setIsRestoredSession(true);
      })
      .catch(() => {});
  }, [loadSessionId]);

  const handleSend = async (forcedMessage = "") => {
    const text = (forcedMessage || input).trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await aiService.chat({
        sessionId: sessionIdRef.current,
        message: text,
      });

      if (res.sessionId) {
        sessionIdRef.current = res.sessionId;
      }

      if (res.limitReached) {
        setRemainingQuota(0);
        setAuthReason(res.message);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: res.message, kind: "limit-reached" },
        ]);
        setShowAuthModal(true);
        setLoading(false);
        return;
      }

      if (typeof res.remaining === "number") {
        setRemainingQuota(Math.max(0, res.remaining));
      }

      if (!res.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: res.message || "Something went wrong.",
          },
        ]);
        setLoading(false);
        return;
      }

      if (res.action === "clarify") {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            kind: "clarify",
            content: res.question,
          },
        ]);
      } else if (res.action === "ask") {
        // AI needs required fields — store extracted data but DON'T show preview yet
        if (res.extracted && Object.keys(res.extracted).length > 0) {
          setAiData(res.extracted);
          // intentionally NOT setting showPreview here
        }
        const missingFields = getMissingFieldsFromQuestion(res.question || "");
        const nextValues = {};
        missingFields.forEach((field, index) => {
          const key = serializeRequiredFields([field])[0] || `field_${index}`;
          nextValues[key] = requiredFieldValues[key] || "";
        });
        setRequiredFields(missingFields);
        setRequiredFieldValues(nextValues);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            kind: "missing-fields",
            content:
              res.question ||
              "Please share a few required details to continue.",
            missingFields,
          },
        ]);
      } else if (res.action === "generate") {
        setAiData(res.data);
        setRequiredFields([]);
        setRequiredFieldValues({});

        const isRefinement = showPreview; // preview already open = refinement

        if (isRefinement) {
          // Just update data — keep preview open, no template picker
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              kind: "refined",
              content: res.message || "Done! Your invoice has been updated.",
              quickActions: QUICK_FOLLOW_UPS,
            },
          ]);
        } else {
          // First generation — show template picker
          setShowPreview(false);
          setShowTemplatePicker(true);
          confirmationShownRef.current = false;

          const confirmationMsg = res.message || "Your invoice is ready!";
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              kind: "template-ready",
              content:
                "Got all the details! Now pick a template to preview your invoice:",
              aiData: res.data,
              showTemplatePicker: true,
              confirmationMsg,
              quickActions: QUICK_FOLLOW_UPS,
            },
          ]);
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: err.message || "Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAuthSuccess = () => {
    setLoggedIn(true);
    setShowAuthModal(false);

    // Sync any guest localStorage session to DB
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        const snap = JSON.parse(raw);
        if (
          snap.sessionId &&
          Array.isArray(snap.messages) &&
          snap.messages.length > 0
        ) {
          aiService
            .syncGuestSession({
              sessionId: snap.sessionId,
              messages: snap.messages,
              knownContent: snap.aiData || {},
              title:
                snap.messages.find((m) => m.role === "user")?.content ||
                "Invoice",
            })
            .catch(() => {});
        }
      }
    } catch {}

    // If user signed in from AI preview lock state, continue directly into builder.
    if (aiData && showPreview) {
      navigate("/template-builder", {
        state: {
          aiContent: aiData,
          selectedTemplateId,
          visibility: buildDefaultVisibilityFromAiData(aiData),
        },
      });
    }
  };

  const openAuthModal = (reason = "") => {
    setAuthReason(reason);
    setShowAuthModal(true);
  };

  const isFirstMessage = messages.length === 0;

  if (!hydrated) return null;

  // Shared input box — rendered in two different positions
  const InputBox = (
    <div className={isFirstMessage ? "w-full max-w-xl" : "w-full"}>
      {!loggedIn && (
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs text-gray-400">
            {remainingQuota > 0
              ? `${remainingQuota} free generation${remainingQuota !== 1 ? "s" : ""} remaining`
              : "Free limit reached"}
          </span>
          {remainingQuota <= 3 && remainingQuota > 0 && (
            <button
              onClick={() =>
                openAuthModal("Sign in for unlimited invoice generations.")
              }
              className="text-xs text-indigo-600 font-medium hover:underline"
            >
              Sign in for unlimited →
            </button>
          )}
        </div>
      )}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm focus-within:border-indigo-400 focus-within:shadow-md transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isFirstMessage
              ? "Describe your invoice..."
              : "Ask a follow-up or refine..."
          }
          rows={2}
          className="w-full px-4 pt-3.5 pb-2 text-sm text-gray-800 placeholder-gray-400 bg-transparent resize-none focus:outline-none rounded-t-2xl"
        />
        <div className="flex items-center justify-between px-3 pb-3">
          <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-indigo-600 bg-indigo-50 rounded-lg font-medium select-none">
            <Sparkles className="w-3 h-3" />
            {loading ? "Processing…" : "AI Assistant"}
          </span>
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
              input.trim() && !loading
                ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4" />
            )}
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
        <div
          className={`flex flex-col ${showPreview ? "w-1/2 border-r border-gray-200" : "w-full"} transition-all duration-300 overflow-hidden`}
        >
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
              <div className="w-full max-w-xl space-y-3 mt-5">
                {STARTER_PROMPTS.map((group) => (
                  <div key={group.label}>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                      {group.label}
                    </p>
                    <div className="space-y-2">
                      {group.prompts.map((s) => (
                        <button
                          key={s}
                          onClick={() => setInput(s)}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
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
                    <div
                      key={i}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-emerald-500 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                          <Sparkles className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-indigo-600 text-white rounded-tr-sm"
                            : "bg-gray-50 border border-gray-200 text-gray-800 rounded-tl-sm"
                        }`}
                      >
                        {msg.content.split("\n").map((line, li) => (
                          <p key={li} className={li > 0 ? "mt-1" : ""}>
                            {line
                              .split(/\*\*(.*?)\*\*/g)
                              .map((part, pi) =>
                                pi % 2 === 1 ? (
                                  <strong key={pi}>{part}</strong>
                                ) : (
                                  part
                                ),
                              )}
                          </p>
                        ))}
                        {msg.kind === "missing-fields" &&
                          Array.isArray(msg.missingFields) &&
                          msg.missingFields.length > 0 && (
                            <div className="mt-3 p-3 rounded-xl border border-indigo-100 bg-indigo-50/70">
                              <div className="space-y-2">
                                {msg.missingFields.map((field, index) => {
                                  const key =
                                    serializeRequiredFields([field])[0] ||
                                    `field_${index}`;
                                  return (
                                    <input
                                      key={key}
                                      value={requiredFieldValues[key] || ""}
                                      onChange={(e) =>
                                        setRequiredFieldValues((prev) => ({
                                          ...prev,
                                          [key]: e.target.value,
                                        }))
                                      }
                                      placeholder={field}
                                      className="w-full px-2.5 py-2 text-xs border border-indigo-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                  );
                                })}
                                <button
                                  onClick={handleSubmitRequiredFields}
                                  className="w-full mt-1 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                                >
                                  Submit
                                </button>
                              </div>
                            </div>
                          )}
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
                              if (
                                !confirmationShownRef.current &&
                                msg.confirmationMsg
                              ) {
                                confirmationShownRef.current = true;
                                setMessages((prev) => [
                                  ...prev,
                                  {
                                    role: "assistant",
                                    content: msg.confirmationMsg,
                                  },
                                ]);
                              }
                            }}
                          />
                        )}
                        {Array.isArray(msg.quickActions) &&
                          msg.quickActions.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {msg.quickActions.map((action) => (
                                <button
                                  key={action}
                                  onClick={() => setInput(action)}
                                  className="text-[11px] px-2 py-1 rounded-full bg-white border border-gray-300 text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700"
                                >
                                  {action}
                                </button>
                              ))}
                            </div>
                          )}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-emerald-500 flex items-center justify-center mr-2 mt-1">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                        <span className="text-xs text-gray-500">
                          Preparing your invoice...
                        </span>
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
              onSignInClick={() =>
                openAuthModal(
                  "Sign in to edit, download, and save your invoice.",
                )
              }
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
