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
  UserCheck,
  UserPlus
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
import AssignStaffModal from '../components/AssignStaffModal';
import { SOCIETY_STAFF } from '../constants/staff';

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

  const [clusters, setClusters] = useState([]);
  const [selectedClusterId, setSelectedClusterId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [assigningComplaint, setAssigningComplaint] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch complaints, summary stats, and clusters concurrently
      const [complaintsData, statsData, clustersData] = await Promise.all([
        api.getComplaints(),
        api.getStats(),
        api.getClusters()
      ]);

      setComplaints(complaintsData);
      setStats(statsData);
      setClusters(clustersData || []);
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
        prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
      );
      // Refresh statistics & clusters
      const [newStats, newClusters] = await Promise.all([
        api.getStats(),
        api.getClusters()
      ]);
      setStats(newStats);
      setClusters(newClusters || []);
    } catch (err) {
      alert(`Could not update status: ${err.message}`);
    }
  };

  // Staff assignment handler for committee members
  const handleAssign = async (id, staffName) => {
    try {
      const current = complaints.find((c) => c.id === id);
      const newStatus = (!current?.status || current?.status === 'OPEN') && staffName ? 'ASSIGNED' : current?.status;
      const updated = await api.updateComplaint(id, {
        assigned_to: staffName || null,
        status: newStatus
      });
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
      );
      // Refresh statistics & clusters
      const [newStats, newClusters] = await Promise.all([
        api.getStats(),
        api.getClusters()
      ]);
      setStats(newStats);
      setClusters(newClusters || []);
      return updated;
    } catch (err) {
      alert(`Could not assign staff: ${err.message}`);
      throw err;
    }
  };

  // Filter complaints client-side for ultra-fast UI response
  const selectedCluster = clusters.find((cl) => cl.cluster_id === selectedClusterId);
  const filteredComplaints = complaints.filter((c) => {
    const matchesCluster =
      !selectedClusterId ||
      c.cluster_id === selectedClusterId ||
      (selectedCluster && selectedCluster.complaint_ids && selectedCluster.complaint_ids.includes(c.id));
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

    return matchesCluster && matchesStatus && matchesCategory && matchesUrgency && matchesSearch;
  });

  // Handle quick click from sidebar or stat cards
  const handleQuickStatClick = (filterType, value) => {
    setSelectedClusterId(null);
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

        {/* COMPLAINT CLUSTERS (Phase 3 Rule-Based Grouping) */}
        {clusters.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Complaint Clusters
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                      {clusters.length} Active {clusters.length === 1 ? 'Cluster' : 'Clusters'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Recognize systemic issues affecting multiple residents in one place
                  </p>
                </div>
              </div>

              {selectedClusterId && (
                <button
                  type="button"
                  onClick={() => setSelectedClusterId(null)}
                  className="text-xs text-purple-700 hover:text-purple-900 font-semibold underline"
                >
                  Show All Complaints
                </button>
              )}
            </div>

            {/* Clusters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clusters.map((cluster) => {
                const isSelected = selectedClusterId === cluster.cluster_id;
                const isCritical = cluster.urgency === 'CRITICAL';
                const isHigh = cluster.urgency === 'HIGH';

                // Dot indicator color
                const dotColor = isCritical
                  ? 'bg-red-500'
                  : isHigh
                  ? 'bg-amber-500'
                  : 'bg-blue-500';

                return (
                  <div
                    key={cluster.cluster_id}
                    className={`rounded-xl border p-4 transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-purple-500 ring-2 ring-purple-100 bg-purple-50/20 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/30'
                    }`}
                  >
                    <div>
                      {/* Top Row: Category + Location and Urgency */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-bold text-xs tracking-wider text-slate-900 uppercase flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${dotColor} ${isCritical ? 'animate-pulse' : ''}`} />
                          {cluster.category} {cluster.title.includes('Wing') ? `— ${cluster.title.split(' ')[0]}` : cluster.title.includes('Tower') ? `— ${cluster.title.split(' ')[0]} ${cluster.title.split(' ')[1]}` : ''}
                        </span>
                        <UrgencyBadge urgency={cluster.urgency} size="sm" />
                      </div>

                      {/* Complaint count & title */}
                      <p className="text-xs font-semibold text-slate-600">
                        {cluster.complaint_count} related complaints
                      </p>
                      <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                        {cluster.title}
                      </h3>

                      {/* Affected flats list */}
                      {cluster.affected_flats && cluster.affected_flats.length > 0 && (
                        <div className="mt-2.5 text-xs text-slate-600 flex items-center flex-wrap gap-1">
                          <span className="text-[11px] text-slate-400 font-medium mr-0.5">Flats:</span>
                          <span className="font-medium text-slate-800">
                            {cluster.affected_flats.join(' • ')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Footer Button: View Complaints */}
                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-400">
                        #{cluster.cluster_id}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedClusterId(isSelected ? null : cluster.cluster_id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                          isSelected
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-white border border-slate-300 text-slate-700 hover:border-purple-300 hover:text-purple-700'
                        }`}
                      >
                        {isSelected ? 'Viewing Filtered' : 'View Complaints'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Cluster Filter Indicator Banner */}
        {selectedClusterId && (
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-between text-xs text-purple-900">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>
                Filtered by Cluster: <strong>{selectedClusterId}</strong> ({filteredComplaints.length} tickets matching)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedClusterId(null)}
              className="text-xs font-bold text-purple-700 hover:text-purple-900 underline"
            >
              Show All Complaints
            </button>
          </div>
        )}

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

          {/* Quick Status Filter Tabs (Phase 4 Workflow) */}
          <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
              Workflow Status:
            </span>
            {[
              { id: 'ALL', label: 'ALL' },
              { id: 'OPEN', label: 'OPEN' },
              { id: 'ASSIGNED', label: 'ASSIGNED' },
              { id: 'IN_PROGRESS', label: 'IN PROGRESS' },
              { id: 'RESOLVED', label: 'RESOLVED' }
            ].map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-600'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
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
            {(statusFilter !== 'ALL' || categoryFilter !== 'ALL' || urgencyFilter !== 'ALL' || searchTerm || selectedClusterId) && (
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('ALL');
                  setCategoryFilter('ALL');
                  setUrgencyFilter('ALL');
                  setSearchTerm('');
                  setSelectedClusterId(null);
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
              setSelectedClusterId(null);
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
                onAssign={handleAssign}
                onOpenAssign={setAssigningComplaint}
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
                    <th scope="col" className="px-4 py-3">Assigned To</th>
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
                        {c.assigned_to ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-800">{c.assigned_to}</span>
                            <button
                              type="button"
                              onClick={() => setAssigningComplaint(c)}
                              className="text-[11px] text-blue-600 hover:text-blue-800 underline font-medium"
                              title="Reassign staff"
                            >
                              (change)
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setAssigningComplaint(c)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition shadow-2xs"
                            title="Assign staff to this complaint"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Assign Staff</span>
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <select
                            value={c.status}
                            onChange={(e) => handleStatusChange(c.id, e.target.value)}
                            className={`px-2 py-1 text-xs border rounded font-semibold focus:ring-1 focus:ring-blue-500 ${
                              c.status === 'RESOLVED'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : c.status === 'IN_PROGRESS'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : c.status === 'ASSIGNED'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-white text-slate-700 border-slate-300'
                            }`}
                          >
                            <option value="OPEN">OPEN</option>
                            <option value="ASSIGNED">ASSIGNED</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="RESOLVED">RESOLVED</option>
                          </select>
                          {c.status === 'RESOLVED' && (
                            <span className="text-emerald-600 font-bold text-xs" title="Resolved">
                              ✓
                            </span>
                          )}
                        </div>
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
                        {(!c.assigned_to || c.status === 'OPEN') && (
                          <button
                            type="button"
                            onClick={() => setAssigningComplaint(c)}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 mr-2.5 inline-flex items-center gap-1"
                            title="Assign staff"
                          >
                            <UserPlus className="w-3 h-3" />
                            <span>Assign</span>
                          </button>
                        )}
                        <Link
                          to={`/complaints/${c.id}`}
                          className="text-xs font-semibold text-slate-600 hover:text-slate-900"
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

        {/* Committee Staff Assignment Modal */}
        <AssignStaffModal
          isOpen={!!assigningComplaint}
          complaint={assigningComplaint}
          onClose={() => setAssigningComplaint(null)}
          onAssign={handleAssign}
        />
      </main>
    </div>
  );
};

export default CommitteeDashboard;
