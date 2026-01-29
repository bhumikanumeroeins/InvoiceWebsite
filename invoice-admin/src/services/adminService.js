import API from './api';

// Get total invoice count with filters and pagination
export const getTotalInvoiceCount = async (params = {}) => {
  try {
    const response = await API.get('/admin/invoiceCount', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching invoice count:', error);
    throw error;
  }
};

// Get recent invoices
export const getRecentInvoices = async () => {
  try {
    const response = await API.get('/admin/recentInvoices');
    return response.data;
  } catch (error) {
    console.error('Error fetching recent invoices:', error);
    throw error;
  }
};

// Get customers from invoices
export const getCustomersFromInvoices = async (search = '') => {
  try {
    const response = await API.get('/admin/customers', {
      params: { search }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

// Get users list
export const getUsersList = async (params = {}) => {
  try {
    const response = await API.get('/admin/users-list', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching users list:', error);
    throw error;
  }
};
