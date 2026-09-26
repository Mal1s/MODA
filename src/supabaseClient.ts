import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface PlayerStateRow {
  id: string;
  coins: number;
  energy: number;
  gender: string;
  updated_at: string;
}

export interface InventoryRow {
  id: string;
  item_id: string;
  name: string;
  type: string;
  rarity: string;
  emoji: string;
  value: number;
  color: string;
  description: string;
  created_at: string;
}
