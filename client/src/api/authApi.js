import apiClient from "./client";

export const authApi = {
  login: async (credentials) => {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  },

  refresh: async (refreshToken) => {
    const response = await apiClient.post("/auth/refresh", { refreshToken });
    return response.data;
  },

  logout: async (refreshToken) => {
    const response = await apiClient.post("/auth/logout", { refreshToken });
    return response.data;
  }
};

export default authApi;
