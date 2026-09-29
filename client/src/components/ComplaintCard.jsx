import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  User, 
  Home, 
  ArrowRight, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Wrench,
  UserCheck,
  UserPlus,
  AlertCircle
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

  return (
    <div className={`rounded-xl border p-5 transition-all shadow-sm hover:shadow-md flex flex-col justify-between ${
      isResolved 
        ? 'bg-slate-50/60 border-slate-200' 
        : 'bg-white border-slate-200 hover:border-slate-300'
    }`}>
      <div>
        {/* Top Header Row: Flat, Resident, Date, Badges */}
        <div className="flex flex-wrap items-start justify-between gap-2.5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 text-white font-semibold text-xs tracking-wide">
              <Home className="w-3.5 h-3.5 text-slate-300" />
              Flat {complaint.flat_number}
            </span>
            <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {complaint.resident_name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <UrgencyBadge urgency={complaint.urgency} size="sm" />
            <StatusBadge status={complaint.status} size="sm" />
          </div>
        </div>

        {/* Category & AI Clusters */}
        <div className="flex flex-wrap items-center gap-2 mt-3 mb-2">
          <CategoryBadge category={complaint.category} size="sm" />
          
          {complaint.language && (
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {complaint.language}
            </span>
          )}

          {complaint.cluster_id && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
              <Layers className="w-3 h-3" />
              Linked #{complaint.cluster_id}
            </span>
          )}
        </div>

        {/* Complaint Text */}
        <p className="text-sm text-slate-700 line-clamp-3 leading-relaxed mt-2">
          {complaint.description}
        </p>

        {/* AI Summary & Suggested Action */}
        {(complaint.ai_summary || complaint.summary) && (
          <div className="mt-3 p-2.5 rounded-lg bg-blue-50/50 border border-blue-100 text-xs text-slate-700 flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <span className="line-clamp-2 italic">
              <strong className="not-italic text-slate-800 font-semibold">AI Summary:</strong> {complaint.ai_summary || complaint.summary}
            </span>
          </div>
        )}

        {complaint.suggested_action && (
          <div className="mt-1.5 p-2 rounded-lg bg-emerald-50/40 border border-emerald-100 text-xs text-slate-700 flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span className="line-clamp-2">
              <strong className="text-slate-800 font-semibold">Suggested Action:</strong> {complaint.suggested_action}
            </span>
          </div>
        )}

        {/* Resolution Banner (Visible when Resolved) */}
        {isResolved ? (
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between flex-wrap gap-2">
            <span className="font-bold flex items-center gap-1.5 text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ✅ RESOLVED
            </span>
            {complaint.assigned_to && (
              <span className="text-[11px] text-emerald-700 font-medium">
                Assigned to: <strong className="font-semibold text-emerald-900">{complaint.assigned_to}</strong>
              </span>
            )}
          </div>
        ) : complaint.assigned_to ? (
          /* Assignment Display when Active */
          <div className="mt-2.5 p-2 rounded-lg bg-blue-50/60 border border-blue-200/80 text-xs text-blue-900 flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-medium">
              <Wrench className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Assigned to: <strong className="font-semibold text-slate-900">{complaint.assigned_to}</strong></span>
            </div>
            {isCommitteeView && onOpenAssign && (
              <button
                type="button"
                onClick={() => onOpenAssign(complaint)}
                className="text-[11px] text-blue-700 hover:text-blue-900 font-semibold underline ml-2"
                title="Reassign staff"
              >
                Change
              </button>
            )}
          </div>
        ) : isCommitteeView ? (
          /* Visible prompt for OPEN / unassigned complaints */
          <div className="mt-2.5 p-2 rounded-lg bg-amber-50/80 border border-amber-200/90 text-xs text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-medium text-amber-800">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Status: <strong>OPEN</strong> (Awaiting Staff)</span>
            </div>
            {onOpenAssign && (
              <button
                type="button"
                onClick={() => onOpenAssign(complaint)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition"
                title="Assign staff to open complaint"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Assign Staff</span>
              </button>
            )}
          </div>
        ) : null}
      </div>

      {/* Footer Info & Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2.5">
        {/* Committee Quick Action Controls */}
        {isCommitteeView && (
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs">
              {/* Staff Assignment Action */}
              <div className="flex-1 flex items-center gap-1.5">
                {onOpenAssign ? (
                  <button
                    type="button"
                    onClick={() => onOpenAssign(complaint)}
                    className={`w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition ${
                      complaint.assigned_to 
                        ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' 
                        : 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 shadow-xs'
                    }`}
                    title={complaint.assigned_to ? `Assigned to ${complaint.assigned_to} - Click to change` : 'Click to assign staff'}
                  >
                    {complaint.assigned_to ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{complaint.assigned_to}</span>
                        <span className="text-[10px] text-slate-400 font-normal ml-0.5">(edit)</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Assign Staff...</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 w-full">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <select
                      value={complaint.assigned_to || ''}
                      onChange={(e) => onAssign && onAssign(complaint.id, e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white text-slate-700 font-medium focus:ring-1 focus:ring-blue-500"
                      aria-label={`Assign staff for complaint ${complaint.id}`}
                    >
                      <option value="">Assign Staff...</option>
                      {SOCIETY_STAFF.map((staff) => (
                        <option key={staff} value={staff}>
                          {staff}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Status Change Dropdown */}
              <div className="flex items-center gap-1.5">
                <select
                  value={complaint.status}
                  onChange={(e) => onStatusChange && onStatusChange(complaint.id, e.target.value)}
                  className={`px-2 py-1 text-xs border rounded font-semibold focus:ring-1 focus:ring-blue-500 ${
                    complaint.status === 'RESOLVED'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : complaint.status === 'IN_PROGRESS'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : complaint.status === 'ASSIGNED'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                  aria-label={`Change status for complaint ${complaint.id}`}
                >
                  <option value="OPEN">OPEN</option>
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>

                {!isResolved && onStatusChange && (
                  <button
                    type="button"
                    onClick={() => onStatusChange(complaint.id, 'RESOLVED')}
                    className="px-2 py-1 text-[11px] font-semibold rounded bg-emerald-600 hover:bg-emerald-700 text-white transition shrink-0"
                    title="Quick Mark Resolved"
                  >
                    ✓ Resolve
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Date and Details Link */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatDate(complaint.created_at)}</span>
          </div>

          {showActions && (
            <Link
              to={`/complaints/${complaint.id}`}
              className="inline-flex items-center gap-1 text-blue-600 font-medium hover:text-blue-800 transition py-0.5 px-1.5 rounded hover:bg-blue-50 text-xs"
            >
              <span>Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;
