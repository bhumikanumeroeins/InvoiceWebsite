import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Sparkles, ArrowLeft, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { aiService } from '../services/aiService';

import t1 from '../assets/templates/images/1.jpg';
import t2 from '../assets/templates/images/2.jpg';
import t3 from '../assets/templates/images/3.png';
import t4 from '../assets/templates/images/4.jpg';
import t5 from '../assets/templates/images/5.jpg';
import t6 from '../assets/templates/images/6.jpg';
import t7 from '../assets/templates/images/7.png';
import t8 from '../assets/templates/images/8.jpg';
import t9 from '../assets/templates/images/9.jpg';
import t10 from '../assets/templates/images/10.jpg';
import t11 from '../assets/templates/images/11.jpg';
import t12 from '../assets/templates/images/12.png';

const TEMPLATES = [
  { id: 1, name: 'Template 1', preview: t1 },
  { id: 2, name: 'Template 2', preview: t2 },
  { id: 3, name: 'Template 3', preview: t3 },
  { id: 4, name: 'Template 4', preview: t4 },
  { id: 5, name: 'Template 5', preview: t5 },
  { id: 6, name: 'Template 6', preview: t6 },
  { id: 7, name: 'Template 7', preview: t7 },
  { id: 8, name: 'Template 8', preview: t8 },
  { id: 9, name: 'Template 9', preview: t9 },
  { id: 10, name: 'Template 10', preview: t10 },
  { id: 11, name: 'Template 11', preview: t11 },
  { id: 12, name: 'Template 12', preview: t12 },
];

const EXAMPLE_PROMPTS = [
  "Invoice for web design project, client is Acme Corp at 123 Main St NYC. Items: Logo Design $500, Landing Page $1200, SEO Setup $300. 18% tax. Due in 30 days.",
  "Freelance invoice for John Smith. Consulting services 10 hours at $150/hr, Report writing 5 hours at $100/hr. No tax. Payment via bank transfer.",
  "Invoice from TechSolutions Ltd to Global Retail Inc. Software development $3000, Testing $800, Deployment $500. 10% tax. Due Feb 2026.",
];

const STEPS = ['Describe', 'Sections', 'Choose Template', 'Review'];

const CURRENCY_SYMBOLS = {
  USD: '$', INR: '₹', EUR: '€', GBP: '£', AUD: 'A$',
  CAD: 'C$', SGD: 'S$', AED: 'د.إ', JPY: '¥', CNY: '¥',
};

const ALL_SECTIONS = [
  { key: 'logoSection',   label: 'Logo' },
  { key: 'businessInfo',  label: 'Business Info' },
  { key: 'clientInfo',    label: 'Client Info' },
  { key: 'shipTo',        label: 'Ship To' },
  { key: 'invoiceMeta',   label: 'Invoice Meta' },
  { key: 'itemsTable',    label: 'Items Table' },
  { key: 'totals',        label: 'Totals' },
  { key: 'terms',         label: 'Terms & Conditions' },
  { key: 'paymentInfo',   label: 'Payment Info' },
  { key: 'signature',     label: 'Signature' },
  { key: 'qrCodeSection', label: 'QR Code' },
];

const DEFAULT_VISIBILITY = Object.fromEntries(ALL_SECTIONS.map(s => [s.key, true]));

