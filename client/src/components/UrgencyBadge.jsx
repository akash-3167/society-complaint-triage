import React from 'react';
import { AlertCircle, AlertTriangle, Info, Clock } from 'lucide-react';

const URGENCY_CONFIG = {
  CRITICAL: {
    label: 'Critical',
    icon: AlertCircle,
    classes: 'bg-red-50 text-red-700 border-red-200',
    iconClass: 'text-red-600'
  },
  HIGH: {
    label: 'High',
    icon: AlertTriangle,
    classes: 'bg-amber-50 text-amber-800 border-amber-200',
    iconClass: 'text-amber-600'
  },
  MEDIUM: {
    label: 'Medium',
    icon: Info,
    classes: 'bg-sky-50 text-sky-800 border-sky-200',
    iconClass: 'text-sky-600'
  },
  LOW: {
    label: 'Low',
    icon: Clock,
    classes: 'bg-slate-100 text-slate-700 border-slate-200',
    iconClass: 'text-slate-500'
  }
};

export const UrgencyBadge = ({ urgency = 'MEDIUM', size = 'md', showIcon = true }) => {
  const normalized = (urgency || 'MEDIUM').toUpperCase();
  const config = URGENCY_CONFIG[normalized] || URGENCY_CONFIG.MEDIUM;
  const Icon = config.icon;

  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs' 
    : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${config.classes} ${sizeClasses} tracking-tight`}
      title={`Urgency: ${config.label}`}
    >
      {showIcon && <Icon className={`w-3.5 h-3.5 ${config.iconClass}`} aria-hidden="true" />}
      <span>{config.label}</span>
    </span>
  );
};

export default UrgencyBadge;
