import { apiCall } from './apiConfig';

export const customerAPI = {
  getAll: () => apiCall('/customers/list'),
  getInvoices: (name) => apiCall(`/customers/invoices/${encodeURIComponent(name)}`),
};

export const taxAPI = {
  getAll: () => apiCall('/tax/list'),
  create: (data) => apiCall('/tax/create', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  delete: (taxId) => apiCall(`/tax/delete/${taxId}`, {
    method: 'DELETE',
  }),
};

export const itemAPI = {
  getAll: () => apiCall('/item/list'),
  create: (data) => apiCall('/item/create', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  delete: (itemId) => apiCall(`/item/delete/${itemId}`, {
    method: 'DELETE',
  }),
};

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

  copy: (id) => apiCall(`/invoiceForms/copy/${id}`, {
    method: 'POST',
  }),

  sendEmail: (invoiceId, emailData) => apiCall(`/invoiceForms/send-email/${invoiceId}`, {
    method: 'POST',
    body: JSON.stringify(emailData),
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
