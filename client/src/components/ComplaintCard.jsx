import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Home, ArrowRight, Layers, Sparkles, CheckCircle2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import UrgencyBadge from './UrgencyBadge';
import CategoryBadge from './CategoryBadge';

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
  isCommitteeView = false
}) => {
  if (!complaint) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-all shadow-sm hover:shadow-md flex flex-col justify-between">
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
      </div>

      {/* Footer Info & Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{formatDate(complaint.created_at)}</span>
        </div>

        <div className="flex items-center gap-2">
          {isCommitteeView && onStatusChange && (
            <select
              value={complaint.status}
              onChange={(e) => onStatusChange(complaint.id, e.target.value)}
              className="px-2 py-1 text-xs border border-slate-300 rounded bg-white text-slate-700 focus:ring-1 focus:ring-blue-500"
              aria-label={`Change status for complaint ${complaint.id}`}
            >
              <option value="OPEN">Open</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          )}

          {showActions && (
            <Link
              to={`/complaints/${complaint.id}`}
              className="inline-flex items-center gap-1 text-blue-600 font-medium hover:text-blue-800 transition py-1 px-2 rounded hover:bg-blue-50"
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
