import { apiCall } from "./apiConfig";

export const templateAPI = {
  getByName: (name) =>
    apiCall(`/invoice-template/${name}`, {
      method: "GET",
    }),
};
