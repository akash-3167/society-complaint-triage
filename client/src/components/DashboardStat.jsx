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
      iconBg: 'bg-blue-50/80 text-blue-600 border border-blue-100',
      activeBorder: 'border-blue-500 ring-2 ring-blue-500/15'
    },
    red: {
      iconBg: 'bg-rose-50/80 text-rose-600 border border-rose-100',
      activeBorder: 'border-rose-500 ring-2 ring-rose-500/15'
    },
    amber: {
      iconBg: 'bg-amber-50/80 text-amber-600 border border-amber-100',
      activeBorder: 'border-amber-500 ring-2 ring-amber-500/15'
    },
    emerald: {
      iconBg: 'bg-emerald-50/80 text-emerald-600 border border-emerald-100',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/15'
    },
    indigo: {
      iconBg: 'bg-indigo-50/80 text-indigo-600 border border-indigo-100',
      activeBorder: 'border-indigo-500 ring-2 ring-indigo-500/15'
    },
    slate: {
      iconBg: 'bg-slate-100/80 text-slate-600 border border-slate-200/60',
      activeBorder: 'border-slate-700 ring-2 ring-slate-700/15'
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
      className={`glass-panel glass-panel-hover rounded-2xl p-4.5 sm:p-5 flex flex-col justify-between ${
        active 
          ? `${style.activeBorder}` 
          : ''
      } ${isClickable ? 'cursor-pointer select-none' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-xl shrink-0 ${style.iconBg}`}>
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

