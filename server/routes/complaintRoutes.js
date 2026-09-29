/**
 * Complaint Routes
 * Defines endpoints for complaint management
 */

const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { validateCreateComplaint, validateUpdateComplaint } = require('../middleware/validator');

// Stats endpoint
router.get('/stats/summary', complaintController.getStats);

// Clusters endpoint
router.get('/clusters', complaintController.getClusters);

// Complaints CRUD endpoints
router.route('/')
  .get(complaintController.getComplaints)
  .post(validateCreateComplaint, complaintController.createComplaint);

router.route('/:id')
  .get(complaintController.getComplaintById)
  .patch(validateUpdateComplaint, complaintController.updateComplaint)
  .delete(complaintController.deleteComplaint);

module.exports = router;
