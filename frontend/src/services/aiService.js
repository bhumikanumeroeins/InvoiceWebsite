import { apiCall, API_BASE_URL } from './apiConfig';

export const aiService = {
  // Authenticated generate
  generate: async (prompt) => {
    return apiCall('/ai/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  },

  // Authenticated refine
  refine: async (currentContent, instruction) => {
    return apiCall('/ai/refine', {
      method: 'POST',
      body: JSON.stringify({ currentContent, instruction }),
    });
  },

  // Public chat — no auth required, rate limited
  chat: async (messages) => {
    const res = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    const data = await res.json().catch(() => ({ message: 'Something went wrong' }));
    if (!res.ok && res.status !== 429) throw new Error(data.message || 'API Error');
    return data;
  },
};
