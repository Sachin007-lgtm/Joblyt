-- Quick fix: Disable RLS on job_descriptions table
-- This allows all authenticated users to create/read/update/delete job descriptions
-- Use this if you don't need fine-grained access control on JDs

ALTER TABLE job_descriptions DISABLE ROW LEVEL SECURITY;
