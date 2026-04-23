/// <reference types="vite/client" />
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
    throw new Error('Configuração do Supabase ausente ou inválida. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY nos segredos do AI Studio.');
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
};

// Deprecated: Use getSupabase() instead. Keeping for backward compatibility during migration.
// This will still throw if called, but at least won't crash on module load.
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (getSupabase() as any)[prop];
  }
});

export type AffiliateLink = {
  id: string;
  created_at: string;
  nome_produto: string;
  url_original: string;
  slug_curto: string;
  moeda: string;
  pixel_id?: string;
  tiktok_pixel_id?: string;
  google_tag_id?: string;
  cliques: number;
};
