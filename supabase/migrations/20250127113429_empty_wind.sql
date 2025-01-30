/*
  # Fix infinite recursion in policies

  1. Changes
    - Rewrite policies to avoid self-referencing queries
    - Add admin check function for cleaner policy definitions
    - Update all policies to use the new approach
*/

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_admin = true
  );
$$;

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Users and admins can view wallets" ON wallets;
DROP POLICY IF EXISTS "Users and admins can view transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert transactions" ON transactions;
DROP POLICY IF EXISTS "Users and admins can view bets" ON bets;
DROP POLICY IF EXISTS "Users can place bets" ON bets;

-- Recreate policies using the new admin check function
CREATE POLICY "View profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() OR
    auth.is_admin()
  );

CREATE POLICY "Update profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    id = auth.uid() OR
    auth.is_admin()
  );

CREATE POLICY "View wallets"
  ON wallets FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    auth.is_admin()
  );

CREATE POLICY "View transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    auth.is_admin()
  );

CREATE POLICY "Insert transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    type IN ('deposit', 'withdrawal', 'bet_place', 'bet_win', 'bet_loss')
  );

CREATE POLICY "View bets"
  ON bets FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    auth.is_admin()
  );

CREATE POLICY "Insert bets"
  ON bets FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
  );