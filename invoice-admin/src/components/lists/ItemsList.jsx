import React, { useState } from 'react';

const ItemsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const items = [
    {
      id: 1,
      name: 'Web Development Service',
      sku: 'WEB-001',
      price: 2500,
      tax: 18,
      stock: 'Unlimited',
      usedInInvoices: 12,
      category: 'Services',
      status: 'active',
      description: 'Full-stack web development including frontend and backend'
    },
    {
      id: 2,
      name: 'Mobile App Development',
      sku: 'MOB-002',
      price: 5000,
      tax: 18,
      stock: 'Unlimited',
      usedInInvoices: 8,
      category: 'Services',
      status: 'active',
      description: 'Native mobile app development for iOS and Android'
    },
    {
      id: 3,
      name: 'UI/UX Design Package',
      sku: 'DES-003',
      price: 1500,
      tax: 18,
      stock: 'Unlimited',
      usedInInvoices: 15,
      category: 'Services',
      status: 'active',
      description: 'Complete UI/UX design package with wireframes and prototypes'
    },
    {
      id: 4,
      name: 'SEO Optimization',
      sku: 'SEO-004',
      price: 800,
      tax: 18,
      stock: 'Unlimited',
      usedInInvoices: 6,
      category: 'Services',
      status: 'active',
      description: 'Search engine optimization and digital marketing services'
    },
    {
      id: 5,
      name: 'Hosting Package - Basic',
      sku: 'HST-005',
      price: 50,
      tax: 18,
      stock: 25,
      usedInInvoices: 20,
      category: 'Products',
      status: 'active',
      description: 'Basic web hosting package with 5GB storage'
    },
    {
      id: 6,
      name: 'Domain Registration',
      sku: 'DOM-006',
      price: 15,
      tax: 18,
      stock: 100,
      usedInInvoices: 35,
      category: 'Products',
      status: 'active',
      description: 'Domain name registration (.com, .net, .org)'
    },
    {
      id: 7,
      name: 'SSL Certificate',
      sku: 'SSL-007',
      price: 75,
      tax: 18,
      stock: 50,
      usedInInvoices: 18,
      category: 'Products',
      status: 'active',
      description: 'Standard SSL certificate for website security'
    },
    {
      id: 8,
      name: 'Consultation Service',
      sku: 'CON-008',
      price: 200,
      tax: 18,
      stock: 'Unlimited',
      usedInInvoices: 9,
      category: 'Services',
      status: 'archived',
      description: '1-hour technical consultation and advisory service'
    }
  ];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStockStatus = (stock) => {
    if (stock === 'Unlimited') return { text: 'Unlimited', color: 'text-green-600' };
    if (stock <= 5) return { text: stock, color: 'text-red-600' };
    if (stock <= 20) return { text: stock, color: 'text-yellow-600' };
    return { text: stock, color: 'text-green-600' };
  };

  const handleEdit = (item) => {
    // Placeholder for edit functionality
    alert(`Edit item: ${item.name}`);
  };

  const handleArchive = (item) => {
    // Placeholder for archive functionality
    alert(`Archive item: ${item.name}`);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Items / Products</h1>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
          Add New Item
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or SKU..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="sm:w-48">
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Items</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Inventory ({filteredItems.length} items)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tax
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Used In Invoices
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => {
                const stockStatus = getStockStatus(item.stock);
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                        <div className="text-xs text-gray-400 mt-1">{item.category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {item.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ${item.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.tax}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${stockStatus.color}`}>
                        {stockStatus.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <span className="font-medium">{item.usedInInvoices}</span>
                        <span className="text-gray-500 ml-1">invoices</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Edit Item"
                        >
                          ✏
                        </button>
                        <button
                          onClick={() => handleArchive(item)}
                          className={`p-1 ${
                            item.status === 'archived'
                              ? 'text-green-600 hover:text-green-900'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                          title={item.status === 'archived' ? 'Unarchive Item' : 'Archive Item'}
                        >
                          📦
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No items found matching your search criteria.
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">📦</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Items
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {items.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">✅</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Items
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {items.filter(item => item.status === 'active').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">⚠</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Low Stock
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {items.filter(item => typeof item.stock === 'number' && item.stock <= 20).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">📊</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Usage
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {items.reduce((sum, item) => sum + item.usedInInvoices, 0)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemsList;