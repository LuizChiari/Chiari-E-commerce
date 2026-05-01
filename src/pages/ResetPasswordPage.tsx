import React, { useState } from 'react';
import { getSupabase } from '../lib/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await getSupabase().auth.updateUser({ password: newPassword });
    
    if (error) toast.error(error.message);
    else {
      toast.success('Senha alterada com sucesso!');
      navigate('/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center items-center p-4">
      <form onSubmit={handleUpdatePassword} className="bg-white p-8 rounded-2xl w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Redefinir Senha</h2>
        <input 
          type="password" 
          placeholder="Nova senha" 
          className="w-full p-3 border rounded-lg mb-4"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button className="w-full bg-green-600 text-white py-3 rounded-lg font-bold">
          {loading ? 'Salvando...' : 'Salvar Nova Senha'}
        </button>
      </form>
    </div>
  );
}
