import { useEffect, useState } from "react";
import recipientService from "../services/recipientService";

const emptyForm = {
  name: "",
  email: ""
};

function Recipients() {
  const [recipients, setRecipients] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadRecipients = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await recipientService.getRecipients();

      setRecipients(
        response?.data?.recipients || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load recipients"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipients();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      if (editingId) {
        await recipientService.updateRecipient(
          editingId,
          {
            name: form.name,
            email: form.email
          }
        );

        setSuccess(
          "Recipient updated successfully"
        );
      } else {
        await recipientService.createRecipient({
          name: form.name,
          email: form.email
        });

        setSuccess(
          "Recipient created successfully"
        );
      }

      resetForm();
      await loadRecipients();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save recipient"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (recipient) => {
    setEditingId(recipient.id);

    setForm({
      name: recipient.name || "",
      email: recipient.email || ""
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleDelete = async (recipientId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this recipient?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await recipientService.deleteRecipient(
        recipientId
      );

      setSuccess(
        "Recipient deleted successfully"
      );

      if (editingId === recipientId) {
        resetForm();
      }

      await loadRecipients();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete recipient"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">
              Recipients
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your email campaign recipients.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-950">
              {editingId
                ? "Edit Recipient"
                : "Add Recipient"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editingId
                ? "Update recipient information."
                : "Add a recipient to your campaign audience."}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 md:grid-cols-2"
          >
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter recipient name"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter recipient email"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Recipient"
                    : "Add Recipient"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-950">
              Recipient List
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Active recipients available for campaigns.
            </p>
          </div>

          {loading ? (
            <div className="px-6 py-10 text-center text-sm text-slate-500">
              Loading recipients...
            </div>
          ) : recipients.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-slate-500">
              No recipients found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Name
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Subscription
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {recipients.map((recipient) => (
                    <tr
                      key={recipient.id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {recipient.name}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {recipient.email}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            recipient.isSubscribed
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {recipient.isSubscribed
                            ? "Subscribed"
                            : "Unsubscribed"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            recipient.isActive
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {recipient.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(recipient)
                            }
                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                recipient.id
                              )
                            }
                            className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
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
          )}
        </section>
      </main>
    </div>
  );
}

export default Recipients;