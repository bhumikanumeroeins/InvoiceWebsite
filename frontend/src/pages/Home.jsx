import { useState, useRef } from "react";
import Sidebar from "../components/home/Sidebar";
import MainWorkspace from "../components/home/MainWorkspace";

const Home = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [loadSessionId, setLoadSessionId] = useState(undefined);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        onLoadSession={setLoadSessionId}
      />
      <MainWorkspace loadSessionId={loadSessionId} />
    </div>
  );
};

export default Home;
