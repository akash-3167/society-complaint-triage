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
      className={`rounded-xl border transition-all duration-150 p-4 sm:p-5 flex flex-col justify-between h-full bg-white ${
        isCritical 
          ? 'border-l-4 border-l-rose-500 border-slate-200/90 shadow-2xs hover:shadow-xs' 
          : isResolved
          ? 'bg-slate-50/50 border-slate-200 shadow-2xs opacity-90'
          : 'border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs'
      }`}
    >
      <div>
        {/* 1. Top row: Flat number, Resident name, Date/time, Status */}
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight shrink-0">
              Flat {complaint.flat_number}
            </span>
            <span className="text-slate-300 text-xs shrink-0">•</span>
            <span className="text-xs text-slate-500 truncate font-medium">
              {complaint.resident_name}
            </span>
            <span className="text-slate-300 text-xs shrink-0 hidden sm:inline">•</span>
            <span className="text-[11px] text-slate-400 shrink-0 hidden sm:inline">
              {formatDate(complaint.created_at)}
            </span>
          </div>

          <div className="shrink-0">
            <StatusBadge status={complaint.status} size="sm" />
          </div>
        </div>

        {/* 2. Small category + urgency indicators */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
          <CategoryBadge category={complaint.category} size="sm" />
          <UrgencyBadge urgency={complaint.urgency} size="sm" />

          {complaint.cluster_id && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded">
              <Layers className="w-3 h-3" />
              <span>Linked #{complaint.cluster_id}</span>
            </span>
          )}

          {complaint.language && complaint.language !== 'English' && (
            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              {complaint.language}
            </span>
          )}
        </div>

        {/* 3. Complaint description preview with line-clamping */}
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed line-clamp-2 mt-2.5">
          {complaint.description}
        </p>

        {/* 4. AI summary: Presented subtly */}
        {summaryText && (
          <div className="mt-2.5 py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-1.5 text-xs text-slate-600">
            <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
            <span className="line-clamp-1">
              <strong className="font-semibold text-slate-700">AI Summary:</strong> {summaryText}
            </span>
          </div>
        )}

        {/* 5. Assignment/status information: Visible but compact */}
        {isResolved ? (
          <div className="mt-2.5 flex items-center justify-between text-xs text-emerald-700">
            <span className="font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Resolved
            </span>
            {complaint.assigned_to && (
              <span className="text-[11px] text-slate-500">
                Staff: <span className="font-medium text-slate-700">{complaint.assigned_to}</span>
              </span>
            )}
          </div>
        ) : complaint.assigned_to ? (
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-1.5 truncate">
              <Wrench className="w-3 h-3 text-blue-600 shrink-0" />
              <span className="truncate">
                Assigned: <strong className="text-slate-800 font-semibold">{complaint.assigned_to}</strong>
              </span>
            </div>
            {isCommitteeView && onOpenAssign && (
              <button
                type="button"
                onClick={() => onOpenAssign(complaint)}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold hover:underline shrink-0 ml-2"
              >
                Change
              </button>
            )}
          </div>
        ) : isCommitteeView ? (
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
            <span className="text-[11px] text-slate-500 italic">Unassigned</span>
            {onOpenAssign && (
              <button
                type="button"
                onClick={() => onOpenAssign(complaint)}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition"
              >
                <UserPlus className="w-3 h-3" />
                <span>Assign Staff</span>
              </button>
            )}
          </div>
        ) : null}
      </div>

      {/* 6. Bottom row: Quick action toolbar (committee) + Ticket ID & View Details */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex flex-col gap-2">
        {isCommitteeView && (
          <div className="flex items-center justify-between gap-2">
            {/* Status change select */}
            <div className="flex items-center gap-1.5 flex-1">
              <select
                value={complaint.status}
                onChange={(e) => onStatusChange && onStatusChange(complaint.id, e.target.value)}
                className={`w-full max-w-[130px] px-2 py-1 text-[11px] border rounded-md font-semibold bg-white focus:ring-1 focus:ring-blue-500 ${
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
                  className="px-2 py-1 text-[11px] font-semibold rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition shrink-0"
                  title="Quick resolve"
                >
                  ✓ Resolve
                </button>
              )}
            </div>

            {/* Quick staff button if still open */}
            {onOpenAssign && !complaint.assigned_to && (
              <button
                type="button"
                onClick={() => onOpenAssign(complaint)}
                className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                title="Assign Staff"
              >
                <UserPlus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            <span className="text-slate-400 font-medium">#{complaint.id}</span>
            <span className="text-slate-300 sm:hidden">&bull;</span>
            <span className="text-slate-400 sm:hidden font-sans">{formatDate(complaint.created_at)}</span>
          </div>

          {showActions && (
            <Link
              to={`/complaints/${complaint.id}`}
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold text-xs transition group"
            >
              <span>View Details</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;

