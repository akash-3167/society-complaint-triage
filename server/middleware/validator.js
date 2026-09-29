/**
 * Request Validation Middleware for Complaints
 */

const { STATUS_ENUM, CATEGORY_ENUM, URGENCY_ENUM } = require('../models/complaintModel');

const validateCreateComplaint = (req, res, next) => {
  const { resident_name, flat_number, description } = req.body;
  const errors = [];

  if (!resident_name || typeof resident_name !== 'string' || !resident_name.trim()) {
    errors.push('resident_name is required');
  }

  if (!flat_number || typeof flat_number !== 'string' || !flat_number.trim()) {
    errors.push('flat_number is required');
  }

  if (!description || typeof description !== 'string' || !description.trim()) {
    errors.push('description is required');
  } else if (description.trim().length < 5) {
    errors.push('description must be at least 5 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        details: errors
      }
    });
  }

  next();
};

const validateUpdateComplaint = (req, res, next) => {
  const { status, category, urgency } = req.body;

  if (status && !Object.values(STATUS_ENUM).includes(status)) {
    return res.status(400).json({
      success: false,
      error: {
        message: `Invalid status. Must be one of: ${Object.values(STATUS_ENUM).join(', ')}`
      }
    });
  }

  if (category && !Object.values(CATEGORY_ENUM).includes(category)) {
    return res.status(400).json({
      success: false,
      error: {
        message: `Invalid category. Must be one of: ${Object.values(CATEGORY_ENUM).join(', ')}`
      }
    });
  }

  if (urgency && !Object.values(URGENCY_ENUM).includes(urgency)) {
    return res.status(400).json({
      success: false,
      error: {
        message: `Invalid urgency. Must be one of: ${Object.values(URGENCY_ENUM).join(', ')}`
      }
    });
  }

  next();
};

module.exports = {
  validateCreateComplaint,
  validateUpdateComplaint
};
