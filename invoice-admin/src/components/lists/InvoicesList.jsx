import React, { useState } from 'react';
import { Link } from "react-router-dom";

const InvoicesList = () => {
  const [filters, setFilters] = useState({
    search: '',
    customer: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
    template: ''
  });

  const invoices = [
    {
      id: 1,
      number: 'INV-001',
      customer: 'Customer A',
      issueDate: '2026-01-15',
      dueDate: '2026-01-30',
      amount: 500,
      status: 'Paid',
      template: 'Template 1'
    },
    {
      id: 2,
      number: 'INV-002',
      customer: 'Customer B',
      issueDate: '2026-01-18',
      dueDate: '2026-02-02',
      amount: 750,
      status: 'Pending',
      template: 'Template 2'
    },
    {
      id: 3,
      number: 'INV-003',
      customer: 'Customer C',
      issueDate: '2026-01-10',
      dueDate: '2026-01-25',
      amount: 300,
      status: 'Overdue',
      template: 'Template 1'
    },
    {
      id: 4,
      number: 'INV-004',
      customer: 'Customer D',
      issueDate: '2026-01-20',
      dueDate: '2026-02-05',
      amount: 1200,
      status: 'Paid',
      template: 'Template 3'
    },
    {
      id: 5,
      number: 'INV-005',
      customer: 'Customer A',
      issueDate: '2026-01-22',
      dueDate: '2026-02-07',
      amount: 950,
      status: 'Pending',
      template: 'Template 2'
    }
  ];

  const customers = ['Customer A', 'Customer B', 'Customer C', 'Customer D'];
  const statuses = ['Paid', 'Pending', 'Overdue'];
  const templates = ['Template 1', 'Template 2', 'Template 3'];

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-gradient-to-r from-green-400 to-green-600 text-white';
      case 'Pending':
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
      case 'Overdue':
        return 'bg-gradient-to-r from-red-400 to-red-600 text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = filters.search === '' || invoice.number.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCustomer = filters.customer === '' || invoice.customer === filters.customer;
    const matchesStatus = filters.status === '' || invoice.status === filters.status;
    const matchesAmount = (filters.amountMin === '' || invoice.amount >= parseFloat(filters.amountMin)) &&
                         (filters.amountMax === '' || invoice.amount <= parseFloat(filters.amountMax));

    return matchesSearch && matchesCustomer && matchesStatus && matchesAmount;
  });

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
      </div>

      {/* Filters Row */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🔍</span>
          Filters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Search by Invoice Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Number
            </label>
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          {/* Customer Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filters.customer}
              onChange={(e) => handleFilterChange('customer', e.target.value)}
            >
              <option value="">All Customers</option>
              {customers.map(customer => (
                <option key={customer} value={customer}>{customer}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date From
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            />
          </div>

          {/* Amount Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount Min
            </label>
            <input
              type="number"
              placeholder="Min amount"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filters.amountMin}
              onChange={(e) => handleFilterChange('amountMin', e.target.value)}
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={() => setFilters({
              search: '',
              customer: '',
              status: '',
              dateFrom: '',
              dateTo: '',
              amountMin: '',
              amountMax: '',
              template: ''
            })}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Invoice List ({filteredInvoices.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                    {invoice.number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    ${invoice.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-3">
                      <Link
                        to={`/invoices/${invoice.id}`}
                        className="text-indigo-600 hover:text-indigo-800 transition"
                      >
                        View
                      </Link>


                      <button className="text-emerald-600 hover:text-emerald-800 transition">
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredInvoices.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No invoices found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicesList;