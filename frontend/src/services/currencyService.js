import { apiCall } from './apiConfig';

export const currencyService = {
  // Get all active currencies for dropdown
  getAll: async () => {
    try {
      const response = await apiCall('/currencies', 'GET');
      return response;
    } catch (error) {
      console.error('Get currencies error:', error);
      throw error;
    }
  },

  // Get currency by code
  getByCode: async (code) => {
    try {
      const response = await apiCall(`/currencies/${code}`, 'GET');
      return response;
    } catch (error) {
      console.error('Get currency by code error:', error);
      throw error;
    }
  },

  // Get currency symbol (fallback to hardcoded if API fails)
  getSymbol: (code) => {
    const fallbackSymbols = {
      INR: '₹',
      USD: '$',
      EUR: '€',
      GBP: '£',
      AUD: 'A$',
      CAD: 'C$',
      SGD: 'S$',
      AED: 'د.إ',
      JPY: '¥',
      CNY: '¥',
    };
    return fallbackSymbols[code] || '₹';
  }
};