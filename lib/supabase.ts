import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase do lado do SERVIDOR (service role).
 * - A service_role key NUNCA vai para o navegador (sem prefixo NEXT_PUBLIC).
 * - Se as variáveis não estiverem configuradas, retorna null e o app usa o
 *   armazenamento em arquivo (fallback) — assim nada quebra.
 */

let cached: SupabaseClient | null | undefined;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    cached = null;
    return null;
  }

  cached = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}
