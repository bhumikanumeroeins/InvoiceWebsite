import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import DashboardContent from '../components/dashboard/DashboardContent';

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <DashboardContent />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;