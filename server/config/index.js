const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
// Also fallback to server/.env if present
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || process.env.AI_API_KEY || '',
    model: 'gemini-3.8-flash'
  }
};

module.exports = config;
