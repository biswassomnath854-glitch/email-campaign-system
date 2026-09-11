import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import campaignApi from "../api/campaignApi";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import { Spinner, Skeleton } from "../components/Loading";

const emptyForm = {
  name: "",
  subject: "",
  content: ""
};

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Create / Edit Modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  // Schedule Modal state
  const [scheduleModalCampaign, setScheduleModalCampaign] = useState(null);
  const [scheduledAtInput, setScheduledAtInput] = useState("");

  // Confirmation dialogs state
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [cancelCandidate, setCancelCandidate] = useState(null);

  const loadCampaigns = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await campaignApi.getCampaigns();
      setCampaigns(response?.data?.campaigns || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to retrieve campaigns"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback({ type: "", message: "" });
    }, 4500);
  };

  const handleOpenCreateModal = () => {
    setEditingCampaign(null);
    setFormData(emptyForm);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name || "",
      subject: campaign.subject || "",
      content: campaign.content || ""
    });
    setIsFormModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (editingCampaign) {
        await campaignApi.updateCampaign(editingCampaign.id, formData);
        showFeedback("success", "Campaign updated successfully.");
      } else {
        await campaignApi.createCampaign(formData);
        showFeedback("success", "Campaign created successfully.");
      }

      setIsFormModalOpen(false);
      setFormData(emptyForm);
      setEditingCampaign(null);
      await loadCampaigns();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save campaign"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCampaign = async () => {
    if (!deleteCandidate) return;
    setSubmitting(true);

    try {
      await campaignApi.deleteCampaign(deleteCandidate.id);
      showFeedback("success", `Campaign "${deleteCandidate.name}" deleted.`);
      setDeleteCandidate(null);
      await loadCampaigns();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete campaign"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduleModalCampaign || !scheduledAtInput) return;

    const scheduledDate = new Date(scheduledAtInput);
    if (scheduledDate <= new Date()) {
      setError("Scheduled time must be in the future.");
      return;
    }

    setSubmitting(true);
    try {
      await campaignApi.scheduleCampaign(
        scheduleModalCampaign.id,
        scheduledDate.toISOString()
      );
      showFeedback("success", `Campaign "${scheduleModalCampaign.name}" scheduled.`);
      setScheduleModalCampaign(null);
      setScheduledAtInput("");
      await loadCampaigns();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to schedule campaign. Ensure at least one recipient is assigned."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelScheduled = async () => {
    if (!cancelCandidate) return;
    setSubmitting(true);

    try {
      await campaignApi.cancelCampaign(cancelCandidate.id);
      showFeedback("success", `Schedule cancelled for "${cancelCandidate.name}". Status reverted to draft.`);
      setCancelCandidate(null);
      await loadCampaigns();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to cancel scheduled campaign"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.subject?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || campaign.status?.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

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

  return (
    <div className="space-y-6">
      {/* Page Title & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Campaigns</h1>
          <p className="mt-1 text-sm text-slate-500">
            Create, design, assign audiences, and schedule targeted email dispatches.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 transition active:scale-98 cursor-pointer"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Create Campaign</span>
        </button>
      </div>

      {/* Alert Feedbacks */}
      {feedback.message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span>{feedback.message}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError("")}
            className="text-red-500 hover:text-red-700"
          >
            &times;
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {["all", "draft", "scheduled", "completed", "cancelled"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition cursor-pointer ${
                statusFilter === status
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns Table / Cards */}
      {loading ? (
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <EmptyState
          title={searchQuery || statusFilter !== "all" ? "No matching campaigns" : "No campaigns yet"}
          description={
            searchQuery || statusFilter !== "all"
              ? "Try adjusting your search terms or filter selection."
              : "Launch your first email campaign by crafting a draft today."
          }
          actionLabel={searchQuery || statusFilter !== "all" ? null : "Create First Campaign"}
          onAction={handleOpenCreateModal}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3.5">Campaign Name</th>
                  <th className="px-6 py-3.5">Subject</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Created</th>
                  <th className="px-6 py-3.5">Scheduled For</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredCampaigns.map((campaign) => (
                  <tr
                    key={campaign.id}
                    className="hover:bg-slate-50/60 transition"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      <Link
                        to={`/campaigns/${campaign.id}`}
                        className="hover:text-indigo-600 transition flex items-center gap-1.5"
                      >
                        <span>{campaign.name}</span>
                        <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </Link>
                    </td>

                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                      {campaign.subject}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={campaign.status} size="sm" />
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(campaign.createdAt)}
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {campaign.scheduledAt ? formatDate(campaign.scheduledAt) : "—"}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <Link
                          to={`/campaigns/${campaign.id}`}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                        >
                          Details
                        </Link>

                        {campaign.status === "draft" && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(campaign)}
                              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setScheduleModalCampaign(campaign);
                                setScheduledAtInput("");
                              }}
                              className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 transition"
                            >
                              Schedule
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteCandidate(campaign)}
                              className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100 transition"
                            >
                              Delete
                            </button>
                          </>
                        )}

                        {campaign.status === "scheduled" && (
                          <button
                            type="button"
                            onClick={() => setCancelCandidate(campaign)}
                            className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100 transition"
                          >
                            Cancel Schedule
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Campaign Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingCampaign ? "Edit Campaign" : "Create New Campaign"}
        subtitle={
          editingCampaign
            ? "Update campaign details. Only draft campaigns can be updated."
            : "Fill in the campaign name, subject line, and email body."
        }
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Campaign Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              required
              placeholder="e.g. March Product Newsletter"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleFormChange}
              required
              placeholder="e.g. Exciting updates to your workspace"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Body Content
            </label>
            <textarea
              name="content"
              rows={5}
              value={formData.content}
              onChange={handleFormChange}
              required
              placeholder="Write your email announcement or broadcast content..."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
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
              <span>{editingCampaign ? "Update Campaign" : "Save Campaign"}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Schedule Modal */}
      <Modal
        isOpen={Boolean(scheduleModalCampaign)}
        onClose={() => setScheduleModalCampaign(null)}
        title="Schedule Campaign"
        subtitle={`Select a future timestamp to dispatch "${scheduleModalCampaign?.name}". Note: The campaign must have at least one recipient assigned.`}
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
            <p className="mt-1.5 text-[11px] text-slate-500">
              The backend cron scheduler checks pending jobs every minute and queues recipients automatically.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setScheduleModalCampaign(null)}
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
              <span>Schedule Now</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleDeleteCampaign}
        title="Delete Campaign"
        message={`Are you sure you want to delete "${deleteCandidate?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Campaign"
        loading={submitting}
      />

      {/* Cancel Schedule Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(cancelCandidate)}
        onClose={() => setCancelCandidate(null)}
        onConfirm={handleCancelScheduled}
        title="Cancel Scheduled Broadcast"
        message={`Cancel scheduled dispatch for "${cancelCandidate?.name}"? The campaign will return to draft status.`}
        confirmLabel="Cancel Schedule"
        confirmVariant="warning"
        loading={submitting}
      />
    </div>
  );
};

export default Campaigns;