-- Fix RLS policy for job_descriptions table
-- This allows authenticated users (admin/backend_team) to insert/update/delete job descriptions

-- Option 1: Disable RLS completely (simpler, less secure)
-- ALTER TABLE job_descriptions DISABLE ROW LEVEL SECURITY;

-- Option 2: Enable RLS with proper policies (recommended)
ALTER TABLE job_descriptions ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read job descriptions
CREATE POLICY "Allow authenticated users to read job descriptions"
ON job_descriptions
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert job descriptions
CREATE POLICY "Allow authenticated users to insert job descriptions"
ON job_descriptions
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update job descriptions
CREATE POLICY "Allow authenticated users to update job descriptions"
ON job_descriptions
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete job descriptions
CREATE POLICY "Allow authenticated users to delete job descriptions"
ON job_descriptions
FOR DELETE
TO authenticated
USING (true);

-- Note: If you want more fine-grained control, you can modify these policies
-- For example, to only allow admin/backend_team roles:
-- USING (auth.jwt() ->> 'user_metadata' ->> 'role' IN ('admin', 'backend_team'))
