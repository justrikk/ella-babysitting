import { createClient } from "@supabase/supabase-js";

export const SITTER_AVATARS_BUCKET = "sitter-avatars";

// Server-only — SUPABASE_SERVICE_ROLE_KEY bypasses Row Level Security, so
// this must never be imported from a Client Component. This app uses
// Auth.js (not Supabase Auth), so there's no user JWT to hand Supabase for
// RLS-based client-side upload — all writes go through this service client
// from Server Actions instead, with ownership checked in application code.
export function getSupabaseServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
