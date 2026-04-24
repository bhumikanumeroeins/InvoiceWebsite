import { useState } from 'react';
import Sidebar from '../components/home/Sidebar';
import MainWorkspace from '../components/home/MainWorkspace';

const Home = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar expanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} />
      <MainWorkspace />
    </div>
  );
};

export default Home;
