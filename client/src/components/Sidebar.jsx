import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Layers, 
  HelpCircle,
  Building,
  Bot
} from 'lucide-react';

export const Sidebar = ({ 
  stats = {}, 
  activeFilter = 'ALL', 
  onFilterChange = () => {} 
}) => {
  const filterItems = [
    { id: 'ALL', label: 'All Complaints', icon: LayoutDashboard, count: stats.total || 0 },
    { id: 'CRITICAL', label: 'Critical Urgency', icon: AlertCircle, count: stats.critical || 0, badgeColor: 'text-red-700 bg-red-50' },
    { id: 'OPEN', label: 'Open / Unassigned', icon: Clock, count: stats.open || 0, badgeColor: 'text-indigo-700 bg-indigo-50' },
    { id: 'IN_PROGRESS', label: 'In Progress', icon: Layers, count: stats.inProgress || 0, badgeColor: 'text-amber-700 bg-amber-50' },
    { id: 'RESOLVED', label: 'Resolved', icon: CheckCircle2, count: stats.resolved || 0, badgeColor: 'text-emerald-700 bg-emerald-50' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] p-4">
      <div className="space-y-6">
        {/* Society Overview Card */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs uppercase tracking-wider">
            <Building className="w-4 h-4 text-blue-600" />
            <span>Green Meadows CHS</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            4 Towers (A, B, C, D) &bull; 104 Residential Flats
          </p>
        </div>

        {/* Quick Filter Navigation */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
            Quick Views
          </span>
          <nav className="mt-2 space-y-1" aria-label="Sidebar filters">
            {filterItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeFilter === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onFilterChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition text-left ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span
                    className={`ml-2 px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                      item.badgeColor || (isActive ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600')
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
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 text-xs text-slate-700">
          <div className="flex items-center gap-2 font-semibold text-blue-900 mb-1">
            <Bot className="w-4 h-4 text-blue-600" />
            <span>AI Triage Module</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-normal">
            Phase 1 Ready. Isolated services for NLP language detection and semantic clustering prepared.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
