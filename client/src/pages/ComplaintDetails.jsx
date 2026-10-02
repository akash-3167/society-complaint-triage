import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Home, 
  Calendar, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Trash2, 
  Wrench, 
  Languages, 
  ShieldCheck, 
  Save, 
  UserPlus
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import UrgencyBadge from '../components/UrgencyBadge';
import CategoryBadge from '../components/CategoryBadge';
import LoadingState from '../components/LoadingState';
import AssignStaffModal from '../components/AssignStaffModal';
import { SOCIETY_STAFF } from '../constants/staff';

export const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isCommittee: authIsCommittee } = useAuth();
  const isCommittee = (user?.role?.toUpperCase() === 'COMMITTEE') || Boolean(authIsCommittee);

  const [complaint, setComplaint] = useState(null);
  const [clusteredComplaints, setClusteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Form edit states for committee resolution
  const [status, setStatus] = useState('OPEN');
  const [assignedTo, setAssignedTo] = useState('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [successNotice, setSuccessNotice] = useState(null);

  // Handler for direct staff assignment from modal
  const handleAssignStaff = async (complaintId, staffName) => {
    try {
      const updated = await api.updateComplaint(complaintId, {
        assigned_to: staffName,
        status: 'ASSIGNED'
      });
      setComplaint(updated);
      setStatus(updated.status);
      setAssignedTo(updated.assigned_to || '');
      setSuccessNotice(`Staff assigned successfully: ${staffName}`);
      setTimeout(() => setSuccessNotice(null), 4000);
      return updated;
    } catch (err) {
      alert(`Assignment failed: ${err.message}`);
      throw err;
    }
  };

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getComplaintById(id);
      setComplaint(data);
      setStatus(data.status);
      setAssignedTo(data.assigned_to || '');

      // If clustered, fetch all complaints and show others in the same cluster
      if (data.cluster_id) {
        const all = await api.getComplaints();
        const related = all.filter((c) => c.cluster_id === data.cluster_id && c.id !== data.id);
        setClusteredComplaints(related);
      }
    } catch (err) {
      setError(err.message || 'Failed to load complaint details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await api.updateComplaint(id, {
        status,
        assigned_to: assignedTo.trim() || null
      });
      setComplaint(updated);
      setSuccessNotice('Complaint ticket updated successfully');
      setTimeout(() => setSuccessNotice(null), 4000);
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete complaint ticket ${id}?`)) {
      return;
    }
    try {
      await api.deleteComplaint(id);
      navigate('/committee');
    } catch (err) {
      alert(`Could not delete complaint: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <LoadingState message="Loading complaint details..." />
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2.5" />
        <h2 className="text-base font-bold text-slate-900">Complaint Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">{error || 'The requested complaint ticket does not exist.'}</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-4 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg shadow-2xs hover:bg-blue-700 transition"
        >
          Return Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">
      {/* Top Navigation & Actions Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Complaints</span>
        </button>

        {isCommittee && (
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 px-2.5 py-1 rounded-lg hover:bg-rose-50 transition"
            title="Delete Complaint"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Ticket</span>
          </button>
        )}
      </div>

      {successNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Main Ticket Layout: 2-Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2 cols): Complaint Info, AI Triage, Cluster Linking */}
        <div className="lg:col-span-2 space-y-4">
          {/* Section 1: Complaint Information */}
          <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">
                  Flat {complaint.flat_number}
                </span>
                <span className="text-slate-300">•</span>
                <span className="font-mono text-xs text-slate-400">
                  #{complaint.id}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <UrgencyBadge urgency={complaint.urgency} size="sm" />
                <StatusBadge status={complaint.status} size="sm" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <CategoryBadge category={complaint.category} size="sm" />
              {complaint.language && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                  <Languages className="w-3 h-3 text-slate-400" />
                  <span>Language: {complaint.language}</span>
                </span>
              )}
              {complaint.cluster_id && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                  <Layers className="w-3 h-3" />
                  <span>Cluster #{complaint.cluster_id}</span>
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Resident Problem Description
              </h2>
              <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                {complaint.description}
              </div>
            </div>

            {/* Resident & Timestamp Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  Reported by: <strong className="text-slate-700">{complaint.resident_name}</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  Logged: <strong className="text-slate-700">{new Date(complaint.created_at).toLocaleString('en-IN')}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: AI Triage Analysis */}
          <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    AI Triage Analysis
                  </h3>
                  <p className="text-[11px] text-slate-400">Gemini model automated evaluation</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-slate-600 block mb-1">Executive Summary:</span>
                <p className="text-slate-700 glass-ai-badge p-3 rounded-xl border italic leading-relaxed">
                  "{complaint.ai_summary || complaint.summary || 'Standard complaint registered.'}"
                </p>
              </div>

              <div>
                <span className="font-semibold text-slate-600 block mb-1">Recommended Action:</span>
                <p className="text-slate-700 bg-slate-50/70 p-3 rounded-xl border border-slate-100 flex items-start gap-2 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{complaint.suggested_action || 'Assign maintenance staff to inspect with resident.'}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Clustered Related Complaints if present */}
          {clusteredComplaints.length > 0 && (
            <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wider">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Related Complaints in Same Cluster (#{complaint.cluster_id})</span>
              </div>
              <p className="text-xs text-slate-500">
                Similar issues reported across neighboring flats. Resolving this issue likely addresses all linked tickets.
              </p>

              <div className="divide-y divide-slate-100">
                {clusteredComplaints.map((c) => (
                  <div key={c.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                    <div className="truncate">
                      <span className="font-semibold text-slate-900">Flat {c.flat_number}</span> &bull; {c.resident_name}
                      <p className="text-slate-500 line-clamp-1 text-[11px] mt-0.5">{c.description}</p>
                    </div>
                    <Link
                      to={`/complaints/${c.id}`}
                      className="text-blue-600 hover:text-blue-800 font-semibold px-2.5 py-1 rounded bg-blue-50 shrink-0"
                    >
                      View Ticket
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1 col): Status, Assignment, Committee Workflow */}
        <div className="space-y-4">
          {/* Status & Assignment Information */}
          <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Status & Assignment
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-medium block text-[11px] mb-1">Current Status</span>
                <StatusBadge status={complaint.status} size="md" />
              </div>

              {complaint.assigned_to ? (
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 font-medium block text-[10px]">Assigned Personnel</span>
                    <p className="font-semibold text-slate-800 text-xs mt-0.5 flex items-center gap-1.5">
                      <Wrench className="w-3 h-3 text-blue-600" />
                      <span>{complaint.assigned_to}</span>
                    </p>
                  </div>
                  {isCommittee && (
                    <button
                      type="button"
                      onClick={() => setIsAssignModalOpen(true)}
                      className="text-[11px] text-blue-600 hover:text-blue-800 underline font-semibold ml-2"
                      title="Reassign staff"
                    >
                      Change
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-slate-400 font-medium block text-[10px]">Assigned Personnel</span>
                    <p className="font-medium text-slate-500 text-xs mt-0.5">Pending committee assignment</p>
                  </div>
                  {isCommittee && (
                    <button
                      type="button"
                      onClick={() => setIsAssignModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition"
                    >
                      <UserPlus className="w-3 h-3" />
                      <span>Assign Staff</span>
                    </button>
                  )}
                </div>
              )}

              {complaint.status === 'RESOLVED' ? (
                <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200 text-emerald-800 text-xs">
                  <span className="font-bold flex items-center gap-1 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Resolved
                  </span>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    This ticket has been completed and verified.
                  </p>
                </div>
              ) : (
                <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-100 text-slate-500 text-[11px] leading-relaxed">
                  Active ticket. Real-time updates reflect automatically.
                </div>
              )}
            </div>
          </div>

          {/* Committee Action Workflow (Only visible to Committee members) */}
          {isCommittee && (
            <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Committee Workflow
                </h3>
              </div>

              <form onSubmit={handleUpdate} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1" htmlFor="statusSelect">
                    Update Status
                  </label>
                  <select
                    id="statusSelect"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 text-xs"
                  >
                    <option value="OPEN">OPEN (Unassigned)</option>
                    <option value="ASSIGNED">ASSIGNED (Staff dispatched)</option>
                    <option value="IN_PROGRESS">IN PROGRESS (Under repair)</option>
                    <option value="RESOLVED">RESOLVED (Closed)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1" htmlFor="assignedInput">
                    Assigned Staff / Vendor
                  </label>
                  <input
                    id="assignedInput"
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    placeholder="e.g. Ramesh (Plumber), Johnson Lifts"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:ring-1 focus:ring-blue-500 text-xs"
                  />
                </div>

                {/* Quick staff picker helpers */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Quick Assign Staff:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {SOCIETY_STAFF.map((staff) => (
                      <button
                        key={staff}
                        type="button"
                        onClick={() => {
                          setAssignedTo(staff);
                          if (status === 'OPEN') setStatus('ASSIGNED');
                        }}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 text-[11px] font-medium"
                      >
                        {staff}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full mt-2 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-2xs disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Updating...' : 'Save Resolution Updates'}</span>
                </button>
              </form>
            </div>
          )}

          {/* Society Emergency Contacts Card */}
          <div className="bg-slate-50/80 rounded-xl border border-slate-200/80 p-4 text-xs space-y-1.5 text-slate-500">
            <span className="font-semibold text-slate-700 uppercase tracking-wider text-[10px] block">
              Emergency Society Contacts
            </span>
            <p>• Security Gate: +91 98200 11223</p>
            <p>• Society Electrician: +91 98200 44556</p>
            <p>• Lift Helpline: 1800 209 5438</p>
          </div>
        </div>
      </div>

      {/* Committee Staff Assignment Modal */}
      <AssignStaffModal
        isOpen={isAssignModalOpen}
        complaint={complaint}
        onClose={() => setIsAssignModalOpen(false)}
        onAssign={handleAssignStaff}
      />
    </div>
  );
};

export default ComplaintDetails;

