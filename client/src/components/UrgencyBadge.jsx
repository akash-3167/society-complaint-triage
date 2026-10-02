import React from 'react';

const URGENCY_CONFIG = {
  CRITICAL: {
    label: 'Critical',
    dot: 'bg-rose-500 animate-pulse',
    classes: 'bg-rose-50/80 text-rose-700 border-rose-200/80 font-semibold'
  },
  HIGH: {
    label: 'High',
    dot: 'bg-amber-500',
    classes: 'bg-amber-50/80 text-amber-800 border-amber-200/80 font-medium'
  },
  MEDIUM: {
    label: 'Medium',
    dot: 'bg-slate-400',
    classes: 'bg-slate-100/80 text-slate-700 border-slate-200/70 font-medium'
  },
  LOW: {
    label: 'Low',
    dot: 'bg-slate-300',
    classes: 'bg-slate-50/80 text-slate-500 border-slate-200/50 font-normal'
  }
};

export const UrgencyBadge = ({ urgency = 'MEDIUM', size = 'md' }) => {
  const normalized = (urgency || 'MEDIUM').toUpperCase();
  const config = URGENCY_CONFIG[normalized] || URGENCY_CONFIG.MEDIUM;

  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-[11px]' 
    : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.classes} ${sizeClasses} tracking-tight select-none`}
      title={`Urgency: ${config.label}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
};

export default UrgencyBadge;

