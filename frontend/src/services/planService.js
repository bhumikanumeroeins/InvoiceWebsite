import { apiCall } from './apiConfig';

export const planAPI = {
  getAll: () => {
    return apiCall('/invoices/plans', {
      method: 'GET',
    });
  },
  upgrade: (planId) => {
    return apiCall('/invoices/upgrade-subscription', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    });
  },
};
