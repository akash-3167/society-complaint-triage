import React from 'react';
import { AlertCircle, AlertTriangle, Clock } from 'lucide-react';

const URGENCY_CONFIG = {
  CRITICAL: {
    label: 'Critical',
    icon: AlertCircle,
    classes: 'bg-rose-50 text-rose-700 border-rose-200/80 font-semibold',
    iconClass: 'text-rose-600'
  },
  HIGH: {
    label: 'High',
    icon: AlertTriangle,
    classes: 'bg-amber-50 text-amber-800 border-amber-200/80 font-medium',
    iconClass: 'text-amber-600'
  },
  MEDIUM: {
    label: 'Medium',
    icon: null,
    classes: 'bg-slate-100 text-slate-700 border-slate-200/80 font-medium',
    iconClass: 'text-slate-500'
  },
  LOW: {
    label: 'Low',
    icon: null,
    classes: 'bg-slate-50 text-slate-500 border-slate-200/60 font-normal',
    iconClass: 'text-slate-400'
  }
};

export const UrgencyBadge = ({ urgency = 'MEDIUM', size = 'md', showIcon = true }) => {
  const normalized = (urgency || 'MEDIUM').toUpperCase();
  const config = URGENCY_CONFIG[normalized] || URGENCY_CONFIG.MEDIUM;
  const Icon = config.icon;

  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-[11px]' 
    : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${config.classes} ${sizeClasses} tracking-tight`}
      title={`Urgency: ${config.label}`}
    >
      {showIcon && Icon && <Icon className={`w-3 h-3 ${config.iconClass}`} aria-hidden="true" />}
      <span>{config.label}</span>
    </span>
  );
};

export default UrgencyBadge;

