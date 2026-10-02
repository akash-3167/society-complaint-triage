import React from 'react';

const STATUS_CONFIG = {
  OPEN: {
    label: 'Open',
    dot: 'bg-slate-400',
    classes: 'bg-slate-100/90 text-slate-700 border-slate-200/80'
  },
  ASSIGNED: {
    label: 'Assigned',
    dot: 'bg-blue-500',
    classes: 'bg-blue-50 text-blue-700 border-blue-200/80'
  },
  IN_PROGRESS: {
    label: 'In Progress',
    dot: 'bg-amber-500 animate-pulse',
    classes: 'bg-amber-50 text-amber-800 border-amber-200/80'
  },
  RESOLVED: {
    label: 'Resolved',
    dot: 'bg-emerald-500',
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
  }
};

export const StatusBadge = ({ status = 'OPEN', size = 'md' }) => {
  const normalized = (status || 'OPEN').toUpperCase();
  const config = STATUS_CONFIG[normalized] || STATUS_CONFIG.OPEN;

  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-[11px]' 
    : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium tracking-tight ${config.classes} ${sizeClasses}`}
      role="status"
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;

