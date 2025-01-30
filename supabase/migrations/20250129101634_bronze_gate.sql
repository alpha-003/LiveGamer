/*
  # Fix RLS Policies and Admin Function

  1. Changes
    - Create admin check function in public schema instead of auth
    - Drop and recreate policies with proper error handling
    - Update policy names to avoid conflicts
  
  2. Security
    - Implement proper RLS for all tables
    - Add secure admin check function
    - Ensure proper authentication checks
*/

-- Create admin check function in public schema to avoid permission issues
CREATE OR REPLACE FUNCTION public.is_admin()
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

-- Safely drop existing policies if they exist
DO $$ 
BEGIN
    -- Profiles policies
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'View profiles') THEN
        DROP POLICY "View profiles" ON profiles;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Update profiles') THEN
        DROP POLICY "Update profiles" ON profiles;
    END IF;

    -- Wallets policies
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'View wallets') THEN
        DROP POLICY "View wallets" ON wallets;
    END IF;

    -- Transactions policies
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'View transactions') THEN
        DROP POLICY "View transactions" ON transactions;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Insert transactions') THEN
        DROP POLICY "Insert transactions" ON transactions;
    END IF;

    -- Bets policies
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'View bets') THEN
        DROP POLICY "View bets" ON bets;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Insert bets') THEN
        DROP POLICY "Insert bets" ON bets;
    END IF;
END $$;

-- Create new policies with updated names to avoid conflicts
CREATE POLICY "profiles_select_policy" ON profiles
    FOR SELECT TO authenticated
    USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "profiles_update_policy" ON profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "wallets_select_policy" ON wallets
    FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "transactions_select_policy" ON transactions
    FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "transactions_insert_policy" ON transactions
    FOR INSERT TO authenticated
    WITH CHECK (
        user_id = auth.uid() AND
        type IN ('deposit', 'withdrawal', 'bet_place', 'bet_win', 'bet_loss')
    );

CREATE POLICY "bets_select_policy" ON bets
    FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "bets_insert_policy" ON bets
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());