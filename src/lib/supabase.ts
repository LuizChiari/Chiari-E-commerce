/// <reference types="vite/client" />
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
    throw new Error('Configuração do Supabase ausente. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY nas variáveis de ambiente do seu provedor (ex: Vercel) ou no arquivo .env local.');
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
};

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

export type Lead = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  origin?: string;
};
