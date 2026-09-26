/*
# Create game state tables for Fashion Cases (single-tenant, no auth)

1. New Tables
- `player_state`
  - `id` (text, primary key) — singleton row 'default'
  - `coins` (integer, default 250)
  - `energy` (integer, default 1000)
  - `gender` (text, default 'female')
  - `updated_at` (timestamp)
- `inventory`
  - `id` (uuid, primary key)
  - `item_id` (text, not null) — references ITEMS in gameData
  - `name` (text, not null)
  - `type` (text, not null)
  - `rarity` (text, not null)
  - `emoji` (text)
  - `value` (integer)
  - `color` (text)
  - `description` (text)
  - `created_at` (timestamp)
2. Security
- Enable RLS on both tables.
- Allow anon + authenticated full CRUD because this is a single-tenant demo with no sign-in.
- All data is intentionally public/shared.
*/

CREATE TABLE IF NOT EXISTS player_state (
  id text PRIMARY KEY DEFAULT 'default',
  coins integer NOT NULL DEFAULT 250,
  energy integer NOT NULL DEFAULT 1000,
  gender text NOT NULL DEFAULT 'female',
  updated_at timestamptz DEFAULT now()
);

INSERT INTO player_state (id, coins, energy, gender)
VALUES ('default', 250, 1000, 'female')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id text NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  rarity text NOT NULL,
  emoji text,
  value integer,
  color text,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE player_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_player_state" ON player_state;
CREATE POLICY "anon_select_player_state" ON player_state FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_player_state" ON player_state;
CREATE POLICY "anon_insert_player_state" ON player_state FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_player_state" ON player_state;
CREATE POLICY "anon_update_player_state" ON player_state FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_player_state" ON player_state;
CREATE POLICY "anon_delete_player_state" ON player_state FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_inventory" ON inventory;
CREATE POLICY "anon_select_inventory" ON inventory FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_inventory" ON inventory;
CREATE POLICY "anon_insert_inventory" ON inventory FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_inventory" ON inventory;
CREATE POLICY "anon_update_inventory" ON inventory FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_inventory" ON inventory;
CREATE POLICY "anon_delete_inventory" ON inventory FOR DELETE
  TO anon, authenticated USING (true);
