import { apiCall } from './apiConfig';

export const contactAPI = {
  submitSimple: (data) => {
    return apiCall('/users/contact-us', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  submitFull: (data) => {
    return apiCall('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
