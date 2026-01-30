import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Rnd } from 'react-rnd';
import { Save, Eye, ArrowLeft, Loader2, Mail, Download, Edit } from 'lucide-react';
import { backgroundPatterns, BackgroundPattern } from './BackgroundPatterns';
import { apiCall } from '../../services/apiConfig';
import { buildInvoiceAPI } from '../../services/buildInvoiceService';
import { getCurrentUser } from '../../services/authService';
import TemplateBuilderTabs from './TemplateBuilderTabs';

const EditableText = ({ value, onChange, style, className, placeholder }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [isHovered, setIsHovered] = useState(false);

  const handleBlur = () => {
    setIsEditing(false);
    onChange(tempValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        style={{
          ...style,
          border: '2px solid #4F46E5',
          outline: 'none',
          background: 'white',
          padding: '2px 4px',
          borderRadius: '2px'
        }}
        className={className}
      />
    );
  }

  return (
    <span
      onClick={() => {
        setIsEditing(true);
        setTempValue(value);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...style,
        cursor: 'pointer',
        padding: '2px 4px',
        borderRadius: '2px',
        transition: 'background 0.2s',
        background: isHovered ? '#EFF6FF' : 'transparent'
      }}
      className={className}
      title="Click to edit"
    >
      {value || placeholder}
    </span>
  );
};

