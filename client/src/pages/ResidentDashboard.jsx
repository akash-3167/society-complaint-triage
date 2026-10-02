import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  Building,
  Info
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ComplaintCard from '../components/ComplaintCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import DashboardStat from '../components/DashboardStat';

export const ResidentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const flatNumber = user?.flat || 'B-402';

  const fetchResidentComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      {/* Welcome & Top Action Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Resident Portal
            </span>
            <span className="text-xs text-slate-400 font-medium">Green Meadows CHS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Welcome, {user?.name || 'Resident'}
          </h1>
          <p className="text-sm text-slate-500 mt-1 flex items-center flex-wrap gap-2">
            <span>Registered Flat:</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md font-semibold text-xs bg-slate-100 text-slate-800 border border-slate-200">
              {flatNumber}
            </span>
            <span className="text-slate-300">&bull;</span>
            <span>Lodge and track your maintenance issues with automated AI triage.</span>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={fetchResidentComplaints}
            className="p-2.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 text-slate-600 transition shadow-2xs hover:border-slate-300"
            title="Refresh Complaints"
            aria-label="Refresh Complaints"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
          
          <Link
            to="/submit"
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow-xs hover:shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Complaint</span>
          </Link>
        </div>
      </div>

      {/* AI Assistance Tip Box */}
      <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50/50 border border-blue-100/80 rounded-xl p-4 sm:p-4.5 flex items-start gap-3 shadow-2xs">
        <div className="p-1.5 rounded-lg bg-blue-100/70 text-blue-600 shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          <strong className="text-blue-900 font-semibold">Write in Hindi, English, or Hinglish: </strong>
          No need to format complaints or choose technical categories. The AI triage engine automatically assesses urgency, detects affected services, generates structured summaries, and links issues to ongoing society clusters.
        </div>
      </div>

      {/* Quick Resident Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <DashboardStat
          title="Open / Assigned"
          value={myOpen}
          icon={Clock}
          color="indigo"
          subtitle={`Awaiting resolution for ${flatNumber}`}
        />
        <DashboardStat
          title="In Progress"
          value={myInProgress}
          icon={RefreshCw}
          color="amber"
          subtitle="Staff currently working"
        />
        <DashboardStat
          title="Resolved"
          value={myResolved}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Closed & verified"
        />
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200/80 rounded-xl text-red-700 text-sm flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchResidentComplaints}
            className="text-xs font-semibold text-red-800 underline hover:text-red-950"
          >
            Retry
          </button>
        </div>
      )}

      {/* Recent Complaints Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">My Flat Complaints</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {myComplaints.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Issues registered for Flat {flatNumber}
            </p>
          </div>
          {myComplaints.length > 0 && (
            <Link
              to="/my-complaints"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </Link>
          )}
        </div>

        {loading ? (
          <LoadingState type="skeleton" />
        ) : myComplaints.length === 0 ? (
          <EmptyState
            title={`No complaints logged for Flat ${flatNumber}`}
            description="Have an issue with water, plumbing, lift, electricals, or cleanliness? Lodge a new complaint and the managing committee will be alerted immediately."
            actionText="Submit Complaint"
            onAction={() => navigate('/submit')}
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
      <div className="space-y-4 pt-6 border-t border-slate-200/80">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-400" />
              <h2 className="text-base font-bold text-slate-900">Recent Society Notices & Complaints</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Transparency feed: View recently reported society issues to avoid duplicate filings
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
