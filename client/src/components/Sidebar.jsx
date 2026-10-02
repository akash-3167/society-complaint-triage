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
    <aside className="w-60 bg-white border-r border-slate-200/80 hidden lg:flex flex-col justify-between shrink-0 min-h-[calc(100vh-3.75rem)] p-4">
      <div className="space-y-5">
        {/* Society Overview Card */}
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs tracking-tight">
            <Building className="w-3.5 h-3.5 text-blue-600" />
            <span>Green Meadows CHS</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            4 Towers • 104 Residential Flats
          </p>
        </div>

        {/* Quick Filter Navigation */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
            Quick Views
          </span>
          <nav className="space-y-0.5" aria-label="Sidebar filters">
            {filterItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeFilter === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onFilterChange(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors text-left ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span
                    className={`ml-2 px-1.5 py-0.2 rounded text-[10px] font-semibold ${
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
      <div className="pt-3 border-t border-slate-100 space-y-2">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Triage Engine</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Automated categorization, urgency scoring, language detection & cluster grouping.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

