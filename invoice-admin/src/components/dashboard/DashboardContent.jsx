import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getRecentInvoices } from '../../services/adminService';

const DashboardContent = () => {
  const [stats, setStats] = useState(null);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const res = await getRecentInvoices();

        if (res.success) {
          setStats(res.stats);
          setRecentInvoices(res.data);
        }

      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);


  return (
  <div className="container mx-auto px-6 py-8">

    {/* Header */}
    <div className="mb-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">
        Dashboard
      </h1>
      <p className="text-gray-500 mt-1 text-sm">
        Overview of your system performance
      </p>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">

      {/* Card */}
      {[
        {
          title: "Total Invoices",
          value: stats?.totalInvoicesCount,
          color: "from-emerald-500 to-green-600",
        },
        {
          title: "Total Customers",
          value: stats?.totalClientsCount,
          color: "from-blue-500 to-blue-700",
        },
        {
          title: "Revenue This Month",
          value: `₹${stats?.thisMonthRevenue || 0}`,
          color: "from-purple-500 to-purple-700",
        },
        {
          title: "Outstanding Amount",
          value: `₹${stats?.outstandingAmount || 0}`,
          color: "from-orange-400 to-orange-600",
        },
        {
          title: "Paid %",
          value: `${stats?.paidPercentage || 0}%`,
          color: "from-teal-400 to-teal-600",
        },
        {
          title: "Overdue",
          value: stats?.overdueInvoicesCount,
          color: "from-red-400 to-red-600",
        },
      ].map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
        >
          <div className="p-5">
            <div
              className={`w-10 h-10 rounded-lg bg-gradient-to-r ${card.color} flex items-center justify-center mb-4`}
            >
              <span className="text-white font-bold text-sm">
                {card.title.charAt(0)}
              </span>
            </div>

            <p className="text-sm text-gray-500">{card.title}</p>
            <p className="text-xl font-semibold text-gray-900 mt-1">
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>

    {/* Recent Invoices */}
    <div className="mt-10">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 flex justify-between items-center border-b border-gray-100">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Invoices
            </h3>
            <p className="text-sm text-gray-500">
              Latest invoice activities
            </p>
          </div>

          <Link
            to="/invoices"
            className="bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            View All
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Invoice #</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : (
                recentInvoices.map((invoice) => (
                  <tr
                    key={invoice._id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-blue-600">
                      {invoice.invoiceMeta.invoiceNo}
                    </td>

                    <td className="px-6 py-4 text-gray-800">
                      {invoice.client.name}
                    </td>

                    <td className="px-6 py-4 font-semibold text-gray-900">
                      ₹{invoice.totals.grandTotal}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium
                        ${
                          invoice.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : invoice.paymentStatus === "unpaid"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {invoice.paymentStatus}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-500">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>
);

};

export default DashboardContent;
