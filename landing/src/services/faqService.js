import { apiCall } from './apiConfig';

export const faqAPI = {
  getAll: () => apiCall('/user/faq/all', { method: 'GET' }),
};
