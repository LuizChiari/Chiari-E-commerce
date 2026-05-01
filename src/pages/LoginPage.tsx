import React, { useState } from 'react';
import { getSupabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { Lock, Mail, TrendingUp } from 'lucide-react';
import { Session } from '@supabase/supabase-js';

export default function LoginPage({ session }: { session: Session | null | undefined }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (session) navigate('/admin');
  }, [session, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await getSupabase().auth.signInWithPassword({ email, password });
    if (error) toast.error(error.message);
    else navigate('/admin');
    setLoading(false);
  };

  const handleRecovery = async () => {
    if (!email) { toast.error('Digite seu e-mail primeiro'); return; }
    setLoading(true);
    const { error } = await getSupabase().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success('Link enviado para seu e-mail!');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-8 h-8" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-8">Global Affiliate Hub</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input type="email" required className="w-full pl-10 py-2 border rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input type="password" required className="w-full pl-10 py-2 border rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          <button type="button" onClick={handleRecovery} className="text-sm text-blue-600 hover:underline">
            Esqueci minha senha
          </button>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg">
            {loading ? 'Aguarde...' : 'Entrar no Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
}
