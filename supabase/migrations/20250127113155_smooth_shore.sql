/*
  # Fix bets table policies

  1. Changes
    - Drop existing policies
    - Create new policies that use is_admin field from profiles
    - Add policies for both regular users and admins
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own bets" ON bets;
DROP POLICY IF EXISTS "Users can place bets" ON bets;

-- Create new policies for bets table
CREATE POLICY "Users and admins can view bets"
  ON bets FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR -- User can view their own bets
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) -- Admin can view all bets
  );

CREATE POLICY "Users can place bets"
  ON bets FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id -- Only users can place their own bets
  );

-- Add policies for matches and odds tables
DROP POLICY IF EXISTS "Anyone can view matches" ON matches;
DROP POLICY IF EXISTS "Anyone can view odds" ON odds;

CREATE POLICY "Users and admins can view matches"
  ON matches FOR SELECT
  TO authenticated
  USING (true); -- All authenticated users can view matches

CREATE POLICY "Users and admins can view odds"
  ON odds FOR SELECT
  TO authenticated
  USING (true); -- All authenticated users can view odds