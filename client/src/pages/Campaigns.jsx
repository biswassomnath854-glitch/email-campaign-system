import { useEffect, useState } from "react";
import campaignService from "../services/campaignService";
import recipientService from "../services/recipientService";

const emptyCampaign = {
  name: "",
  subject: "",
  content: ""
};

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [campaignRecipients, setCampaignRecipients] =
    useState([]);

  const [campaignForm, setCampaignForm] =
    useState(emptyCampaign);

  const [editingCampaignId, setEditingCampaignId] =
    useState(null);

  const [selectedCampaignId, setSelectedCampaignId] =
    useState(null);

  const [recipientToAdd, setRecipientToAdd] =
    useState("");

  const [scheduleCampaignId, setScheduleCampaignId] =
    useState(null);

  const [scheduledAt, setScheduledAt] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [recipientLoading, setRecipientLoading] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadCampaigns();
    loadRecipients();
  }, []);

  const loadCampaigns = async () => {
    try {
      const response =
        await campaignService.getCampaigns();

      setCampaigns(
        response?.data?.campaigns || []
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to load campaigns"
      );
    }
  };

  const loadRecipients = async () => {
    try {
      const response =
        await recipientService.getRecipients();

      setRecipients(
        response?.data?.recipients || []
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to load recipients"
      );
    }
  };

  const loadCampaignRecipients = async (
    campaignId
  ) => {
    setRecipientLoading(true);
    setError("");

    try {
      const response =
        await recipientService.getCampaignRecipients(
          campaignId
        );

      setCampaignRecipients(
        response?.data?.campaignRecipients || []
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to load campaign recipients"
      );
    } finally {
      setRecipientLoading(false);
    }
  };

  const handleCampaignChange = (event) => {
    const { name, value } = event.target;

    setCampaignForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleCreateCampaign = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await campaignService.createCampaign(
        campaignForm
      );

      setMessage(
        "Campaign created successfully"
      );

      setCampaignForm(emptyCampaign);

      await loadCampaigns();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to create campaign"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (campaign) => {
    setEditingCampaignId(campaign.id);

    setCampaignForm({
      name: campaign.name || "",
      subject: campaign.subject || "",
      content: campaign.content || ""
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleUpdateCampaign = async (event) => {
    event.preventDefault();

    if (!editingCampaignId) {
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await campaignService.updateCampaign(
        editingCampaignId,
        campaignForm
      );

      setMessage(
        "Campaign updated successfully"
      );

      setEditingCampaignId(null);
      setCampaignForm(emptyCampaign);

      await loadCampaigns();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to update campaign"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (campaignId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this campaign?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    try {
      await campaignService.deleteCampaign(
        campaignId
      );

      setMessage(
        "Campaign deleted successfully"
      );

      if (selectedCampaignId === campaignId) {
        setSelectedCampaignId(null);
        setCampaignRecipients([]);
      }

      if (scheduleCampaignId === campaignId) {
        setScheduleCampaignId(null);
        setScheduledAt("");
      }

      await loadCampaigns();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to delete campaign"
      );
    }
  };

  const openRecipientManager = async (
    campaignId
  ) => {
    setSelectedCampaignId(campaignId);
    setRecipientToAdd("");
    setMessage("");
    setError("");

    await loadCampaignRecipients(campaignId);
  };

  const closeRecipientManager = () => {
    setSelectedCampaignId(null);
    setRecipientToAdd("");
    setCampaignRecipients([]);
  };

  const handleAddRecipient = async () => {
    if (!selectedCampaignId) {
      return;
    }

    if (!recipientToAdd) {
      setError("Please select a recipient");
      return;
    }

    setRecipientLoading(true);
    setMessage("");
    setError("");

    try {
      await recipientService.addRecipientToCampaign(
        selectedCampaignId,
        Number(recipientToAdd)
      );

      setMessage(
        "Recipient added to campaign successfully"
      );

      setRecipientToAdd("");

      await loadCampaignRecipients(
        selectedCampaignId
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to add recipient"
      );
    } finally {
      setRecipientLoading(false);
    }
  };

  const handleRemoveRecipient = async (
    recipientId
  ) => {
    if (!selectedCampaignId) {
      return;
    }

    const confirmed = window.confirm(
      "Remove this recipient from the campaign?"
    );

    if (!confirmed) {
      return;
    }

    setRecipientLoading(true);
    setMessage("");
    setError("");

    try {
      await recipientService.removeRecipientFromCampaign(
        selectedCampaignId,
        recipientId
      );

      setMessage(
        "Recipient removed from campaign successfully"
      );

      await loadCampaignRecipients(
        selectedCampaignId
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to remove recipient"
      );
    } finally {
      setRecipientLoading(false);
    }
  };

  const openSchedule = async (campaignId) => {
    setScheduleCampaignId(campaignId);
    setScheduledAt("");
    setMessage("");
    setError("");

    setSelectedCampaignId(null);
    setCampaignRecipients([]);
  };

  const closeSchedule = () => {
    setScheduleCampaignId(null);
    setScheduledAt("");
  };

  const handleSchedule = async () => {
    if (!scheduleCampaignId) {
      return;
    }

    if (!scheduledAt) {
      setError(
        "Please select a future date and time"
      );
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const isoDate =
        new Date(scheduledAt).toISOString();

      await campaignService.scheduleCampaign(
        scheduleCampaignId,
        isoDate
      );

      setMessage(
        "Campaign scheduled successfully"
      );

      closeSchedule();

      await loadCampaigns();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to schedule campaign"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelCampaign = async (
    campaignId
  ) => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await campaignService.cancelCampaign(
        campaignId
      );

      setMessage(
        "Campaign cancelled successfully"
      );

      await loadCampaigns();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to cancel campaign"
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedCampaign = campaigns.find(
    (campaign) =>
      campaign.id === selectedCampaignId
  );

  const scheduleTargetCampaign =
    campaigns.find(
      (campaign) =>
        campaign.id === scheduleCampaignId
    );

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Campaigns
          </h1>

          <p className="mt-1 text-slate-500">
            Create, manage, schedule and send email
            campaigns.
          </p>
        </div>

        {message && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {/* CREATE / EDIT CAMPAIGN */}

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            {editingCampaignId
              ? "Edit Campaign"
              : "Create Campaign"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Campaigns start as drafts.
          </p>

          <form
            onSubmit={
              editingCampaignId
                ? handleUpdateCampaign
                : handleCreateCampaign
            }
            className="mt-6 space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Campaign Name
              </label>

              <input
                type="text"
                name="name"
                value={campaignForm.name}
                onChange={handleCampaignChange}
                placeholder="September Newsletter"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email Subject
              </label>

              <input
                type="text"
                name="subject"
                value={campaignForm.subject}
                onChange={handleCampaignChange}
                placeholder="Welcome to our newsletter"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email Content
              </label>

              <textarea
                name="content"
                value={campaignForm.content}
                onChange={handleCampaignChange}
                placeholder="Write your email content..."
                required
                rows={7}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : editingCampaignId
                    ? "Update Campaign"
                    : "Create Campaign"}
              </button>

              {editingCampaignId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCampaignId(null);
                    setCampaignForm(emptyCampaign);
                  }}
                  className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        {/* RECIPIENT MANAGER */}

        {selectedCampaign && (
          <section className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Manage Campaign Recipients
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  {selectedCampaign.name}
                </p>

                <p className="text-sm text-slate-500">
                  Campaign ID:{" "}
                  {selectedCampaign.id}
                </p>
              </div>

              <button
                type="button"
                onClick={closeRecipientManager}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
              >
                Close
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <select
                value={recipientToAdd}
                onChange={(event) =>
                  setRecipientToAdd(
                    event.target.value
                  )
                }
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none"
              >
                <option value="">
                  Select a recipient
                </option>

                {recipients
                  .filter((recipient) => {
                    return !campaignRecipients.some(
                      (item) =>
                        item.recipientId ===
                        recipient.id
                    );
                  })
                  .map((recipient) => (
                    <option
                      key={recipient.id}
                      value={recipient.id}
                    >
                      {recipient.name} —{" "}
                      {recipient.email}
                    </option>
                  ))}
              </select>

              <button
                type="button"
                onClick={handleAddRecipient}
                disabled={recipientLoading}
                className="rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white disabled:opacity-50"
              >
                Add Recipient
              </button>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-slate-900">
                Current Recipients
              </h3>

              {recipientLoading ? (
                <p className="mt-3 text-sm text-slate-500">
                  Loading recipients...
                </p>
              ) : campaignRecipients.length ===
                0 ? (
                <div className="mt-3 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500">
                  No recipients added to this
                  campaign.
                </div>
              ) : (
                <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white">
                  {campaignRecipients.map(
                    (item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between border-b border-slate-200 p-4 last:border-b-0"
                      >
                        <div>
                          <p className="font-medium text-slate-900">
                            {item.recipient?.name ||
                              `Recipient #${item.recipientId}`}
                          </p>

                          <p className="text-sm text-slate-500">
                            {item.recipient?.email ||
                              "Email unavailable"}
                          </p>

                          <p className="mt-1 text-xs uppercase text-slate-400">
                            Status: {item.status}
                          </p>
                        </div>

                        {item.status !==
                          "sent" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveRecipient(
                                item.recipientId
                              )
                            }
                            className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* SCHEDULE */}

        {scheduleTargetCampaign && (
          <section className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Schedule Campaign
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                {scheduleTargetCampaign.name}
              </p>

              <p className="text-sm text-slate-500">
                Campaign ID:{" "}
                {scheduleTargetCampaign.id}
              </p>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Scheduled Date & Time
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(event) =>
                    setScheduledAt(
                      event.target.value
                    )
                  }
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none"
                />

                <button
                  type="button"
                  onClick={handleSchedule}
                  disabled={loading}
                  className="rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white disabled:opacity-50"
                >
                  {loading
                    ? "Scheduling..."
                    : "Schedule"}
                </button>

                <button
                  type="button"
                  onClick={closeSchedule}
                  className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700"
                >
                  Close
                </button>
              </div>
            </div>
          </section>
        )}

        {/* CAMPAIGN LIST */}

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Campaign List
            </h2>
          </div>

          {campaigns.length === 0 ? (
            <div className="p-6 text-slate-500">
              No campaigns found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Name
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Subject
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Scheduled
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {campaigns.map((campaign) => (
                    <tr
                      key={campaign.id}
                      className="border-t border-slate-200"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {campaign.name}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {campaign.subject}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
                          {campaign.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {campaign.scheduledAt
                          ? new Date(
                              campaign.scheduledAt
                            ).toLocaleString()
                          : "—"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {campaign.status ===
                            "draft" && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  handleEdit(
                                    campaign
                                  )
                                }
                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  openRecipientManager(
                                    campaign.id
                                  )
                                }
                                className="rounded-lg border border-blue-300 px-3 py-2 text-sm font-medium text-blue-600"
                              >
                                Recipients
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  openSchedule(
                                    campaign.id
                                  )
                                }
                                className="rounded-lg border border-blue-300 px-3 py-2 text-sm font-medium text-blue-600"
                              >
                                Schedule
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    campaign.id
                                  )
                                }
                                className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600"
                              >
                                Delete
                              </button>
                            </>
                          )}

                          {campaign.status ===
                            "scheduled" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleCancelCampaign(
                                  campaign.id
                                )
                              }
                              className="rounded-lg border border-orange-300 px-3 py-2 text-sm font-medium text-orange-600"
                            >
                              Cancel
                            </button>
                          )}

                          {campaign.status ===
                            "processing" && (
                            <span className="rounded-lg bg-yellow-50 px-3 py-2 text-sm font-medium text-yellow-700">
                              Processing
                            </span>
                          )}

                          {campaign.status ===
                            "completed" && (
                            <span className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
                              Completed
                            </span>
                          )}

                          {campaign.status ===
                            "failed" && (
                            <span className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                              Failed
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default Campaigns;