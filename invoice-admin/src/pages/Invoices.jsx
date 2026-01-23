import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import InvoicesList from '../components/lists/InvoicesList';

const Invoices = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <InvoicesList />
        </main>
      </div>
    </div>
  );
};

export default Invoices;