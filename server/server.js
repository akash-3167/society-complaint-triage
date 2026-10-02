/**
 * Society Complaint Triage - Express Server
 */

const express = require('express');
const cors = require('cors');
const config = require('./config');
const complaintRoutes = require('./routes/complaintRoutes');
const authRoutes = require('./routes/authRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Middlewares
const corsOptions = {
  origin: [
    'https://society-complaint-triage-beta.vercel.app',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Society Complaint Triage Backend API',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// Mount APIs
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = config.port;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 Society Complaint Triage API running on:`);
    console.log(`   http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health`);
    console.log(`   Complaints API: http://localhost:${PORT}/api/complaints`);
    console.log(`===============================================`);
  });
}

module.exports = app;

