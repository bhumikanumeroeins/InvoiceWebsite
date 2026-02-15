import { useState, useEffect } from "react";
import { Loader2, Trash2, Eye, Mail, User, Calendar } from "lucide-react";
import API from "../services/api";
import { toast } from "react-toastify";

const AdminContactUs = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await API.get("/admin/faq/contact-us-messages");
      if (response.data.status === "success" || response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleViewMessage = async (id) => {
    try {
      const response = await API.get(`/admin/faq/contact-us-messages/${id}`);
      if (response.data.status === "success" || response.data.success) {
        setSelectedMessage(response.data.data);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch message details:", error);
      toast.error("Failed to load message details");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) {
      return;
    }

    try {
      const response = await API.delete(`/admin/faq/contact-us-messages/${id}`);
      if (response.data.status === "success" || response.data.success) {
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
        if (selectedMessage?._id === id) {
          setIsModalOpen(false);
          setSelectedMessage(null);
        }
        toast.success("Message deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
      toast.error("Failed to delete message");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto px-6 py-8 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Us Messages</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage user inquiries</p>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">All Messages</h3>
          <p className="mt-1 text-sm text-gray-500">Total messages: {messages.length}</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <span className="ml-3 text-slate-500">Loading messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Mail className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500">No messages found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {messages.map((message) => (
                  <tr key={message._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        {message.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-400" />
                        {message.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                      {message.message}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        {formatDate(message.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => handleViewMessage(message._id)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                      >
                        <Eye size={14} />
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(message._id)}
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

      {/* View Message Modal */}
      {isModalOpen && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedMessage(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Message Details
            </h2>

            {/* Message Content */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Name
                </label>
                <p className="text-gray-900 font-medium">{selectedMessage.name}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{selectedMessage.email}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Date
                </label>
                <p className="text-gray-900">{formatDate(selectedMessage.createdAt)}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Message
                </label>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-8 space-x-3">
              <button
                onClick={() => handleDelete(selectedMessage._id)}
                className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Message
              </button>

              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedMessage(null);
                }}
                className="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContactUs;
