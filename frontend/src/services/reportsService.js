import { apiCall } from './apiConfig';

// Helper function to build query string
const buildQueryString = (params) => {
  const filteredParams = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined && value !== '')
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  
  return new URLSearchParams(filteredParams).toString();
};

export const reportsAPI = {
  // Get reports with filters and pagination
  getReports: async (filters = {}) => {
    try {
      const {
        dateFrom,
        dateTo,
        status = 'all',
        documentType = 'all',
        page = 1,
        limit = 50,
        sortBy = 'date',
        sortOrder = 'desc'
      } = filters;

      const queryParams = buildQueryString({
        dateFrom,
        dateTo,
        status,
        documentType,
        page,
        limit,
        sortBy,
        sortOrder
      });

      return await apiCall(`/reports?${queryParams}`);
    } catch (error) {
      console.error('Get reports error:', error);
      throw error;
    }
  },

  // Get reports summary/statistics
  getSummary: async (period = 'all') => {
    try {
      return await apiCall(`/reports/summary?period=${period}`);
    } catch (error) {
      console.error('Get reports summary error:', error);
      throw error;
    }
  },

  // Export reports data
  exportReports: async (filters = {}, format = 'csv') => {
    try {
      const {
        dateFrom,
        dateTo,
        status = 'all',
        documentType = 'all'
      } = filters;

      const queryParams = buildQueryString({
        dateFrom,
        dateTo,
        status,
        documentType,
        format
      });

      return await apiCall(`/reports/export?${queryParams}`);
    } catch (error) {
      console.error('Export reports error:', error);
      throw error;
    }
  },

  // Helper function to convert data to CSV format
  convertToCSV: (data) => {
    if (!data || data.length === 0) return '';

    const headers = [
      'Customer Name',
      'Customer Address', 
      'Document Type',
      'Number',
      'Date',
      'Due Date',
      'Subtotal',
      'Tax',
      'Paid Amount',
      'Total',
      'Payment Status'
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        `"${row.customerName || ''}"`,
        `"${row.customerAddress || ''}"`,
        `"${row.documentType || ''}"`,
        `"${row.number || ''}"`,
        `"${row.date ? new Date(row.date).toLocaleDateString() : ''}"`,
        `"${row.dueDate ? new Date(row.dueDate).toLocaleDateString() : ''}"`,
        row.subtotal || 0,
        row.tax || 0,
        row.paidAmount || 0,
        row.total || 0,
        `"${row.paymentStatus || ''}"`
      ].join(','))
    ].join('\n');

    return csvContent;
  },

  // Helper function to download CSV file
  downloadCSV: (csvContent, filename = 'reports.csv') => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },

  // Helper function to get predefined date ranges
  getDateRanges: () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return {
      today: {
        from: today.toISOString().split('T')[0],
        to: today.toISOString().split('T')[0]
      },
      thisWeek: {
        from: new Date(now.setDate(now.getDate() - now.getDay())).toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0]
      },
      thisMonth: {
        from: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0]
      },
      lastMonth: {
        from: new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0],
        to: new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0]
      },
      thisQuarter: {
        from: new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1).toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0]
      },
      lastQuarter: {
        from: new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 - 3, 1).toISOString().split('T')[0],
        to: new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 0).toISOString().split('T')[0]
      },
      thisYear: {
        from: new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0]
      }
    };
  }
};