import { apiCall } from './apiConfig';

export const contactAPI = {
  submit: (data) =>
    apiCall('/invoices/contact-us', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
