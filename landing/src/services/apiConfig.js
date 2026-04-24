export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiCall = async (endpoint, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({ message: 'Something went wrong' }));

  if (!response.ok) {
    throw new Error(data.message || 'API Error');
  }

  return data;
};
