-- Remove auth trigger for user_progress initialization
-- Auth triggers cause unstable signup failures on Supabase
-- Application-level initialization handles this instead

BEGIN;

-- Drop trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Restore simpler INSERT policy (without trigger workaround)
DROP POLICY IF EXISTS "Users can insert their own progress" ON user_progress;

CREATE POLICY "Users can insert their own progress"
    ON user_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

COMMIT;