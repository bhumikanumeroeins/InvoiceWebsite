import { useState, useEffect } from "react";
import { Plus, X, Loader2, Trash2 } from "lucide-react";
import API from "../services/api";
import { toast } from "react-toastify";

const AdminFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const response = await API.get("/admin/faq/all");
      if (response.data.status === "success" || response.data.success) {
        setFaqs(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch FAQs:", error);
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      question: "",
      answer: "",
      isActive: true,
      order: 0,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      question: "",
      answer: "",
      isActive: true,
      order: 0,
    });
  };

  const handleSave = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.error("Question and Answer are required");
      return;
    }

    setSaving(true);
    try {
      const response = await API.post("/admin/faq/create", formData);
      if (response.data.status === "success" || response.data.success) {
        setFaqs((prev) => [...prev, response.data.data]);
        handleCloseModal();
        toast.success("FAQ created successfully");
      }
    } catch (error) {
      console.error("Failed to save FAQ:", error);
      toast.error("Failed to save FAQ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) {
      return;
    }

    try {
      const response = await API.delete(`/admin/faq/delete/${id}`);
      if (response.data.status === "success" || response.data.success) {
        setFaqs((prev) => prev.filter((faq) => faq._id !== id));
        toast.success("FAQ deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete FAQ:", error);
      toast.error("Failed to delete FAQ");
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">FAQs</h1>
          <p className="text-sm text-gray-500 mt-1">Manage frequently asked questions</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition"
        >
          <Plus size={20} />
          Add FAQ
        </button>
      </div>

      {/* FAQs Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">All FAQs</h3>
          <p className="mt-1 text-sm text-gray-500">Total FAQs: {faqs.length}</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <span className="ml-3 text-slate-500">Loading FAQs...</span>
          </div>
        ) : faqs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-500">No FAQs found</p>
            <button
              onClick={handleOpenModal}
              className="mt-4 text-indigo-600 hover:text-indigo-700"
            >
              Create your first FAQ
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Question
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Answer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {faqs.map((faq) => (
                  <tr key={faq._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {faq.order}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs">
                      {faq.question}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                      {faq.answer}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                          faq.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {faq.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(faq._id)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              disabled={saving}
            >
              <X size={20} />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Add New FAQ
            </h2>

            {/* Form */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Question *
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  disabled={saving}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-100"
                  placeholder="Enter question"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Answer *
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
                  disabled={saving}
                  rows={5}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-100"
                  placeholder="Enter answer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: Number(e.target.value) })
                    }
                    disabled={saving}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.value === "true" })
                    }
                    disabled={saving}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-100"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-8 space-x-3">
              <button
                onClick={handleCloseModal}
                disabled={saving}
                className="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 rounded-xl text-white bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600 hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? "Saving..." : "Create FAQ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFAQ;
