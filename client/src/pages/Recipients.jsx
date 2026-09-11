import { useEffect, useState } from "react";
import recipientApi from "../api/recipientApi";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import { Spinner, Skeleton } from "../components/Loading";

const emptyForm = {
  name: "",
  email: ""
};

const Recipients = () => {
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Search and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubscription, setFilterSubscription] = useState("all");

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [editSubscription, setEditSubscription] = useState(true);

  // Soft delete confirmation state
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  const loadRecipients = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await recipientApi.getRecipients();
      setRecipients(res?.data?.recipients || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load recipients list"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipients();
  }, []);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback({ type: "", message: "" });
    }, 4500);
  };

  const handleOpenAddModal = () => {
    setEditingRecipient(null);
    setFormData(emptyForm);
    setEditSubscription(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (recipient) => {
    setEditingRecipient(recipient);
    setFormData({
      name: recipient.name || "",
      email: recipient.email || ""
    });
    setEditSubscription(Boolean(recipient.isSubscribed));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (editingRecipient) {
        await recipientApi.updateRecipient(editingRecipient.id, {
          name: formData.name.trim(),
          email: formData.email.trim(),
          isSubscribed: editSubscription
        });
        showFeedback("success", `Recipient "${formData.name}" updated successfully.`);
      } else {
        await recipientApi.createRecipient({
          name: formData.name.trim(),
          email: formData.email.trim()
        });
        showFeedback("success", `Recipient "${formData.name}" added successfully.`);
      }

      setIsModalOpen(false);
      setFormData(emptyForm);
      setEditingRecipient(null);
      await loadRecipients();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save recipient"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    setSubmitting(true);

    try {
      await recipientApi.deleteRecipient(deleteCandidate.id);
      showFeedback("success", `Recipient "${deleteCandidate.name}" removed.`);
      setDeleteCandidate(null);
      await loadRecipients();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to remove recipient"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRecipients = recipients.filter((r) => {
    const matchesSearch =
      r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSub =
      filterSubscription === "all" ||
      (filterSubscription === "subscribed" && r.isSubscribed) ||
      (filterSubscription === "unsubscribed" && !r.isSubscribed);

    return matchesSearch && matchesSub;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Recipients</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your audience directory, contact details, and newsletter subscriptions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 transition active:scale-98 cursor-pointer"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Add Recipient</span>
        </button>
      </div>

      {/* Alerts */}
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
          <span>{error}</span>
          <button type="button" onClick={() => setError("")} className="text-red-500 hover:text-red-700">
            &times;
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
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
            placeholder="Search by name or email..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {["all", "subscribed", "unsubscribed"].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setFilterSubscription(filter)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition cursor-pointer ${
                filterSubscription === filter
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredRecipients.length === 0 ? (
        <EmptyState
          title={searchQuery || filterSubscription !== "all" ? "No matching recipients" : "No recipients added yet"}
          description={
            searchQuery || filterSubscription !== "all"
              ? "Try updating your search query or filter selection."
              : "Build your subscriber audience by adding your first recipient."
          }
          actionLabel={searchQuery || filterSubscription !== "all" ? null : "Add Recipient"}
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5">Subscription</th>
                  <th className="px-6 py-3.5">Account State</th>
                  <th className="px-6 py-3.5">Added Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredRecipients.map((recipient) => (
                  <tr key={recipient.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {recipient.name}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {recipient.email}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge
                        status={recipient.isSubscribed ? "subscribed" : "unsubscribed"}
                        size="sm"
                      />
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge
                        status={recipient.isActive ? "active" : "inactive"}
                        size="sm"
                      />
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(recipient.createdAt)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(recipient)}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteCandidate(recipient)}
                          className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Recipient Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRecipient ? "Edit Recipient" : "Add New Recipient"}
        subtitle={
          editingRecipient
            ? "Modify recipient name, email address, or subscription state."
            : "Add an individual to your campaign audience directory."
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g. Jane Doe"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="jane.doe@example.com"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {editingRecipient && (
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editSubscription}
                  onChange={(e) => setEditSubscription(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-slate-700">Subscribed to Email Campaigns</span>
              </label>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
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
              <span>{editingRecipient ? "Update Recipient" : "Save Recipient"}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleDelete}
        title="Remove Recipient"
        message={`Are you sure you want to deactivate and remove "${deleteCandidate?.name}" (${deleteCandidate?.email})?`}
        confirmLabel="Deactivate Recipient"
        loading={submitting}
      />
    </div>
  );
};

export default Recipients;