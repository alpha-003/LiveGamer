/*
  # Simplify RLS Policies
  
  1. Changes
    - Remove admin role dependency
    - Simplify policies to use basic auth checks
    - Ensure proper access control
  
  2. Security
    - Maintain data isolation between users
    - Ensure proper authorization
*/

-- Drop existing policies
DO $$ 
BEGIN
    -- Drop all existing policies
    DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
    DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
    DROP POLICY IF EXISTS "wallets_select_policy" ON wallets;
    DROP POLICY IF EXISTS "transactions_select_policy" ON transactions;
    DROP POLICY IF EXISTS "transactions_insert_policy" ON transactions;
    DROP POLICY IF EXISTS "bets_select_policy" ON bets;
    DROP POLICY IF EXISTS "bets_insert_policy" ON bets;
END $$;

-- Create simplified policies
CREATE POLICY "profiles_select_policy" ON profiles
    FOR SELECT TO authenticated
    USING (id = auth.uid());

CREATE POLICY "profiles_update_policy" ON profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid());

CREATE POLICY "wallets_select_policy" ON wallets
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "transactions_select_policy" ON transactions
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "transactions_insert_policy" ON transactions
    FOR INSERT TO authenticated
    WITH CHECK (
        user_id = auth.uid() AND
        type IN ('deposit', 'withdrawal', 'bet_place', 'bet_win', 'bet_loss')
    );

CREATE POLICY "bets_select_policy" ON bets
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "bets_insert_policy" ON bets
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());