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

-- Resolve o provável warning 'unindexed_foreign_key' para a tabela links_afiliados
CREATE INDEX IF NOT EXISTS idx_links_afiliados_user_id 
ON public.links_afiliados(user_id);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.links_afiliados ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Segurança (Para simplificar, permitimos leitura pública e escrita apenas para admins)
-- Nota: Em produção, o 'user_id' deve ser verificado se o usuário está autenticado.

-- Permitir leitura pública (necessário para o redirecionamento funcionar)
DROP POLICY IF EXISTS "Leitura pública de links" ON public.links_afiliados;
CREATE POLICY "Leitura pública de links"
ON public.links_afiliados FOR SELECT
USING (true);

-- Permitir inserção apenas para usuários autenticados (Admins)
DROP POLICY IF EXISTS "Admins podem criar links" ON public.links_afiliados;
CREATE POLICY "Admins podem criar links"
ON public.links_afiliados FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Permitir atualização apenas para usuários autenticados (Admins)
DROP POLICY IF EXISTS "Admins podem atualizar links" ON public.links_afiliados;
CREATE POLICY "Admins podem atualizar links"
ON public.links_afiliados FOR UPDATE
USING (auth.role() = 'authenticated');

-- Permitir exclusão apenas para usuários autenticados (Admins)
DROP POLICY IF EXISTS "Admins podem deletar links" ON public.links_afiliados;
CREATE POLICY "Admins podem deletar links"
ON public.links_afiliados FOR DELETE
USING (auth.role() = 'authenticated');

-- ==========================================
-- 4. CONFIGURAÇÃO DA TABELA LEADS_V3 E RLS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.leads_v3 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    origin TEXT
);

ALTER TABLE public.leads_v3 ENABLE ROW LEVEL SECURITY;

-- AVISO: A política abaixo usa `WITH CHECK (true)` intencionalmente.
-- Isso é necessário para que o formulário de captura de leads público (`Captura.tsx`)
-- possa inserir novos registros de forma anônima. O linter do Supabase irá gerar um
-- aviso (rls_policy_always_true), que pode ser ignorado com segurança para este caso de uso.
DROP POLICY IF EXISTS "permitir_captura" ON public.leads_v3;
CREATE POLICY "permitir_captura" ON public.leads_v3 FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins podem ler leads" ON public.leads_v3;
CREATE POLICY "Admins podem ler leads" ON public.leads_v3 FOR SELECT USING (auth.role() = 'authenticated');

-- ==========================================
-- 5. LIMPEZA DE POLÍTICAS E FUNÇÕES INSEGURAS
-- ==========================================

-- Remove políticas temporárias e inseguras que permitem acesso total
DROP POLICY IF EXISTS "Atualizacao de links provisoria" ON public.links_afiliados;
DROP POLICY IF EXISTS "Criacao de links provisoria" ON public.links_afiliados;
DROP POLICY IF EXISTS "Exclusao de links provisoria" ON public.links_afiliados;

-- Remove permissões de execução da função `rls_auto_enable` para os papéis `anon` e `authenticated`
-- para resolver os warnings `anon_security_definer_function_executable` e `authenticated_security_definer_function_executable`.
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon, authenticated;
DROP FUNCTION IF EXISTS public.rls_auto_enable CASCADE;

-- ==========================================
-- 6. INCREMENTO SEGURO DE CLIQUES
-- ==========================================
CREATE OR REPLACE FUNCTION public.increment_click(link_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.links_afiliados SET cliques = cliques + 1 WHERE id = link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
