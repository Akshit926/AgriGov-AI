export default function StatusBadge({ status, size = 'sm' }) {
  const statusConfig = {
    verified: { label: 'Verified', bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
    missing_fields: { label: 'Missing Fields', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
    needs_review: { label: 'Needs Review', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
    pending: { label: 'Pending', bg: 'bg-slate-50', text: 'text-slate-600', dot: 'bg-slate-400' },
    approved: { label: 'Approved', bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
    rejected: { label: 'Rejected', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
    flagged: { label: 'Flagged', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },

    // Fraud
    critical: { label: 'Critical', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
    high: { label: 'High Risk', bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
    medium: { label: 'Medium Risk', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
    low: { label: 'Low Risk', bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },

    // Field
    valid: { label: 'Valid', bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
    mismatch: { label: 'Mismatch', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },

    // Grievance
    open: { label: 'Open', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
    in_progress: { label: 'In Progress', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
    resolved: { label: 'Resolved', bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },

    // Priority
    urgent: { label: 'Urgent', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },

    // Scheme
    increasing: { label: 'Increasing', bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
    stable: { label: 'Stable', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
    decreasing: { label: 'Decreasing', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },

    // Generic
    success: { label: 'Success', bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
    info: { label: 'Info', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
    warning: { label: 'Warning', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
    danger: { label: 'Alert', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bg} ${config.text} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
