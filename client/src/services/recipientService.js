import recipientApi from "../api/recipientApi";

const getRecipients = async () => recipientApi.getRecipients();
const getRecipient = async (recipientId) => recipientApi.getRecipientById(recipientId);
const createRecipient = async (recipientData) => recipientApi.createRecipient(recipientData);
const updateRecipient = async (recipientId, recipientData) => recipientApi.updateRecipient(recipientId, recipientData);
const deleteRecipient = async (recipientId) => recipientApi.deleteRecipient(recipientId);

const recipientService = {
  getRecipients,
  getRecipient,
  createRecipient,
  updateRecipient,
  deleteRecipient
};

export default recipientService;