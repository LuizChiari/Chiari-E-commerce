-- SCRIPT SQL PARA CONFIGURAÇÃO DO SUPABASE
-- Execute este script no SQL Editor do seu projeto Supabase

-- 1. Tabela de Links de Afiliados
CREATE TABLE IF NOT EXISTS public.links_afiliados (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    nome_produto TEXT NOT NULL,
    url_original TEXT NOT NULL,
    slug_curto TEXT UNIQUE NOT NULL,
    moeda TEXT DEFAULT 'BRL' NOT NULL,
    pixel_id TEXT,
    tiktok_pixel_id TEXT,
    google_tag_id TEXT,
    cliques INTEGER DEFAULT 0 NOT NULL,
    user_id UUID REFERENCES auth.users(id) -- Opcional: Relacionar com usuário admin
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.links_afiliados ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Segurança (Para simplificar, permitimos leitura pública e escrita apenas para admins)
-- Nota: Em produção, o 'user_id' deve ser verificado se o usuário está autenticado.

-- Permitir leitura pública (necessário para o redirecionamento funcionar)
CREATE POLICY "Leitura pública de links"
ON public.links_afiliados FOR SELECT
USING (true);

-- Permitir inserção apenas para usuários autenticados (Admins)
CREATE POLICY "Admins podem criar links"
ON public.links_afiliados FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Permitir atualização apenas para usuários autenticados (Admins)
CREATE POLICY "Admins podem atualizar links"
ON public.links_afiliados FOR UPDATE
USING (auth.role() = 'authenticated');

-- Permitir exclusão apenas para usuários autenticados (Admins)
CREATE POLICY "Admins podem deletar links"
ON public.links_afiliados FOR DELETE
USING (auth.role() = 'authenticated');
