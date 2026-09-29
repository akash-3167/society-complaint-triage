/**
 * Complaint Routes
 * Defines endpoints for complaint management
 */

const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { validateCreateComplaint, validateUpdateComplaint } = require('../middleware/validator');
const { authenticate, requireCommittee } = require('../middleware/auth');

// Apply authentication middleware to all complaint endpoints
router.use(authenticate);

// Stats endpoint
router.get('/stats/summary', complaintController.getStats);

// Clusters endpoint (Committee only)
router.get('/clusters', requireCommittee, complaintController.getClusters);

// Complaints CRUD endpoints
router.route('/')
  .get(complaintController.getComplaints)
  .post(validateCreateComplaint, complaintController.createComplaint);

router.route('/:id')
  .get(complaintController.getComplaintById)
  .patch(requireCommittee, validateUpdateComplaint, complaintController.updateComplaint)
  .delete(requireCommittee, complaintController.deleteComplaint);

module.exports = router;
