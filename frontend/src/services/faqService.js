import { apiCall } from './apiConfig';

export const faqAPI = {
  getAll: () => {
    return apiCall('/user/faq/all', {
      method: 'GET',
    });
  },
};
