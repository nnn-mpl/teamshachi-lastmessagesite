
import { createClient } from '@supabase/supabase-js';

// --- IMPORTANT ---
// Please replace these placeholder values with your actual Supabase project URL and public Anon Key.
// You can find these in your Supabase project's dashboard under "Settings" > "API".
const supabaseUrl = 'https://placeholder.supabase.co';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

// This check helps to remind the developer to configure Supabase.
// The app will still render, but Supabase functionality will not work until this is configured.
export const isSupabaseConfigured =
  supabaseUrl !== 'https://placeholder.supabase.co' &&
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase is not configured. Please update `services/supabase.ts` with your project URL and anon key.',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
