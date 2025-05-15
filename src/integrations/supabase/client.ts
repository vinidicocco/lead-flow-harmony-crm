
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = "https://rmrosmltpeiuusvhxkmg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtcm9zbWx0cGVpdXVzdmh4a21nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNzY5NDIsImV4cCI6MjA2Mjg1Mjk0Mn0.pBKbS-3p570TKx7rhNxnx4gx35ysyVicFH07vcaa9K0";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: "crm-auth",
  },
});
