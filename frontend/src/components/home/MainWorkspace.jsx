import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowUp,
  Loader2,
  CheckCircle2,
  LayoutTemplate,
  X,
  PanelRightClose,
  PanelRightOpen,
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

// urlSessionId — the :sessionId from the URL (undefined on /)
const MainWorkspace = ({ urlSessionId }) => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(1);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authReason, setAuthReason] = useState("");
  const [remainingQuota, setRemainingQuota] = useState(FREE_LIMIT);
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [requiredFields, setRequiredFields] = useState([]);
  const [requiredFieldValues, setRequiredFieldValues] = useState({});
  const [loadingSession, setLoadingSession] = useState(false);
  const [showChangeTemplate, setShowChangeTemplate] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  // sessionIdRef holds the active backend session ID for the current chat
  const sessionIdRef = useRef(urlSessionId || createChatSessionId());
  const confirmationShownRef = useRef(false);

  const buildDefaultVisibility = () => ({
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

  useEffect(() => {
    if (!urlSessionId) {
      setMessages([]);
      setAiData(null);
      setShowPreview(false);
      setShowTemplatePicker(false);
      setRequiredFields([]);
      setRequiredFieldValues({});
      confirmationShownRef.current = false;
      sessionIdRef.current = createChatSessionId();
      return;
    }

    setLoadingSession(true);
    aiService
      .getSession(urlSessionId)
      .then((res) => {
        if (!res?.session) return;
        const s = res.session;

        const hasInvoice =
          s.knownContent && Object.keys(s.knownContent).length > 0;
        const templateId =
          typeof s.selectedTemplateId === "number" ? s.selectedTemplateId : 1;

        let restoredMessages = Array.isArray(s.messages) ? [...s.messages] : [];
        if (hasInvoice) {
          const pickerIdx = restoredMessages.findLastIndex(
            (m) => m.role === "assistant" && m.kind === "template-ready",
          );
          if (pickerIdx !== -1) {
            restoredMessages = restoredMessages.map((m, i) =>
              i === pickerIdx
                ? {
                    ...m,
                    aiData: s.knownContent,
                    showTemplatePicker: true,
                    confirmationMsg: m.confirmationMsg || "",
                    quickActions: m.quickActions || QUICK_FOLLOW_UPS,
                  }
                : m,
            );
          }
          const refinedIdx = restoredMessages.findLastIndex(
            (m) => m.role === "assistant" && m.kind === "refined",
          );
          if (refinedIdx !== -1 && !restoredMessages[refinedIdx].quickActions) {
            restoredMessages = restoredMessages.map((m, i) =>
              i === refinedIdx ? { ...m, quickActions: QUICK_FOLLOW_UPS } : m,
            );
          }
        }

        setMessages(restoredMessages);
        if (hasInvoice) setAiData(s.knownContent);
        setSelectedTemplateId(templateId);
        setShowPreview(hasInvoice && s.lastAction === "generate");
        setShowTemplatePicker(false);
        confirmationShownRef.current = hasInvoice;
        setRequiredFields([]);
        setRequiredFieldValues({});
        sessionIdRef.current = s.sessionId;
      })
      .catch(() => {})
      .finally(() => setLoadingSession(false));
  }, [urlSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!loading) textareaRef.current?.focus();
  }, [loading, messages]);

  // ── Helpers ─────────────────────────────────────────────────────────────────
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

  // ── Send message ─────────────────────────────────────────────────────────────
  const handleSend = async (forcedMessage = "") => {
    const text = (forcedMessage || input).trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await aiService.chat({
        sessionId: sessionIdRef.current,
        message: text,
      });

      // Backend may assign/confirm the session ID — update URL if it changed
      if (res.sessionId && res.sessionId !== sessionIdRef.current) {
        sessionIdRef.current = res.sessionId;
        // Push the session URL so refresh / back button work
        navigate(`/chat/${res.sessionId}`, { replace: true });
      } else if (res.sessionId && !urlSessionId) {
        // First message on a fresh / chat — move to the session URL
        sessionIdRef.current = res.sessionId;
        navigate(`/chat/${res.sessionId}`, { replace: true });
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
          { role: "assistant", kind: "clarify", content: res.question },
        ]);
      } else if (res.action === "ask") {
        if (res.extracted && Object.keys(res.extracted).length > 0) {
          setAiData(res.extracted);
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

        const isRefinement = showPreview;

        if (isRefinement) {
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

  // ── Auth success ─────────────────────────────────────────────────────────────
  const handleAuthSuccess = () => {
    setLoggedIn(true);
    setShowAuthModal(false);

    if (sessionIdRef.current && messages.length > 0) {
      aiService
        .syncGuestSession({
          sessionId: sessionIdRef.current,
          messages,
          knownContent: aiData || {},
          selectedTemplateId,
          title: messages.find((m) => m.role === "user")?.content || "Invoice",
        })
        .then((res) => {
          if (res?.success && sessionIdRef.current) {
            navigate(`/chat/${sessionIdRef.current}`, { replace: true });
          }
        })
        .catch(() => {});
    }

    // If signed in from the preview lock, go straight to the builder
    if (aiData && showPreview) {
      navigate("/template-builder", {
        state: {
          fromAiChatSessionId: sessionIdRef.current,
          aiContent: aiData,
          selectedTemplateId,
          visibility: buildDefaultVisibility(),
        },
      });
    }
  };

  const openAuthModal = (reason = "") => {
    setAuthReason(reason);
    setShowAuthModal(true);
  };

  const isFirstMessage = messages.length === 0;

  if (loadingSession) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
      </div>
    );
  }

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
      {/* spacer — overlay is rendered at root level, not here */}
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
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-indigo-600 bg-indigo-50 rounded-lg font-medium select-none">
              <Sparkles className="w-3 h-3" />
              {loading ? "Processing…" : "AI Assistant"}
            </span>
            {/* Change Template button — only when invoice data is ready */}
            {aiData && !isFirstMessage && (
              <>
                <button
                  onClick={() => setShowChangeTemplate((v) => !v)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                    showChangeTemplate
                      ? "bg-indigo-600 text-white"
                      : "text-gray-500 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600"
                  }`}
                >
                  <LayoutTemplate className="w-3 h-3" />
                  Template
                </button>
                <button
                  onClick={() => setShowPreview((v) => !v)}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg text-gray-500 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  title={showPreview ? "Hide preview" : "Show preview"}
                >
                  {showPreview ? (
                    <PanelRightClose className="w-3 h-3" />
                  ) : (
                    <PanelRightOpen className="w-3 h-3" />
                  )}
                  {showPreview ? "Hide" : "Show"}
                </button>
              </>
            )}{" "}
          </div>
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
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 overflow-y-auto">
              <h1 className="text-[28px] font-bold text-gray-900 flex items-center gap-2 mb-1">
                InvoicePro Workspace
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              </h1>
              <p className="text-gray-400 text-sm mb-8">
                Describe your invoice — AI fills in the details instantly
              </p>
              {InputBox}
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
            <>
              <div className="flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto w-full px-6 py-6 space-y-4">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-7 h-7 rounded-full bg-linear-to-br from-indigo-600 to-emerald-500 flex items-center justify-center mr-2 mt-1 shrink-0">
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

                        {/* Missing fields form */}
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

                        {/* Invoice ready badge */}
                        {msg.aiData && (
                          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            Invoice data ready — pick a template below
                          </div>
                        )}

                        {/* Template picker */}
                        {msg.showTemplatePicker && (
                          <TemplatePicker
                            selectedId={selectedTemplateId}
                            readOnly={showPreview}
                            onSelect={(t) => {
                              setSelectedTemplateId(t.id);
                              setShowPreview(true);
                              if (loggedIn) {
                                aiService
                                  .updateSession(sessionIdRef.current, {
                                    selectedTemplateId: t.id,
                                  })
                                  .catch(() => {});
                              }
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

                        {/* Quick-action chips */}
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
                      <div className="w-7 h-7 rounded-full bg-linear-to-br from-indigo-600 to-emerald-500 flex items-center justify-center mr-2 mt-1">
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

              <div className="border-t border-gray-100 bg-white px-6 py-4 shrink-0">
                {InputBox}
              </div>
            </>
          )}
        </div>

        {/* ── RIGHT: Live invoice preview ── */}
        {aiData && (
          <div
            className={`flex flex-col bg-gray-50 overflow-hidden transition-all duration-300 ease-in-out ${
              showPreview ? "w-1/2" : "w-0"
            }`}
          >
            {showPreview && (
              <InvoiceLivePreview
                aiData={aiData}
                templateId={selectedTemplateId}
                sessionId={sessionIdRef.current}
                isLoggedIn={loggedIn}
                onSignInClick={() =>
                  openAuthModal(
                    "Sign in to edit, download, and save your invoice.",
                  )
                }
              />
            )}
          </div>
        )}
      </div>

      {/* Change Template — fixed full-screen overlay, always properly sized */}
      {showChangeTemplate && aiData && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setShowChangeTemplate(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
              <span className="text-sm font-semibold text-gray-800">
                Change template
              </span>
              <button
                onClick={() => setShowChangeTemplate(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto p-4">
              <TemplatePicker
                selectedId={selectedTemplateId}
                readOnly={false}
                onSelect={(t) => {
                  setSelectedTemplateId(t.id);
                  setShowPreview(true);
                  setShowChangeTemplate(false);
                  if (loggedIn) {
                    aiService
                      .updateSession(sessionIdRef.current, {
                        selectedTemplateId: t.id,
                      })
                      .catch(() => {});
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

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
