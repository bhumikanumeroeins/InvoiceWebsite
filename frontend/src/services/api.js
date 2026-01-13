// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  // Don't set Content-Type for FormData (browser will set it with boundary)
  if (!(options.body instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({ message: 'Something went wrong' }));
  
  if (!response.ok) {
    throw new Error(data.message || 'API Error');
  }
  
  return data;
};

// Auth APIs
export const authAPI = {
  login: (data) => apiCall('/invoices/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  register: (data) => apiCall('/invoices/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Invoice Form APIs - /api/invoiceForms
export const invoiceAPI = {
  // Create invoice with file uploads (logo, signature, qrCode)
  create: (formData) => apiCall('/invoiceForms/create', {
    method: 'POST',
    body: formData, // FormData object
  }),
  
  // Get all invoices
  getAll: () => apiCall('/invoiceForms/list'),
  
  // Get single invoice by ID
  getById: (id) => apiCall(`/invoiceForms/list/${id}`),
  
  // Update invoice
  update: (id, data) => apiCall(`/invoiceForms/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Delete invoice
  delete: (id) => apiCall(`/invoiceForms/${id}`, {
    method: 'DELETE',
  }),
};

// Store token and user after login
export const setAuthData = (token, user = null) => {
  localStorage.setItem('token', token);
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Check if user is logged in
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Get token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Get uploads base URL for images
export const getUploadsUrl = () => {
  return import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
};

export default apiCall;