const TemplateBuilder = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const customInvoiceId = searchParams.get('id');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [activeTab, setActiveTab] = useState('preview'); // 'preview', 'edit', 'email', 'download'
  const templateRef = useRef(null);
  const currentUser = getCurrentUser();
  const userEmail = currentUser?.email || '';
  
  // Email state
  const [emailData, setEmailData] = useState({
    from: userEmail,
    to: '',
    sendCopy: false,
    subject: 'Custom Invoice',
    message: `Dear Customer,

Please find the attached custom invoice for your reference.

Thank you for your business!

Best regards`,
  });
  const [sendingEmail, setSendingEmail] = useState(false);
  
  const [templateConfig, setTemplateConfig] = useState({
    templateName: 'My Custom Template',
    
    // Colors - match backend field names
    primaryColor: '#4F46E5',
    secondaryColor: '#10B981',
    textColor: '#1F2937',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    
    // Typography - match backend structure
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      headingSize: '24px',
      bodySize: '14px'
    },
    
    // Content - match backend structure (all editable fields)
    content: {
      logoText: 'LOGO',
      logoImage: '',
      invoiceTitle: 'INVOICE',
      invoiceNumberLabel: 'Invoice #:',
      invoiceNumber: 'INV-001',
      dateLabel: 'Date:',
      invoiceDate: 'Jan 29, 2026',
      poNumberLabel: 'PO #:',
      poNumber: 'PO-12345',
      dueDateLabel: 'Due Date:',
      dueDate: 'Feb 28, 2026',
      fromLabel: 'From',
      businessName: 'Your Business Name',
      businessAddress1: '123 Business St',
      businessAddress2: 'City, State 12345',
      billToLabel: 'Bill To',
      clientName: 'Client Name',
      clientAddress1: '456 Client Ave',
      clientAddress2: 'City, State 67890',
      shipToLabel: 'Ship To',
      shipToName: 'Ship To Name',
      shipToAddress1: '789 Shipping St',
      shipToAddress2: 'City, State 11111',
      descriptionLabel: 'Description',
      qtyLabel: 'Qty',
      rateLabel: 'Rate',
      amountLabel: 'Amount',
      item1Desc: 'Sample Item 1',
      item1Qty: '2',
      item1Rate: '$50.00',
      item1Amount: '$100.00',
      item2Desc: 'Sample Item 2',
      item2Qty: '1',
      item2Rate: '$75.00',
      item2Amount: '$75.00',
      subtotalLabel: 'Subtotal:',
      subtotal: '$175.00',
      taxLabel: 'Tax (10%):',
      tax: '$17.50',
      totalLabel: 'Total:',
      total: '$192.50',
      termsLabel: 'Terms & Conditions',
      terms: 'Payment is due within 30 days. Thank you for your business!',
      paymentInfoLabel: 'PAYMENT INFORMATION',
      bankLabel: 'Bank:',
      bankName: 'Bank of America',
      accountLabel: 'Account:',
      accountNumber: '****1234',
      ifscLabel: 'IFSC/Routing:',
      ifscCode: 'BOFA0001234',
      qrCodeImage: '',
      qrCodeText: 'Scan to Pay',
      signatureImage: '',
      signatureLabel: 'Authorized Signature',
      emailLabel: 'EMAIL',
      footerEmail: 'contact@business.com',
      phoneLabel: 'PHONE',
      footerPhone: '+1 (555) 123-4567',
      websiteLabel: 'WEBSITE',
      footerWebsite: 'www.business.com'
    },
    
    // Section visibility - match backend structure (nested in visibility object)
    visibility: {
      businessInfo: true,
      clientInfo: true,
      shipTo: true,
      invoiceMeta: true,
      itemsTable: true,
      totals: true,
      terms: true,
      paymentInfo: true,
      signature: true,
      qrCodeSection: true,
      logoSection: true
    },
    
    // Background pattern - match backend field names
    backgroundPattern: 'none',
    backgroundHeaderColor: '#4F46E5',
    backgroundFooterColor: '#4F46E5',
    
    // Positioning - match backend field names
    logoPosition: { x: 50, y: 50, width: 120, height: 120 },
    invoiceMetaPosition: { x: 500, y: 50, width: 250, height: 120 },
    invoiceTitlePosition: { x: 50, y: 190, width: 300, height: 40 },
    businessInfoPosition: { x: 50, y: 260, width: 220, height: 150 },
    clientInfoPosition: { x: 290, y: 260, width: 220, height: 120 },
    shipToPosition: { x: 530, y: 260, width: 220, height: 120 },
    itemsTablePosition: { x: 50, y: 430, width: 700, height: 200 },
    totalsPosition: { x: 500, y: 650, width: 250, height: 120 },
    termsPosition: { x: 50, y: 650, width: 400, height: 120 },
    paymentInfoPosition: { x: 50, y: 780, width: 300, height: 120 },
    qrCodePosition: { x: 380, y: 780, width: 150, height: 150 },
    signaturePosition: { x: 560, y: 780, width: 190, height: 100 },
    footerPosition: { x: 50, y: 950, width: 700, height: 60 }
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Computed: disable editing when in preview tab
  const isEditMode = activeTab === 'edit';

  // Generate PDF using screenshot approach (captures exact design)
  const generatePDF = async (forDownload = false) => {
    try {
      if (!templateRef.current) {
        throw new Error('Template reference not found');
      }

      // Dynamically import libraries
      const { domToPng } = await import('modern-screenshot');
      const { jsPDF } = await import('jspdf');

      // Temporarily enable preview mode to hide drag handles
      const wasPreviewMode = previewMode;
      setPreviewMode(true);
      
      // Wait for React to re-render
      await new Promise(resolve => setTimeout(resolve, 300));

      // Capture using modern-screenshot (supports modern CSS including oklch)
      const dataUrl = await domToPng(templateRef.current, {
        scale: 2,
        backgroundColor: templateConfig.backgroundColor,
        filter: (node) => {
          // Skip hidden elements (opacity-0)
          if (node.classList && node.classList.contains('opacity-0')) {
            return false;
          }
          // Skip drag handles
          if (node.classList && (
            node.classList.contains('react-draggable-handle') ||
            node.classList.contains('react-resizable-handle')
          )) {
            return false;
          }
          return true;
        }
      });

      // Restore preview mode
      setPreviewMode(wasPreviewMode);

      // Create PDF (A4 size)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // A4 dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = 297;

      // Load image to get dimensions
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = dataUrl;
      });

      // Calculate image dimensions to fit A4
      const imgWidth = pdfWidth;
      const imgHeight = (img.height * pdfWidth) / img.width;

      // Add image to PDF
      pdf.addImage(dataUrl, 'PNG', 0, 0, imgWidth, imgHeight);

      if (forDownload) {
        // Download the PDF
        pdf.save(`${templateConfig.templateName || 'Custom-Invoice'}.pdf`);
        return true;
      } else {
        // Return base64 for email
        const pdfBase64 = pdf.output('datauristring').split(',')[1];
        return pdfBase64;
      }
    } catch (error) {
      // Restore preview mode on error
      setPreviewMode(false);
      throw new Error('Failed to generate PDF: ' + error.message);
    }
  };

  // Handle download PDF
  const handleDownloadPDF = async () => {
    setLoading(true);
    try {
      await generatePDF(true);
    } catch (error) {
      alert('Failed to generate PDF: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle send email
  const handleSendEmail = async () => {
    if (!emailData.to) {
      alert('Please enter recipient email address.');
      return;
    }

    if (!customInvoiceId) {
      alert('Please save the invoice first before sending email.');
      return;
    }

    setSendingEmail(true);
    
    try {
      // Generate PDF using screenshot approach
      const pdfBase64 = await generatePDF(false);
      
      // Send email via API
      const response = await apiCall(`/build-invoice/send-email/${customInvoiceId}`, {
        method: 'POST',
        body: JSON.stringify({
          to: emailData.to,
          subject: emailData.subject,
          message: emailData.message,
          sendCopy: emailData.sendCopy,
          pdfBase64,
        }),
      });
      
      if (response && response.success) {
        alert('Email sent successfully with PDF attachment!');
        setActiveTab('preview');
      } else {
        alert('Failed to send email: ' + (response?.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to send email: ' + (err?.message || 'Unknown error'));
    } finally {
      setSendingEmail(false);
    }
  };

  const handleContentChange = (key, value) => {
    setTemplateConfig(prev => ({
      ...prev,
      content: { ...prev.content, [key]: value }
    }));
  };

  const handleImageUpload = (key, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleContentChange(key, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updatePosition = (key, x, y) => {
    const positionKey = `${key}Position`;
    setTemplateConfig(prev => ({
      ...prev,
      [positionKey]: { ...prev[positionKey], x, y }
    }));
  };

  const updateSize = (key, width, height) => {
    const positionKey = `${key}Position`;
    setTemplateConfig(prev => ({
      ...prev,
      [positionKey]: { ...prev[positionKey], width, height }
    }));
  };

  const handleColorChange = (key, value) => {
    setTemplateConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSectionToggle = (key) => {
    setTemplateConfig(prev => ({
      ...prev,
      visibility: {
        ...prev.visibility,
        [key]: !prev.visibility[key]
      }
    }));
  };

  // Load existing custom invoice data if ID is provided
  useEffect(() => {
    const loadCustomInvoice = async () => {
      if (!customInvoiceId) return;
      
      setLoadingData(true);
      try {
        const response = await buildInvoiceAPI.getById(customInvoiceId);
        if (response.success && response.data) {
          const data = response.data;
          
          // Parse stringified fields if needed
          const parseIfString = (value) => {
            if (typeof value === 'string') {
              try {
                return JSON.parse(value);
              } catch {
                return value;
              }
            }
            return value;
          };
          
          // Merge loaded data with existing config (to preserve position defaults)
          setTemplateConfig(prev => ({
            ...prev,
            templateName: data.templateName || prev.templateName,
            primaryColor: data.primaryColor || prev.primaryColor,
            secondaryColor: data.secondaryColor || prev.secondaryColor,
            textColor: data.textColor || prev.textColor,
            backgroundColor: data.backgroundColor || prev.backgroundColor,
            borderColor: data.borderColor || prev.borderColor,
            typography: parseIfString(data.typography) || prev.typography,
            content: parseIfString(data.content) || prev.content,
            visibility: parseIfString(data.visibility) || prev.visibility,
            items: parseIfString(data.items) || prev.items,
            paymentInformation: parseIfString(data.paymentInformation) || prev.paymentInformation,
            termsAndConditions: parseIfString(data.termsAndConditions) || prev.termsAndConditions,
            backgroundPattern: data.backgroundPattern || prev.backgroundPattern,
            backgroundHeaderColor: data.backgroundHeaderColor || prev.backgroundHeaderColor,
            backgroundFooterColor: data.backgroundFooterColor || prev.backgroundFooterColor,
            // Position fields from backend (if they exist)
            logoPosition: data.logoPosition || prev.logoPosition,
            invoiceMetaPosition: data.invoiceMetaPosition || prev.invoiceMetaPosition,
            businessInfoPosition: data.businessInfoPosition || prev.businessInfoPosition,
            clientInfoPosition: data.clientInfoPosition || prev.clientInfoPosition,
            shipToPosition: data.shipToPosition || prev.shipToPosition,
            itemsTablePosition: data.itemsTablePosition || prev.itemsTablePosition,
            totalsPosition: data.totalsPosition || prev.totalsPosition,
            termsPosition: data.termsPosition || prev.termsPosition,
            paymentInfoPosition: data.paymentInfoPosition || prev.paymentInfoPosition,
            qrCodePosition: data.qrCodePosition || prev.qrCodePosition,
            signaturePosition: data.signaturePosition || prev.signaturePosition,
            footerPosition: data.footerPosition || prev.footerPosition,
            invoiceTitlePosition: data.invoiceTitlePosition || prev.invoiceTitlePosition,
          }));
        }
      } catch (error) {
        console.error('Failed to load custom invoice:', error);
        alert('Failed to load custom invoice data');
      } finally {
        setLoadingData(false);
      }
    };
    
    loadCustomInvoice();
  }, [customInvoiceId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      
      // Position field keys
      const positionFields = [
        'logoPosition', 'invoiceMetaPosition', 'businessInfoPosition',
        'clientInfoPosition', 'shipToPosition', 'itemsTablePosition',
        'totalsPosition', 'termsPosition', 'paymentInfoPosition',
        'qrCodePosition', 'signaturePosition', 'footerPosition', 'invoiceTitlePosition'
      ];
      
      // Add all fields to FormData
      Object.keys(templateConfig).forEach(key => {
        const value = templateConfig[key];
        
        if (value === null || value === undefined || value === '') {
          // Skip null/undefined/empty values
          return;
        }
        
        // Skip position fields - let backend use defaults
        if (positionFields.includes(key)) {
          return;
        }
        
        if (typeof value === 'object' && !Array.isArray(value)) {
          // Stringify objects (typography, content, visibility)
          formData.append(key, JSON.stringify(value));
        } else if (Array.isArray(value)) {
          // Arrays
          formData.append(key, JSON.stringify(value));
        } else {
          // Primitive values
          formData.append(key, value);
        }
      });
      
      const response = await apiCall('/build-invoice/customize-invoice', {
        method: 'POST',
        body: formData
      });
      
      if (response.success) {
        alert('Template saved successfully!');
        navigate('/dashboard');
      } else {
        alert('Failed to save template: ' + response.message);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save template: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const fontOptions = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Arial',
    'Times New Roman',
    'Georgia',
    'Courier New'
  ];

  // Show loading state while fetching data
  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading custom invoice...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Action Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 border-b">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard?tab=myInvoices')}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Custom Invoice</h1>
                <p className="text-sm text-gray-500">{templateConfig.templateName}</p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Template'}
            </button>
          </div>
          
          {/* Action Tabs */}
          <div className="flex gap-2 pt-3">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
                activeTab === 'preview'
                  ? 'bg-gradient-to-r from-indigo-600 to-emerald-500 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
                activeTab === 'edit'
                  ? 'bg-gradient-to-r from-indigo-600 to-emerald-500 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
                activeTab === 'email'
                  ? 'bg-gradient-to-r from-indigo-600 to-emerald-500 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
            <button
              onClick={() => {
                setActiveTab('download');
                handleDownloadPDF();
              }}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
                activeTab === 'download'
                  ? 'bg-gradient-to-r from-indigo-600 to-emerald-500 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              } disabled:opacity-50`}
            >
              <Download className="w-4 h-4" />
              {loading ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* Email Tab Content */}
      {activeTab === 'email' && (
        <TemplateBuilderTabs
          activeTab={activeTab}
          emailData={emailData}
          setEmailData={setEmailData}
          templateConfig={templateConfig}
          sendingEmail={sendingEmail}
          onSendEmail={handleSendEmail}
          onCancel={() => setActiveTab('preview')}
        />
      )}

      {/* Preview/Edit Content - Always rendered for PDF generation */}
      <div className={activeTab === 'email' ? 'absolute left-[-9999px] top-0' : ''}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customization Panel */}
          {!previewMode && activeTab === 'edit' && (
            <div className="lg:col-span-1 space-y-6">
              {/* Template Name */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Template Name</h3>
                <input
                  type="text"
                  value={templateConfig.templateName}
                  onChange={(e) => setTemplateConfig(prev => ({ ...prev, templateName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Colors */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Colors</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={templateConfig.primaryColor}
                        onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                        className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={templateConfig.primaryColor}
                        onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Secondary Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={templateConfig.secondaryColor}
                        onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                        className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={templateConfig.secondaryColor}
                        onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Text Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={templateConfig.textColor}
                        onChange={(e) => handleColorChange('textColor', e.target.value)}
                        className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={templateConfig.textColor}
                        onChange={(e) => handleColorChange('textColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Background Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={templateConfig.backgroundColor}
                        onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                        className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={templateConfig.backgroundColor}
                        onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Border Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={templateConfig.borderColor}
                        onChange={(e) => handleColorChange('borderColor', e.target.value)}
                        className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={templateConfig.borderColor}
                        onChange={(e) => handleColorChange('borderColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fonts */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Typography</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Heading Font
                    </label>
                    <select
                      value={templateConfig.typography.headingFont}
                      onChange={(e) => setTemplateConfig(prev => ({ ...prev, typography: { ...prev.typography, headingFont: e.target.value } }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {fontOptions.map(font => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Body Font
                    </label>
                    <select
                      value={templateConfig.typography.bodyFont}
                      onChange={(e) => setTemplateConfig(prev => ({ ...prev, typography: { ...prev.typography, bodyFont: e.target.value } }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {fontOptions.map(font => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Heading Size
                    </label>
                    <input
                      type="text"
                      value={templateConfig.typography.headingSize}
                      onChange={(e) => setTemplateConfig(prev => ({ ...prev, typography: { ...prev.typography, headingSize: e.target.value } }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="24px"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Body Size
                    </label>
                    <input
                      type="text"
                      value={templateConfig.typography.bodySize}
                      onChange={(e) => setTemplateConfig(prev => ({ ...prev, typography: { ...prev.typography, bodySize: e.target.value } }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="14px"
                    />
                  </div>
                </div>
              </div>

              {/* Background Patterns */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Background Pattern</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pattern Style
                    </label>
                    <select
                      value={templateConfig.backgroundPattern}
                      onChange={(e) => setTemplateConfig(prev => ({ ...prev, backgroundPattern: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {Object.entries(backgroundPatterns).map(([key, pattern]) => (
                        <option key={key} value={key}>{pattern.name}</option>
                      ))}
                    </select>
                  </div>
                  {templateConfig.backgroundPattern !== 'none' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Header Color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={templateConfig.backgroundHeaderColor}
                            onChange={(e) => setTemplateConfig(prev => ({ ...prev, backgroundHeaderColor: e.target.value }))}
                            className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={templateConfig.backgroundHeaderColor}
                            onChange={(e) => setTemplateConfig(prev => ({ ...prev, backgroundHeaderColor: e.target.value }))}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Footer Color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={templateConfig.backgroundFooterColor}
                            onChange={(e) => setTemplateConfig(prev => ({ ...prev, backgroundFooterColor: e.target.value }))}
                            className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={templateConfig.backgroundFooterColor}
                            onChange={(e) => setTemplateConfig(prev => ({ ...prev, backgroundFooterColor: e.target.value }))}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Sections */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Sections</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={templateConfig.visibility.logoSection}
                      onChange={() => handleSectionToggle('logoSection')}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Logo</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={templateConfig.visibility.businessInfo}
                      onChange={() => handleSectionToggle('businessInfo')}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Business Info</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={templateConfig.visibility.clientInfo}
                      onChange={() => handleSectionToggle('clientInfo')}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Client Info</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={templateConfig.visibility.shipTo}
                      onChange={() => handleSectionToggle('shipTo')}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Ship To</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={templateConfig.visibility.invoiceMeta}
                      onChange={() => handleSectionToggle('invoiceMeta')}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Invoice Meta</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={templateConfig.visibility.itemsTable}
                      onChange={() => handleSectionToggle('itemsTable')}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Items Table</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={templateConfig.visibility.totals}
                      onChange={() => handleSectionToggle('totals')}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Totals</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={templateConfig.visibility.terms}
                      onChange={() => handleSectionToggle('terms')}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Terms</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={templateConfig.visibility.paymentInfo}
                      onChange={() => handleSectionToggle('paymentInfo')}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Payment Info</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={templateConfig.visibility.signature}
                      onChange={() => handleSectionToggle('signature')}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Signature</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={templateConfig.visibility.qrCodeSection}
                      onChange={() => handleSectionToggle('qrCodeSection')}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">QR Code</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Preview Panel */}
          <div className={activeTab === 'edit' && !previewMode ? 'lg:col-span-2' : 'lg:col-span-3'}>
            <div className="flex justify-center">
              <div 
                ref={templateRef}
                id="invoice-template-preview"
                className="border border-gray-200 rounded-lg shadow-lg p-6"
                style={{
                  backgroundColor: templateConfig.backgroundColor,
                  fontFamily: templateConfig.typography.bodyFont,
                  fontSize: templateConfig.typography.bodySize,
                  color: templateConfig.textColor,
                  width: '850px',
                  minHeight: '1123px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxSizing: 'border-box'
                }}
              >
                {/* Background Patterns */}
                <BackgroundPattern 
                  pattern={templateConfig.backgroundPattern} 
                  position="header" 
                  color={templateConfig.backgroundHeaderColor} 
                />
                <BackgroundPattern 
                  pattern={templateConfig.backgroundPattern} 
                  position="footer" 
                  color={templateConfig.backgroundFooterColor} 
                />

                {/* Logo */}
                {templateConfig.visibility.logoSection && (
                  <Rnd
                    bounds="parent"
                    position={{ x: templateConfig.logoPosition.x, y: templateConfig.logoPosition.y }}
                    size={{ width: templateConfig.logoPosition.width, height: templateConfig.logoPosition.height }}
                    onDragStop={(_, d) => updatePosition('logo', d.x, d.y)}
                    onResizeStop={(_, __, ref, ___, position) => {
                      updateSize('logo', ref.offsetWidth, ref.offsetHeight);
                      updatePosition('logo', position.x, position.y);
                    }}
                    disableDragging={!isEditMode}
                    enableResizing={isEditMode}
                    style={{ zIndex: 10 }}
                  >
                    <div className="relative group w-full h-full">
                      {templateConfig.content.logoImage ? (
                        <img 
                          src={templateConfig.content.logoImage} 
                          alt="Logo" 
                          className="w-full h-full object-contain rounded"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-500">
                          <EditableText
                            value={templateConfig.content.logoText}
                            onChange={(val) => handleContentChange('logoText', val)}
                            placeholder="LOGO"
                          />
                        </div>
                      )}
                      {!previewMode && (
                        <>
                          <label className="absolute bottom-2 right-2 bg-indigo-600 text-white px-2 py-1 rounded text-xs cursor-pointer opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-indigo-700">
                            📷 Upload
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload('logoImage', e.target.files[0])}
                              className="hidden"
                            />
                          </label>
                          {templateConfig.content.logoImage && (
                            <button
                              onClick={() => handleContentChange('logoImage', null)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-red-600"
                              title="Remove image"
                            >
                              ×
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </Rnd>
                )}

                {/* Invoice Meta on Right */}
                {templateConfig.visibility.invoiceMeta && (
                  <Rnd
                    bounds="parent"
                    position={{ x: templateConfig.invoiceMetaPosition.x, y: templateConfig.invoiceMetaPosition.y }}
                    size={{ width: templateConfig.invoiceMetaPosition.width, height: templateConfig.invoiceMetaPosition.height }}
                    onDragStop={(_, d) => updatePosition('invoiceMeta', d.x, d.y)}
                    onResizeStop={(_, __, ref, ___, position) => {
                      updateSize('invoiceMeta', ref.offsetWidth, ref.offsetHeight);
                      updatePosition('invoiceMeta', position.x, position.y);
                    }}
                    disableDragging={previewMode}
                    enableResizing={!previewMode}
                    style={{ zIndex: 10 }}
                  >
                    <div className="text-right text-sm">
                      <div className="mb-2">
                        <span className="font-semibold" style={{ color: templateConfig.primaryColor }}>
                          <EditableText
                            value={templateConfig.content.invoiceNumberLabel}
                            onChange={(val) => handleContentChange('invoiceNumberLabel', val)}
                            placeholder="Invoice #:"
                          />
                        </span>{' '}
                        <EditableText
                          value={templateConfig.content.invoiceNumber}
                          onChange={(val) => handleContentChange('invoiceNumber', val)}
                          placeholder="INV-001"
                        />
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold" style={{ color: templateConfig.primaryColor }}>
                          <EditableText
                            value={templateConfig.content.dateLabel}
                            onChange={(val) => handleContentChange('dateLabel', val)}
                            placeholder="Date:"
                          />
                        </span>{' '}
                        <EditableText
                          value={templateConfig.content.invoiceDate}
                          onChange={(val) => handleContentChange('invoiceDate', val)}
                          placeholder="Jan 29, 2026"
                        />
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold" style={{ color: templateConfig.primaryColor }}>
                          <EditableText
                            value={templateConfig.content.poNumberLabel}
                            onChange={(val) => handleContentChange('poNumberLabel', val)}
                            placeholder="PO #:"
                          />
                        </span>{' '}
                        <EditableText
                          value={templateConfig.content.poNumber}
                          onChange={(val) => handleContentChange('poNumber', val)}
                          placeholder="PO-12345"
                        />
                      </div>
                      <div>
                        <span className="font-semibold" style={{ color: templateConfig.primaryColor }}>
                          <EditableText
                            value={templateConfig.content.dueDateLabel}
                            onChange={(val) => handleContentChange('dueDateLabel', val)}
                            placeholder="Due Date:"
                          />
                        </span>{' '}
                        <EditableText
                          value={templateConfig.content.dueDate}
                          onChange={(val) => handleContentChange('dueDate', val)}
                          placeholder="Feb 28, 2026"
                        />
                      </div>
                    </div>
                  </Rnd>
                )}

                {/* Invoice Title */}
                <Rnd
                  bounds="parent"
                  position={{ x: templateConfig.invoiceTitlePosition.x, y: templateConfig.invoiceTitlePosition.y }}
                  size={{ width: templateConfig.invoiceTitlePosition.width, height: templateConfig.invoiceTitlePosition.height }}
                  onDragStop={(_, d) => updatePosition('invoiceTitle', d.x, d.y)}
                  onResizeStop={(_, __, ref, ___, position) => {
                    updateSize('invoiceTitle', ref.offsetWidth, ref.offsetHeight);
                    updatePosition('invoiceTitle', position.x, position.y);
                  }}
                  disableDragging={previewMode}
                  enableResizing={!previewMode}
                  style={{ zIndex: 10 }}
                >
                  <div>
                    <h1 
                      style={{
                        fontFamily: templateConfig.typography.headingFont,
                        fontSize: templateConfig.typography.headingSize,
                        color: templateConfig.primaryColor
                      }}
                      className="font-bold"
                    >
                      <EditableText
                        value={templateConfig.content.invoiceTitle}
                        onChange={(val) => handleContentChange('invoiceTitle', val)}
                        placeholder="INVOICE"
                      />
                    </h1>
                  </div>
                </Rnd>

                {/* Business Info (From) */}
                {templateConfig.visibility.businessInfo && (
                  <Rnd
                    bounds="parent"
                    position={{ x: templateConfig.businessInfoPosition.x, y: templateConfig.businessInfoPosition.y }}
                    size={{ width: templateConfig.businessInfoPosition.width, height: templateConfig.businessInfoPosition.height }}
                    onDragStop={(_, d) => updatePosition('businessInfo', d.x, d.y)}
                    onResizeStop={(_, __, ref, ___, position) => {
                      updateSize('businessInfo', ref.offsetWidth, ref.offsetHeight);
                      updatePosition('businessInfo', position.x, position.y);
                    }}
                    disableDragging={previewMode}
                    enableResizing={!previewMode}
                    style={{ zIndex: 10 }}
                  >
                    <div>
                      <h3 className="font-semibold mb-2" style={{ color: templateConfig.primaryColor }}>
                        <EditableText
                          value={templateConfig.content.fromLabel}
                          onChange={(val) => handleContentChange('fromLabel', val)}
                          placeholder="From"
                        />
                      </h3>
                      <p className="text-sm">
                        <EditableText
                          value={templateConfig.content.businessName}
                          onChange={(val) => handleContentChange('businessName', val)}
                          placeholder="Your Business Name"
                          className="block"
                        />
                      </p>
                      <p className="text-sm">
                        <EditableText
                          value={templateConfig.content.businessAddress1}
                          onChange={(val) => handleContentChange('businessAddress1', val)}
                          placeholder="123 Business St"
                          className="block"
                        />
                      </p>
                      <p className="text-sm">
                        <EditableText
                          value={templateConfig.content.businessAddress2}
                          onChange={(val) => handleContentChange('businessAddress2', val)}
                          placeholder="City, State 12345"
                          className="block"
                        />
                      </p>
                    </div>
                  </Rnd>
                )}

                {/* Client Info (Bill To) */}
                {templateConfig.visibility.clientInfo && (
                  <Rnd
                    bounds="parent"
                    position={{ x: templateConfig.clientInfoPosition.x, y: templateConfig.clientInfoPosition.y }}
                    size={{ width: templateConfig.clientInfoPosition.width, height: templateConfig.clientInfoPosition.height }}
                    onDragStop={(_, d) => updatePosition('clientInfo', d.x, d.y)}
                    onResizeStop={(_, __, ref, ___, position) => {
                      updateSize('clientInfo', ref.offsetWidth, ref.offsetHeight);
                      updatePosition('clientInfo', position.x, position.y);
                    }}
                    disableDragging={previewMode}
                    enableResizing={!previewMode}
                    style={{ zIndex: 10 }}
                  >
                    <div>
                      <h3 className="font-semibold mb-2" style={{ color: templateConfig.primaryColor }}>
                        <EditableText
                          value={templateConfig.content.billToLabel}
                          onChange={(val) => handleContentChange('billToLabel', val)}
                          placeholder="Bill To"
                        />
                      </h3>
                      <p className="text-sm">
                        <EditableText
                          value={templateConfig.content.clientName}
                          onChange={(val) => handleContentChange('clientName', val)}
                          placeholder="Client Name"
                          className="block"
                        />
                      </p>
                      <p className="text-sm">
                        <EditableText
                          value={templateConfig.content.clientAddress1}
                          onChange={(val) => handleContentChange('clientAddress1', val)}
                          placeholder="456 Client Ave"
                          className="block"
                        />
                      </p>
                      <p className="text-sm">
                        <EditableText
                          value={templateConfig.content.clientAddress2}
                          onChange={(val) => handleContentChange('clientAddress2', val)}
                          placeholder="City, State 67890"
                          className="block"
                        />
                      </p>
                    </div>
                  </Rnd>
                )}

                {/* Ship To */}
                {templateConfig.visibility.shipTo && (
                  <Rnd
                    bounds="parent"
                    position={{ x: templateConfig.shipToPosition.x, y: templateConfig.shipToPosition.y }}
                    size={{ width: templateConfig.shipToPosition.width, height: templateConfig.shipToPosition.height }}
                    onDragStop={(_, d) => updatePosition('shipTo', d.x, d.y)}
                    onResizeStop={(_, __, ref, ___, position) => {
                      updateSize('shipTo', ref.offsetWidth, ref.offsetHeight);
                      updatePosition('shipTo', position.x, position.y);
                    }}
                    disableDragging={previewMode}
                    enableResizing={!previewMode}
                    style={{ zIndex: 10 }}
                  >
                    <div>
                      <h3 className="font-semibold mb-2" style={{ color: templateConfig.primaryColor }}>
                        <EditableText
                          value={templateConfig.content.shipToLabel}
                          onChange={(val) => handleContentChange('shipToLabel', val)}
                          placeholder="Ship To"
                        />
                      </h3>
                      <p className="text-sm">
                        <EditableText
                          value={templateConfig.content.shipToName}
                          onChange={(val) => handleContentChange('shipToName', val)}
                          placeholder="Ship To Name"
                          className="block"
                        />
                      </p>
                      <p className="text-sm">
                        <EditableText
                          value={templateConfig.content.shipToAddress1}
                          onChange={(val) => handleContentChange('shipToAddress1', val)}
                          placeholder="789 Shipping St"
                          className="block"
                        />
                      </p>
                      <p className="text-sm">
                        <EditableText
                          value={templateConfig.content.shipToAddress2}
                          onChange={(val) => handleContentChange('shipToAddress2', val)}
                          placeholder="City, State 11111"
                          className="block"
                        />
                      </p>
                    </div>
                  </Rnd>
                )}

                {/* Items Table */}
                {templateConfig.visibility.itemsTable && (
                  <Rnd
                    bounds="parent"
                    position={{ x: templateConfig.itemsTablePosition.x, y: templateConfig.itemsTablePosition.y }}
                    size={{ width: templateConfig.itemsTablePosition.width, height: templateConfig.itemsTablePosition.height }}
                    onDragStop={(_, d) => updatePosition('itemsTable', d.x, d.y)}
                    onResizeStop={(_, __, ref, ___, position) => {
                      updateSize('itemsTable', ref.offsetWidth, ref.offsetHeight);
                      updatePosition('itemsTable', position.x, position.y);
                    }}
                    disableDragging={previewMode}
                    enableResizing={!previewMode}
                    style={{ zIndex: 10 }}
                  >
                    <div style={{ overflowX: 'auto' }}>
                      <table className="w-full text-sm" style={{ minWidth: '600px' }}>
                        <thead>
                          <tr 
                            style={{ 
                              backgroundColor: templateConfig.primaryColor,
                              color: '#FFFFFF'
                            }}
                          >
                            <th className="text-left p-2 border" style={{ borderColor: templateConfig.borderColor }}>
                              <EditableText
                                value={templateConfig.content.descriptionLabel}
                                onChange={(val) => handleContentChange('descriptionLabel', val)}
                                placeholder="Description"
                              />
                            </th>
                            <th className="text-right p-2 border" style={{ borderColor: templateConfig.borderColor }}>
                              <EditableText
                                value={templateConfig.content.qtyLabel}
                                onChange={(val) => handleContentChange('qtyLabel', val)}
                                placeholder="Qty"
                              />
                            </th>
                            <th className="text-right p-2 border" style={{ borderColor: templateConfig.borderColor }}>
                              <EditableText
                                value={templateConfig.content.rateLabel}
                                onChange={(val) => handleContentChange('rateLabel', val)}
                                placeholder="Rate"
                              />
                            </th>
                            <th className="text-right p-2 border" style={{ borderColor: templateConfig.borderColor }}>
                              <EditableText
                                value={templateConfig.content.amountLabel}
                                onChange={(val) => handleContentChange('amountLabel', val)}
                                placeholder="Amount"
                              />
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-2 border" style={{ borderColor: templateConfig.borderColor }}>
                              <EditableText
                                value={templateConfig.content.item1Desc}
                                onChange={(val) => handleContentChange('item1Desc', val)}
                                placeholder="Sample Item 1"
                              />
                            </td>
                            <td className="text-right p-2 border" style={{ borderColor: templateConfig.borderColor }}>
                              <EditableText
                                value={templateConfig.content.item1Qty}
                                onChange={(val) => handleContentChange('item1Qty', val)}
                                placeholder="2"
                              />
                            </td>
                            <td className="text-right p-2 border" style={{ borderColor: templateConfig.borderColor }}>
                              <EditableText
                                value={templateConfig.content.item1Rate}
                                onChange={(val) => handleContentChange('item1Rate', val)}
                                placeholder="$50.00"
                              />
                            </td>
                            <td className="text-right p-2 border" style={{ borderColor: templateConfig.borderColor }}>
                              <EditableText
                                value={templateConfig.content.item1Amount}
                                onChange={(val) => handleContentChange('item1Amount', val)}
                                placeholder="$100.00"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="p-2 border" style={{ borderColor: templateConfig.borderColor }}>
                              <EditableText
                                value={templateConfig.content.item2Desc}
                                onChange={(val) => handleContentChange('item2Desc', val)}
                                placeholder="Sample Item 2"
                              />
                            </td>
                            <td className="text-right p-2 border" style={{ borderColor: templateConfig.borderColor }}>
                              <EditableText
                                value={templateConfig.content.item2Qty}
                                onChange={(val) => handleContentChange('item2Qty', val)}
                                placeholder="1"
                              />
                            </td>
                            <td className="text-right p-2 border" style={{ borderColor: templateConfig.borderColor }}>
                              <EditableText
                                value={templateConfig.content.item2Rate}
                                onChange={(val) => handleContentChange('item2Rate', val)}
                                placeholder="$75.00"
                              />
                            </td>
                            <td className="text-right p-2 border" style={{ borderColor: templateConfig.borderColor }}>
                              <EditableText
                                value={templateConfig.content.item2Amount}
                                onChange={(val) => handleContentChange('item2Amount', val)}
                                placeholder="$75.00"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Rnd>
                )}

                {/* Totals */}
                {templateConfig.visibility.totals && (
                  <Rnd
                    bounds="parent"
                    position={{ x: templateConfig.totalsPosition.x, y: templateConfig.totalsPosition.y }}
                    size={{ width: templateConfig.totalsPosition.width, height: templateConfig.totalsPosition.height }}
                    onDragStop={(_, d) => updatePosition('totals', d.x, d.y)}
                    onResizeStop={(_, __, ref, ___, position) => {
                      updateSize('totals', ref.offsetWidth, ref.offsetHeight);
                      updatePosition('totals', position.x, position.y);
                    }}
                    disableDragging={previewMode}
                    enableResizing={!previewMode}
                    style={{ zIndex: 10 }}
                  >
                    <div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>
                            <EditableText
                              value={templateConfig.content.subtotalLabel}
                              onChange={(val) => handleContentChange('subtotalLabel', val)}
                              placeholder="Subtotal:"
                            />
                          </span>
                          <EditableText
                            value={templateConfig.content.subtotal}
                            onChange={(val) => handleContentChange('subtotal', val)}
                            placeholder="$175.00"
                          />
                        </div>
                        <div className="flex justify-between">
                          <span>
                            <EditableText
                              value={templateConfig.content.taxLabel}
                              onChange={(val) => handleContentChange('taxLabel', val)}
                              placeholder="Tax (10%):"
                            />
                          </span>
                          <EditableText
                            value={templateConfig.content.tax}
                            onChange={(val) => handleContentChange('tax', val)}
                            placeholder="$17.50"
                          />
                        </div>
                        <div 
                          className="flex justify-between font-bold text-lg pt-2 border-t"
                          style={{ 
                            borderColor: templateConfig.borderColor,
                            color: templateConfig.secondaryColor
                          }}
                        >
                          <span>
                            <EditableText
                              value={templateConfig.content.totalLabel}
                              onChange={(val) => handleContentChange('totalLabel', val)}
                              placeholder="Total:"
                            />
                          </span>
                          <EditableText
                            value={templateConfig.content.total}
                            onChange={(val) => handleContentChange('total', val)}
                            placeholder="$192.50"
                          />
                        </div>
                      </div>
                    </div>
                  </Rnd>
                )}

                {/* Terms */}
                {templateConfig.visibility.terms && (
                  <Rnd
                    bounds="parent"
                    position={{ x: templateConfig.termsPosition.x, y: templateConfig.termsPosition.y }}
                    size={{ width: templateConfig.termsPosition.width, height: templateConfig.termsPosition.height }}
                    onDragStop={(_, d) => updatePosition('terms', d.x, d.y)}
                    onResizeStop={(_, __, ref, ___, position) => {
                      updateSize('terms', ref.offsetWidth, ref.offsetHeight);
                      updatePosition('terms', position.x, position.y);
                    }}
                    disableDragging={previewMode}
                    enableResizing={!previewMode}
                    style={{ zIndex: 10 }}
                  >
                    <div className="text-sm">
                      <h3 className="font-semibold mb-2" style={{ color: templateConfig.primaryColor }}>
                        <EditableText
                          value={templateConfig.content.termsLabel}
                          onChange={(val) => handleContentChange('termsLabel', val)}
                          placeholder="Terms & Conditions"
                        />
                      </h3>
                      <p className="text-gray-600">
                        <EditableText
                          value={templateConfig.content.terms}
                          onChange={(val) => handleContentChange('terms', val)}
                          placeholder="Payment is due within 30 days. Thank you for your business!"
                          className="block"
                        />
                      </p>
                    </div>
                  </Rnd>
                )}

                {/* Payment Information */}
                {templateConfig.visibility.paymentInfo && (
                  <Rnd
                    bounds="parent"
                    position={{ x: templateConfig.paymentInfoPosition.x, y: templateConfig.paymentInfoPosition.y }}
                    size={{ width: templateConfig.paymentInfoPosition.width, height: templateConfig.paymentInfoPosition.height }}
                    onDragStop={(_, d) => updatePosition('paymentInfo', d.x, d.y)}
                    onResizeStop={(_, __, ref, ___, position) => {
                      updateSize('paymentInfo', ref.offsetWidth, ref.offsetHeight);
                      updatePosition('paymentInfo', position.x, position.y);
                    }}
                    disableDragging={previewMode}
                    enableResizing={!previewMode}
                    style={{ zIndex: 10 }}
                  >
                    <div className="bg-white border rounded-lg p-4" style={{ borderColor: templateConfig.borderColor }}>
                        <h3 className="font-semibold mb-3 text-sm" style={{ color: templateConfig.primaryColor }}>
                          <EditableText
                            value={templateConfig.content.paymentInfoLabel}
                            onChange={(val) => handleContentChange('paymentInfoLabel', val)}
                            placeholder="PAYMENT INFORMATION"
                          />
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex gap-2">
                            <span className="text-gray-600 w-24">
                              <EditableText
                                value={templateConfig.content.bankLabel}
                                onChange={(val) => handleContentChange('bankLabel', val)}
                                placeholder="Bank:"
                              />
                            </span>
                            <EditableText
                              value={templateConfig.content.bankName}
                              onChange={(val) => handleContentChange('bankName', val)}
                              placeholder="Bank of America"
                            />
                          </div>
                          <div className="flex gap-2">
                            <span className="text-gray-600 w-24">
                              <EditableText
                                value={templateConfig.content.accountLabel}
                                onChange={(val) => handleContentChange('accountLabel', val)}
                                placeholder="Account:"
                              />
                            </span>
                            <EditableText
                              value={templateConfig.content.accountNumber}
                              onChange={(val) => handleContentChange('accountNumber', val)}
                              placeholder="****1234"
                            />
                          </div>
                          <div className="flex gap-2">
                            <span className="text-gray-600 w-24">
                              <EditableText
                                value={templateConfig.content.ifscLabel}
                                onChange={(val) => handleContentChange('ifscLabel', val)}
                                placeholder="IFSC/Routing:"
                              />
                            </span>
                            <EditableText
                              value={templateConfig.content.ifscCode}
                              onChange={(val) => handleContentChange('ifscCode', val)}
                              placeholder="BOFA0001234"
                            />
                          </div>
                        </div>
                      </div>
                  </Rnd>
                )}

                {/* QR Code */}
                {templateConfig.visibility.qrCodeSection && (
                  <Rnd
                    bounds="parent"
                    position={{ x: templateConfig.qrCodePosition.x, y: templateConfig.qrCodePosition.y }}
                    size={{ width: templateConfig.qrCodePosition.width, height: templateConfig.qrCodePosition.height }}
                    onDragStop={(_, d) => updatePosition('qrCode', d.x, d.y)}
                    onResizeStop={(_, __, ref, ___, position) => {
                      updateSize('qrCode', ref.offsetWidth, ref.offsetHeight);
                      updatePosition('qrCode', position.x, position.y);
                    }}
                    disableDragging={previewMode}
                    enableResizing={!previewMode}
                    style={{ zIndex: 10 }}
                  >
                    <div className="text-center flex flex-col items-center justify-center">
                        <div className="relative group">
                          {templateConfig.content.qrCodeImage ? (
                            <img 
                              src={templateConfig.content.qrCodeImage} 
                              alt="QR Code" 
                              className="w-32 h-32 object-contain rounded"
                            />
                          ) : (
                            <div className="w-32 h-32 mb-2 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-gray-500 text-xs">QR Code</span>
                            </div>
                          )}
                          {!previewMode && (
                            <>
                              <label className="absolute bottom-2 right-2 bg-indigo-600 text-white px-2 py-1 rounded text-xs cursor-pointer opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-indigo-700">
                                📷 Upload
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload('qrCodeImage', e.target.files[0])}
                                  className="hidden"
                                />
                              </label>
                              {templateConfig.content.qrCodeImage && (
                                <button
                                  onClick={() => handleContentChange('qrCodeImage', null)}
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-red-600"
                                  title="Remove image"
                                >
                                  ×
                                </button>
                              )}
                            </>
                          )}
                        </div>
                        <p className="text-sm font-semibold mt-2" style={{ color: templateConfig.primaryColor }}>
                          <EditableText
                            value={templateConfig.content.qrCodeText}
                            onChange={(val) => handleContentChange('qrCodeText', val)}
                            placeholder="Scan to Pay"
                          />
                        </p>
                      </div>
                  </Rnd>
                )}

                {/* Signature */}
                {templateConfig.visibility.signature && (
                  <Rnd
                    bounds="parent"
                    position={{ x: templateConfig.signaturePosition.x, y: templateConfig.signaturePosition.y }}
                    size={{ width: templateConfig.signaturePosition.width, height: templateConfig.signaturePosition.height }}
                    onDragStop={(_, d) => updatePosition('signature', d.x, d.y)}
                    onResizeStop={(_, __, ref, ___, position) => {
                      updateSize('signature', ref.offsetWidth, ref.offsetHeight);
                      updatePosition('signature', position.x, position.y);
                    }}
                    disableDragging={previewMode}
                    enableResizing={!previewMode}
                    style={{ zIndex: 10 }}
                  >
                    <div className="text-center">
                      <div className="relative group inline-block">
                        {templateConfig.content.signatureImage ? (
                          <div className="w-48 mx-auto mb-2">
                            <img 
                              src={templateConfig.content.signatureImage} 
                              alt="Signature" 
                              className="w-full h-16 object-contain"
                            />
                          </div>
                        ) : (
                          <div 
                            className="w-48 mx-auto mb-2 border-b-2"
                            style={{ 
                              borderColor: templateConfig.primaryColor,
                              height: '60px'
                            }}
                          >
                            <div className="text-gray-400 text-xs pt-10">Signature Area</div>
                          </div>
                        )}
                        {!previewMode && (
                          <>
                            <label className="absolute bottom-2 right-2 bg-indigo-600 text-white px-2 py-1 rounded text-xs cursor-pointer opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-indigo-700">
                              📷 Upload
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload('signatureImage', e.target.files[0])}
                                className="hidden"
                              />
                            </label>
                            {templateConfig.content.signatureImage && (
                              <button
                                onClick={() => handleContentChange('signatureImage', null)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-red-600"
                                title="Remove image"
                              >
                                ×
                              </button>
                            )}
                          </>
                        )}
                      </div>
                      <p className="text-sm font-semibold">
                        <EditableText
                          value={templateConfig.content.signatureLabel}
                          onChange={(val) => handleContentChange('signatureLabel', val)}
                          placeholder="Authorized Signature"
                        />
                      </p>
                    </div>
                  </Rnd>
                )}

                {/* Footer */}
                {(templateConfig.visibility.businessInfo || templateConfig.visibility.paymentInfo) && (
                  <Rnd
                    bounds="parent"
                    position={{ x: templateConfig.footerPosition.x, y: templateConfig.footerPosition.y }}
                    size={{ width: templateConfig.footerPosition.width, height: templateConfig.footerPosition.height }}
                    onDragStop={(_, d) => updatePosition('footer', d.x, d.y)}
                    onResizeStop={(_, __, ref, ___, position) => {
                      updateSize('footer', ref.offsetWidth, ref.offsetHeight);
                      updatePosition('footer', position.x, position.y);
                    }}
                    disableDragging={previewMode}
                    enableResizing={!previewMode}
                    style={{ zIndex: 10 }}
                  >
                    <div 
                      className="grid grid-cols-3 gap-4 text-center text-sm border-t"
                      style={{ borderColor: templateConfig.borderColor }}
                    >
                      <div>
                        <p className="font-semibold mb-1" style={{ color: templateConfig.primaryColor }}>
                          <EditableText
                            value={templateConfig.content.emailLabel}
                            onChange={(val) => handleContentChange('emailLabel', val)}
                            placeholder="EMAIL"
                          />
                        </p>
                        <p className="text-xs">
                          <EditableText
                            value={templateConfig.content.footerEmail}
                            onChange={(val) => handleContentChange('footerEmail', val)}
                            placeholder="contact@business.com"
                          />
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold mb-1" style={{ color: templateConfig.primaryColor }}>
                          <EditableText
                            value={templateConfig.content.phoneLabel}
                            onChange={(val) => handleContentChange('phoneLabel', val)}
                            placeholder="PHONE"
                          />
                        </p>
                        <p className="text-xs">
                          <EditableText
                            value={templateConfig.content.footerPhone}
                            onChange={(val) => handleContentChange('footerPhone', val)}
                            placeholder="+1 (555) 123-4567"
                          />
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold mb-1" style={{ color: templateConfig.primaryColor }}>
                          <EditableText
                            value={templateConfig.content.websiteLabel}
                            onChange={(val) => handleContentChange('websiteLabel', val)}
                            placeholder="WEBSITE"
                          />
                        </p>
                        <p className="text-xs">
                          <EditableText
                            value={templateConfig.content.footerWebsite}
                            onChange={(val) => handleContentChange('footerWebsite', val)}
                            placeholder="www.business.com"
                          />
                        </p>
                      </div>
                    </div>
                  </Rnd>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default TemplateBuilder;
