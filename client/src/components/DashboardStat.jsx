import React from 'react';

export const DashboardStat = ({
  title,
  value,
  icon: Icon,
  color = 'blue',
  subtitle,
  onClick,
  active = false
}) => {
  const colorStyles = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: active ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200 hover:border-blue-300',
      badge: 'bg-blue-100 text-blue-800'
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      border: active ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200 hover:border-red-300',
      badge: 'bg-red-100 text-red-800'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: active ? 'border-amber-500 ring-2 ring-amber-100' : 'border-slate-200 hover:border-amber-300',
      badge: 'bg-amber-100 text-amber-800'
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: active ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-emerald-300',
      badge: 'bg-emerald-100 text-emerald-800'
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: active ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-indigo-300',
      badge: 'bg-indigo-100 text-indigo-800'
    },
    slate: {
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: active ? 'border-slate-500 ring-2 ring-slate-100' : 'border-slate-200 hover:border-slate-300',
      badge: 'bg-slate-200 text-slate-800'
    }
  };

  const style = colorStyles[color] || colorStyles.blue;
  const isClickable = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      className={`bg-white rounded-xl border p-4 sm:p-5 transition-all shadow-sm ${style.border} ${
        isClickable ? 'cursor-pointer select-none hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-medium text-slate-500 tracking-wide uppercase">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-lg ${style.bg} ${style.text}`}>
            <Icon className="w-5 h-5" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {value ?? 0}
        </span>
        {subtitle && (
          <span className="text-xs text-slate-500 truncate max-w-[140px]">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default DashboardStat;
