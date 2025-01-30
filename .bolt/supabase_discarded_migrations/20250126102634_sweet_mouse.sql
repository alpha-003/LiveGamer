/*
  # Fix user registration trigger

  1. Changes
    - Add error handling to trigger function
    - Add RETURNING clause to INSERT statements
    - Add transaction handling
    - Add explicit error messages
*/

CREATE OR REPLACE FUNCTION create_profile_and_wallet()
RETURNS trigger AS $$
DECLARE
  v_profile_id uuid;
  v_wallet_id uuid;
BEGIN
  -- Start an explicit transaction
  BEGIN
    -- Create profile
    INSERT INTO public.profiles (id, username, created_at, updated_at)
    VALUES (new.id, new.email, now(), now())
    RETURNING id INTO v_profile_id;

    -- Create wallet with 0 balance
    INSERT INTO public.wallets (user_id, balance, created_at, updated_at)
    VALUES (new.id, 0.00, now(), now())
    RETURNING id INTO v_wallet_id;

    -- If we got here, both inserts succeeded
    RETURN new;
  EXCEPTION
    WHEN unique_violation THEN
      -- Handle case where profile/wallet already exists
      RAISE EXCEPTION 'Profile or wallet already exists for user %', new.id;
    WHEN others THEN
      -- Handle any other errors
      RAISE EXCEPTION 'Failed to create profile and wallet for user %: %', new.id, SQLERRM;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_and_wallet();