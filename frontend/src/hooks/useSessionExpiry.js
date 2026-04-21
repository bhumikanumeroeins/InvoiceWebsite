import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { getToken, authAPI } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

const useSessionExpiry = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkExpiry = () => {
      const token = getToken();
      if (!token) return;

      const payload = parseJwt(token);
      if (!payload?.exp) return;

      const expiresAt = payload.exp * 1000;
      const now = Date.now();
      const msUntilExpiry = expiresAt - now;

      if (msUntilExpiry <= 0) {
        authAPI.logout();
        navigate('/signin');
        return;
      }

      // Warn 5 minutes before expiry
      if (msUntilExpiry < 5 * 60 * 1000) {
        toast.warning('Your session expires soon. Please save your work and sign in again.', {
          toastId: 'session-expiry',
          autoClose: false,
        });
      }
    };

    checkExpiry();
    const interval = setInterval(checkExpiry, 60 * 1000); // check every minute
    return () => clearInterval(interval);
  }, [navigate]);
};

export default useSessionExpiry;
