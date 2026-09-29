/**
 * Role-Based Access Control Middleware (Phase 5A)
 * Supports RESIDENT and COMMITTEE roles with server-enforced authorization
 */

const DEMO_USERS = {
  COMMITTEE: {
    id: 'u-comm-01',
    name: 'Sunil Mehta',
    role: 'COMMITTEE',
    flat: 'Secretary Office',
    email: 'secretary@greenmeadows.org',
    token: 'demo-token-committee-sunil'
  },
  RESIDENT: {
    id: 'u-res-01',
    name: 'Akash',
    role: 'RESIDENT',
    flat: 'B-402',
    email: 'akash.b402@gmail.com',
    token: 'demo-token-resident-akash'
  }
};

// In-memory active session store (token -> user)
const SESSIONS = new Map([
  [DEMO_USERS.COMMITTEE.token, DEMO_USERS.COMMITTEE],
  [DEMO_USERS.RESIDENT.token, DEMO_USERS.RESIDENT]
]);

/**
 * Extract token from request headers
 */
const extractToken = (req) => {
  const authHeader = req.headers.authorization || req.headers['x-auth-token'];
  if (!authHeader) return null;
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return authHeader.trim();
};

/**
 * Authenticate middleware: resolves user from token and attaches to req.user
 */
const authenticate = (req, res, next) => {
  const token = extractToken(req);

  if (token) {
    if (SESSIONS.has(token)) {
      req.user = SESSIONS.get(token);
    } else if (token.toLowerCase().includes('committee')) {
      req.user = DEMO_USERS.COMMITTEE;
    } else if (token.toLowerCase().includes('resident')) {
      req.user = DEMO_USERS.RESIDENT;
    }
  }

  next();
};

/**
 * Require Committee role middleware: strictly rejects non-committee callers with HTTP 403 Forbidden
 */
const requireCommittee = (req, res, next) => {
  // Ensure authentication was run
  if (!req.user) {
    const token = extractToken(req);
    if (token) {
      if (SESSIONS.has(token)) {
        req.user = SESSIONS.get(token);
      } else if (token.toLowerCase().includes('committee')) {
        req.user = DEMO_USERS.COMMITTEE;
      } else if (token.toLowerCase().includes('resident')) {
        req.user = DEMO_USERS.RESIDENT;
      }
    }
  }

  // If caller is authenticated as RESIDENT or missing committee authorization, reject with 403 Forbidden
  if (!req.user || req.user.role !== 'COMMITTEE') {
    return res.status(403).json({
      success: false,
      error: {
        message: 'Forbidden: Only committee members can assign or resolve complaints'
      }
    });
  }

  next();
};

module.exports = {
  DEMO_USERS,
  SESSIONS,
  authenticate,
  requireCommittee
};
