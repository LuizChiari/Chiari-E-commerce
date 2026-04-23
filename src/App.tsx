import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RedirectPage from './components/RedirectPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import AnalistaIA from './pages/AnalistaIA';
import { getSupabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

function ProtectedRoute({ children, session }: { children: React.ReactNode, session: Session | null | undefined }) {
  if (session === undefined) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage session={session} />} />
        
        {/* Rotas Protegidas do Admin */}
        <Route path="/admin" element={<ProtectedRoute session={session}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/analista" element={<ProtectedRoute session={session}><AnalistaIA /></ProtectedRoute>} />
        
        {/* Rota Raiz */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* Dynamic Catch-all for Slugs */}
        <Route path="/:slug" element={<RedirectPage />} />
      </Routes>
    </Router>
  );
}
