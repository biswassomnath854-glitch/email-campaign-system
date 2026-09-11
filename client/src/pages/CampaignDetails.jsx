import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import campaignApi from "../api/campaignApi";
import recipientApi from "../api/recipientApi";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import { PageLoading, Spinner } from "../components/Loading";

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [campaignRecipients, setCampaignRecipients] = useState([]);
  const [allRecipients, setAllRecipients] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Add Recipient Selection
  const [selectedRecipientId, setSelectedRecipientId] = useState("");

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: "", subject: "", content: "" });

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduledAtInput, setScheduledAtInput] = useState("");

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [removeRecipientCandidate, setRemoveRecipientCandidate] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [campaignRes, campRecipientsRes, allRecipientsRes] = await Promise.all([
        campaignApi.getCampaignById(id),
        campaignApi.getCampaignRecipients(id),
        recipientApi.getRecipients()
      ]);

      setCampaign(campaignRes?.data?.campaign || null);
      setCampaignRecipients(campRecipientsRes?.data?.campaignRecipients || []);
      setAllRecipients(allRecipientsRes?.data?.recipients || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load campaign details"
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback({ type: "", message: "" });
    }, 4500);
  };

  const handleOpenEdit = () => {
    if (!campaign) return;
    setEditFormData({
      name: campaign.name,
      subject: campaign.subject,
      content: campaign.content
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await campaignApi.updateCampaign(campaign.id, editFormData);
      setCampaign(res?.data?.campaign || { ...campaign, ...editFormData });
      setIsEditModalOpen(false);
      showFeedback("success", "Campaign updated successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to update campaign");
    } finally {
      setSubmitting(false);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduledAtInput) return;

    const scheduledDate = new Date(scheduledAtInput);
    if (scheduledDate <= new Date()) {
      setError("Scheduled time must be in the future.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await campaignApi.scheduleCampaign(campaign.id, scheduledDate.toISOString());
      setCampaign(res?.data?.campaign || { ...campaign, status: "scheduled", scheduledAt: scheduledDate.toISOString() });
      setIsScheduleModalOpen(false);
      setScheduledAtInput("");
      showFeedback("success", "Campaign scheduled successfully.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to schedule campaign. Ensure at least one recipient is added."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelSchedule = async () => {
    setSubmitting(true);
    try {
      const res = await campaignApi.cancelCampaign(campaign.id);
      setCampaign(res?.data?.campaign || { ...campaign, status: "draft", scheduledAt: null });
      setCancelConfirmOpen(false);
      showFeedback("success", "Scheduled broadcast cancelled. Status reverted to draft.");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to cancel schedule");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCampaign = async () => {
    setSubmitting(true);
    try {
      await campaignApi.deleteCampaign(campaign.id);
      navigate("/campaigns", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to delete campaign");
      setSubmitting(false);
    }
  };

  const handleAddRecipient = async (e) => {
    e.preventDefault();
    if (!selectedRecipientId) return;

    setSubmitting(true);
    setError("");

    try {
      await campaignApi.addRecipientToCampaign(campaign.id, Number(selectedRecipientId));
      setSelectedRecipientId("");
      showFeedback("success", "Recipient added to campaign.");
      // Reload campaign recipients
      const res = await campaignApi.getCampaignRecipients(campaign.id);
      setCampaignRecipients(res?.data?.campaignRecipients || []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to add recipient");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveRecipient = async () => {
    if (!removeRecipientCandidate) return;
    setSubmitting(true);

    try {
      await campaignApi.removeRecipientFromCampaign(campaign.id, removeRecipientCandidate.recipientId);
      showFeedback("success", "Recipient removed from campaign.");
      setRemoveRecipientCandidate(null);
      const res = await campaignApi.getCampaignRecipients(campaign.id);
      setCampaignRecipients(res?.data?.campaignRecipients || []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to remove recipient");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateRecipientStatus = async (recipientId, newStatus) => {
    try {
      await campaignApi.updateRecipientStatus(campaign.id, recipientId, newStatus);
      showFeedback("success", "Recipient status updated.");
      const res = await campaignApi.getCampaignRecipients(campaign.id);
      setCampaignRecipients(res?.data?.campaignRecipients || []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to update recipient status");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateString;
    }
  };

  // Find assigned recipient IDs to exclude from the dropdown
  const assignedRecipientIds = new Set(
    campaignRecipients.map((cr) => cr.recipientId)
  );

  // Filter available recipients: must be active, subscribed, and not already assigned
  const availableRecipients = allRecipients.filter(
    (r) => r.isActive && r.isSubscribed && !assignedRecipientIds.has(r.id)
  );

  if (loading) {
    return <PageLoading message="Loading campaign details..." />;
  }

  if (error && !campaign) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  if (!campaign) {
    return (
      <EmptyState
        title="Campaign not found"
        description="This campaign may have been deleted or does not exist."
        actionLabel="Back to Campaigns"
        onAction={() => navigate("/campaigns")}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button & Action Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link
              to="/campaigns"
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition flex items-center gap-1"
            >
              <span>&larr;</span> All Campaigns
            </Link>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {campaign.name}
            </h1>
            <StatusBadge status={campaign.status} />
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Created on {formatDate(campaign.createdAt)}
            {campaign.scheduledAt && ` • Scheduled for ${formatDate(campaign.scheduledAt)}`}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {campaign.status === "draft" && (
            <>
              <button
                type="button"
                onClick={handleOpenEdit}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition"
              >
                Edit Draft
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsScheduleModalOpen(true);
                  setScheduledAtInput("");
                }}
                disabled={campaignRecipients.length === 0}
                title={campaignRecipients.length === 0 ? "Add at least one recipient to schedule" : ""}
                className="rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Schedule Broadcast
              </button>

              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(true)}
                className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
              >
                Delete
              </button>
            </>
          )}

          {campaign.status === "scheduled" && (
            <button
              type="button"
              onClick={() => setCancelConfirmOpen(true)}
              className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition"
            >
              Cancel Schedule
            </button>
          )}
        </div>
      </div>

      {/* Alerts */}
      {feedback.message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {feedback.message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")} className="text-red-500 hover:text-red-700">
            &times;
          </button>
        </div>
      )}

      {/* Content Preview & Audience Split */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column: Email Content Preview (1 col) */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Email Specification
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-slate-700">Subject:</span>
                <p className="mt-1 rounded-lg bg-slate-50 p-2.5 font-medium text-slate-900 border border-slate-200">
                  {campaign.subject}
                </p>
              </div>

              <div>
                <span className="font-semibold text-slate-700">Body Content:</span>
                <div className="mt-1 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-slate-800 border border-slate-200 min-h-[160px] font-mono text-xs leading-relaxed">
                  {campaign.content}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between text-slate-500">
                <span>Audience Count:</span>
                <span className="font-bold text-slate-900">{campaignRecipients.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Recipient Management (2 cols) */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="border-b border-slate-100 p-5 sm:flex sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Campaign Audience</h3>
                <p className="text-xs text-slate-500">
                  Recipients designated to receive this broadcast.
                </p>
              </div>

              {/* Add Recipient Form (Only for draft campaigns) */}
              {campaign.status === "draft" && (
                <form onSubmit={handleAddRecipient} className="mt-4 sm:mt-0 flex items-center gap-2">
                  <select
                    value={selectedRecipientId}
                    onChange={(e) => setSelectedRecipientId(e.target.value)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 max-w-xs"
                  >
                    <option value="">Select a recipient to add...</option>
                    {availableRecipients.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.email})
                      </option>
                    ))}
                  </select>

                  <button
                    type="submit"
                    disabled={!selectedRecipientId || submitting}
                    className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-50 cursor-pointer"
                  >
                    Add
                  </button>
                </form>
              )}
            </div>

            {/* Campaign Recipients List */}
            {campaignRecipients.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-500">No recipients assigned to this campaign yet.</p>
                {campaign.status === "draft" && availableRecipients.length > 0 && (
                  <p className="mt-1 text-xs text-slate-400">
                    Use the dropdown above to assign subscribers.
                  </p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="px-5 py-3">Recipient</th>
                      <th className="px-5 py-3">Subscription</th>
                      <th className="px-5 py-3">Delivery Status</th>
                      <th className="px-5 py-3">Dispatched</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {campaignRecipients.map((item) => (
                      <tr key={item.id || item.recipientId} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3 font-medium text-slate-900">
                          <div>{item.recipient?.name || `Recipient #${item.recipientId}`}</div>
                          <div className="text-[11px] text-slate-500 font-normal">{item.recipient?.email}</div>
                        </td>

                        <td className="px-5 py-3">
                          <StatusBadge status={item.recipient?.isSubscribed ? "subscribed" : "unsubscribed"} size="sm" />
                        </td>

                        <td className="px-5 py-3">
                          <StatusBadge status={item.status} size="sm" />
                        </td>

                        <td className="px-5 py-3 text-slate-500">
                          {formatDate(item.sentAt)}
                        </td>

                        <td className="px-5 py-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            {/* Status Changer */}
                            <select
                              value={item.status}
                              onChange={(e) => handleUpdateRecipientStatus(item.recipientId, e.target.value)}
                              className="rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 outline-none"
                            >
                              <option value="pending">pending</option>
                              <option value="queued">queued</option>
                              <option value="sent">sent</option>
                              <option value="failed">failed</option>
                            </select>

                            {/* Remove button (only in draft) */}
                            {campaign.status === "draft" && (
                              <button
                                type="button"
                                onClick={() => setRemoveRecipientCandidate(item)}
                                className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                                title="Remove recipient"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Campaign"
        subtitle="Update name, subject line, or body content for this draft."
      >
        <form onSubmit={handleUpdateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Campaign Name
            </label>
            <input
              type="text"
              name="name"
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              required
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={editFormData.subject}
              onChange={(e) => setEditFormData({ ...editFormData, subject: e.target.value })}
              required
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Content
            </label>
            <textarea
              name="content"
              rows={6}
              value={editFormData.content}
              onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })}
              required
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 transition disabled:opacity-50"
            >
              {submitting && <Spinner size="sm" className="text-white" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Schedule Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Schedule Campaign"
        subtitle={`Select future date & time to dispatch "${campaign?.name}".`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleScheduleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Dispatch Date & Time
            </label>
            <input
              type="datetime-local"
              value={scheduledAtInput}
              onChange={(e) => setScheduledAtInput(e.target.value)}
              required
              min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsScheduleModalOpen(false)}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 transition disabled:opacity-50"
            >
              {submitting && <Spinner size="sm" className="text-white" />}
              <span>Schedule</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Campaign Confirm */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteCampaign}
        title="Delete Campaign"
        message={`Delete "${campaign.name}"? This action is permanent.`}
        confirmLabel="Delete"
        loading={submitting}
      />

      {/* Cancel Schedule Confirm */}
      <ConfirmDialog
        isOpen={cancelConfirmOpen}
        onClose={() => setCancelConfirmOpen(false)}
        onConfirm={handleCancelSchedule}
        title="Cancel Scheduled Broadcast"
        message="Cancel this scheduled campaign? It will return to draft status."
        confirmLabel="Cancel Schedule"
        confirmVariant="warning"
        loading={submitting}
      />

      {/* Remove Recipient Confirm */}
      <ConfirmDialog
        isOpen={Boolean(removeRecipientCandidate)}
        onClose={() => setRemoveRecipientCandidate(null)}
        onConfirm={handleRemoveRecipient}
        title="Remove Recipient"
        message={`Remove ${removeRecipientCandidate?.recipient?.name || "this recipient"} from the campaign?`}
        confirmLabel="Remove"
        loading={submitting}
      />
    </div>
  );
};

export default CampaignDetails;
