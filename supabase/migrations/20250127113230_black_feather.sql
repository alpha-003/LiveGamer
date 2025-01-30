/*
  # Fix remaining table policies

  1. Changes
    - Drop and recreate wallet policies
    - Drop and recreate transaction policies
    - Update policies to use is_admin field from profiles
*/

-- Drop existing wallet policies
DROP POLICY IF EXISTS "Users can view their own wallet" ON wallets;

-- Create new wallet policies
CREATE POLICY "Users and admins can view wallets"
  ON wallets FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR -- User can view their own wallet
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) -- Admin can view all wallets
  );

-- Drop existing transaction policies
DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON transactions;

-- Create new transaction policies
CREATE POLICY "Users and admins can view transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR -- User can view their own transactions
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) -- Admin can view all transactions
  );

CREATE POLICY "Users can insert transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND -- Only users can insert their own transactions
    type IN ('deposit', 'withdrawal', 'bet_place', 'bet_win', 'bet_loss')
  );