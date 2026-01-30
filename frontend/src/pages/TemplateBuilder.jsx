import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Eye, ArrowLeft } from 'lucide-react';

const EditableText = ({ value, onChange, style, className, placeholder }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

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
      style={{
        ...style,
        cursor: 'pointer',
        padding: '2px 4px',
        borderRadius: '2px',
        transition: 'background 0.2s'
      }}
      className={`${className} hover:bg-blue-50`}
      title="Click to edit"
    >
      {value || placeholder}
    </span>
  );
};

const TemplateBuilder = () => {
  const navigate = useNavigate();
  
  const [templateConfig, setTemplateConfig] = useState({
    name: 'My Custom Template',
    colors: {
      primary: '#4F46E5',
      secondary: '#10B981',
      text: '#1F2937',
      background: '#FFFFFF',
      border: '#E5E7EB'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
      headingSize: '24px',
      bodySize: '14px'
    },
    layout: {
      logoPosition: 'left',
      logoSize: 'medium',
      headerStyle: 'modern',
      tableStyle: 'striped',
      footerStyle: 'full'
    },
    sections: {
      showLogo: true,
      showBusinessInfo: true,
      showClientInfo: true,
      showShipTo: true,
      showInvoiceMeta: true,
      showItemsTable: true,
      showTotals: true,
      showTerms: true,
      showPaymentInfo: true,
      showSignature: true,
      showQRCode: true
    },
    content: {
      invoiceTitle: 'INVOICE',
      logoText: 'LOGO',
      
      // Section Headers (editable)
      fromLabel: 'From',
      billToLabel: 'Bill To',
      shipToLabel: 'Ship To',
      invoiceNumberLabel: 'Invoice #:',
      dateLabel: 'Date:',
      poNumberLabel: 'PO #:',
      dueDateLabel: 'Due Date:',
      descriptionLabel: 'Description',
      qtyLabel: 'Qty',
      rateLabel: 'Rate',
      amountLabel: 'Amount',
      subtotalLabel: 'Subtotal:',
      taxLabel: 'Tax (10%):',
      totalLabel: 'Total:',
      termsLabel: 'Terms & Conditions',
      paymentInfoLabel: 'PAYMENT INFORMATION',
      bankLabel: 'Bank:',
      accountLabel: 'Account:',
      ifscLabel: 'IFSC/Routing:',
      signatureLabel: 'Authorized Signature',
      emailLabel: 'EMAIL',
      phoneLabel: 'PHONE',
      websiteLabel: 'WEBSITE',
      
      // Content values
      businessName: 'Your Business Name',
      businessAddress1: '123 Business St',
      businessAddress2: 'City, State 12345',
      businessEmail: 'business@email.com',
      businessPhone: '+1 (555) 123-4567',
      clientName: 'Client Name',
      clientAddress1: '456 Client Ave',
      clientAddress2: 'City, State 67890',
      shipToName: 'Ship To Name',
      shipToAddress1: '789 Shipping St',
      shipToAddress2: 'City, State 11111',
      invoiceNumber: 'INV-001',
      invoiceDate: 'Jan 29, 2026',
      poNumber: 'PO-12345',
      dueDate: 'Feb 28, 2026',
      item1Desc: 'Sample Item 1',
      item1Qty: '2',
      item1Rate: '$50.00',
      item1Amount: '$100.00',
      item2Desc: 'Sample Item 2',
      item2Qty: '1',
      item2Rate: '$75.00',
      item2Amount: '$75.00',
      subtotal: '$175.00',
      tax: '$17.50',
      total: '$192.50',
      terms: 'Payment is due within 30 days. Thank you for your business!',
      bankName: 'Bank of America',
      accountNumber: '****1234',
      ifscCode: 'BOFA0001234',
      qrCodeText: 'Scan to Pay',
      footerEmail: 'contact@business.com',
      footerPhone: '+1 (555) 123-4567',
      footerWebsite: 'www.business.com'
    }
  });

  const [previewMode, setPreviewMode] = useState(false);

  const handleContentChange = (key, value) => {
    setTemplateConfig(prev => ({
      ...prev,
      content: { ...prev.content, [key]: value }
    }));
  };

  const handleColorChange = (key, value) => {
    setTemplateConfig(prev => ({
      ...prev,
      colors: { ...prev.colors, [key]: value }
    }));
  };

  const handleFontChange = (key, value) => {
    setTemplateConfig(prev => ({
      ...prev,
      fonts: { ...prev.fonts, [key]: value }
    }));
  };

  const handleLayoutChange = (key, value) => {
    setTemplateConfig(prev => ({
      ...prev,
      layout: { ...prev.layout, [key]: value }
    }));
  };

  const handleSectionToggle = (key) => {
    setTemplateConfig(prev => ({
      ...prev,
      sections: { ...prev.sections, [key]: !prev.sections[key] }
    }));
  };

  const handleSave = async () => {
    try {
      // TODO: Save to backend
      alert('Template saved successfully!');
      navigate('/dashboard');
    } catch (error) {
      alert('Failed to save template');
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Template Builder</h1>
                <p className="text-sm text-gray-500">Create your custom invoice template</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <Eye className="w-4 h-4" />
                {previewMode ? 'Edit' : 'Preview'}
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <Save className="w-4 h-4" />
                Save Template
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customization Panel */}
          {!previewMode && (
            <div className="lg:col-span-1 space-y-6">
              {/* Template Name */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Template Name</h3>
                <input
                  type="text"
                  value={templateConfig.name}
                  onChange={(e) => setTemplateConfig(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Colors */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Colors</h3>
                <div className="space-y-3">
                  {Object.entries(templateConfig.colors).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={value}
                          onChange={(e) => handleColorChange(key, e.target.value)}
                          className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => handleColorChange(key, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  ))}
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
                      value={templateConfig.fonts.heading}
                      onChange={(e) => handleFontChange('heading', e.target.value)}
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
                      value={templateConfig.fonts.body}
                      onChange={(e) => handleFontChange('body', e.target.value)}
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
                      value={templateConfig.fonts.headingSize}
                      onChange={(e) => handleFontChange('headingSize', e.target.value)}
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
                      value={templateConfig.fonts.bodySize}
                      onChange={(e) => handleFontChange('bodySize', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="14px"
                    />
                  </div>
                </div>
              </div>

              {/* Layout */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Layout</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logo Position
                    </label>
                    <select
                      value={templateConfig.layout.logoPosition}
                      onChange={(e) => handleLayoutChange('logoPosition', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logo Size
                    </label>
                    <select
                      value={templateConfig.layout.logoSize}
                      onChange={(e) => handleLayoutChange('logoSize', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Header Style
                    </label>
                    <select
                      value={templateConfig.layout.headerStyle}
                      onChange={(e) => handleLayoutChange('headerStyle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="modern">Modern</option>
                      <option value="classic">Classic</option>
                      <option value="minimal">Minimal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Table Style
                    </label>
                    <select
                      value={templateConfig.layout.tableStyle}
                      onChange={(e) => handleLayoutChange('tableStyle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="striped">Striped</option>
                      <option value="bordered">Bordered</option>
                      <option value="minimal">Minimal</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Sections</h3>
                <div className="space-y-2">
                  {Object.entries(templateConfig.sections).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => handleSectionToggle(key)}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace('show', '').trim()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Preview Panel */}
          <div className={previewMode ? 'lg:col-span-3' : 'lg:col-span-2'}>
            <div className="bg-white rounded-lg shadow p-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Preview</h3>
              </div>
              <div 
                className="border border-gray-200 rounded-lg p-8 min-h-[800px]"
                style={{
                  backgroundColor: templateConfig.colors.background,
                  fontFamily: templateConfig.fonts.body,
                  fontSize: templateConfig.fonts.bodySize,
                  color: templateConfig.colors.text
                }}
              >
                {/* Preview Content */}
                <div className="space-y-6">
                  {/* Header Row: Logo on left, Invoice Meta on right */}
                  <div className="flex justify-between items-start">
                    {/* Logo */}
                    {templateConfig.sections.showLogo && (
                      <div className={`flex ${templateConfig.layout.logoPosition === 'center' ? 'justify-center' : templateConfig.layout.logoPosition === 'right' ? 'justify-end' : 'justify-start'}`}>
                        <div 
                          className="bg-gray-200 rounded flex items-center justify-center text-gray-500"
                          style={{
                            width: templateConfig.layout.logoSize === 'small' ? '80px' : templateConfig.layout.logoSize === 'large' ? '150px' : '120px',
                            height: templateConfig.layout.logoSize === 'small' ? '80px' : templateConfig.layout.logoSize === 'large' ? '150px' : '120px'
                          }}
                        >
                          <EditableText
                            value={templateConfig.content.logoText}
                            onChange={(val) => handleContentChange('logoText', val)}
                            placeholder="LOGO"
                          />
                        </div>
                      </div>
                    )}

                    {/* Invoice Meta on Right */}
                    {templateConfig.sections.showInvoiceMeta && (
                      <div className="text-right text-sm">
                        <div className="mb-2">
                          <span className="font-semibold">
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
                          <span className="font-semibold">
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
                          <span className="font-semibold">
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
                          <span className="font-semibold">
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
                    )}
                  </div>

                  {/* Invoice Title */}
                  <div>
                    <h1 
                      style={{
                        fontFamily: templateConfig.fonts.heading,
                        fontSize: templateConfig.fonts.headingSize,
                        color: templateConfig.colors.primary
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

                  {/* From, Bill To, Ship To in one row */}
                  <div className="grid grid-cols-3 gap-6">
                    {templateConfig.sections.showBusinessInfo && (
                      <div>
                        <h3 className="font-semibold mb-2" style={{ color: templateConfig.colors.primary }}>
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
                    )}
                    {templateConfig.sections.showClientInfo && (
                      <div>
                        <h3 className="font-semibold mb-2" style={{ color: templateConfig.colors.primary }}>
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
                    )}
                    {templateConfig.sections.showShipTo && (
                      <div>
                        <h3 className="font-semibold mb-2" style={{ color: templateConfig.colors.primary }}>
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
                    )}
                  </div>

                  {/* Items Table */}
                  {templateConfig.sections.showItemsTable && (
                    <div>
                      <table className="w-full text-sm">
                        <thead>
                          <tr 
                            style={{ 
                              backgroundColor: templateConfig.layout.tableStyle === 'bordered' ? templateConfig.colors.background : templateConfig.colors.primary,
                              color: templateConfig.layout.tableStyle === 'bordered' ? templateConfig.colors.text : '#FFFFFF'
                            }}
                          >
                            <th className="text-left p-2 border" style={{ borderColor: templateConfig.colors.border }}>
                              <EditableText
                                value={templateConfig.content.descriptionLabel}
                                onChange={(val) => handleContentChange('descriptionLabel', val)}
                                placeholder="Description"
                              />
                            </th>
                            <th className="text-right p-2 border" style={{ borderColor: templateConfig.colors.border }}>
                              <EditableText
                                value={templateConfig.content.qtyLabel}
                                onChange={(val) => handleContentChange('qtyLabel', val)}
                                placeholder="Qty"
                              />
                            </th>
                            <th className="text-right p-2 border" style={{ borderColor: templateConfig.colors.border }}>
                              <EditableText
                                value={templateConfig.content.rateLabel}
                                onChange={(val) => handleContentChange('rateLabel', val)}
                                placeholder="Rate"
                              />
                            </th>
                            <th className="text-right p-2 border" style={{ borderColor: templateConfig.colors.border }}>
                              <EditableText
                                value={templateConfig.content.amountLabel}
                                onChange={(val) => handleContentChange('amountLabel', val)}
                                placeholder="Amount"
                              />
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className={templateConfig.layout.tableStyle === 'striped' ? 'bg-gray-50' : ''}>
                            <td className="p-2 border" style={{ borderColor: templateConfig.colors.border }}>
                              <EditableText
                                value={templateConfig.content.item1Desc}
                                onChange={(val) => handleContentChange('item1Desc', val)}
                                placeholder="Sample Item 1"
                              />
                            </td>
                            <td className="text-right p-2 border" style={{ borderColor: templateConfig.colors.border }}>
                              <EditableText
                                value={templateConfig.content.item1Qty}
                                onChange={(val) => handleContentChange('item1Qty', val)}
                                placeholder="2"
                              />
                            </td>
                            <td className="text-right p-2 border" style={{ borderColor: templateConfig.colors.border }}>
                              <EditableText
                                value={templateConfig.content.item1Rate}
                                onChange={(val) => handleContentChange('item1Rate', val)}
                                placeholder="$50.00"
                              />
                            </td>
                            <td className="text-right p-2 border" style={{ borderColor: templateConfig.colors.border }}>
                              <EditableText
                                value={templateConfig.content.item1Amount}
                                onChange={(val) => handleContentChange('item1Amount', val)}
                                placeholder="$100.00"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="p-2 border" style={{ borderColor: templateConfig.colors.border }}>
                              <EditableText
                                value={templateConfig.content.item2Desc}
                                onChange={(val) => handleContentChange('item2Desc', val)}
                                placeholder="Sample Item 2"
                              />
                            </td>
                            <td className="text-right p-2 border" style={{ borderColor: templateConfig.colors.border }}>
                              <EditableText
                                value={templateConfig.content.item2Qty}
                                onChange={(val) => handleContentChange('item2Qty', val)}
                                placeholder="1"
                              />
                            </td>
                            <td className="text-right p-2 border" style={{ borderColor: templateConfig.colors.border }}>
                              <EditableText
                                value={templateConfig.content.item2Rate}
                                onChange={(val) => handleContentChange('item2Rate', val)}
                                placeholder="$75.00"
                              />
                            </td>
                            <td className="text-right p-2 border" style={{ borderColor: templateConfig.colors.border }}>
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
                  )}

                  {/* Totals */}
                  {templateConfig.sections.showTotals && (
                    <div className="flex justify-end">
                      <div className="w-64 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <EditableText
                            value={templateConfig.content.subtotal}
                            onChange={(val) => handleContentChange('subtotal', val)}
                            placeholder="$175.00"
                          />
                        </div>
                        <div className="flex justify-between">
                          <span>Tax (10%):</span>
                          <EditableText
                            value={templateConfig.content.tax}
                            onChange={(val) => handleContentChange('tax', val)}
                            placeholder="$17.50"
                          />
                        </div>
                        <div 
                          className="flex justify-between font-bold text-lg pt-2 border-t"
                          style={{ 
                            borderColor: templateConfig.colors.border,
                            color: templateConfig.colors.primary
                          }}
                        >
                          <span>Total:</span>
                          <EditableText
                            value={templateConfig.content.total}
                            onChange={(val) => handleContentChange('total', val)}
                            placeholder="$192.50"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Terms */}
                  {templateConfig.sections.showTerms && (
                    <div className="text-sm">
                      <h3 className="font-semibold mb-2" style={{ color: templateConfig.colors.primary }}>
                        Terms & Conditions
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
                  )}

                  {/* Payment Information and QR Code in one row */}
                  <div className="grid grid-cols-2 gap-6">
                    {templateConfig.sections.showPaymentInfo && (
                      <div className="border rounded-lg p-4" style={{ borderColor: templateConfig.colors.border }}>
                        <h3 className="font-semibold mb-3 text-sm" style={{ color: templateConfig.colors.primary }}>
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
                    )}

                    {templateConfig.sections.showQRCode && (
                      <div className="text-center flex flex-col items-center justify-center">
                        <div 
                          className="w-32 h-32 mb-2 bg-gray-200 rounded flex items-center justify-center"
                        >
                          <span className="text-gray-500 text-xs">QR Code</span>
                        </div>
                        <p className="text-sm font-semibold" style={{ color: templateConfig.colors.primary }}>
                          <EditableText
                            value={templateConfig.content.qrCodeText}
                            onChange={(val) => handleContentChange('qrCodeText', val)}
                            placeholder="Scan to Pay"
                          />
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Signature */}
                  {templateConfig.sections.showSignature && (
                    <div className="text-center">
                      <div 
                        className="w-48 mx-auto mb-2 border-b-2"
                        style={{ 
                          borderColor: templateConfig.colors.primary,
                          height: '60px'
                        }}
                      >
                        <div className="text-gray-400 text-xs pt-10">Signature Area</div>
                      </div>
                      <p className="text-sm font-semibold">
                        <EditableText
                          value={templateConfig.content.signatureLabel}
                          onChange={(val) => handleContentChange('signatureLabel', val)}
                          placeholder="Authorized Signature"
                        />
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  {(templateConfig.sections.showBusinessInfo || templateConfig.sections.showPaymentInfo) && (
                    <div 
                      className="grid grid-cols-3 gap-4 text-center text-sm pt-6 border-t"
                      style={{ borderColor: templateConfig.colors.border }}
                    >
                      <div>
                        <p className="font-semibold mb-1">
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
                        <p className="font-semibold mb-1">
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
                        <p className="font-semibold mb-1">
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
