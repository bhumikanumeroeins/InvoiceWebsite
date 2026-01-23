import { API_BASE_URL } from './apiConfig.js';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create or update recurring invoice schedule
export const createRecurringInvoice = async (invoiceId, recurringData) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/recurring/${invoiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(recurringData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create recurring invoice');
    }

    return data;
  } catch (error) {
    console.error('Create recurring invoice error:', error);
    throw error;
  }
};

// Get recurring invoice schedule for a specific invoice
export const getRecurringInvoice = async (invoiceId) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/recurring/invoice/${invoiceId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get recurring invoice');
    }

    return data;
  } catch (error) {
    console.error('Get recurring invoice error:', error);
    throw error;
  }
};

// Get all recurring invoices for the user
export const getAllRecurringInvoices = async (status = 'active') => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/recurring?status=${status}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get recurring invoices');
    }

    return data;
  } catch (error) {
    console.error('Get all recurring invoices error:', error);
    throw error;
  }
};

// Update recurring invoice schedule
export const updateRecurringInvoice = async (recurringId, updateData) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/recurring/${recurringId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update recurring invoice');
    }

    return data;
  } catch (error) {
    console.error('Update recurring invoice error:', error);
    throw error;
  }
};

// Delete/deactivate recurring invoice schedule
export const deleteRecurringInvoice = async (recurringId) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/recurring/${recurringId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete recurring invoice');
    }

    return data;
  } catch (error) {
    console.error('Delete recurring invoice error:', error);
    throw error;
  }
};

export default {
  createRecurringInvoice,
  getRecurringInvoice,
  getAllRecurringInvoices,
  updateRecurringInvoice,
  deleteRecurringInvoice
};