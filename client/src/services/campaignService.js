import campaignApi from "../api/campaignApi";

const getCampaigns = async () => campaignApi.getCampaigns();
const getCampaign = async (campaignId) => campaignApi.getCampaignById(campaignId);
const createCampaign = async (campaignData) => campaignApi.createCampaign(campaignData);
const updateCampaign = async (campaignId, campaignData) => campaignApi.updateCampaign(campaignId, campaignData);
const deleteCampaign = async (campaignId) => campaignApi.deleteCampaign(campaignId);
const scheduleCampaign = async (campaignId, scheduledAt) => campaignApi.scheduleCampaign(campaignId, scheduledAt);
const cancelCampaign = async (campaignId) => campaignApi.cancelCampaign(campaignId);
const getCampaignRecipients = async (campaignId) => campaignApi.getCampaignRecipients(campaignId);
const addRecipientToCampaign = async (campaignId, recipientId) => campaignApi.addRecipientToCampaign(campaignId, recipientId);
const removeRecipientFromCampaign = async (campaignId, recipientId) => campaignApi.removeRecipientFromCampaign(campaignId, recipientId);
const updateCampaignRecipientStatus = async (campaignId, recipientId, status) => campaignApi.updateRecipientStatus(campaignId, recipientId, status);

const campaignService = {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  scheduleCampaign,
  cancelCampaign,
  getCampaignRecipients,
  addRecipientToCampaign,
  removeRecipientFromCampaign,
  updateCampaignRecipientStatus
};

export default campaignService;