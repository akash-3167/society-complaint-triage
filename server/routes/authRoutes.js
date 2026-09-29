/**
 * Auth Routes for Hackathon Demo Login / Session Management (Phase 5A)
 */

const express = require('express');
const router = express.Router();
const { DEMO_USERS, SESSIONS, authenticate } = require('../middleware/auth');

// @desc    Demo login / role selection
// @route   POST /api/auth/login
router.post('/login', (req, res) => {
  const { role = 'RESIDENT', name, flat } = req.body;
  const normalizedRole = role.toUpperCase();

  if (normalizedRole === 'COMMITTEE') {
    const user = {
      ...DEMO_USERS.COMMITTEE,
      name: name || DEMO_USERS.COMMITTEE.name
    };
    SESSIONS.set(user.token, user);
    return res.status(200).json({
      success: true,
      token: user.token,
      user
    });
  }

  // Resident role
  const residentFlat = (flat || 'B-402').toUpperCase();
  const residentName = name || 'Akash';
  const token = `demo-token-resident-${residentFlat.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  const user = {
    id: 'u-res-01',
    name: residentName,
    role: 'RESIDENT',
    flat: residentFlat,
    email: `${residentName.toLowerCase()}@greenmeadows.org`,
    token: DEMO_USERS.RESIDENT.token // Keep consistent token for tests
  };

  SESSIONS.set(user.token, user);
  SESSIONS.set(token, user);

  return res.status(200).json({
    success: true,
    token: user.token,
    user
  });
});

// @desc    Get current authenticated session
// @route   GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: { message: 'Not authenticated' }
    });
  }
  return res.status(200).json({
    success: true,
    user: req.user
  });
});

module.exports = router;
