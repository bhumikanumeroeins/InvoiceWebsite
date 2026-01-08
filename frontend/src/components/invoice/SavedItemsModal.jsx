import { useState } from 'react';
import { X, Plus, Trash2, Search } from 'lucide-react';

const SavedItemsModal = ({ isOpen, onClose, savedItems, onSelectItem, onDeleteItem, onSaveNewItem }) => {
  const [newDescription, setNewDescription] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const handleSaveNew = () => {
    if (newDescription.trim() && newAmount) {
      onSaveNewItem({
        id: Date.now(),
        description: newDescription.trim(),
        amount: parseFloat(newAmount),
      });
      setNewDescription('');
      setNewAmount('');
    }
  };

  // Filter items based on search query
  const filteredItems = savedItems.filter(item =>
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Saved Items</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved items..."
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            />
          </div>

          {/* Saved Items List */}
          {savedItems.length > 0 ? (
            <div className="mb-6">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-slate-50 rounded-t-lg text-xs font-semibold text-slate-600 uppercase tracking-wide">
                <div className="col-span-6">Description</div>
                <div className="col-span-3 text-center">Amount</div>
                <div className="col-span-3 text-center">Actions</div>
              </div>

              {/* Item Rows */}
              <div className="border border-slate-200 rounded-b-lg divide-y divide-slate-200 max-h-64 overflow-y-auto">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-slate-50 transition-colors"
                    >
                      <div className="col-span-6 text-slate-700">{item.description}</div>
                      <div className="col-span-3 text-center text-slate-600">₹{item.amount.toFixed(2)}</div>
                      <div className="col-span-3 flex justify-center gap-2">
                        <button
                          onClick={() => onSelectItem(item)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-slate-500 text-sm">
                    No items found matching "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 mb-6">
              No saved items yet. Add your first item below.
            </div>
          )}
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

export default SavedItemsModal;
