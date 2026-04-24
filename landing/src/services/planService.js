import { apiCall } from './apiConfig';

export const planAPI = {
  getAll: () => apiCall('/invoices/plans', { method: 'GET' }),
};
