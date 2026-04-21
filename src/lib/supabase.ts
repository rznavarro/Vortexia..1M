import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fkqfpqzbfbihkcgmtrdh.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_zULkRO6nwiPPSvqbOvPUXg_XKQkp1JU';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          handle: string;
          name: string;
          specialty: string | null;
          location: string | null;
          status: string;
          last_interaction_at: string;
          notes: string | null;
          estimated_value: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          handle: string;
          name: string;
          specialty?: string | null;
          location?: string | null;
          status: string;
          last_interaction_at?: string;
          notes?: string | null;
          estimated_value?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          handle?: string;
          name?: string;
          specialty?: string | null;
          location?: string | null;
          status?: string;
          last_interaction_at?: string;
          notes?: string | null;
          estimated_value?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      interactions: {
        Row: {
          id: string;
          lead_id: string;
          type: string;
          notes: string | null;
          result: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          type: string;
          notes?: string | null;
          result?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          type?: string;
          notes?: string | null;
          result?: string | null;
          created_at?: string;
        };
      };
      user_settings: {
        Row: {
          id: string;
          miami_goal_clients: number;
          miami_life_cost: number;
          setup_price: number;
          retainer_price: number;
          follow_up_alert_hours: number;
          daily_dm_goal: number;
          openai_key: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          miami_goal_clients?: number;
          miami_life_cost?: number;
          setup_price?: number;
          retainer_price?: number;
          follow_up_alert_hours?: number;
          daily_dm_goal?: number;
          openai_key?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          miami_goal_clients?: number;
          miami_life_cost?: number;
          setup_price?: number;
          retainer_price?: number;
          follow_up_alert_hours?: number;
          daily_dm_goal?: number;
          openai_key?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}