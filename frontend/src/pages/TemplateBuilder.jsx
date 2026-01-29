import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Eye, ArrowLeft } from 'lucide-react';

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
      logoPosition: 'left', // left, center, right
      logoSize: 'medium', // small, medium, large
      headerStyle: 'modern', // modern, classic, minimal
      tableStyle: 'striped', // striped, bordered, minimal
      footerStyle: 'full' // full, minimal, none
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
    }
  });

  const [previewMode, setPreviewMode] = useState(false);

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
      console.log('Saving template:', templateConfig);
      alert('Template saved successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving template:', error);
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
              <h3 className="text-lg font-semibold mb-4">Preview</h3>
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
                  {/* Header */}
                  {templateConfig.sections.showLogo && (
                    <div className={`flex ${templateConfig.layout.logoPosition === 'center' ? 'justify-center' : templateConfig.layout.logoPosition === 'right' ? 'justify-end' : 'justify-start'}`}>
                      <div 
                        className="bg-gray-200 rounded flex items-center justify-center text-gray-500"
                        style={{
                          width: templateConfig.layout.logoSize === 'small' ? '80px' : templateConfig.layout.logoSize === 'large' ? '150px' : '120px',
                          height: templateConfig.layout.logoSize === 'small' ? '80px' : templateConfig.layout.logoSize === 'large' ? '150px' : '120px'
                        }}
                      >
                        LOGO
                      </div>
                    </div>
                  )}

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
                      INVOICE
                    </h1>
                  </div>

                  {/* Business & Client Info */}
                  <div className="grid grid-cols-2 gap-8">
                    {templateConfig.sections.showBusinessInfo && (
                      <div>
                        <h3 className="font-semibold mb-2" style={{ color: templateConfig.colors.primary }}>
                          From
                        </h3>
                        <p className="text-sm">Your Business Name</p>
                        <p className="text-sm">123 Business St</p>
                        <p className="text-sm">City, State 12345</p>
                      </div>
                    )}
                    {templateConfig.sections.showClientInfo && (
                      <div>
                        <h3 className="font-semibold mb-2" style={{ color: templateConfig.colors.primary }}>
                          Bill To
                        </h3>
                        <p className="text-sm">Client Name</p>
                        <p className="text-sm">456 Client Ave</p>
                        <p className="text-sm">City, State 67890</p>
                      </div>
                    )}
                  </div>

                  {/* Invoice Meta */}
                  {templateConfig.sections.showInvoiceMeta && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold">Invoice #:</span> INV-001
                      </div>
                      <div>
                        <span className="font-semibold">Date:</span> Jan 29, 2026
                      </div>
                      <div>
                        <span className="font-semibold">Due Date:</span> Feb 28, 2026
                      </div>
                    </div>
                  )}

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
                            <th className="text-left p-2 border" style={{ borderColor: templateConfig.colors.border }}>Description</th>
                            <th className="text-right p-2 border" style={{ borderColor: templateConfig.colors.border }}>Qty</th>
                            <th className="text-right p-2 border" style={{ borderColor: templateConfig.colors.border }}>Rate</th>
                            <th className="text-right p-2 border" style={{ borderColor: templateConfig.colors.border }}>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className={templateConfig.layout.tableStyle === 'striped' ? 'bg-gray-50' : ''}>
                            <td className="p-2 border" style={{ borderColor: templateConfig.colors.border }}>Sample Item 1</td>
                            <td className="text-right p-2 border" style={{ borderColor: templateConfig.colors.border }}>2</td>
                            <td className="text-right p-2 border" style={{ borderColor: templateConfig.colors.border }}>$50.00</td>
                            <td className="text-right p-2 border" style={{ borderColor: templateConfig.colors.border }}>$100.00</td>
                          </tr>
                          <tr>
                            <td className="p-2 border" style={{ borderColor: templateConfig.colors.border }}>Sample Item 2</td>
                            <td className="text-right p-2 border" style={{ borderColor: templateConfig.colors.border }}>1</td>
                            <td className="text-right p-2 border" style={{ borderColor: templateConfig.colors.border }}>$75.00</td>
                            <td className="text-right p-2 border" style={{ borderColor: templateConfig.colors.border }}>$75.00</td>
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
                          <span>$175.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax (10%):</span>
                          <span>$17.50</span>
                        </div>
                        <div 
                          className="flex justify-between font-bold text-lg pt-2 border-t"
                          style={{ 
                            borderColor: templateConfig.colors.border,
                            color: templateConfig.colors.primary
                          }}
                        >
                          <span>Total:</span>
                          <span>$192.50</span>
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
                      <p className="text-gray-600">Payment is due within 30 days. Thank you for your business!</p>
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
