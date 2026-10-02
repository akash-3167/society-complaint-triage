import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  ArrowRight, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Wrench,
  UserCheck,
  UserPlus
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import UrgencyBadge from './UrgencyBadge';
import CategoryBadge from './CategoryBadge';
import { SOCIETY_STAFF } from '../constants/staff';

// Helper to format ISO timestamp into readable string
const formatDate = (isoString) => {
  if (!isoString) return 'Just now';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  } catch (e) {
    return isoString;
  }
};

export const ComplaintCard = ({
  complaint,
  showActions = true,
  onStatusChange,
  onAssign,
  onOpenAssign,
  isCommitteeView = false
}) => {
  if (!complaint) return null;

  const isResolved = complaint.status === 'RESOLVED';
  const isCritical = complaint.urgency === 'CRITICAL' && !isResolved;
  const summaryText = complaint.ai_summary || complaint.summary;

  return (
    <div 
      className={`glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between h-full relative ${
        isCritical 
          ? 'border-l-[3.5px] border-l-rose-500' 
          : isResolved
          ? 'opacity-90'
          : ''
      }`}
    >
      <div>
        {/* TOP: Flat number / resident & Status */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100/90">
          <div>
            <div className="font-bold text-slate-900 text-sm sm:text-base tracking-tight leading-tight">
              Flat {complaint.flat_number}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              {complaint.resident_name}
            </div>
          </div>

          <div className="shrink-0 pt-0.5">
            <StatusBadge status={complaint.status} size="sm" />
          </div>
        </div>

        {/* SECOND: Category + Urgency */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          <CategoryBadge category={complaint.category} size="sm" />
          <UrgencyBadge urgency={complaint.urgency} size="sm" />

          {complaint.cluster_id && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-700 bg-indigo-50/80 border border-indigo-200/70 px-2 py-0.5 rounded-full">
              <Layers className="w-3 h-3 text-indigo-500" />
              <span>Cluster #{complaint.cluster_id}</span>
            </span>
          )}

          {complaint.language && complaint.language !== 'English' && (
            <span className="text-[10px] font-medium text-slate-500 bg-slate-100/80 border border-slate-200/60 px-1.5 py-0.5 rounded-md">
              {complaint.language}
            </span>
          )}
        </div>

        {/* MAIN: Short complaint description */}
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed line-clamp-2 mt-3 font-normal">
          {complaint.description}
        </p>

        {/* AI: Small subtle "AI Summary" section */}
        {summaryText && (
          <div className="mt-3 p-2.5 rounded-xl glass-ai-badge flex items-start gap-2 text-xs text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="leading-snug min-w-0">
              <span className="font-semibold text-indigo-950 text-[10px] uppercase tracking-wider block mb-0.5">
                AI Summary
              </span>
              <p className="line-clamp-2 text-slate-600 text-[12px]">{summaryText}</p>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM: Assignment / status & View Details */}
      <div className="mt-4 pt-3 border-t border-slate-100/90 flex flex-col gap-2.5">
        {/* Committee Workflow Controls */}
        {isCommitteeView && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-1">
              <select
                value={complaint.status}
                onChange={(e) => onStatusChange && onStatusChange(complaint.id, e.target.value)}
                className={`w-full max-w-[130px] px-2 py-1 text-[11px] border rounded-lg font-semibold bg-white/90 focus:ring-1 focus:ring-blue-500 ${
                  complaint.status === 'RESOLVED'
                    ? 'text-emerald-700 border-emerald-200 bg-emerald-50/50'
                    : complaint.status === 'IN_PROGRESS'
                    ? 'text-amber-700 border-amber-200 bg-amber-50/50'
                    : complaint.status === 'ASSIGNED'
                    ? 'text-blue-700 border-blue-200 bg-blue-50/50'
                    : 'text-slate-700 border-slate-200'
                }`}
                aria-label={`Change status for complaint ${complaint.id}`}
              >
                <option value="OPEN">OPEN</option>
                <option value="ASSIGNED">ASSIGNED</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>

              {!isResolved && onStatusChange && (
                <button
                  type="button"
                  onClick={() => onStatusChange(complaint.id, 'RESOLVED')}
                  className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition shrink-0"
                  title="Quick resolve"
                >
                  ✓ Resolve
                </button>
              )}
            </div>

            {onOpenAssign && (
              <button
                type="button"
                onClick={() => onOpenAssign(complaint)}
                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-slate-600 hover:text-blue-700 hover:bg-blue-50/80 rounded-lg border border-slate-200/80 transition"
                title={complaint.assigned_to ? 'Change staff' : 'Assign staff'}
              >
                <UserPlus className="w-3 h-3" />
                <span>{complaint.assigned_to ? 'Change' : 'Assign'}</span>
              </button>
            )}
          </div>
        )}

        {/* Assignment & View Details */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] truncate">
            {complaint.assigned_to ? (
              <span className="truncate">
                Assigned: <strong className="text-slate-800 font-semibold">{complaint.assigned_to}</strong>
              </span>
            ) : isResolved ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Resolved
              </span>
            ) : (
              <span className="text-slate-400 italic">Unassigned</span>
            )}
          </div>

          {showActions && (
            <Link
              to={`/complaints/${complaint.id}`}
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold text-xs transition group shrink-0 ml-2"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;

