import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and Anon Key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// --- Debugging Logs ---
console.log('Supabase URL Loaded:', supabaseUrl);
console.log('Supabase Anon Key Loaded:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 10)}...` : 'Not Loaded'); // Log only prefix of key
// --- End Debugging Logs ---

// Basic validation
if (!supabaseUrl) {
  console.error('Error: VITE_SUPABASE_URL environment variable is not set.');
  throw new Error('Supabase URL is not configured. Please check your .env file.');
}
if (!supabaseAnonKey) {
  console.error('Error: VITE_SUPABASE_ANON_KEY environment variable is not set.');
  throw new Error('Supabase Anon Key is not configured. Please check your .env file.');
}

// Create and export the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
