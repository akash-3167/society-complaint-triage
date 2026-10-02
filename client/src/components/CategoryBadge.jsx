import React from 'react';
import { 
  Droplets, 
  ArrowUpDown, 
  Car, 
  Volume2, 
  Sparkles, 
  Wrench, 
  HelpCircle 
} from 'lucide-react';

const CATEGORY_CONFIG = {
  WATER: {
    label: 'Water Supply',
    icon: Droplets,
    classes: 'bg-sky-50 text-sky-800 border-sky-200/70'
  },
  LIFT: {
    label: 'Lift / Elevator',
    icon: ArrowUpDown,
    classes: 'bg-indigo-50 text-indigo-800 border-indigo-200/70'
  },
  PARKING: {
    label: 'Parking',
    icon: Car,
    classes: 'bg-blue-50 text-blue-800 border-blue-200/70'
  },
  NOISE: {
    label: 'Noise Disturbance',
    icon: Volume2,
    classes: 'bg-amber-50 text-amber-800 border-amber-200/70'
  },
  CLEANING: {
    label: 'Cleaning',
    icon: Sparkles,
    classes: 'bg-emerald-50 text-emerald-800 border-emerald-200/70'
  },
  MAINTENANCE: {
    label: 'Maintenance',
    icon: Wrench,
    classes: 'bg-slate-100 text-slate-800 border-slate-200/80'
  },
  OTHER: {
    label: 'General',
    icon: HelpCircle,
    classes: 'bg-slate-100 text-slate-700 border-slate-200/70'
  }
};

export const CategoryBadge = ({ category = 'OTHER', size = 'md', showIcon = true }) => {
  const normalized = (category || 'OTHER').toUpperCase();
  const config = CATEGORY_CONFIG[normalized] || CATEGORY_CONFIG.OTHER;
  const Icon = config.icon;

  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-[11px]' 
    : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium ${config.classes} ${sizeClasses}`}
    >
      {showIcon && <Icon className="w-3 h-3 shrink-0 opacity-80" aria-hidden="true" />}
      <span>{config.label}</span>
    </span>
  );
};

export default CategoryBadge;

