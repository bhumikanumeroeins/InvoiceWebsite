import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../services/authService';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
