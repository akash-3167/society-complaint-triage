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
      iconBg: 'bg-blue-50 text-blue-600',
      activeBorder: 'border-blue-500 ring-2 ring-blue-500/10'
    },
    red: {
      iconBg: 'bg-rose-50 text-rose-600',
      activeBorder: 'border-rose-500 ring-2 ring-rose-500/10'
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600',
      activeBorder: 'border-amber-500 ring-2 ring-amber-500/10'
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/10'
    },
    indigo: {
      iconBg: 'bg-indigo-50 text-indigo-600',
      activeBorder: 'border-indigo-500 ring-2 ring-indigo-500/10'
    },
    slate: {
      iconBg: 'bg-slate-100 text-slate-600',
      activeBorder: 'border-slate-700 ring-2 ring-slate-700/10'
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
      className={`bg-white rounded-xl border p-4 sm:p-4.5 transition-all duration-150 flex flex-col justify-between ${
        active 
          ? `${style.activeBorder} shadow-xs` 
          : 'border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs'
      } ${isClickable ? 'cursor-pointer select-none' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-semibold text-slate-500 tracking-tight">
          {title}
        </span>
        {Icon && (
          <div className={`p-1.5 rounded-lg shrink-0 ${style.iconBg}`}>
            <Icon className="w-4 h-4" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-none">
          {value ?? 0}
        </div>
        {subtitle && (
          <p className="text-[11px] text-slate-400 font-medium mt-1.5 truncate">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardStat;

