import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertCircle, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Layers, 
  Search, 
  Filter, 
  RefreshCw, 
  LayoutGrid, 
  List, 
  ArrowUpDown,
  Download,
  Building,
  Sparkles,
  UserCheck
} from 'lucide-react';
import api from '../services/api';
import DashboardStat from '../components/DashboardStat';
import ComplaintCard from '../components/ComplaintCard';
import StatusBadge from '../components/StatusBadge';
import UrgencyBadge from '../components/UrgencyBadge';
import CategoryBadge from '../components/CategoryBadge';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import Sidebar from '../components/Sidebar';

export const CommitteeDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    high: 0,
    open: 0,
    assigned: 0,
    inProgress: 0,
    resolved: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch complaints and summary stats concurrently
      const [complaintsData, statsData] = await Promise.all([
        api.getComplaints(),
        api.getStats()
      ]);

      setComplaints(complaintsData);
      setStats(statsData);
    } catch (err) {
      setError(err.message || 'Failed to load committee data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Quick status update handler for committee members
  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await api.updateComplaint(id, { status: newStatus });
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: updated.status } : c))
      );
      // Refresh statistics
      const newStats = await api.getStats();
      setStats(newStats);
    } catch (err) {
      alert(`Could not update status: ${err.message}`);
    }
  };

  // Filter complaints client-side for ultra-fast UI response
  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
    const matchesUrgency = urgencyFilter === 'ALL' || c.urgency === urgencyFilter;

    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      (c.description && c.description.toLowerCase().includes(q)) ||
      (c.resident_name && c.resident_name.toLowerCase().includes(q)) ||
      (c.flat_number && c.flat_number.toLowerCase().includes(q)) ||
      (c.id && c.id.toLowerCase().includes(q)) ||
      (c.ai_summary && c.ai_summary.toLowerCase().includes(q));

    return matchesStatus && matchesCategory && matchesUrgency && matchesSearch;
  });

  // Handle quick click from sidebar or stat cards
  const handleQuickStatClick = (filterType, value) => {
    if (filterType === 'urgency') {
      setUrgencyFilter(value);
      setStatusFilter('ALL');
    } else if (filterType === 'status') {
      setStatusFilter(value);
      setUrgencyFilter('ALL');
    } else if (filterType === 'all') {
      setStatusFilter('ALL');
      setUrgencyFilter('ALL');
      setCategoryFilter('ALL');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar with Society Overview & Quick Views */}
      <Sidebar
        stats={stats}
        activeFilter={statusFilter !== 'ALL' ? statusFilter : urgencyFilter !== 'ALL' ? urgencyFilter : 'ALL'}
        onFilterChange={(f) => {
          if (f === 'CRITICAL') {
            setUrgencyFilter('CRITICAL');
            setStatusFilter('ALL');
          } else {
            setStatusFilter(f);
            setUrgencyFilter('ALL');
          }
        }}
      />

      {/* Main Dashboard Workspace */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Committee Portal
              </span>
              <span className="text-xs text-slate-500">Managing Committee Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Complaint Triage Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Triage, monitor urgency, assign staff, and track resolution across 104 society flats.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadData}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition shadow-xs"
              title="Refresh data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
              <span>Refresh</span>
            </button>

            <Link
              to="/submit"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm"
            >
              <span>+ Log Complaint</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Statistics Cards per Requirements:
            - Total complaints
            - Critical complaints
            - High priority complaints
            - Open complaints
            - Resolved complaints
        */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          <DashboardStat
            title="Total Complaints"
            value={stats.total}
            color="slate"
            subtitle="All logged tickets"
            active={statusFilter === 'ALL' && urgencyFilter === 'ALL'}
            onClick={() => handleQuickStatClick('all')}
          />
          <DashboardStat
            title="Critical Urgency"
            value={stats.critical}
            icon={AlertCircle}
            color="red"
            subtitle="Immediate action"
            active={urgencyFilter === 'CRITICAL'}
            onClick={() => handleQuickStatClick('urgency', 'CRITICAL')}
          />
          <DashboardStat
            title="High Priority"
            value={stats.high}
            icon={AlertTriangle}
            color="amber"
            subtitle="Elevated concern"
            active={urgencyFilter === 'HIGH'}
            onClick={() => handleQuickStatClick('urgency', 'HIGH')}
          />
          <DashboardStat
            title="Open / Unassigned"
            value={stats.open}
            icon={Clock}
            color="indigo"
            subtitle="Requires triage"
            active={statusFilter === 'OPEN'}
            onClick={() => handleQuickStatClick('status', 'OPEN')}
          />
          <DashboardStat
            title="Resolved"
            value={stats.resolved}
            icon={CheckCircle2}
            color="emerald"
            subtitle="Closed tickets"
            active={statusFilter === 'RESOLVED'}
            onClick={() => handleQuickStatClick('status', 'RESOLVED')}
          />
        </div>

        {/* Filters and Search Control Panel */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3.5">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by keywords, flat (e.g. B-402), resident name, or issue..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1.5 self-end md:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-lg border transition ${
                  viewMode === 'cards'
                    ? 'bg-slate-100 border-slate-300 text-blue-700'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
                title="Card View"
                aria-label="Card View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg border transition ${
                  viewMode === 'table'
                    ? 'bg-slate-100 border-slate-300 text-blue-700'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
                title="Table View"
                aria-label="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Filters:
            </span>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:ring-1 focus:ring-blue-500"
              aria-label="Filter by Status"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:ring-1 focus:ring-blue-500"
              aria-label="Filter by Category"
            >
              <option value="ALL">All Categories</option>
              <option value="WATER">Water Supply</option>
              <option value="LIFT">Lift / Elevator</option>
              <option value="PARKING">Parking</option>
              <option value="NOISE">Noise</option>
              <option value="CLEANING">Cleaning</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="OTHER">Other</option>
            </select>

            {/* Urgency Filter */}
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:ring-1 focus:ring-blue-500"
              aria-label="Filter by Urgency"
            >
              <option value="ALL">All Urgencies</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            {/* Reset Filters */}
            {(statusFilter !== 'ALL' || categoryFilter !== 'ALL' || urgencyFilter !== 'ALL' || searchTerm) && (
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('ALL');
                  setCategoryFilter('ALL');
                  setUrgencyFilter('ALL');
                  setSearchTerm('');
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium underline ml-auto"
              >
                Reset Filters
              </button>
            )}

            <div className="ml-auto text-[11px] text-slate-500 font-medium">
              Showing {filteredComplaints.length} of {complaints.length} complaints
            </div>
          </div>
        </div>

        {/* Content Render: Cards View or Table View */}
        {loading ? (
          <LoadingState type="skeleton" />
        ) : filteredComplaints.length === 0 ? (
          <EmptyState
            title="No complaints match filters"
            description="Try changing the category, urgency, or status filters above."
            actionText="Reset All Filters"
            onAction={() => {
              setStatusFilter('ALL');
              setCategoryFilter('ALL');
              setUrgencyFilter('ALL');
              setSearchTerm('');
            }}
          />
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredComplaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                isCommitteeView={true}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] font-semibold uppercase text-slate-500 border-b border-slate-200">
                  <tr>
                    <th scope="col" className="px-4 py-3">Flat & Resident</th>
                    <th scope="col" className="px-4 py-3">Category</th>
                    <th scope="col" className="px-4 py-3">Urgency</th>
                    <th scope="col" className="px-4 py-3">Description & AI Triage</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                    <th scope="col" className="px-4 py-3">Cluster</th>
                    <th scope="col" className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredComplaints.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/75 transition">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">Flat {c.flat_number}</div>
                        <div className="text-[11px] text-slate-500">{c.resident_name}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <CategoryBadge category={c.category} size="sm" />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <UrgencyBadge urgency={c.urgency} size="sm" />
                      </td>
                      <td className="px-4 py-3 max-w-sm">
                        <div className="text-slate-800 line-clamp-1" title={c.description}>
                          {c.description}
                        </div>
                        {(c.ai_summary || c.summary) && (
                          <div className="text-[11px] text-blue-700 italic flex items-center gap-1 line-clamp-1 mt-0.5" title={c.ai_summary || c.summary}>
                            <Sparkles className="w-3 h-3 text-blue-500 shrink-0" />
                            <span>{c.ai_summary || c.summary}</span>
                          </div>
                        )}
                        {c.suggested_action && (
                          <div className="text-[10px] text-emerald-700 flex items-center gap-1 line-clamp-1 mt-0.5" title={c.suggested_action}>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>Action: {c.suggested_action}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <select
                          value={c.status}
                          onChange={(e) => handleStatusChange(c.id, e.target.value)}
                          className="px-2 py-1 text-xs border border-slate-300 rounded bg-white text-slate-700"
                        >
                          <option value="OPEN">OPEN</option>
                          <option value="ASSIGNED">ASSIGNED</option>
                          <option value="IN_PROGRESS">IN_PROGRESS</option>
                          <option value="RESOLVED">RESOLVED</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {c.cluster_id ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                            <Layers className="w-3 h-3" />
                            {c.cluster_id}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <Link
                          to={`/complaints/${c.id}`}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CommitteeDashboard;
