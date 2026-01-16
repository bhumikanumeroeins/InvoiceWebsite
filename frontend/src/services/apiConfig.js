export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getUploadsUrl = () => {
  return import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
};

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (!(options.body instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({ message: 'Something went wrong' }));
  
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/signin')) {
        window.location.href = '/signin';
      }
      throw new Error('Session expired. Please sign in again.');
    }
    throw new Error(data.message || 'API Error');
  }
  
  return data;
};
