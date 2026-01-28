import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const invoice = {
    id,
    number: "INV-001",
    status: "Paid",
    customer: {
      name: "Customer A",
      email: "customer@example.com",
      phone: "+91 98765 43210",
      address: "Indore, India",
    },
    issueDate: "2026-01-15",
    dueDate: "2026-01-30",
    items: [
      { name: "Website Design", qty: 1, price: 300 },
      { name: "Hosting (1 year)", qty: 1, price: 200 },
    ],
    subtotal: 500,
    tax: 0,
    total: 500,
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-amber-100 text-amber-700";
      case "Overdue":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="px-6 py-8 bg-[#f2f2f2] min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to invoices
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            Invoice {invoice.number}
          </h1>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50">
            Send
          </button>

          <button className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50">
            Download
          </button>

          <button className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-[#00bc7c] to-indigo-600">
            Edit
          </button>
        </div>
      </div>

      {/* TOP GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* CUSTOMER */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            Customer
          </h3>
          <p className="font-medium">{invoice.customer.name}</p>
          <p className="text-sm text-gray-500">
            {invoice.customer.email}
          </p>
          <p className="text-sm text-gray-500">
            {invoice.customer.phone}
          </p>
          <p className="text-sm text-gray-500">
            {invoice.customer.address}
          </p>
        </div>

        {/* DATES */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            Invoice Dates
          </h3>

          <div className="space-y-2 text-sm">
            <p>
              <span className="text-gray-500">Issue:</span>{" "}
              {new Date(invoice.issueDate).toLocaleDateString()}
            </p>

            <p>
              <span className="text-gray-500">Due:</span>{" "}
              {new Date(invoice.dueDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* STATUS */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            Status
          </h3>

          <span
            className={`inline-flex px-4 py-1.5 rounded-full text-sm font-semibold ${getStatusStyle(
              invoice.status
            )}`}
          >
            {invoice.status}
          </span>

          <p className="text-sm text-gray-500 mt-3">
            Last updated: Jan 21, 2026
          </p>
        </div>
      </div>

      {/* LINE ITEMS */}
      <div className="bg-white rounded-xl shadow overflow-hidden mb-6">
        <div className="px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-900">
            Line Items
          </h3>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Item", "Qty", "Price", "Total"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y">
            {invoice.items.map((item, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4">{item.qty}</td>
                <td className="px-6 py-4">${item.price}</td>
                <td className="px-6 py-4 font-medium">
                  ${item.qty * item.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TOTALS */}
      <div className="bg-white rounded-xl shadow p-6 max-w-md ml-auto">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span>${invoice.subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Tax</span>
            <span>${invoice.tax}</span>
          </div>

          <div className="flex justify-between text-lg font-semibold border-t pt-3">
            <span>Total</span>
            <span>${invoice.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
