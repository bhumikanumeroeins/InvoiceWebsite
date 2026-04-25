import { apiCall } from "./apiConfig";

export const buildInvoiceAPI = {
  getAll: async () => {
    return apiCall("/build-invoice/customize-invoice", { method: "GET" });
  },

  getById: async (id) => {
    return apiCall(`/build-invoice/customize-invoice/${id}`, { method: "GET" });
  },

  save: async (formData) => {
    return apiCall("/build-invoice/customize-invoice", {
      method: "POST",
      body: formData,
    });
  },

  delete: async (id) => {
    return apiCall(`/build-invoice/customize-invoice/${id}`, {
      method: "DELETE",
    });
  },

  restore: async (id) => {
    return apiCall(`/build-invoice/customize-invoice/${id}/restore`, {
      method: "PATCH",
    });
  },

  permanentDelete: async (id) => {
    return apiCall(`/build-invoice/customize-invoice/${id}/permanent`, {
      method: "DELETE",
    });
  },

  getTrash: async () => {
    return apiCall("/build-invoice/customize-invoice/trash", { method: "GET" });
  },
};
