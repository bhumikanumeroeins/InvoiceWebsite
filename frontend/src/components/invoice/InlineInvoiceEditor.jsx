import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { Save, Loader2, Plus, Trash2, Upload, X } from 'lucide-react';
import { invoiceAPI, itemAPI } from '../../services/invoiceService';
import { getUploadsUrl } from '../../services/apiConfig';

import Templates1 from '../templates/Templates1';
import Templates2 from '../templates/Templates2';
import Templates3 from '../templates/Templates3';
import Templates4 from '../templates/Templates4';
import Templates5 from '../templates/Templates5';
import Templates6 from '../templates/Templates6';
import Templates7 from '../templates/Templates7';
import Templates8 from '../templates/Templates8';
import Templates9 from '../templates/Templates9';
import Templates10 from '../templates/Templates10';
import Templates11 from '../templates/Templates11';
import Templates12 from '../templates/Templates12';

const templates = { 1: Templates1, 2: Templates2, 3: Templates3, 4: Templates4, 5: Templates5, 6: Templates6, 7: Templates7, 8: Templates8, 9: Templates9, 10: Templates10, 11: Templates11, 12: Templates12 };

const Field = ({ label, value, onChange, type = 'text', rows }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</label>
    {rows ? (
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
      />
    ) : (
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
      />
    )}
  </div>
);

const Section = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        <span className="text-sm font-semibold text-slate-700">{title}</span>
        <span className="text-slate-400 text-xs">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="p-4 space-y-3 bg-white">{children}</div>}
    </div>
  );
};

