import apiClient from "./client";

export const adminApi = {
  checkAdminAccess: async () => {
    const response = await apiClient.get("/test/admin-only");
    return response.data;
  },

  getHealth: async () => {
    const response = await apiClient.get("/health");
    return response.data;
  },

  checkProtected: async () => {
    const response = await apiClient.get("/test/protected");
    return response.data;
  }
};

export default adminApi;
