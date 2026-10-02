import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Sparkles,
  UserPlus,
  X
} from 'lucide-react';
import api from '../services/api';
import DashboardStat from '../components/DashboardStat';
import ComplaintCard from '../components/ComplaintCard';
import UrgencyBadge from '../components/UrgencyBadge';
import CategoryBadge from '../components/CategoryBadge';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import Sidebar from '../components/Sidebar';
import AssignStaffModal from '../components/AssignStaffModal';

export const CommitteeDashboard = () => {
  const location = useLocation();
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

  // Smooth scroll to anchor if hash is present
  useEffect(() => {
    if (location.hash) {
      const timer = setTimeout(() => {
        const id = location.hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location.hash]);

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
    <div className="flex min-h-[calc(100vh-3.75rem)] bg-slate-50/50">
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
              <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                Managing Committee
              </span>
              <span className="text-xs text-slate-400">Green Meadows CHS • 104 Flats</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Complaint Triage Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Review incoming issues, evaluate automated AI triage, link clusters, and assign staff.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={loadData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition shadow-2xs"
              title="Refresh data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
              <span>Refresh</span>
            </button>

            <Link
              to="/submit"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition shadow-2xs"
            >
              <span>+ Log Complaint</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Statistics KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-3.5">
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
          <div id="clusters" className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-indigo-50 text-indigo-600">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Complaint Clusters
                    </h2>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                      {clusters.length} Active {clusters.length === 1 ? 'Cluster' : 'Clusters'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Systemic issues automatically grouped across multiple flats
                  </p>
                </div>
              </div>

              {selectedClusterId && (
                <button
                  type="button"
                  onClick={() => setSelectedClusterId(null)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
                >
                  Clear Cluster Filter
                </button>
              )}
            </div>

            {/* Clusters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {clusters.map((cluster) => {
                const isSelected = selectedClusterId === cluster.cluster_id;
                const relatedComplaints = complaints.filter(
                  (c) => c.cluster_id === cluster.cluster_id || (cluster.complaint_ids && cluster.complaint_ids.includes(c.id))
                );

                return (
                  <div
                    key={cluster.cluster_id}
                    className={`rounded-xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-500 ring-2 ring-indigo-500/15 bg-indigo-50/20 shadow-xs'
                        : 'border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50/50 shadow-2xs'
                    }`}
                  >
                    <div className="space-y-2.5">
                      {/* Top Row: Category + Urgency */}
                      <div className="flex items-center justify-between gap-2">
                        <CategoryBadge category={cluster.category} size="sm" />
                        <UrgencyBadge urgency={cluster.urgency} size="sm" />
                      </div>

                      {/* Complaint count & title */}
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-snug">
                          {cluster.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 flex items-center flex-wrap gap-1.5">
                          <span className="font-semibold text-indigo-700">
                            {cluster.complaint_count || relatedComplaints.length}
                          </span>
                          <span>related complaints</span>
                          {cluster.affected_flats && cluster.affected_flats.length > 0 && (
                            <>
                              <span className="text-slate-300">&bull;</span>
                              <span className="text-slate-600 truncate">
                                Flats: {cluster.affected_flats.join(', ')}
                              </span>
                            </>
                          )}
                        </p>
                      </div>

                      {/* Related Complaints List Preview */}
                      {relatedComplaints.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 space-y-1.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Related Complaints
                          </p>
                          <div className="space-y-1">
                            {relatedComplaints.slice(0, 2).map((rc) => (
                              <div
                                key={rc.id}
                                className="text-[11px] text-slate-600 bg-slate-50/80 rounded px-2 py-1 border border-slate-100 flex items-center justify-between gap-2"
                              >
                                <span className="font-semibold text-slate-800 shrink-0">
                                  {rc.flat_number || 'Flat'}:
                                </span>
                                <span className="truncate text-slate-500">
                                  {rc.summary || rc.description}
                                </span>
                                <span className="text-[9px] font-mono text-slate-400 shrink-0">
                                  #{rc.id.slice(0, 4)}
                                </span>
                              </div>
                            ))}
                            {relatedComplaints.length > 2 && (
                              <p className="text-[10px] text-slate-400 italic">
                                +{relatedComplaints.length - 2} more flat reports
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer Button: View Complaints */}
                    <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400">
                        #{cluster.cluster_id}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedClusterId(isSelected ? null : cluster.cluster_id)}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-2xs hover:bg-indigo-700'
                            : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200'
                        }`}
                      >
                        {isSelected ? 'Viewing Filtered' : 'Filter Complaints'}
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
          <div className="p-3 bg-indigo-50/80 border border-indigo-200/80 rounded-xl flex items-center justify-between text-xs text-indigo-900">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>
                Filtered by Cluster: <strong>{selectedClusterId}</strong> ({filteredComplaints.length} tickets matching)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedClusterId(null)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900 hover:underline"
            >
              <X className="w-3.5 h-3.5" />
              <span>Show All</span>
            </button>
          </div>
        )}

        {/* Filters and Search Control Toolbar */}
        <div id="complaints" className="bg-white rounded-xl border border-slate-200/90 p-3.5 sm:p-4 shadow-2xs space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by keywords, flat (e.g. B-402), resident name, or issue..."
                className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50 placeholder:text-slate-400"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 self-end md:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg border transition ${
                  viewMode === 'cards'
                    ? 'bg-slate-100 border-slate-300 text-blue-700'
                    : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                }`}
                title="Card View"
                aria-label="Card View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg border transition ${
                  viewMode === 'table'
                    ? 'bg-slate-100 border-slate-300 text-blue-700'
                    : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                }`}
                title="Table View"
                aria-label="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Status Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'ALL', label: 'All' },
                { id: 'OPEN', label: 'Open' },
                { id: 'ASSIGNED', label: 'Assigned' },
                { id: 'IN_PROGRESS', label: 'In Progress' },
                { id: 'RESOLVED', label: 'Resolved' }
              ].map((tab) => {
                const isActive = statusFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setStatusFilter(tab.id)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              
              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2 py-1 rounded-md border border-slate-200 bg-white text-slate-700 text-xs font-medium focus:ring-1 focus:ring-blue-500"
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
                className="px-2 py-1 rounded-md border border-slate-200 bg-white text-slate-700 text-xs font-medium focus:ring-1 focus:ring-blue-500"
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
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline ml-1"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Complaints Count Subtitle */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            Showing <strong className="text-slate-700 font-semibold">{filteredComplaints.length}</strong> of {complaints.length} tickets
          </span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] font-semibold uppercase text-slate-400 border-b border-slate-200">
                  <tr>
                    <th scope="col" className="px-4 py-3">Flat & Resident</th>
                    <th scope="col" className="px-4 py-3">Category</th>
                    <th scope="col" className="px-4 py-3">Urgency</th>
                    <th scope="col" className="px-4 py-3">Description & AI Summary</th>
                    <th scope="col" className="px-4 py-3">Assigned To</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                    <th scope="col" className="px-4 py-3">Cluster</th>
                    <th scope="col" className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredComplaints.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">Flat {c.flat_number}</div>
                        <div className="text-[11px] text-slate-400">{c.resident_name}</div>
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
                          <div className="text-[11px] text-slate-500 italic flex items-center gap-1 line-clamp-1 mt-0.5" title={c.ai_summary || c.summary}>
                            <Sparkles className="w-3 h-3 text-blue-500 shrink-0" />
                            <span>{c.ai_summary || c.summary}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {c.assigned_to ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-slate-800">{c.assigned_to}</span>
                            <button
                              type="button"
                              onClick={() => setAssigningComplaint(c)}
                              className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                              title="Reassign staff"
                            >
                              (change)
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setAssigningComplaint(c)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded text-blue-700 bg-blue-50 hover:bg-blue-100 transition"
                            title="Assign staff to this complaint"
                          >
                            <UserPlus className="w-3 h-3" />
                            <span>Assign</span>
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <select
                          value={c.status}
                          onChange={(e) => handleStatusChange(c.id, e.target.value)}
                          className={`px-2 py-1 text-[11px] border rounded-md font-semibold bg-white focus:ring-1 focus:ring-blue-500 ${
                            c.status === 'RESOLVED'
                              ? 'text-emerald-700 border-emerald-200 bg-emerald-50/50'
                              : c.status === 'IN_PROGRESS'
                              ? 'text-amber-700 border-amber-200 bg-amber-50/50'
                              : c.status === 'ASSIGNED'
                              ? 'text-blue-700 border-blue-200 bg-blue-50/50'
                              : 'text-slate-700 border-slate-200'
                          }`}
                        >
                          <option value="OPEN">OPEN</option>
                          <option value="ASSIGNED">ASSIGNED</option>
                          <option value="IN_PROGRESS">IN PROGRESS</option>
                          <option value="RESOLVED">RESOLVED</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {c.cluster_id ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded">
                            <Layers className="w-3 h-3" />
                            {c.cluster_id}
                          </span>
                        ) : (
                          <span className="text-slate-300 text-[11px]">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <Link
                          to={`/complaints/${c.id}`}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                        >
                          View Details
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

