import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import ItemsList from '../components/lists/ItemsList';

const Items = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <ItemsList />
        </main>
      </div>
    </div>
  );
};

export default Items;