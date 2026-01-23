import { apiCall } from './apiConfig';

export const paymentAPI = {
  // Update payment status for an invoice
  updatePaymentStatus: async (invoiceId, paymentData) => {
    try {
      return await apiCall(`/payments/${invoiceId}`, {
        method: 'PUT',
        body: JSON.stringify(paymentData)
      });
    } catch (error) {
      throw error;
    }
  },

  // Get payment details for an invoice
  getPaymentDetails: async (invoiceId) => {
    try {
      return await apiCall(`/payments/${invoiceId}`, {
        method: 'GET'
      });
    } catch (error) {
      throw error;
    }
  },

  // Legacy method for backward compatibility (if needed)
  recordPayment: async (invoiceId, paymentData) => {
    return await paymentAPI.updatePaymentStatus(invoiceId, paymentData);
  }
};