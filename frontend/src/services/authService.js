import { apiCall } from './apiConfig';

export const authAPI = {
  login: (data) => apiCall('/invoices/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  register: (data) => apiCall('/invoices/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  getProfile: () => apiCall('/invoices/profile'),
  
  updateProfile: (data) => apiCall('/invoices/updateProfile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  changePassword: (data) => apiCall('/invoices/changePassword', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  getEmailReportFrequency: () => apiCall('/invoices/email-report-frequency'),
  
  updateEmailReportFrequency: (data) => apiCall('/invoices/email-report-frequency', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const setAuthData = (token, user = null) => {
  localStorage.setItem('token', token);
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getToken = () => {
  return localStorage.getItem('token');
};
