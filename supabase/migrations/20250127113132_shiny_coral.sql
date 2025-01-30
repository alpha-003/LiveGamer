/*
  # Fix admin policies

  1. Changes
    - Drop existing policies to avoid conflicts
    - Recreate policies with proper conditions
    - Ensure admin field exists
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Add admin field to profiles (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false;
  END IF;
END $$;

-- Create unified policies that handle both regular users and admins
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR -- User can view their own profile
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) -- Admin can view all profiles
  );

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id OR -- User can update their own profile
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) -- Admin can update all profiles
  );