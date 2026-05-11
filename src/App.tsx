import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RedirectPage from './components/RedirectPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import AnalistaIA from './pages/AnalistaIA';
import Captura from './pages/Captura';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Privacidade from './pages/Privacidade';
import Termos from './pages/Termos';
import { getSupabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Loader2, AlertTriangle } from 'lucide-react';

function ProtectedRoute({ children, session }: { children: React.ReactNode, session: Session | null | undefined }) {
  if (session === undefined) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const supabase = getSupabase();
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });
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

  if (initError) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg border border-red-100">
          <div className="bg-red-100 text-red-600 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Erro de Configuração (WSOD Fix)</h1>
          <p className="text-slate-600 mb-6">{initError}</p>
          <div className="bg-slate-50 p-4 rounded-lg text-left text-sm text-slate-500 font-mono border border-slate-200">
            <strong>Dica para a Vercel:</strong><br/>
            Vá em Settings {'>'} Environment Variables, adicione as chaves e faça um novo Deploy.
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage session={session} />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Rotas Protegidas do Admin */}
        <Route path="/admin" element={<ProtectedRoute session={session}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/analista" element={<ProtectedRoute session={session}><AnalistaIA /></ProtectedRoute>} />
        
        {/* Rota Raiz */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* Captura de Leads V3 */}
        <Route path="/captura" element={<Captura />} />

        {/* Páginas Legais */}
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="/termos" element={<Termos />} />

        {/* Dynamic Catch-all for Slugs */}
        <Route path="/:slug" element={<RedirectPage />} />
      </Routes>
    </Router>
  );
}
