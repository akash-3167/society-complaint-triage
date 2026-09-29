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
  Building,
  Save
} from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import UrgencyBadge from '../components/UrgencyBadge';
import CategoryBadge from '../components/CategoryBadge';
import LoadingState from '../components/LoadingState';

export const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [clusteredComplaints, setClusteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Form edit states for committee resolution
  const [status, setStatus] = useState('OPEN');
  const [assignedTo, setAssignedTo] = useState('');
  const [successNotice, setSuccessNotice] = useState(null);

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
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900">Complaint Not Found</h2>
        <p className="text-sm text-slate-500 mt-1">{error || 'The requested complaint ticket does not exist.'}</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg"
        >
          Return Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Complaints</span>
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition"
          title="Delete Complaint"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Ticket</span>
        </button>
      </div>

      {successNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Main Ticket Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Complaint Details & AI Triage */}
        <div className="lg:col-span-2 space-y-6">
          {/* Core Ticket Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  {complaint.id}
                </span>
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Home className="w-3.5 h-3.5 text-slate-400" />
                  Flat {complaint.flat_number}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <UrgencyBadge urgency={complaint.urgency} />
                <StatusBadge status={complaint.status} />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={complaint.category} />
              {complaint.language && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                  <Languages className="w-3.5 h-3.5 text-slate-400" />
                  Language: {complaint.language}
                </span>
              )}
              {complaint.cluster_id && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                  <Layers className="w-3.5 h-3.5" />
                  Cluster #{complaint.cluster_id}
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Resident Problem Description
              </h2>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 leading-relaxed font-sans">
                {complaint.description}
              </div>
            </div>

            {/* Resident & Timestamp Meta */}
            <div className="grid grid-cols-2 gap-4 pt-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-400" />
                <span>
                  Reported by: <strong className="text-slate-700">{complaint.resident_name}</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>
                  Logged on:{' '}
                  <strong className="text-slate-700">
                    {new Date(complaint.created_at).toLocaleString('en-IN')}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* AI Triage Analysis Card */}
          <div className="bg-gradient-to-br from-blue-50/70 via-indigo-50/50 to-white rounded-2xl border border-blue-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-600 text-white shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">AI Triage Analysis</h3>
                  <p className="text-[11px] text-slate-500">Isolated service analysis (Phase 1 Ready)</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-full">
                Phase 1 Preview
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-slate-600 block mb-1">AI Executive Summary:</span>
                <p className="text-slate-800 bg-white/80 p-3 rounded-lg border border-blue-100 italic">
                  "{complaint.ai_summary || 'Standard complaint registered.'}"
                </p>
              </div>

              <div>
                <span className="font-semibold text-slate-600 block mb-1">Recommended Action:</span>
                <p className="text-slate-800 bg-white/80 p-3 rounded-lg border border-blue-100 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{complaint.suggested_action || 'Assign volunteer to verify with resident.'}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Clustered Related Complaints if present */}
          {clusteredComplaints.length > 0 && (
            <div className="bg-white rounded-2xl border border-purple-200 p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                <Layers className="w-4 h-4 text-purple-600" />
                <span>Related Complaints in Same Cluster (#{complaint.cluster_id})</span>
              </div>
              <p className="text-xs text-slate-500">
                These flats reported similar issues in the same area. Resolving this issue will likely resolve all linked tickets.
              </p>

              <div className="divide-y divide-slate-100">
                {clusteredComplaints.map((c) => (
                  <div key={c.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-900">Flat {c.flat_number}</span> &bull; {c.resident_name}
                      <p className="text-slate-500 line-clamp-1 text-[11px] mt-0.5">{c.description}</p>
                    </div>
                    <Link
                      to={`/complaints/${c.id}`}
                      className="text-blue-600 hover:text-blue-800 font-semibold px-2 py-1 rounded bg-blue-50"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Committee Action Workflow */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Committee Resolution Workflow</h3>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1" htmlFor="statusSelect">
                  Ticket Status
                </label>
                <select
                  id="statusSelect"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-blue-500"
                >
                  <option value="OPEN">OPEN (Unassigned)</option>
                  <option value="ASSIGNED">ASSIGNED (Staff dispatched)</option>
                  <option value="IN_PROGRESS">IN_PROGRESS (Under repair)</option>
                  <option value="RESOLVED">RESOLVED (Closed)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1" htmlFor="assignedInput">
                  Assigned Personnel / Agency
                </label>
                <input
                  id="assignedInput"
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="e.g. Ramesh (Plumber), Johnson Lifts"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Quick staff picker helpers */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-medium text-slate-400 block">Quick Assign Staff:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Ramesh (Plumber)', 'Suresh (Electrician)', 'Johnson Lifts AMC', 'Housekeeping Lead'].map((staff) => (
                    <button
                      key={staff}
                      type="button"
                      onClick={() => setAssignedTo(staff)}
                      className="px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 text-[11px]"
                    >
                      {staff.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full mt-3 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Updating...' : 'Save Resolution Updates'}</span>
              </button>
            </form>
          </div>

          {/* Society Contact Quick Card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-xs space-y-2 text-slate-600">
            <span className="font-semibold text-slate-800 uppercase tracking-wider text-[11px] block">
              Emergency Society Contacts
            </span>
            <p>&bull; Security Gate 1: +91 98200 11223</p>
            <p>&bull; Society Electrician: +91 98200 44556</p>
            <p>&bull; Lift Emergency Helpline: 1800 209 5438</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
