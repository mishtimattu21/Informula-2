-- Reset all profiles to start fresh
-- Run this in Supabase SQL Editor

-- Delete all existing profiles
DELETE FROM user_profiles;

-- Verify the table is empty
SELECT COUNT(*) as remaining_profiles FROM user_profiles;

-- This should return 0
