-- Society Complaint Triage - Supabase PostgreSQL Schema

-- 1. Create Enums
DO $$ BEGIN
  CREATE TYPE complaint_status AS ENUM ('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE complaint_category AS ENUM ('WATER', 'LIFT', 'PARKING', 'NOISE', 'CLEANING', 'MAINTENANCE', 'OTHER');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE complaint_urgency AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Create Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
  id TEXT PRIMARY KEY DEFAULT ('c-' || substr(md5(random()::text), 1, 8)),
  resident_name TEXT NOT NULL,
  flat_number TEXT NOT NULL,
  description TEXT NOT NULL,
  category complaint_category NOT NULL DEFAULT 'OTHER',
  urgency complaint_urgency NOT NULL DEFAULT 'MEDIUM',
  language TEXT DEFAULT 'English',
  ai_summary TEXT,
  suggested_action TEXT,
  status complaint_status NOT NULL DEFAULT 'OPEN',
  assigned_to TEXT,
  cluster_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Indexes for fast querying & dashboard filtering
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON complaints(category);
CREATE INDEX IF NOT EXISTS idx_complaints_urgency ON complaints(urgency);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON complaints(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_complaints_cluster ON complaints(cluster_id);