const InlineInvoiceEditor = ({ invoice, selectedTemplate, onSave, onCancel }) => {
  const [saving, setSaving] = useState(false);

  // Build editable state from invoice
  const [draft, setDraft] = useState(() => {
    const inv = invoice || {};
    return {
      // Business
      businessName: inv.business?.name || '',
      businessAddress: inv.business?.address || '',
      businessCity: inv.business?.city || '',
      businessState: inv.business?.state || '',
      businessZip: inv.business?.zip || '',
      logo: inv.business?.logo ? `${getUploadsUrl()}/uploads/${inv.business.logo}` : null,
      logoFile: null,
      // Client
      clientName: inv.client?.name || '',
      clientAddress: inv.client?.address || '',
      clientCity: inv.client?.city || '',
      clientState: inv.client?.state || '',
      clientZip: inv.client?.zip || '',
      clientEmail: inv.client?.email || '',
      // Ship To
      shippingName: inv.shipTo?.shippingName || '',
      shippingAddress: inv.shipTo?.shippingAddress || '',
      // Invoice Meta
      invoiceNo: inv.invoiceMeta?.invoiceNo || '',
      invoiceDate: inv.invoiceMeta?.invoiceDate ? new Date(inv.invoiceMeta.invoiceDate).toISOString().split('T')[0] : '',
      dueDate: inv.invoiceMeta?.dueDate ? new Date(inv.invoiceMeta.dueDate).toISOString().split('T')[0] : '',
      currency: inv.invoiceMeta?.currency || 'INR',
      // Items
      items: (inv.items || []).map((item) => ({
        _id: item._id,
        description: item.description || '',
        quantity: item.quantity || 1,
        rate: item.rate || 0,
        amount: item.amount || 0,
        tax: item.tax || 0,
      })),
      // Payment
      bankName: inv.payment?.bankName || '',
      accountNo: inv.payment?.accountNo || '',
      ifscCode: inv.payment?.ifscCode || '',
      // Terms
      terms: Array.isArray(inv.terms) ? inv.terms.map((t) => (typeof t === 'string' ? t : t.text || '')) : [],
      // Signature / QR
      signature: inv.signature ? `${getUploadsUrl()}/uploads/${inv.signature}` : null,
      signatureFile: null,
      qrCode: inv.qrCode ? `${getUploadsUrl()}/uploads/${inv.qrCode}` : null,
      qrCodeFile: null,
    };
  });

  const set = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));

  const setItem = (index, key, value) => {
    const items = [...draft.items];
    items[index] = { ...items[index], [key]: value };
    if (key === 'quantity' || key === 'rate') {
      const qty = key === 'quantity' ? parseFloat(value) || 0 : items[index].quantity;
      const rate = key === 'rate' ? parseFloat(value) || 0 : items[index].rate;
      items[index].amount = qty * rate;
    }
    set('items', items);
  };

  const addItem = () => set('items', [...draft.items, { description: '', quantity: 1, rate: 0, amount: 0, tax: 0 }]);
  const removeItem = (i) => set('items', draft.items.filter((_, idx) => idx !== i));

  const subtotal = draft.items.reduce((s, item) => s + (item.quantity * item.rate), 0);
  const taxTotal = draft.items.reduce((s, item) => s + (item.amount * (item.tax || 0) / 100), 0);
  const grandTotal = subtotal + taxTotal;

  // Build live preview data in the same shape templates expect
  const previewData = {
    business: {
      name: draft.businessName,
      address: draft.businessAddress,
      city: draft.businessCity,
      state: draft.businessState,
      zip: draft.businessZip,
      logo: draft.logoFile ? URL.createObjectURL(draft.logoFile) : (draft.logo?.startsWith('blob:') || draft.logo?.startsWith('http') ? draft.logo : null),
    },
    client: {
      name: draft.clientName,
      address: draft.clientAddress,
      city: draft.clientCity,
      state: draft.clientState,
      zip: draft.clientZip,
      email: draft.clientEmail,
    },
    shipTo: {
      shippingName: draft.shippingName,
      shippingAddress: draft.shippingAddress,
    },
    invoiceMeta: {
      invoiceNo: draft.invoiceNo,
      invoiceDate: draft.invoiceDate,
      dueDate: draft.dueDate,
      currency: draft.currency,
    },
    items: draft.items,
    terms: draft.terms.map((t) => ({ text: t })),
    payment: {
      bankName: draft.bankName,
      accountNo: draft.accountNo,
      ifscCode: draft.ifscCode,
    },
    totals: { subtotal, taxTotal, grandTotal },
    signature: draft.signatureFile ? URL.createObjectURL(draft.signatureFile) : draft.signature,
    qrCode: draft.qrCodeFile ? URL.createObjectURL(draft.qrCodeFile) : draft.qrCode,
    selectedTemplate,
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const invoiceId = invoice?._id || invoice?.id;

      // Save/update items in ItemMaster first
      const itemIds = [];
      for (const item of draft.items) {
        if (!item.description?.trim()) continue;
        const res = await itemAPI.create({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          tax: item.tax || 0,
        });
        if (res.success) itemIds.push({ itemId: res.data._id });
      }

      if (itemIds.length === 0) {
        toast.warning('Please add at least one item');
        setSaving(false);
        return;
      }

      const payload = {
        business: {
          name: draft.businessName,
          address: draft.businessAddress,
          city: draft.businessCity,
          state: draft.businessState,
          zip: draft.businessZip,
        },
        client: {
          name: draft.clientName,
          address: draft.clientAddress,
          city: draft.clientCity,
          state: draft.clientState,
          zip: draft.clientZip,
          email: draft.clientEmail,
        },
        shipTo: draft.shippingName || draft.shippingAddress ? {
          shippingName: draft.shippingName,
          shippingAddress: draft.shippingAddress,
        } : undefined,
        invoiceMeta: {
          invoiceNo: draft.invoiceNo,
          invoiceDate: draft.invoiceDate,
          dueDate: draft.dueDate,
          currency: draft.currency,
        },
        items: itemIds,
        terms: draft.terms.filter((t) => t.trim()).map((t) => ({ text: t })),
        payment: {
          bankName: draft.bankName,
          accountNo: draft.accountNo,
          ifscCode: draft.ifscCode,
        },
        totals: { subtotal, taxTotal, grandTotal },
      };

      const formData = new FormData();
      formData.append('data', JSON.stringify(payload));
      if (draft.logoFile) formData.append('logo', draft.logoFile);
      if (draft.signatureFile) formData.append('signature', draft.signatureFile);
      if (draft.qrCodeFile) formData.append('qrCode', draft.qrCodeFile);

      const response = await invoiceAPI.update(invoiceId, formData);
      if (response.success) {
        toast.success('Invoice updated successfully!');
        onSave && onSave(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      toast.error('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const TemplateComponent = templates[selectedTemplate] || Templates1;

  return (
    <div className="flex h-full min-h-0" style={{ maxHeight: 'calc(100vh - 120px)' }}>
      {/* LEFT — editable fields panel */}
      <div className="w-80 flex-shrink-0 flex flex-col border-r border-slate-200 bg-slate-50">
        {/* Panel header */}
        <div className="flex-shrink-0 px-4 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Edit Fields</span>
          <button onClick={onCancel} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
        </div>

        {/* Scrollable fields */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <Section title="Your Business">
            <Field label="Business Name" value={draft.businessName} onChange={(v) => set('businessName', v)} />
            <Field label="Address" value={draft.businessAddress} onChange={(v) => set('businessAddress', v)} />
            <div className="grid grid-cols-3 gap-2">
              <Field label="City" value={draft.businessCity} onChange={(v) => set('businessCity', v)} />
              <Field label="State" value={draft.businessState} onChange={(v) => set('businessState', v)} />
              <Field label="ZIP" value={draft.businessZip} onChange={(v) => set('businessZip', v)} />
            </div>
            {/* Logo upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Logo</label>
              {draft.logo || draft.logoFile ? (
                <div className="relative inline-block">
                  <img src={draft.logoFile ? URL.createObjectURL(draft.logoFile) : draft.logo} alt="logo" className="h-12 rounded border border-slate-200" />
                  <button onClick={() => { set('logo', null); set('logoFile', null); }} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-sm text-slate-500">
                  <Upload className="w-4 h-4" /> Upload logo
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files[0]) set('logoFile', e.target.files[0]); }} />
                </label>
              )}
            </div>
          </Section>

          <Section title="Bill To (Client)">
            <Field label="Client Name" value={draft.clientName} onChange={(v) => set('clientName', v)} />
            <Field label="Email" value={draft.clientEmail} onChange={(v) => set('clientEmail', v)} type="email" />
            <Field label="Address" value={draft.clientAddress} onChange={(v) => set('clientAddress', v)} />
            <div className="grid grid-cols-3 gap-2">
              <Field label="City" value={draft.clientCity} onChange={(v) => set('clientCity', v)} />
              <Field label="State" value={draft.clientState} onChange={(v) => set('clientState', v)} />
              <Field label="ZIP" value={draft.clientZip} onChange={(v) => set('clientZip', v)} />
            </div>
          </Section>

          <Section title="Ship To" defaultOpen={false}>
            <Field label="Name" value={draft.shippingName} onChange={(v) => set('shippingName', v)} />
            <Field label="Address" value={draft.shippingAddress} onChange={(v) => set('shippingAddress', v)} rows={2} />
          </Section>

          <Section title="Invoice Details">
            <Field label="Invoice #" value={draft.invoiceNo} onChange={(v) => set('invoiceNo', v)} />
            <Field label="Invoice Date" value={draft.invoiceDate} onChange={(v) => set('invoiceDate', v)} type="date" />
            <Field label="Due Date" value={draft.dueDate} onChange={(v) => set('dueDate', v)} type="date" />
            <Field label="Currency" value={draft.currency} onChange={(v) => set('currency', v)} />
          </Section>

          <Section title="Line Items">
            <div className="space-y-3">
              {draft.items.map((item, i) => (
                <div key={i} className="bg-slate-50 rounded-lg p-3 space-y-2 relative">
                  <button onClick={() => removeItem(i)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <Field label="Description" value={item.description} onChange={(v) => setItem(i, 'description', v)} />
                  <div className="grid grid-cols-3 gap-2">
                    <Field label="Qty" value={item.quantity} onChange={(v) => setItem(i, 'quantity', v)} type="number" />
                    <Field label="Rate" value={item.rate} onChange={(v) => setItem(i, 'rate', v)} type="number" />
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Amount</label>
                      <div className="px-3 py-2 text-sm bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-medium">
                        {(item.quantity * item.rate).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addItem} className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-sm text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50/50 flex items-center justify-center gap-1 transition-all">
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>
            {/* Totals summary */}
            <div className="mt-2 pt-2 border-t border-slate-200 space-y-1 text-xs text-slate-600">
              <div className="flex justify-between"><span>Subtotal</span><span>{subtotal.toFixed(2)}</span></div>
              {taxTotal > 0 && <div className="flex justify-between"><span>Tax</span><span>{taxTotal.toFixed(2)}</span></div>}
              <div className="flex justify-between font-bold text-slate-800 text-sm pt-1 border-t border-slate-200">
                <span>Total</span><span>{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </Section>

          <Section title="Terms & Conditions" defaultOpen={false}>
            <div className="space-y-2">
              {draft.terms.map((term, i) => (
                <div key={i} className="flex gap-2">
                  <input value={term} onChange={(e) => { const t = [...draft.terms]; t[i] = e.target.value; set('terms', t); }}
                    className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                  <button onClick={() => set('terms', draft.terms.filter((_, idx) => idx !== i))} className="text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button onClick={() => set('terms', [...draft.terms, ''])} className="w-full py-1.5 border border-dashed border-slate-300 rounded-lg text-xs text-indigo-600 hover:border-indigo-400 flex items-center justify-center gap-1 transition-all">
                <Plus className="w-3 h-3" /> Add Term
              </button>
            </div>
          </Section>

          <Section title="Payment Info" defaultOpen={false}>
            <Field label="Bank Name" value={draft.bankName} onChange={(v) => set('bankName', v)} />
            <Field label="Account No." value={draft.accountNo} onChange={(v) => set('accountNo', v)} />
            <Field label="IFSC Code" value={draft.ifscCode} onChange={(v) => set('ifscCode', v)} />
            {/* Signature */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Signature</label>
              {draft.signature || draft.signatureFile ? (
                <div className="relative inline-block">
                  <img src={draft.signatureFile ? URL.createObjectURL(draft.signatureFile) : draft.signature} alt="sig" className="h-10 rounded border border-slate-200" />
                  <button onClick={() => { set('signature', null); set('signatureFile', null); }} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-sm text-slate-500">
                  <Upload className="w-4 h-4" /> Upload signature
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files[0]) set('signatureFile', e.target.files[0]); }} />
                </label>
              )}
            </div>
            {/* QR Code */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">QR Code</label>
              {draft.qrCode || draft.qrCodeFile ? (
                <div className="relative inline-block">
                  <img src={draft.qrCodeFile ? URL.createObjectURL(draft.qrCodeFile) : draft.qrCode} alt="qr" className="h-16 rounded border border-slate-200" />
                  <button onClick={() => { set('qrCode', null); set('qrCodeFile', null); }} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-sm text-slate-500">
                  <Upload className="w-4 h-4" /> Upload QR code
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files[0]) set('qrCodeFile', e.target.files[0]); }} />
                </label>
              )}
            </div>
          </Section>
        </div>

        {/* Save button */}
        <div className="flex-shrink-0 p-4 bg-white border-t border-slate-200">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
          >
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      </div>

      {/* RIGHT — live template preview */}
      <div className="flex-1 overflow-auto bg-slate-100 flex items-start justify-center p-6">
        <div className="shadow-2xl rounded-lg overflow-hidden" style={{ transform: 'scale(0.75)', transformOrigin: 'top center', marginBottom: '-25%' }}>
          <TemplateComponent data={previewData} />
        </div>
      </div>
    </div>
  );
};

export default InlineInvoiceEditor;
