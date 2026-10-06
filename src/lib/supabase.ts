import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let adminCached: SupabaseClient | null = null;
let anonCached: SupabaseClient | null = null;

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}

/** Server-only Supabase client (service role — never import from the browser). */
export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    throw new Error("Brak NEXT_PUBLIC_SUPABASE_URL lub SUPABASE_SERVICE_ROLE_KEY");
  }
  adminCached ??= createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return adminCached;
}

export function getSupabaseAnon(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anon) {
    throw new Error("Brak NEXT_PUBLIC_SUPABASE_URL lub NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  anonCached ??= createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return anonCached;
}
