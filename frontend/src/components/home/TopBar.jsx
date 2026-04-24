import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { authAPI, getCurrentUser } from '../../services/authService';

const TopBar = ({ loggedIn, onSignIn }) => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    authAPI.logout();
    window.location.reload();
  };

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-gray-200 bg-white flex-shrink-0">
      <div /> {/* spacer */}
      <div className="flex items-center gap-2">
        {loggedIn ? (
          <>
            <span className="text-sm text-gray-500 hidden sm:block">{user?.email}</span>
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onSignIn}
              className="px-4 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={onSignIn}
              className="px-4 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default TopBar;
