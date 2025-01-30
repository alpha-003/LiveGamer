/*
  # Add admin role to profiles

  1. Changes
    - Add admin boolean field to profiles table
    - Add RLS policy for admin access
*/

-- Add admin field to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Create policy for admin access
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE is_admin = true
  ));

-- Create policy for admin updates
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE is_admin = true
  ));