import { Lock, Save, Edit, Download } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Templates1 from "../templates/Templates1";
import Templates2 from "../templates/Templates2";
import Templates3 from "../templates/Templates3";
import Templates4 from "../templates/Templates4";
import Templates5 from "../templates/Templates5";
import Templates6 from "../templates/Templates6";
import Templates7 from "../templates/Templates7";
import Templates8 from "../templates/Templates8";
import Templates9 from "../templates/Templates9";
import Templates10 from "../templates/Templates10";
import Templates11 from "../templates/Templates11";
import Templates12 from "../templates/Templates12";
import { aiDataToTemplateFormat } from "../../utils/aiDataToTemplate";
import { buildInvoiceAPI } from "../../services/buildInvoiceService";
import { toast } from "react-toastify";

const TEMPLATES = {
  1: Templates1,
  2: Templates2,
  3: Templates3,
  4: Templates4,
  5: Templates5,
  6: Templates6,
  7: Templates7,
  8: Templates8,
  9: Templates9,
  10: Templates10,
  11: Templates11,
  12: Templates12,
};

// templateId is now controlled from outside (driven by TemplatePicker)
const InvoiceLivePreview = ({
  aiData,
  templateId = 1,
  sessionId,
  isLoggedIn,
  onSignInClick,
}) => {
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const TemplateComponent = TEMPLATES[templateId] || Templates1;
  const templateData = aiDataToTemplateFormat(aiData);

  const TEMPLATE_WIDTH = 794;
  const DISPLAY_WIDTH = 420;
  const scale = DISPLAY_WIDTH / TEMPLATE_WIDTH;

  // Convert AI data to custom invoice format for saving
  const convertAiDataToCustomInvoice = (aiData, templateId) => {
    const formData = new FormData();

    // Basic template info
    formData.append(
      "templateName",
      aiData.templateName || `AI Invoice - ${new Date().toLocaleDateString()}`,
    );
    formData.append("currency", aiData.currency || "USD");

    // Content mapping from AI data to custom invoice format
    const content = {
      // Business info
      businessName: aiData.businessName || "",
      businessAddress1: aiData.businessAddress1 || "",
      businessAddress2: aiData.businessAddress2 || "",

      // Client info
      clientName: aiData.clientName || "",
      clientAddress1: aiData.clientAddress1 || "",
      clientAddress2: aiData.clientAddress2 || "",

      // Ship to info
      shipToName: aiData.shipToName || "",
      shipToAddress1: aiData.shipToAddress1 || "",
      shipToAddress2: aiData.shipToAddress2 || "",

      // Invoice meta
      invoiceNumber: aiData.invoiceNumber || "INV-001",
      invoiceDate: aiData.invoiceDate || new Date().toLocaleDateString(),
      dueDate: aiData.dueDate || "",
      poNumber: aiData.poNumber || "",

      // Items
      item1Desc: aiData.item1Desc || "",
      item1Qty: aiData.item1Qty || "1",
      item1Rate: aiData.item1Rate || "0",
      item1Amount: aiData.item1Amount || "0",
      item2Desc: aiData.item2Desc || "",
      item2Qty: aiData.item2Qty || "1",
      item2Rate: aiData.item2Rate || "0",
      item2Amount: aiData.item2Amount || "0",
      item3Desc: aiData.item3Desc || "",
      item3Qty: aiData.item3Qty || "1",
      item3Rate: aiData.item3Rate || "0",
      item3Amount: aiData.item3Amount || "0",
      item4Desc: aiData.item4Desc || "",
      item4Qty: aiData.item4Qty || "1",
      item4Rate: aiData.item4Rate || "0",
      item4Amount: aiData.item4Amount || "0",

      // Totals
      subtotal: aiData.subtotal || "0",
      tax: aiData.tax || "0",
      total: aiData.total || "0",
      taxLabel: aiData.taxLabel || "Tax (0%):",

      // Payment info
      bankName: aiData.bankName || "",
      accountNumber: aiData.accountNumber || "",
      ifscCode: aiData.ifscCode || "",

      // Terms
      terms: aiData.terms || "Payment is due within 30 days.",

      // Footer
      footerEmail: aiData.footerEmail || "",
      footerPhone: aiData.footerPhone || "",
      footerWebsite: aiData.footerWebsite || "",
    };

    formData.append("content", JSON.stringify(content));

    // Default visibility (all sections visible)
    const visibility = {
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
    };

    formData.append("visibility", JSON.stringify(visibility));

    return formData;
  };

  const handleSaveInvoice = async () => {
    setSaving(true);
    try {
      const formData = convertAiDataToCustomInvoice(aiData, templateId);
      const response = await buildInvoiceAPI.save(formData);

      if (response.success) {
        toast.success("Invoice saved successfully!");
        // Navigate to dashboard to show the saved invoice
        navigate("/dashboard?tab=myInvoices");
      } else {
        toast.error("Failed to save invoice: " + response.message);
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save invoice: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEditInvoice = () => {
    navigate("/template-builder", {
      state: {
        fromAiChatSessionId: sessionId,
        aiContent: aiData,
        selectedTemplateId: templateId,
        visibility: {
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
        },
      },
    });
  };

  const handleDownloadPDF = () => {
    // For now, redirect to edit mode where they can download
    // This is simpler and more reliable than trying to generate PDF from scaled preview
    toast.info("Redirecting to editor for download...");
    handleEditInvoice();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white flex-shrink-0">
        <span className="text-xs font-medium text-gray-500">
          Template {templateId} — Live Preview
        </span>
        <span className="text-xs text-gray-400">
          Change template anytime in chat
        </span>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-hidden relative bg-gray-100 flex items-start justify-center pt-4 pb-4">
        <div
          style={{
            width: `${DISPLAY_WIDTH}px`,
            transformOrigin: "top center",
            transform: `scale(${scale})`,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <TemplateComponent data={templateData} />
        </div>

        {/* Action buttons for logged-in users */}
        {isLoggedIn && (
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleEditInvoice}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 shadow-sm transition-all"
            >
              <Edit className="w-3.5 h-3.5" />
              Continue to Editor
            </button>
          </div>
        )}

        {/* Blur overlay for non-logged-in users — editing locked */}
        {!isLoggedIn && (
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 bg-gradient-to-t from-white/80 via-transparent to-transparent">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg px-6 py-5 text-center max-w-xs mx-4">
              <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-sm font-semibold text-gray-800 mb-1">
                Sign in to edit & save
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Your invoice is ready. Sign in to edit, download, or send it.
              </p>
              <button
                onClick={onSignInClick}
                className="w-full py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white text-sm font-semibold rounded-xl hover:shadow-md transition-all"
              >
                Sign in / Sign up free
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceLivePreview;
