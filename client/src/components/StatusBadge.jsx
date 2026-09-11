const statusConfig = {
  // Campaign statuses
  draft: {
    label: "Draft",
    bg: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-400"
  },
  scheduled: {
    label: "Scheduled",
    bg: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500 animate-pulse"
  },
  processing: {
    label: "Processing",
    bg: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500 animate-pulse"
  },
  completed: {
    label: "Completed",
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500"
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-400"
  },
  failed: {
    label: "Failed",
    bg: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500"
  },

  // Recipient delivery statuses
  pending: {
    label: "Pending",
    bg: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-400"
  },
  queued: {
    label: "Queued",
    bg: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dot: "bg-indigo-400"
  },
  sent: {
    label: "Sent",
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500"
  },

  // Recipient general statuses
  active: {
    label: "Active",
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500"
  },
  inactive: {
    label: "Inactive",
    bg: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400"
  },
  subscribed: {
    label: "Subscribed",
    bg: "bg-teal-50 text-teal-700 border-teal-200",
    dot: "bg-teal-500"
  },
  unsubscribed: {
    label: "Unsubscribed",
    bg: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-400"
  },

  // Role badges
  admin: {
    label: "Admin",
    bg: "bg-purple-50 text-purple-700 border-purple-200",
    dot: "bg-purple-500"
  },
  user: {
    label: "User",
    bg: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-400"
  }
};

const StatusBadge = ({ status, size = "md" }) => {
  const normalized = (status || "").toLowerCase();
  const config = statusConfig[normalized] || {
    label: status || "Unknown",
    bg: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-400"
  };

  const sizeClasses =
    size === "sm"
      ? "px-2 py-0.5 text-xs"
      : "px-2.5 py-1 text-xs font-medium";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${sizeClasses} tracking-wide`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
