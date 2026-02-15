import { apiCall } from './apiConfig';

export const contactAPI = {
  // Simple contact form with 3 fields (name, email, message)
  submit: (data) => {
    return apiCall('/invoices/contact-us', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
