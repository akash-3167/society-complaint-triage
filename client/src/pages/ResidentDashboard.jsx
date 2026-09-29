import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Sparkles, 
  HelpCircle, 
  Home, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ComplaintCard from '../components/ComplaintCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import DashboardStat from '../components/DashboardStat';

export const ResidentDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const flatNumber = user?.flat || 'B-402';

  const fetchResidentComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch all complaints, and highlight/focus on resident flat
      const data = await api.getComplaints();
      setComplaints(data);
    } catch (err) {
      setError(err.message || 'Unable to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidentComplaints();
  }, []);

  // Filter complaints related to this resident's flat
  const myComplaints = complaints.filter(
    (c) => c.flat_number && c.flat_number.toLowerCase() === flatNumber.toLowerCase()
  );

  const myOpen = myComplaints.filter((c) => c.status === 'OPEN' || c.status === 'ASSIGNED').length;
  const myInProgress = myComplaints.filter((c) => c.status === 'IN_PROGRESS').length;
  const myResolved = myComplaints.filter((c) => c.status === 'RESOLVED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Top Action Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Resident Portal
            </span>
            <span className="text-xs text-slate-500">Green Meadows CHS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Welcome, {user?.name || 'Resident'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Registered Flat: <strong className="text-slate-800">{flatNumber}</strong> &bull; Lodge and track your maintenance issues seamlessly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={fetchResidentComplaints}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
            title="Refresh Complaints"
            aria-label="Refresh Complaints"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
          
          <Link
            to="/submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Complaint</span>
          </Link>
        </div>
      </div>

      {/* AI Assistance Tip Box */}
      <div className="bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border border-blue-100 rounded-xl p-4 sm:p-5 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          <strong className="text-blue-900 font-semibold">Messy or Hinglish complaint? No problem! </strong>
          You can write in English, Hindi, or Hinglish. Our AI triage system will automatically evaluate urgency, detect category, and link related issues across society flats.
        </div>
      </div>

      {/* Quick Resident Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <DashboardStat
          title="Open / Assigned"
          value={myOpen}
          icon={Clock}
          color="indigo"
          subtitle={`For flat ${flatNumber}`}
        />
        <DashboardStat
          title="In Progress"
          value={myInProgress}
          icon={RefreshCw}
          color="amber"
          subtitle="Work underway"
        />
        <DashboardStat
          title="Resolved"
          value={myResolved}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Closed issues"
        />
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchResidentComplaints}
            className="text-xs font-semibold underline hover:text-red-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* Recent Complaints Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">My Flat Complaints</h2>
            <p className="text-xs text-slate-500">
              Showing complaints registered for Flat {flatNumber}
            </p>
          </div>
          <Link
            to="/my-complaints"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingState type="skeleton" />
        ) : myComplaints.length === 0 ? (
          <EmptyState
            title={`No complaints logged for Flat ${flatNumber}`}
            description="Have an issue with water, lift, parking, or cleanliness? Lodge a new complaint and the managing committee will be alerted."
            actionText="Submit Complaint"
            onAction={() => window.location.href = '/submit'}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myComplaints.slice(0, 6).map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                isCommitteeView={false}
              />
            ))}
          </div>
        )}
      </div>

      {/* Society Recent Activity / Community Awareness */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">Recent Society Notices & Complaints</h2>
            <p className="text-xs text-slate-500">
              Transparency feed: Recent public issues reported in society
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingState message="Fetching society feed..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {complaints.slice(0, 3).map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                isCommitteeView={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResidentDashboard;
