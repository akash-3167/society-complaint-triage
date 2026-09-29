/**
 * Complaint Clustering Service (Phase 3 - Rule-Based Complaint Clustering)
 * 
 * Groups related housing society complaints by category, wing/tower location,
 * and issue context without external vector/embedding dependencies.
 */

const URGENCY_PRIORITY = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1
};

class ComplaintClusteringService {
  /**
   * Extract wing/tower location from flat number or description
   * @param {Object} complaint
   * @returns {string|null} - e.g. 'A', 'B', 'C', 'D'
   */
  extractWing(complaint) {
    if (!complaint) return null;

    // Check flat number first (e.g. B-402, A-701, C-104, D-303)
    const flat = (complaint.flat_number || '').trim().toUpperCase();
    const flatMatch = flat.match(/^([A-Z])[-_\s]?\d+/);
    if (flatMatch) {
      return flatMatch[1];
    }

    // Check description for explicit wing/tower mentions
    const desc = (complaint.description || '').toLowerCase();
    const descMatch = desc.match(/\b(?:tower|wing|block)\s*([a-d])\b/i) || desc.match(/\b([a-d])\s*(?:tower|wing|block)\b/i);
    if (descMatch) {
      return descMatch[1].toUpperCase();
    }

    return null;
  }

  /**
   * Determine highest urgency among a list of urgencies
   * Priority: CRITICAL > HIGH > MEDIUM > LOW
   * @param {Array<string>} urgencies
   * @returns {string}
   */
  getHighestUrgency(urgencies = []) {
    let highest = 'LOW';
    let maxPriority = 0;

    for (const u of urgencies) {
      const normalized = (u || 'LOW').toUpperCase();
      const p = URGENCY_PRIORITY[normalized] || 1;
      if (p > maxPriority) {
        maxPriority = p;
        highest = normalized;
      }
    }

    return highest;
  }

  /**
   * Generate a clear human-readable title for a cluster
   * @param {string} category
   * @param {string|null} wing
   * @returns {string}
   */
  generateClusterTitle(category, wing) {
    const wingPrefix = wing ? `${wing}-Wing ` : '';

    switch (category) {
      case 'WATER':
        return `${wingPrefix}Water Supply Disruption`;
      case 'LIFT':
        return wing ? `Tower ${wing} Lift Malfunction` : 'Lift Service Outage';
      case 'PARKING':
        return `${wingPrefix}Parking Obstruction / Violation`;
      case 'NOISE':
        return `${wingPrefix}Repeated Noise Disturbance`;
      case 'CLEANING':
        return `${wingPrefix}Sanitation / Garbage Clearance Issue`;
      case 'MAINTENANCE':
        return `${wingPrefix}Common Area Maintenance Issue`;
      default:
        return `${wingPrefix}Society Issue`;
    }
  }

  /**
   * Group all complaints into clusters and return structured cluster summaries
   * @param {Array<Object>} complaints - List of all complaints
   * @returns {Object} - { clusters: Array<ClusterDisplay>, unclusteredCount: number }
   */
  getClustersSummary(complaints = []) {
    if (!complaints || complaints.length === 0) {
      return { clusters: [], unclusteredCount: 0 };
    }

    // Map: cluster_key -> Array<Complaint>
    const groupMap = new Map();

    for (const complaint of complaints) {
      // 1. If complaint already has an explicit cluster_id, use that
      if (complaint.cluster_id) {
        const key = `explicit:${complaint.cluster_id}`;
        if (!groupMap.has(key)) {
          groupMap.set(key, {
            clusterId: complaint.cluster_id,
            category: complaint.category,
            wing: this.extractWing(complaint),
            complaints: []
          });
        }
        groupMap.get(key).complaints.push(complaint);
        continue;
      }

      // 2. Rule-based grouping by Category + Wing/Tower
      const wing = this.extractWing(complaint);
      const category = (complaint.category || 'OTHER').toUpperCase();

      // Only group systemic issues that affect a whole wing/tower (WATER, LIFT, CLEANING, PARKING)
      // Solitary issues without wing or with unique context stay separate
      if (wing && category !== 'OTHER') {
        const key = `rule:${category}:${wing}`;
        if (!groupMap.has(key)) {
          groupMap.set(key, {
            clusterId: `cl-${category.toLowerCase()}-${wing.toLowerCase()}`,
            category,
            wing,
            complaints: []
          });
        }
        groupMap.get(key).complaints.push(complaint);
      } else {
        // Individual unclustered complaint
        const key = `single:${complaint.id}`;
        groupMap.set(key, {
          clusterId: null,
          category,
          wing,
          complaints: [complaint]
        });
      }
    }

    const clusters = [];
    let unclusteredCount = 0;

    for (const group of groupMap.values()) {
      // A cluster requires at least 2 related complaints
      if (group.complaints.length >= 2) {
        const urgencies = group.complaints.map(c => c.urgency);
        const highestUrgency = this.getHighestUrgency(urgencies);
        
        // Extract unique affected flats
        const affectedFlatsSet = new Set();
        group.complaints.forEach(c => {
          if (c.flat_number) affectedFlatsSet.add(c.flat_number);
        });
        const affectedFlats = Array.from(affectedFlatsSet).sort();

        const complaintIds = group.complaints.map(c => c.id);

        clusters.push({
          cluster_id: group.clusterId,
          category: group.category,
          title: this.generateClusterTitle(group.category, group.wing),
          complaint_count: group.complaints.length,
          urgency: highestUrgency,
          affected_flats: affectedFlats,
          complaint_ids: complaintIds
        });
      } else {
        unclusteredCount += group.complaints.length;
      }
    }

    // Sort clusters by urgency priority (CRITICAL first, then HIGH, etc.), then complaint_count descending
    clusters.sort((a, b) => {
      const pA = URGENCY_PRIORITY[a.urgency] || 1;
      const pB = URGENCY_PRIORITY[b.urgency] || 1;
      if (pB !== pA) return pB - pA;
      return b.complaint_count - a.complaint_count;
    });

    return {
      clusters,
      unclusteredCount
    };
  }

  /**
   * Find or assign cluster_id when a new complaint is created
   * @param {Object} newComplaint
   * @param {Array<Object>} existingComplaints
   * @returns {Promise<Object>} - { cluster_id, is_duplicate, matched_complaint_id }
   */
  async findOrAssignCluster(newComplaint, existingComplaints = []) {
    if (!existingComplaints || existingComplaints.length === 0) {
      return { cluster_id: null, is_duplicate: false };
    }

    const newCategory = (newComplaint.category || 'OTHER').toUpperCase();
    const newWing = this.extractWing(newComplaint);

    if (!newWing || newCategory === 'OTHER') {
      return { cluster_id: null, is_duplicate: false };
    }

    // Look for active complaints in the same wing and category
    const related = existingComplaints.find(c => {
      if (c.status === 'RESOLVED') return false;
      const cCat = (c.category || '').toUpperCase();
      const cWing = this.extractWing(c);
      return cCat === newCategory && cWing === newWing;
    });

    if (related) {
      const clusterId = related.cluster_id || `cl-${newCategory.toLowerCase()}-${newWing.toLowerCase()}-01`;
      return {
        cluster_id: clusterId,
        is_duplicate: false,
        matched_complaint_id: related.id
      };
    }

    return { cluster_id: null, is_duplicate: false };
  }
}

module.exports = new ComplaintClusteringService();
