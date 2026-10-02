import React from 'react';
import { 
  LayoutDashboard, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Layers, 
  Building, 
  Sparkles,
  UserCheck
} from 'lucide-react';

export const Sidebar = ({ 
  stats = {}, 
  activeFilter = 'ALL', 
  onFilterChange = () => {} 
}) => {
  const filterItems = [
    { id: 'ALL', label: 'All Complaints', icon: LayoutDashboard, count: stats.total || 0 },
    { id: 'CRITICAL', label: 'Critical Urgency', icon: AlertCircle, count: stats.critical || 0, badgeColor: 'text-rose-700 bg-rose-50 border border-rose-200/60' },
    { id: 'OPEN', label: 'Open / Unassigned', icon: Clock, count: stats.open || 0, badgeColor: 'text-slate-700 bg-slate-100 border border-slate-200/60' },
    { id: 'ASSIGNED', label: 'Assigned', icon: UserCheck, count: stats.assigned || 0, badgeColor: 'text-blue-700 bg-blue-50 border border-blue-200/60' },
    { id: 'IN_PROGRESS', label: 'In Progress', icon: Layers, count: stats.inProgress || 0, badgeColor: 'text-amber-700 bg-amber-50 border border-amber-200/60' },
    { id: 'RESOLVED', label: 'Resolved', icon: CheckCircle2, count: stats.resolved || 0, badgeColor: 'text-emerald-700 bg-emerald-50 border border-emerald-200/60' },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-200/80 hidden lg:flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] p-4.5">
      <div className="space-y-5">
        {/* Society Overview Card */}
        <div className="p-3.5 bg-white/80 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs tracking-tight">
            <Building className="w-4 h-4 text-blue-600" />
            <span>Green Meadows CHS</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            4 Residential Towers • 104 Units
          </p>
        </div>

        {/* Quick Filter Navigation */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1.5">
            Quick Views
          </span>
          <nav className="space-y-1" aria-label="Sidebar filters">
            {filterItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeFilter === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onFilterChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-all text-left ${
                    isActive
                      ? 'bg-white text-slate-900 font-semibold shadow-2xs border border-slate-200/70'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span
                    className={`ml-2 px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
                      item.badgeColor || (isActive ? 'bg-slate-200 text-slate-800' : 'bg-slate-100 text-slate-500')
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* AI Readiness Banner in Footer */}
      <div className="pt-3 border-t border-slate-100/90 space-y-2">
        <div className="p-3.5 glass-ai-badge rounded-2xl text-xs text-slate-700">
          <div className="flex items-center gap-1.5 font-bold text-indigo-950 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Triage Engine</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Automated categorization, urgency scoring, language detection & cluster grouping.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

