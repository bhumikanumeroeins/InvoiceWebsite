import { apiCall } from './apiConfig';

export const buildInvoiceAPI = {
  // Get all custom invoices for logged-in user
  getAll: async () => {
    try {
      const response = await apiCall('/build-invoice/customize-invoice', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error('Get all custom invoices error:', error);
      throw error;
    }
  },

  // Get custom invoice by ID
  getById: async (id) => {
    try {
      const response = await apiCall(`/build-invoice/customize-invoice/${id}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error('Get custom invoice by ID error:', error);
      throw error;
    }
  },

  // Create or update custom invoice
  save: async (formData) => {
    try {
      const response = await apiCall('/build-invoice/customize-invoice', {
        method: 'POST',
        body: formData,
      });
      return response;
    } catch (error) {
      console.error('Save custom invoice error:', error);
      throw error;
    }
  },
};
