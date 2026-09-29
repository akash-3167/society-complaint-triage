/**
 * Complaint Controller
 * Handles HTTP requests for complaints
 */

const ComplaintModel = require('../models/complaintModel');
const aiTriageService = require('../services/aiTriage');
const clusteringService = require('../services/clustering');

// @desc    Get all complaints with optional filtering
// @route   GET /api/complaints
const getComplaints = async (req, res, next) => {
  try {
    const { status, category, urgency, flat_number, search, cluster_id } = req.query;
    const complaints = await ComplaintModel.getAll({
      status,
      category,
      urgency,
      flat_number,
      search,
      cluster_id
    });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single complaint by ID
// @route   GET /api/complaints/:id
const getComplaintById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const complaint = await ComplaintModel.getById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        error: {
          message: `Complaint not found with ID: ${id}`
        }
      });
    }

    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new complaint
// @route   POST /api/complaints
const createComplaint = async (req, res, next) => {
  try {
    const { resident_name, flat_number, description } = req.body;

    // 1. Run AI triage analysis via isolated service (Phase 1 preview)
    const triageResult = await aiTriageService.triageComplaint({
      resident_name,
      flat_number,
      description
    });

    // 2. Retrieve existing complaints to check clustering
    const existingComplaints = await ComplaintModel.getAll();
    const clusterResult = await clusteringService.findOrAssignCluster(
      { resident_name, flat_number, description, category: triageResult.category },
      existingComplaints
    );

    // 3. Assemble full complaint object with AI triage fields
    const complaintPayload = {
      resident_name,
      flat_number,
      description,
      category: triageResult.category,
      urgency: triageResult.urgency,
      language: triageResult.language,
      ai_summary: triageResult.summary || triageResult.ai_summary,
      summary: triageResult.summary || triageResult.ai_summary,
      suggested_action: triageResult.suggested_action,
      cluster_id: clusterResult.cluster_id || null,
      status: ComplaintModel.STATUS_ENUM.OPEN
    };

    // 4. Save to model (Supabase or in-memory)
    const created = await ComplaintModel.create(complaintPayload);

    res.status(201).json({
      success: true,
      message: 'Complaint submitted and triaged successfully',
      data: created
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint (status, assignment, notes)
// @route   PATCH /api/complaints/:id
const updateComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await ComplaintModel.getById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: {
          message: `Complaint not found with ID: ${id}`
        }
      });
    }

    const updates = { ...req.body };
    if (updates.assigned_to && (!updates.status || updates.status === ComplaintModel.STATUS_ENUM.OPEN)) {
      updates.status = ComplaintModel.STATUS_ENUM.ASSIGNED;
    }

    const updated = await ComplaintModel.update(id, updates);

    res.status(200).json({
      success: true,
      message: 'Complaint updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
const deleteComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await ComplaintModel.getById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: {
          message: `Complaint not found with ID: ${id}`
        }
      });
    }

    const deleted = await ComplaintModel.delete(id);

    if (!deleted) {
      return res.status(500).json({
        success: false,
        error: {
          message: 'Failed to delete complaint'
        }
      });
    }

    res.status(200).json({
      success: true,
      message: `Complaint ${id} deleted successfully`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics/statistics
// @route   GET /api/complaints/stats/summary
const getStats = async (req, res, next) => {
  try {
    const stats = await ComplaintModel.getStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complaint clusters summary
// @route   GET /api/complaints/clusters
const getClusters = async (req, res, next) => {
  try {
    const allComplaints = await ComplaintModel.getAll();
    const summary = clusteringService.getClustersSummary(allComplaints);
    res.status(200).json({
      success: true,
      count: summary.clusters.length,
      unclustered_count: summary.unclusteredCount,
      data: summary.clusters
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  deleteComplaint,
  getStats,
  getClusters
};
