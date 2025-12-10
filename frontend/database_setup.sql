-- Database setup for My Profile page
-- Run this SQL in your Supabase SQL Editor

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id TEXT PRIMARY KEY,
  age INTEGER DEFAULT NULL,
  gender TEXT DEFAULT '',
  diet_type TEXT DEFAULT '',
  past_medication TEXT[] DEFAULT '{}',
  allergies TEXT[] DEFAULT '{}',
  avoid_list TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to manage their own profiles
CREATE POLICY "Users can manage their own profiles" ON user_profiles
  FOR ALL USING (auth.uid()::text = id);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Migration: Update existing table to allow NULL values
ALTER TABLE user_profiles ALTER COLUMN age DROP NOT NULL;
ALTER TABLE user_profiles ALTER COLUMN gender SET DEFAULT '';
ALTER TABLE user_profiles ALTER COLUMN diet_type SET DEFAULT '';
ALTER TABLE user_profiles ALTER COLUMN past_medication SET DEFAULT '{}';
ALTER TABLE user_profiles ALTER COLUMN allergies SET DEFAULT '{}';
ALTER TABLE user_profiles ALTER COLUMN avoid_list SET DEFAULT '{}';

-- Optional: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_id ON user_profiles(id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at);
