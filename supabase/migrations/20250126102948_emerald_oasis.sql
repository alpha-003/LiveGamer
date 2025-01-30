/*
  # Fix transactions table policies

  1. Changes
    - Add RLS policies for transactions table
    - Enable users to insert and view their own transactions
    - Add proper constraints and defaults
    - Ensure proper user_id handling
*/

-- Enable RLS for transactions table
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON transactions;

-- Create policy for viewing transactions
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policy for inserting transactions
CREATE POLICY "Users can insert their own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    type IN ('deposit', 'withdrawal', 'bet_place', 'bet_win', 'bet_loss')
  );

-- Add trigger to automatically set user_id on insert
CREATE OR REPLACE FUNCTION set_transaction_user_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id := auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER set_transaction_user_id_trigger
  BEFORE INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION set_transaction_user_id();