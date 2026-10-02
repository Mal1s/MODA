/*
# Add authenticated player profiles and private game saves

1. New Tables
- `player_profiles`
  - `user_id` (uuid, primary key) — links the profile to Supabase Auth.
  - `display_name` (text) — the player name shown in the game.
  - `created_at` and `updated_at` (timestamptz) — profile timestamps.
- `player_saves`
  - `user_id` (uuid, primary key) — links the save to its owner.
  - `coins` (integer) — current coin balance.
  - `energy` (integer) — current energy.
  - `gender` (text) — selected character body.
  - `inventory` (jsonb) — owned clothing items.
  - `equipped` (jsonb) — currently equipped item ids by clothing slot.
  - `created_at` and `updated_at` (timestamptz) — save timestamps.

2. Security
- Row level security is enabled on both tables.
- Authenticated users can select, insert, update, and delete only their own profile and save rows.
- Anonymous users cannot access private profiles or saves.

3. Compatibility
- Existing single-tenant demo tables are left unchanged so no existing game data is deleted.
- New rows default their owner to the current authenticated user, allowing the client to omit `user_id` on inserts.
*/

CREATE TABLE IF NOT EXISTS player_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL CHECK (char_length(trim(display_name)) BETWEEN 2 AND 24),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS player_saves (
  user_id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  coins integer NOT NULL DEFAULT 250 CHECK (coins >= 0),
  energy integer NOT NULL DEFAULT 1000 CHECK (energy BETWEEN 0 AND 1000),
  gender text NOT NULL DEFAULT 'female' CHECK (gender IN ('female', 'male')),
  inventory jsonb NOT NULL DEFAULT '[]'::jsonb,
  equipped jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE player_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_saves ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_player_profiles" ON player_profiles;
CREATE POLICY "select_own_player_profiles" ON player_profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_player_profiles" ON player_profiles;
CREATE POLICY "insert_own_player_profiles" ON player_profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_player_profiles" ON player_profiles;
CREATE POLICY "update_own_player_profiles" ON player_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_player_profiles" ON player_profiles;
CREATE POLICY "delete_own_player_profiles" ON player_profiles FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "select_own_player_saves" ON player_saves;
CREATE POLICY "select_own_player_saves" ON player_saves FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_player_saves" ON player_saves;
CREATE POLICY "insert_own_player_saves" ON player_saves FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_player_saves" ON player_saves;
CREATE POLICY "update_own_player_saves" ON player_saves FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_player_saves" ON player_saves;
CREATE POLICY "delete_own_player_saves" ON player_saves FOR DELETE TO authenticated
  USING (auth.uid() = user_id);