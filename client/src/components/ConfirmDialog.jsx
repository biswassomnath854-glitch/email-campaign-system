import Modal from "./Modal";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to perform this action? This action cannot be undone.",
  confirmLabel = "Delete",
  confirmVariant = "danger",
  loading = false
}) => {
  const variantClasses = {
    danger: "bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500",
    warning: "bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500",
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500"
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="space-y-4">
        <p className="text-sm text-slate-600">{message}</p>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-xl px-4 py-2 text-sm font-semibold shadow-xs transition disabled:opacity-50 ${variantClasses[confirmVariant] || variantClasses.danger}`}
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
