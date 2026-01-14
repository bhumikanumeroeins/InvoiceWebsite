import { apiCall } from './apiConfig';

export const invoiceAPI = {
  create: (formData) => apiCall('/invoiceForms/create', {
    method: 'POST',
    body: formData, 
  }),
  
  getAll: () => apiCall('/invoiceForms/list'),
  
  getById: (id) => apiCall(`/invoiceForms/list/${id}`),
  
  update: (invoiceId, formData) => apiCall(`/invoiceForms/update/${invoiceId}`, {
    method: 'PUT',
    body: formData, 
  }),
  
  delete: (id) => apiCall(`/invoiceForms/delete/${id}`, {
    method: 'DELETE',
  }),

  updatePaymentStatus: (invoiceId, paymentStatus) => apiCall(`/invoiceForms/invoices/${invoiceId}/payment-status`, {
    method: 'PATCH',
    body: JSON.stringify({ paymentStatus }),
  }),

  // Trash operations
  getTrash: () => apiCall('/invoiceForms/trash'),
  
  restore: (id) => apiCall(`/invoiceForms/restore/${id}`, {
    method: 'PATCH',
  }),
  
  permanentDelete: (id) => apiCall(`/invoiceForms/permanent/${id}`, {
    method: 'DELETE',
  }),
};
