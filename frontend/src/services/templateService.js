import { apiCall } from "./apiConfig";

export const templateAPI = {
  getByName: (name) => {
    const templateNumber = name.replace('Template', '');
    const endpoint = templateNumber === '1' 
      ? `/invoice-template/${name}` 
      : `/invoice-template${templateNumber}/${name}`;
    
    return apiCall(endpoint, {
      method: "GET",
    });
  },
};
