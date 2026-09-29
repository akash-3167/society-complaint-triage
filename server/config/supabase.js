const { createClient } = require('@supabase/supabase-js');
const config = require('./index');

let supabase = null;
const isSupabaseConfigured = Boolean(
  config.supabase.url && 
  (config.supabase.anonKey || config.supabase.serviceRoleKey) &&
  !config.supabase.url.includes('your-project')
);

if (isSupabaseConfigured) {
  try {
    const key = config.supabase.serviceRoleKey || config.supabase.anonKey;
    supabase = createClient(config.supabase.url, key, {
      auth: {
        persistSession: false
      }
    });
    console.log('[Database] Supabase client initialized successfully.');
  } catch (error) {
    console.warn('[Database] Failed to initialize Supabase client:', error.message);
    supabase = null;
  }
} else {
  console.log('[Database] Supabase credentials not fully configured. Using mock in-memory database with realistic demo data.');
}

module.exports = {
  supabase,
  isSupabaseConfigured
};
