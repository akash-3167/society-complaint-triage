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
    classes: 'bg-cyan-50 text-cyan-800 border-cyan-200'
  },
  LIFT: {
    label: 'Lift / Elevator',
    icon: ArrowUpDown,
    classes: 'bg-purple-50 text-purple-800 border-purple-200'
  },
  PARKING: {
    label: 'Parking',
    icon: Car,
    classes: 'bg-blue-50 text-blue-800 border-blue-200'
  },
  NOISE: {
    label: 'Noise Disturbance',
    icon: Volume2,
    classes: 'bg-orange-50 text-orange-800 border-orange-200'
  },
  CLEANING: {
    label: 'Cleaning / Hygiene',
    icon: Sparkles,
    classes: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  },
  MAINTENANCE: {
    label: 'Maintenance',
    icon: Wrench,
    classes: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  OTHER: {
    label: 'General / Other',
    icon: HelpCircle,
    classes: 'bg-slate-100 text-slate-800 border-slate-200'
  }
};

export const CategoryBadge = ({ category = 'OTHER', size = 'md', showIcon = true }) => {
  const normalized = (category || 'OTHER').toUpperCase();
  const config = CATEGORY_CONFIG[normalized] || CATEGORY_CONFIG.OTHER;
  const Icon = config.icon;

  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs' 
    : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${config.classes} ${sizeClasses}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
      <span>{config.label}</span>
    </span>
  );
};

export default CategoryBadge;
