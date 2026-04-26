import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RedirectPage from './components/RedirectPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import AnalistaIA from './pages/AnalistaIA';
import Captura from './pages/Captura';
import Obrigado from './pages/Obrigado'; // Importado com sucesso
import { getSupabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Loader2, AlertTriangle } from 'lucide-react';

// Componente para proteger as rotas de Admin e Analista
function ProtectedRoute({ children, session }: { children: React.ReactNode, session: Session | null | undefined }) {
  if (session === undefined) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <Loader2 className="w-8 h-8 animate-spin text-[#00ff88]" />
    </div>
  );
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const supabase = getSupabase();
      
      // Busca sessão inicial
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });

      // Monitora mudanças de login/logout
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => {
        subscription?.unsubscribe();
      };
    } catch (error: any) {
      console.error('Falha na inicialização do App:', error);
      setInitError(error.message || 'Erro crítico ao conectar com o banco de dados.');
    }
  }, []);

  // Tela de Erro Crítico (Caso falte variáveis de ambiente)
  if (initError) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-[#111] p-8 rounded-2xl shadow-xl max-w-lg border border-red-900/50">
          <div className="bg-red-900/20 text-red-500 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Erro de Configuração</h1>
          <p className="text-gray-400 mb-6">{initError}</p>
          <div className="bg-black/50 p-4 rounded-lg text-left text-sm text-gray-500 font-mono border border-white/10">
            <strong>Dica Chiari Digital:</strong><br/>
            Vá no painel da Vercel {'>'} Settings {'>'} Environment Variables, verifique o Supabase e faça um novo Deploy.
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Rota de Login */}
        <Route path="/login" element={<LoginPage session={session} />} />
        
        {/* Rotas Protegidas (Exigem Login) */}
        <Route 
          path="/admin" 
          element={<ProtectedRoute session={session}><AdminDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/analista" 
          element={<ProtectedRoute session={session}><AnalistaIA /></ProtectedRoute>} 
        />
        
        {/* Funil de Vendas (Público) */}
        <Route path="/captura" element={<Captura />} />
        <Route path="/obrigado" element={<Obrigado />} />

        {/* Redirecionamento da Raiz */}
        <Route path="/" element={<Navigate to="/captura" replace />} />

        {/* IMPORTANTE: A rota :slug deve vir por último. 
            Ela serve para links curtos de afiliados cadastrados no banco. 
        */}
        <Route path="/:slug" element={<RedirectPage />} />
        
        {/* Fallback para páginas não encontradas */}
        <Route path="*" element={<Navigate to="/captura" replace />} />
      </Routes>
    </Router>
  );
}
