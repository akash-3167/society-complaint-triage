/**
 * Complaint Clustering Service (Phase 1 Interface & Placeholder)
 * 
 * In Phase 2, this module will:
 * 1. Generate text embeddings for incoming complaints
 * 2. Calculate semantic similarity across unresolved complaints
 * 3. Group related/duplicate complaints into clusters (e.g., 'cl-water-01' for multiple flats reporting water issue)
 * 4. Help committee members respond to or resolve groups in one click
 * 
 * IMPORTANT ARCHITECTURE RULE:
 * Keep all clustering algorithms and embedding logic isolated in this service.
 */

class ClusteringService {
  /**
   * Assign or detect duplicate/related cluster for a new complaint
   * @param {Object} newComplaint - Complaint data object
   * @param {Array<Object>} existingComplaints - List of open/active complaints
   * @returns {Promise<Object>} - { cluster_id, is_duplicate, duplicate_of }
   */
  async findOrAssignCluster(newComplaint, existingComplaints = []) {
    // Phase 1 Placeholder:
    // Basic similarity check based on category and flat wing or keywords.
    // In Phase 2, this will use vector embeddings and cosine similarity.

    if (!existingComplaints || existingComplaints.length === 0) {
      return {
        cluster_id: null,
        is_duplicate: false,
        confidence: 0
      };
    }

    const newWing = (newComplaint.flat_number || '').charAt(0).toUpperCase();
    const newCategory = newComplaint.category;

    // Check if another complaint in same wing has the same category within recent time
    const related = existingComplaints.find(c => {
      const existingWing = (c.flat_number || '').charAt(0).toUpperCase();
      return (
        c.status !== 'RESOLVED' &&
        c.category === newCategory &&
        existingWing === newWing &&
        c.category !== 'OTHER'
      );
    });

    if (related && related.cluster_id) {
      return {
        cluster_id: related.cluster_id,
        is_duplicate: false,
        confidence: 0.85,
        matched_complaint_id: related.id
      };
    } else if (related && !related.cluster_id) {
      const generatedClusterId = `cl-${newCategory.toLowerCase()}-${Date.now().toString().slice(-4)}`;
      return {
        cluster_id: generatedClusterId,
        is_duplicate: false,
        confidence: 0.85,
        matched_complaint_id: related.id
      };
    }

    return {
      cluster_id: null,
      is_duplicate: false,
      confidence: 0
    };
  }

  /**
   * Group an array of complaints by their cluster_id
   * @param {Array<Object>} complaints
   * @returns {Object} - Map of cluster_id -> complaints array
   */
  groupComplaintsByCluster(complaints = []) {
    const clusters = {};
    const unclustered = [];

    for (const c of complaints) {
      if (c.cluster_id) {
        if (!clusters[c.cluster_id]) {
          clusters[c.cluster_id] = [];
        }
        clusters[c.cluster_id].push(c);
      } else {
        unclustered.push(c);
      }
    }

    return { clusters, unclustered };
  }
}

module.exports = new ClusteringService();
