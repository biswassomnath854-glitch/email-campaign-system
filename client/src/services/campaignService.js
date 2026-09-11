import api from "./api";

const getCampaigns = async () => {
  const response = await api.get(
    "/campaigns"
  );

  return response.data;
};

const getCampaign = async (campaignId) => {
  const response = await api.get(
    `/campaigns/${campaignId}`
  );

  return response.data;
};

const createCampaign = async (campaignData) => {
  const response = await api.post(
    "/campaigns",
    campaignData
  );

  return response.data;
};

const updateCampaign = async (
  campaignId,
  campaignData
) => {
  const response = await api.put(
    `/campaigns/${campaignId}`,
    campaignData
  );

  return response.data;
};

const deleteCampaign = async (campaignId) => {
  const response = await api.delete(
    `/campaigns/${campaignId}`
  );

  return response.data;
};

const scheduleCampaign = async (
  campaignId,
  scheduledAt
) => {
  const response = await api.patch(
    `/campaigns/${campaignId}/schedule`,
    {
      scheduledAt
    }
  );

  return response.data;
};

const cancelCampaign = async (campaignId) => {
  const response = await api.patch(
    `/campaigns/${campaignId}/cancel`
  );

  return response.data;
};

const campaignService = {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  scheduleCampaign,
  cancelCampaign
};

export default campaignService;