const AIInvoiceGenerator = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [visibility, setVisibility] = useState(DEFAULT_VISIBILITY);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.warning('Please describe your invoice first.');
      return;
    }
    setLoading(true);
    try {
      const res = await aiService.generate(prompt);
      if (res.success) {
        setGeneratedContent(res.data);
        setStep(1); // go to sections step
      } else {
        toast.error(res.message || 'Failed to generate invoice');
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (key) => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAll = (val) => {
    setVisibility(Object.fromEntries(ALL_SECTIONS.map(s => [s.key, val])));
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setStep(3);
  };

  const handleLaunchBuilder = () => {
    if (!selectedTemplate || !generatedContent) return;
    navigate('/template-builder', {
      state: { aiContent: generatedContent, templateId: selectedTemplate.id, visibility },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="h-5 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-emerald-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-slate-800">AI Invoice Generator</span>
            <span className="text-xs text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">Powered by Gemini</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Generate Invoice with AI</h1>
          <p className="text-slate-500 max-w-xl mx-auto text-sm">
            Describe your invoice in plain English — AI fills in all the details. Pick a template and you're done.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                i === step
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : i < step
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                  : 'bg-white text-slate-400 border-slate-200'
              }`}>
                {i < step
                  ? <CheckCircle className="w-3.5 h-3.5" />
                  : <span className="w-4 h-4 text-center text-xs leading-4">{i + 1}</span>
                }
                {s}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-6 h-px ${i < step ? 'bg-emerald-400' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 0 — Describe */}
        {step === 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <label className="block text-slate-700 font-medium mb-2 text-sm">Describe your invoice</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
                placeholder="e.g. Invoice for web design work, client is Acme Corp, 3 items: logo design $500, landing page $1200, SEO setup $300, 18% tax, due in 30 days..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Generate Invoice</>
                )}
              </button>
              <div className="mt-5">
                <p className="text-slate-400 text-xs mb-2">Try an example:</p>
                <div className="space-y-2">
                  {EXAMPLE_PROMPTS.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => setPrompt(ex)}
                      className="w-full text-left text-xs text-slate-500 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 rounded-lg px-3 py-2 transition line-clamp-2"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1 — Sections */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-slate-800 font-semibold">Choose sections to include</h2>
              <button onClick={() => setStep(0)} className="text-slate-400 hover:text-slate-700 text-sm flex items-center gap-1 transition">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              {/* Select all / none */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <span className="text-sm font-medium text-slate-700">Sections</span>
                <div className="flex gap-3">
                  <button onClick={() => toggleAll(true)} className="text-xs text-indigo-600 hover:underline">Select all</button>
                  <span className="text-slate-300">|</span>
                  <button onClick={() => toggleAll(false)} className="text-xs text-slate-400 hover:underline">Clear all</button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ALL_SECTIONS.map(({ key, label }) => (
                  <label
                    key={key}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                      visibility[key]
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div
                      onClick={() => toggleSection(key)}
                      className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                        visibility[key] ? 'bg-emerald-600' : 'bg-white border-2 border-slate-300'
                      }`}
                    >
                      {visibility[key] && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span
                      onClick={() => toggleSection(key)}
                      className="text-sm text-slate-700 font-medium select-none"
                    >
                      {label}
                    </span>
                  </label>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Choose Template */}
        {step === 2 && (
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-slate-800 font-semibold">Choose a template</h2>
              <button onClick={() => setStep(1)} className="text-slate-400 hover:text-slate-700 text-sm flex items-center gap-1 transition">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTemplateSelect(t)}
                  className="group block shadow-lg rounded-xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-white text-left"
                >
                  <div className="w-full aspect-[3/4] bg-slate-100 flex items-center justify-center overflow-hidden">
                    <img src={t.preview} alt={t.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="px-3 py-2 flex items-center justify-between border-t border-slate-100">
                    <span className="text-slate-600 text-xs font-medium">{t.name}</span>
                    <span className="opacity-0 group-hover:opacity-100 text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full transition-all">
                      Select
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 — Review */}
        {step === 3 && generatedContent && selectedTemplate && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-slate-800 font-semibold">Review extracted data</h2>
              <button onClick={() => setStep(2)} className="text-slate-400 hover:text-slate-700 text-sm flex items-center gap-1 transition">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4 mb-4">
              {/* Template + sections summary */}
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <img
                  src={selectedTemplate.preview}
                  alt={selectedTemplate.name}
                  className="w-12 h-16 object-contain rounded-lg border border-slate-200 bg-slate-50"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 font-medium">{selectedTemplate.name}</p>
                  <p className="text-slate-400 text-sm truncate">{generatedContent.templateName || 'AI Generated Invoice'}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {generatedContent.currency && (
                      <span className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-full px-2 py-0.5">
                        {generatedContent.currency} {CURRENCY_SYMBOLS[generatedContent.currency] || ''}
                      </span>
                    )}
                    <span className="text-xs bg-slate-100 text-slate-500 rounded-full px-2 py-0.5">
                      {Object.values(visibility).filter(Boolean).length} sections
                    </span>
                  </div>
                </div>
              </div>

              <ReviewSection title="Invoice Details">
                <ReviewRow label="Invoice #" value={generatedContent.invoiceNumber} />
                <ReviewRow label="Date" value={generatedContent.invoiceDate} />
                <ReviewRow label="Due Date" value={generatedContent.dueDate} />
              </ReviewSection>

              <ReviewSection title="From">
                <ReviewRow label="Business" value={generatedContent.businessName} />
                <ReviewRow label="Address" value={[generatedContent.businessAddress1, generatedContent.businessAddress2].filter(Boolean).join(', ')} />
              </ReviewSection>

              <ReviewSection title="Bill To">
                <ReviewRow label="Client" value={generatedContent.clientName} />
                <ReviewRow label="Address" value={[generatedContent.clientAddress1, generatedContent.clientAddress2].filter(Boolean).join(', ')} />
              </ReviewSection>

              <ReviewSection title="Items">
                {[1, 2, 3, 4].map(n => generatedContent[`item${n}Desc`] && (
                  <ReviewRow
                    key={n}
                    label={generatedContent[`item${n}Desc`]}
                    value={`${generatedContent[`item${n}Qty`] || 1} × ${CURRENCY_SYMBOLS[generatedContent.currency] || '$'}${generatedContent[`item${n}Rate`] || 0} = ${CURRENCY_SYMBOLS[generatedContent.currency] || '$'}${generatedContent[`item${n}Amount`] || generatedContent[`item${n}Rate`] || 0}`}
                  />
                ))}
                {generatedContent.subtotal && <ReviewRow label="Subtotal" value={`${CURRENCY_SYMBOLS[generatedContent.currency] || '$'}${generatedContent.subtotal}`} />}
                {generatedContent.taxLabel && <ReviewRow label={generatedContent.taxLabel} value={generatedContent.tax ? `${CURRENCY_SYMBOLS[generatedContent.currency] || '$'}${generatedContent.tax}` : ''} />}
                {generatedContent.total && <ReviewRow label="Total" value={`${CURRENCY_SYMBOLS[generatedContent.currency] || '$'}${generatedContent.total}`} />}
              </ReviewSection>
            </div>

            <p className="text-slate-400 text-xs text-center mb-4">
              You can edit any of this in the builder — this is just a preview.
            </p>

            <button
              onClick={handleLaunchBuilder}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
            >
              Open in Template Builder <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ReviewSection = ({ title, children }) => (
  <div>
    <p className="text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-2">{title}</p>
    <div className="space-y-1">{children}</div>
  </div>
);

const ReviewRow = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-700 text-right max-w-[60%]">{value}</span>
    </div>
  );
};

export default AIInvoiceGenerator;
