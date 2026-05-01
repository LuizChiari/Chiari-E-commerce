import React, { useState, useEffect } from 'react';
import { getSupabase } from '../lib/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o Supabase reconheceu o token na URL ao carregar a página
    getSupabase().auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsTokenValid(true);
      }
    });
    
    // Fallback: se o usuário já estiver autenticado pelo token
    getSupabase().auth.getSession().then(({ data }) => {
      if (data.session) setIsTokenValid(true);
    });
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await getSupabase().auth.updateUser({ password: newPassword });
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Senha alterada com sucesso!');
      navigate('/login');
    }
    setLoading(false);
  };

  if (!isTokenValid) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center p-4">
        <div className="bg-white p-8 rounded-2xl text-center">
          <h2 className="text-xl font-bold mb-4">Aguardando validação...</h2>
          <p>Se você veio pelo link de e-mail, aguarde um momento. Se o erro persistir, solicite um novo link.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center items-center p-4">
      <form onSubmit={handleUpdatePassword} className="bg-white p-8 rounded-2xl w-full max-w-sm shadow-xl">
        <h2 className="text-xl font-bold mb-6">Definir Nova Senha</h2>
        <input 
          type="password" 
          placeholder="Digite sua nova senha" 
          className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
          {loading ? 'Salvando...' : 'Salvar Nova Senha'}
        </button>
      </form>
    </div>
  );
}
