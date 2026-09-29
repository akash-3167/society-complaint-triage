import React, { useState, useEffect } from 'react';
import { 
  X, 
  UserCheck, 
  Wrench, 
  Sparkles, 
  Home, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { SOCIETY_STAFF, getSuggestedStaff } from '../constants/staff';
import CategoryBadge from './CategoryBadge';
import UrgencyBadge from './UrgencyBadge';

export const AssignStaffModal = ({
  isOpen,
  complaint,
  onClose,
  onAssign
}) => {
  const [selectedStaff, setSelectedStaff] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Initialize selected staff when complaint opens
  useEffect(() => {
    if (complaint) {
      if (complaint.assigned_to) {
        setSelectedStaff(complaint.assigned_to);
      } else {
        // Pre-select suggested staff based on category if available
        const suggested = getSuggestedStaff(complaint.category);
        setSelectedStaff(suggested || SOCIETY_STAFF[0]);
      }
      setError(null);
    }
  }, [complaint]);

  if (!isOpen || !complaint) return null;

  const suggestedStaff = getSuggestedStaff(complaint.category);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStaff) {
      setError('Please select a staff member to assign');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onAssign(complaint.id, selectedStaff);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to assign staff');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="assign-modal-title"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="assign-modal-title" className="text-base font-bold text-slate-900 leading-snug">
                Assign Staff
              </h2>
              <p className="text-xs text-slate-500">
                Allocate ticket to society maintenance team
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Complaint Context Summary */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 font-semibold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                  <Home className="w-3.5 h-3.5 text-slate-500" />
                  Flat {complaint.flat_number}
                </span>
                <span className="text-slate-600 font-medium">
                  {complaint.resident_name}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <UrgencyBadge urgency={complaint.urgency} size="sm" />
                <CategoryBadge category={complaint.category} size="sm" />
              </div>
            </div>

            <p className="text-slate-700 italic line-clamp-2 bg-white/70 p-2 rounded border border-slate-100">
              "{complaint.description}"
            </p>

            {complaint.suggested_action && (
              <div className="text-[11px] text-emerald-800 bg-emerald-50/80 p-2 rounded border border-emerald-100 flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>AI Suggested Action:</strong> {complaint.suggested_action}
                </span>
              </div>
            )}
          </div>

          {/* Predefined Staff List */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Staff Member:
            </label>
            <div className="space-y-2">
              {SOCIETY_STAFF.map((staff) => {
                const isSelected = selectedStaff === staff;
                const isRecommended = staff === suggestedStaff;

                return (
                  <label
                    key={staff}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition text-xs ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="assignedStaff"
                        value={staff}
                        checked={isSelected}
                        onChange={() => setSelectedStaff(staff)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                      />
                      <div className="flex flex-col">
                        <span className={`font-semibold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                          {staff}
                        </span>
                        {isRecommended && (
                          <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                            ★ Recommended for {complaint.category} issues
                          </span>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Notice: Status transitions from OPEN to ASSIGNED */}
          <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>
              Assigning will automatically transition complaint status from <strong>{complaint.status}</strong> to <strong>ASSIGNED</strong>.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedStaff}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Assigning...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Confirm Assignment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignStaffModal;
