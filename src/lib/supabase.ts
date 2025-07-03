
import { createClient } from '@supabase/supabase-js';

// Use the direct values from the client.ts file since environment variables are not accessible
const supabaseUrl = "https://geeuxuskzdnpcuirrkqv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlZXV4dXNremRucGN1aXJya3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzQ2ODAsImV4cCI6MjA2MjExMDY4MH0.YS4Kjb_cxMq7IjUG_UVU7GE0rQF0A09stuWbPhPhqDg";

// Create and export the Supabase client with explicit configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: localStorage,
    detectSessionInUrl: true, // Important for redirect-based auth
    flowType: 'pkce' // More secure auth flow
  }
});

// For debugging
console.log("Supabase client initialized with URL:", supabaseUrl);
console.log("Supabase client initialization successful:", !!supabase);
