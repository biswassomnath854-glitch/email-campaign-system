import apiClient from "./client";

export const recipientApi = {
  getRecipients: async () => {
    const response = await apiClient.get("/recipients");
    return response.data;
  },

  getRecipientById: async (recipientId) => {
    const response = await apiClient.get(`/recipients/${recipientId}`);
    return response.data;
  },

  createRecipient: async (recipientData) => {
    const response = await apiClient.post("/recipients", recipientData);
    return response.data;
  },

  updateRecipient: async (recipientId, recipientData) => {
    const response = await apiClient.put(`/recipients/${recipientId}`, recipientData);
    return response.data;
  },

  deleteRecipient: async (recipientId) => {
    const response = await apiClient.delete(`/recipients/${recipientId}`);
    return response.data;
  }
};

export default recipientApi;
