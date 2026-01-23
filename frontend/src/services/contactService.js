import { apiCall } from './apiConfig';

export const contactAPI = {
  // Submit contact form
  submitContact: async (contactData) => {
    try {
      return await apiCall('/contact', {
        method: 'POST',
        body: JSON.stringify(contactData)
      });
    } catch (error) {
      console.error('Submit contact error:', error);
      throw error;
    }
  },

  // Get all contacts (admin only)
  getContacts: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.status) queryParams.append('status', params.status);
      if (params.priority) queryParams.append('priority', params.priority);

      const url = `/contact${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      return await apiCall(url, {
        method: 'GET'
      });
    } catch (error) {
      console.error('Get contacts error:', error);
      throw error;
    }
  },

  // Get contact by ID (admin only)
  getContactById: async (contactId) => {
    try {
      return await apiCall(`/contact/${contactId}`, {
        method: 'GET'
      });
    } catch (error) {
      console.error('Get contact by ID error:', error);
      throw error;
    }
  },

  // Update contact status (admin only)
  updateContactStatus: async (contactId, updateData) => {
    try {
      return await apiCall(`/contact/${contactId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
    } catch (error) {
      console.error('Update contact status error:', error);
      throw error;
    }
  }
};