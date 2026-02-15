import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import API from "../services/api";
import { toast } from "react-toastify";

const AdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await API.get("/admin/get-plans");
      if (response.data.success) {
        setPlans(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch plans:", error);
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (planId) => {
    try {
      const response = await API.patch(`/admin/toggle-plan/${planId}`);
      if (response.data.success) {
        setPlans((prev) =>
          prev.map((plan) =>
            plan._id === planId
              ? { ...plan, isActive: !plan.isActive }
              : plan
          )
        );
        toast.success(response.data.message || "Plan status updated successfully");
      }
    } catch (error) {
      console.error("Failed to toggle plan:", error);
      toast.error("Failed to toggle plan status");
    }
  };

  const handleEdit = (plan) => {
    setSelectedPlan({
      _id: plan._id,
      planName: plan.planName,
      price: plan.price.replace('$', ''),
      invoiceLimit: plan.invoiceLimit,
      durationMonths: plan.durationMonths,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await API.put(`/admin/update-plan/${selectedPlan._id}`, {
        price: `$${selectedPlan.price}`, 
        invoiceLimit: selectedPlan.invoiceLimit,
      });

      if (response.data.success) {
        setPlans((prev) =>
          prev.map((plan) =>
            plan._id === selectedPlan._id ? response.data.data : plan
          )
        );
        setIsModalOpen(false);
        setSelectedPlan(null);
        toast.success("Plan updated successfully");
      }
    } catch (error) {
      console.error("Failed to update plan:", error);
      toast.error("Failed to update plan");
    } finally {
      setSaving(false);
    }
  };

  const getBillingCycle = (months) => {
    if (months === 0) return "Lifetime";
    if (months === 1) return "1 Month";
    if (months === 6) return "6 Months";
    if (months === 12) return "12 Months";
    return `${months} Months`;
  };

  return (
    <div className="container mx-auto px-6 py-8 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Plans</h1>
      </div>

      {/* Plans Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Subscription Plans
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Total plans: {plans.length}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <span className="ml-3 text-slate-500">Loading plans...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Billing Cycle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Invoice Limit
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
                {plans.map((plan) => (
                  <tr key={plan._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {plan.planName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {plan.price}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {getBillingCycle(plan.durationMonths)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {plan.invoiceLimit === -1
                        ? "Unlimited"
                        : plan.invoiceLimit}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                          plan.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {plan.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => handleEdit(plan)}
                        className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggle(plan._id)}
                        className="px-3 py-1 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700"
                      >
                        Toggle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Floating Modal (Clean UI – No Overlay) */}
      {isModalOpen && selectedPlan && (
        <div className="absolute inset-0 flex justify-center items-start pt-24 z-50 pointer-events-none">
          
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 relative pointer-events-auto animate-fadeIn">

            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              disabled={saving}
            >
              <X size={20} />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Edit {selectedPlan.planName}
            </h2>

            {/* Form Fields */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={selectedPlan.price}
                  onChange={(e) =>
                    setSelectedPlan({
                      ...selectedPlan,
                      price: e.target.value,
                    })
                  }
                  disabled={saving}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Invoice Limit
                </label>
                <input
                  type="number"
                  value={
                    selectedPlan.invoiceLimit === -1
                      ? ""
                      : selectedPlan.invoiceLimit
                  }
                  placeholder="Leave empty for Unlimited"
                  onChange={(e) =>
                    setSelectedPlan({
                      ...selectedPlan,
                      invoiceLimit:
                        e.target.value === ""
                          ? -1
                          : Number(e.target.value),
                    })
                  }
                  disabled={saving}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-100"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Leave empty to allow unlimited invoices
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-8 space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
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
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPlans;
