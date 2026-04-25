import { apiCall, API_BASE_URL } from "./apiConfig";

export const aiService = {
  // Authenticated refine
  refine: async (currentContent, instruction) => {
    return apiCall("/ai/refine", {
      method: "POST",
      body: JSON.stringify({ currentContent, instruction }),
    });
  },

  // Public chat — no auth required, but sends token if available for unlimited usage
  chat: async ({ sessionId, message }) => {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify({ sessionId, message }),
    });
    const data = await res
      .json()
      .catch(() => ({ message: "Something went wrong" }));
    if (!res.ok && res.status !== 429)
      throw new Error(data.message || "API Error");
    return data;
  },

  // User chat sessions (authenticated)
  listSessions: () => apiCall("/ai/sessions"),
  getSession: (sessionId) => apiCall(`/ai/sessions/${sessionId}`),
  deleteSession: (sessionId) =>
    apiCall(`/ai/sessions/${sessionId}`, { method: "DELETE" }),
  syncGuestSession: (payload) =>
    apiCall("/ai/sessions/sync", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
