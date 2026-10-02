import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  RefreshCw, 
  ArrowLeft,
  X,
  SlidersHorizontal,
  AlertTriangle
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ComplaintCard from '../components/ComplaintCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

export const MyComplaints = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const flatNumber = user?.flat || 'B-402';

  const loadComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getComplaints();
      setComplaints(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  // Filter for this flat
  const myFlatComplaints = complaints.filter(
    (c) => c.flat_number && c.flat_number.toLowerCase() === flatNumber.toLowerCase()
  );

  // Status counts for this flat
  const countAll = myFlatComplaints.length;
  const countOpen = myFlatComplaints.filter((c) => c.status === 'OPEN' || c.status === 'ASSIGNED').length;
  const countProgress = myFlatComplaints.filter((c) => c.status === 'IN_PROGRESS').length;
  const countResolved = myFlatComplaints.filter((c) => c.status === 'RESOLVED').length;

  // Apply subfilters
  const filtered = myFlatComplaints.filter((c) => {
    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'OPEN'
        ? c.status === 'OPEN' || c.status === 'ASSIGNED'
        : c.status === statusFilter;

    const matchesSearch =
      !searchTerm ||
      (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.id && c.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.category && c.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.summary && c.summary.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Link
              to="/resident"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Resident Portal</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              Flat {flatNumber}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            My Lodged Complaints
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Complete history of all maintenance tickets filed for Flat {flatNumber}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadComplaints}
            className="p-2.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 text-slate-600 transition shadow-2xs hover:border-slate-300"
            title="Refresh Complaints"
            aria-label="Refresh Complaints"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
          
          <Link
            to="/submit"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow-xs hover:shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Complaint</span>
          </Link>
        </div>
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
            onClick={loadComplaints}
            className="text-xs font-semibold text-red-800 underline hover:text-red-950"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search complaints by keyword, issue summary, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50 hover:bg-white transition"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-2.5 p-0.5 text-slate-400 hover:text-slate-600"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Buttons with Counts */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'All', count: countAll },
            { id: 'OPEN', label: 'Open', count: countOpen },
            { id: 'IN_PROGRESS', label: 'In Progress', count: countProgress },
            { id: 'RESOLVED', label: 'Resolved', count: countResolved }
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-blue-700/80 text-white'
                      : 'bg-slate-200/80 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Complaints List */}
      {loading ? (
        <LoadingState type="skeleton" />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No complaints matching criteria"
          description={
            searchTerm
              ? `No complaints matched "${searchTerm}". Try resetting your search filter.`
              : `You don't have any ${statusFilter !== 'ALL' ? statusFilter.toLowerCase().replace('_', ' ') : ''} complaints recorded for Flat ${flatNumber}.`
          }
          actionText="Submit New Complaint"
          onAction={() => navigate('/submit')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              isCommitteeView={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
