import api from "./api";

const getRecipients = async () => {
  const response = await api.get(
    "/recipients"
  );

  return response.data;
};

const getRecipient = async (recipientId) => {
  const response = await api.get(
    `/recipients/${recipientId}`
  );

  return response.data;
};

const createRecipient = async (recipientData) => {
  const response = await api.post(
    "/recipients",
    recipientData
  );

  return response.data;
};

const updateRecipient = async (
  recipientId,
  recipientData
) => {
  const response = await api.put(
    `/recipients/${recipientId}`,
    recipientData
  );

  return response.data;
};

const deleteRecipient = async (recipientId) => {
  const response = await api.delete(
    `/recipients/${recipientId}`
  );

  return response.data;
};

const recipientService = {
  getRecipients,
  getRecipient,
  createRecipient,
  updateRecipient,
  deleteRecipient
};

export default recipientService;