import { useState } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';

const TaxModal = ({ isOpen, onClose, savedTaxes, onSaveTax, onDeleteTax, selectedTaxes, onToggleTax, loading }) => {
  const [newTaxName, setNewTaxName] = useState('');
  const [newTaxRate, setNewTaxRate] = useState('');
  const [isCompound, setIsCompound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  if (!isOpen) return null;

  const handleAddTax = async () => {
    if (newTaxRate) {
      setSaving(true);
      const newTax = {
        name: newTaxName.trim() || `Tax ${parseFloat(newTaxRate)}%`,
        rate: parseFloat(newTaxRate),
        isCompound
      };
      const savedTax = await onSaveTax(newTax);
      if (savedTax) {
        // Auto-select the newly added tax
        onToggleTax(savedTax.id || savedTax._id);
        setNewTaxName('');
        setNewTaxRate('');
        setIsCompound(false);
      }
      setSaving(false);
    }
  };

  const handleDeleteTax = async (taxId) => {
    setDeleting(taxId);
    await onDeleteTax(taxId);
    setDeleting(null);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Add a Tax</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Saved Taxes Table */}
          {savedTaxes.length > 0 && (
            <div className="mb-6">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-slate-50 rounded-t-lg text-xs font-semibold text-slate-600 uppercase tracking-wide">
                <div className="col-span-3">Tax Name</div>
                <div className="col-span-3 text-center">Tax Rate %</div>
                <div className="col-span-4 text-center">Selected?</div>
                <div className="col-span-2 text-center">Delete Tax</div>
              </div>

              {/* Tax Rows */}
              <div className="border border-slate-200 rounded-b-lg divide-y divide-slate-200">
                {savedTaxes.map((tax) => {
                  const taxId = tax.id || tax._id;
                  const isSelected = selectedTaxes.includes(taxId);
                  return (
                    <div 
                      key={taxId} 
                      onClick={() => onToggleTax(taxId)}
                      className={`grid grid-cols-12 gap-4 px-4 py-3 items-center cursor-pointer transition-colors ${
                        isSelected ? 'bg-emerald-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="col-span-3 text-slate-700 font-medium">{tax.name}</div>
                      <div className="col-span-3 text-center text-slate-600">{tax.rate} %</div>
                      <div className="col-span-4 text-center">
                        <span
                          className={`text-sm font-medium ${
                            isSelected 
                              ? 'text-emerald-600' 
                              : 'text-indigo-600'
                          }`}
                        >
                          {isSelected ? 'Selected' : 'Select Second Tax'}
                        </span>
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTax(tax.id || tax._id);
                          }}
                          disabled={deleting === (tax.id || tax._id)}
                          className="w-7 h-7 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                          {deleting === (tax.id || tax._id) ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <X className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add New Tax Section */}
          <div className="border-t border-slate-200 pt-6">
            <p className="text-sm text-indigo-600 font-medium text-center mb-4 flex items-center justify-center gap-1">
              <Plus className="w-4 h-4" />
              Add New Tax
            </p>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={newTaxName}
                onChange={(e) => setNewTaxName(e.target.value)}
                placeholder="Tax Name"
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
              />
              <input
                type="number"
                value={newTaxRate}
                onChange={(e) => setNewTaxRate(e.target.value)}
                placeholder="0.0"
                className="w-24 px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-center"
              />
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={isCompound}
                  onChange={(e) => setIsCompound(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Compound Tax?
              </label>
              <button
                onClick={handleAddTax}
                disabled={!newTaxRate || saving}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors text-sm whitespace-nowrap flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Tax'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaxModal;
