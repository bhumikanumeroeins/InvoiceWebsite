import { apiCall } from './apiConfig';

export const aiService = {
  generate: async (prompt) => {
    return apiCall('/ai/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  },

  refine: async (currentContent, instruction) => {
    return apiCall('/ai/refine', {
      method: 'POST',
      body: JSON.stringify({ currentContent, instruction }),
    });
  },
};
