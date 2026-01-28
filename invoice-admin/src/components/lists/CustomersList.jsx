import React, { useState } from 'react';

const CustomersList = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const customers = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 123-4567',
      totalInvoices: 12,
      outstanding: 2500,
      lastActivity: '2026-01-20',
      address: '123 Main St, New York, NY 10001',
      company: 'Smith Enterprises',
      notes: 'Regular customer, pays on time. Prefers email communication.',
      invoices: [
        { id: 'INV-001', amount: 500, status: 'Paid', date: '2026-01-15' },
        { id: 'INV-002', amount: 750, status: 'Paid', date: '2026-01-18' },
        { id: 'INV-003', amount: 1250, status: 'Pending', date: '2026-01-20' }
      ]
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '+1 (555) 987-6543',
      totalInvoices: 8,
      outstanding: 1800,
      lastActivity: '2026-01-19',
      address: '456 Oak Ave, Los Angeles, CA 90210',
      company: 'Johnson Consulting',
      notes: 'New customer, first invoice sent last month.',
      invoices: [
        { id: 'INV-004', amount: 800, status: 'Paid', date: '2026-01-10' },
        { id: 'INV-005', amount: 1000, status: 'Pending', date: '2026-01-19' }
      ]
    },
    {
      id: 3,
      name: 'Mike Davis',
      email: 'mike.davis@techcorp.com',
      phone: '+1 (555) 456-7890',
      totalInvoices: 15,
      outstanding: 3200,
      lastActivity: '2026-01-22',
      address: '789 Tech Blvd, San Francisco, CA 94105',
      company: 'TechCorp Solutions',
      notes: 'Enterprise client. Requires detailed invoices with project breakdowns.',
      invoices: [
        { id: 'INV-006', amount: 2200, status: 'Paid', date: '2026-01-12' },
        { id: 'INV-007', amount: 1000, status: 'Overdue', date: '2026-01-08' }
      ]
    },
    {
      id: 4,
      name: 'Emily Chen',
      email: 'emily.chen@startup.io',
      phone: '+1 (555) 321-0987',
      totalInvoices: 5,
      outstanding: 950,
      lastActivity: '2026-01-18',
      address: '321 Innovation Dr, Austin, TX 78701',
      company: 'Startup.io',
      notes: 'Startup client. Flexible payment terms discussed.',
      invoices: [
        { id: 'INV-008', amount: 950, status: 'Pending', date: '2026-01-18' }
      ]
    }
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const CustomerProfile = ({ customer, onClose }) => {
    const totalPaid = customer.invoices
      .filter(inv => inv.status === 'Paid')
      .reduce((sum, inv) => sum + inv.amount, 0);

    const totalPending = customer.invoices
      .filter(inv => inv.status === 'Pending')
      .reduce((sum, inv) => sum + inv.amount, 0);

    const totalOverdue = customer.invoices
      .filter(inv => inv.status === 'Overdue')
      .reduce((sum, inv) => sum + inv.amount, 0);

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Customer Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">{customer.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{customer.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-gray-900">{customer.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <p className="text-gray-900">{customer.company}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <p className="text-gray-900">{customer.address}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">${totalPaid.toLocaleString()}</div>
                  <div className="text-sm text-green-800">Total Paid</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">${totalPending.toLocaleString()}</div>
                  <div className="text-sm text-yellow-800">Pending</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">${totalOverdue.toLocaleString()}</div>
                  <div className="text-sm text-red-800">Overdue</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">${customer.outstanding.toLocaleString()}</div>
                  <div className="text-sm text-blue-800">Outstanding</div>
                </div>
              </div>
            </div>
          </div>

          {/* Invoices History */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice History</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customer.invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                        {invoice.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${invoice.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{customer.notes}</p>
            </div>
          </div>

          {/* Attachments */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">📄</span>
                  <span className="text-sm text-gray-900">Contract_Signed.pdf</span>
                </div>
                <button className="text-indigo-600 hover:text-indigo-900 text-sm">Download</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">📄</span>
                  <span className="text-sm text-gray-900">Company_Profile.pdf</span>
                </div>
                <button className="text-indigo-600 hover:text-indigo-900 text-sm">Download</button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md">
              Edit Customer
            </button>
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">
              Create Invoice
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="max-w-md">
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Customer List ({filteredCustomers.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Invoices
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Outstanding
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.company}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {customer.totalInvoices}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    ${customer.outstanding.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-indigo-600 hover:text-indigo-900"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCustomer(customer);
                      }}
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCustomers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No customers found matching your search.
          </div>
        )}
      </div>

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <CustomerProfile
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
};

export default CustomersList;