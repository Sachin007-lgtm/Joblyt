-- Fix Supabase Auth Admin API restrictions
-- This allows the service role to create and delete users via admin API

-- IMPORTANT: Run these queries in your Supabase SQL Editor
-- Go to: https://supabase.com/dashboard → Your Project → SQL Editor → New Query

-- ============================================================================
-- Option 1: Enable Auth Admin Functions (Recommended)
-- ============================================================================

-- This enables the auth.admin schema functions for service role
-- The service role should already have these permissions, but this ensures it

GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA auth TO service_role;

-- ============================================================================
-- Option 2: Check Current Auth Settings
-- ============================================================================

-- Run this to see current auth configuration
-- SELECT * FROM auth.config;

-- ============================================================================
-- Option 3: Verify Service Role Permissions
-- ============================================================================

-- Check if service role has proper permissions
-- SELECT 
--   grantee, 
--   privilege_type 
-- FROM information_schema.role_table_grants 
-- WHERE grantee = 'service_role' 
--   AND table_schema = 'auth';

-- ============================================================================
-- AFTER running this SQL, you also need to update Supabase Dashboard settings:
-- ============================================================================

-- 1. Go to Authentication → Providers → Email
--    - Make sure "Enable Email Provider" is ON
--    - Set "Confirm email" to OFF (for development)

-- 2. Go to Authentication → Settings
--    - Under "Site URL", set: http://localhost:3000
--    - Under "Redirect URLs", add: http://localhost:3000/*

-- 3. Go to Authentication → URL Configuration  
--    - Make sure "Enable Signups" is ON (very important!)

-- ============================================================================
-- Verification Query
-- ============================================================================

-- After applying changes, run this to verify your service role JWT:
-- You should see role = 'service_role' in the result

-- SELECT 
--   auth.jwt() AS current_jwt,
--   current_setting('request.jwt.claims', true)::json->>'role' AS current_role;

