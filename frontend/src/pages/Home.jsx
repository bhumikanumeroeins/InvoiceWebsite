import { useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/home/Sidebar";
import MainWorkspace from "../components/home/MainWorkspace";

const Home = () => {
  const { sessionId } = useParams(); // present on /chat/:sessionId, undefined on /
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        activeSessionId={sessionId}
      />
      <MainWorkspace urlSessionId={sessionId} />
    </div>
  );
};

export default Home;
