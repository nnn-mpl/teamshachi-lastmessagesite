
import { createClient } from '@supabase/supabase-js';

// --- IMPORTANT ---
// Please replace these placeholder values with your actual Supabase project URL and public Anon Key.
// You can find these in your Supabase project's dashboard under "Settings" > "API".
const supabaseUrl = 'https://kqcbzirezrtqbcvteueb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxY2J6aXJlenJ0cWJjdnRldWViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MDc5OTksImV4cCI6MjA3NjI4Mzk5OX0.64Cj0FooPitgBxGsTgrn82oRiNmdks-iX3DyrUu_ApA';

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
