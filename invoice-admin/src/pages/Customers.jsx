import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import CustomersList from '../components/lists/CustomersList';

const Customers = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <CustomersList />
        </main>
      </div>
    </div>
  );
};

export default Customers;