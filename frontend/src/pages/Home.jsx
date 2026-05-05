import { useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/home/Sidebar";
import MainWorkspace from "../components/home/MainWorkspace";
import { isAuthenticated } from "../services/authService";

const Home = () => {
  const { sessionId } = useParams();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        activeSessionId={sessionId}
        loggedIn={loggedIn}
      />
      <MainWorkspace
        urlSessionId={sessionId}
        loggedIn={loggedIn}
        onAuthSuccess={() => setLoggedIn(true)}
      />
    </div>
  );
};

export default Home;
