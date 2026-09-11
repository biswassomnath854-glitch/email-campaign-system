import apiClient from "./client";

export const campaignApi = {
  getCampaigns: async () => {
    const response = await apiClient.get("/campaigns");
    return response.data;
  },

  getCampaignById: async (campaignId) => {
    const response = await apiClient.get(`/campaigns/${campaignId}`);
    return response.data;
  },

  createCampaign: async (campaignData) => {
    const response = await apiClient.post("/campaigns", campaignData);
    return response.data;
  },

  updateCampaign: async (campaignId, campaignData) => {
    const response = await apiClient.put(`/campaigns/${campaignId}`, campaignData);
    return response.data;
  },

  deleteCampaign: async (campaignId) => {
    const response = await apiClient.delete(`/campaigns/${campaignId}`);
    return response.data;
  },

  scheduleCampaign: async (campaignId, scheduledAt) => {
    const response = await apiClient.patch(`/campaigns/${campaignId}/schedule`, {
      scheduledAt
    });
    return response.data;
  },

  cancelCampaign: async (campaignId) => {
    const response = await apiClient.patch(`/campaigns/${campaignId}/cancel`);
    return response.data;
  },

  getCampaignRecipients: async (campaignId) => {
    const response = await apiClient.get(`/campaigns/${campaignId}/recipients`);
    return response.data;
  },

  addRecipientToCampaign: async (campaignId, recipientId) => {
    const response = await apiClient.post(`/campaigns/${campaignId}/recipients`, {
      recipientId
    });
    return response.data;
  },

  removeRecipientFromCampaign: async (campaignId, recipientId) => {
    const response = await apiClient.delete(
      `/campaigns/${campaignId}/recipients/${recipientId}`
    );
    return response.data;
  },

  updateRecipientStatus: async (campaignId, recipientId, status) => {
    const response = await apiClient.patch(
      `/campaigns/${campaignId}/recipients/${recipientId}/status`,
      { status }
    );
    return response.data;
  }
};

export default campaignApi;
