import { apiCall } from './apiConfig';

export const reminderAPI = {
  // Get reminders for an invoice
  getByInvoiceId: async (invoiceId) => {
    try {
      const response = await apiCall(`/reminders/invoice/${invoiceId}`);
      return response;
    } catch (error) {
      console.error('Get reminders error:', error);
      throw error;
    }
  },

  // Create reminders for an invoice
  create: async (invoiceId) => {
    try {
      const response = await apiCall(`/reminders/create/${invoiceId}`, {
        method: 'POST',
      });
      return response;
    } catch (error) {
      console.error('Create reminders error:', error);
      throw error;
    }
  },

  // Delete a reminder
  delete: async (reminderId) => {
    try {
      const response = await apiCall(`/reminders/${reminderId}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      console.error('Delete reminder error:', error);
      throw error;
    }
  },

  // Update reminder status
  updateStatus: async (reminderId, status) => {
    try {
      const response = await apiCall(`/reminders/${reminderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      return response;
    } catch (error) {
      console.error('Update reminder status error:', error);
      throw error;
    }
  },
};
