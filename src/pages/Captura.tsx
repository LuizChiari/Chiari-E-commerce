import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getSupabase } from '../lib/supabase';
import { Toaster, toast } from 'sonner';
import { ArrowRight, Mail, User, ShieldCheck, Sparkles, Download } from 'lucide-react';

export default function Captura() {
  const [searchParams] = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Captura a origem dinâmica via ?origem=anuncio_fb_01 na URL (se não houver, seta "organico-hub")
  const origin = searchParams.get('origin') || searchParams.get('origem') || 'organico-hub';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = getSupabase();
      
      const { error } = await supabase
        .from('leads_v3')
        .insert([
          { name, email, origin }
        ]);

      if (error) {
        throw error;
      }

      setSuccess(true);
      toast.success('Guia liberado com sucesso!');
    } catch (err: any) {
      console.error('Erro na captura:', err);
      toast.error(err.message || 'Erro inesperado ao cadastrar formulário.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] flex flex-col items-center justify-center p-6 text-white font-sans selection:bg-purple-500/30">
        <div className="max-w-md w-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md rounded-2xl p-10 text-center shadow-2xl">
          <div className="w-16 h-16 bg-purple-500/10 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
            <Download className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-4 tracking-tight">Tudo Certo, {name.split(' ')[0]}!</h2>
          <p className="text-zinc-400 mb-6">
            O seu acesso ao <strong>Guia de Prompts Master</strong> foi liberado e o material completo foi enviado para o seu e-mail.
          </p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-colors w-full">
            Acessar o Guia Agora
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] flex flex-col items-center justify-center p-6 text-white font-sans selection:bg-purple-500/30">
      <Toaster position="top-center" theme="dark" />
      
      <div className="w-full max-w-[420px]">
        {/* Badge Premium */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium tracking-wide">
            <Sparkles className="w-4 h-4" />
            Material Premium Liberado
          </div>
        </div>

        {/* Copy / Titulo */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 inline-block bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            O Guia Definitivo de Prompts.
          </h1>
          <p className="text-zinc-400 text-lg">
            Descubra os comandos exatos que o nosso Analista IA usa para encontrar produtos ocultos e gerar copys milionárias em Dólar. Insira seus dados para baixar.
          </p>
        </div>

        {/* Captura Card */}
        <div className="bg-white/[0.02] border border-white/[0.05] shadow-2xl backdrop-blur-xl rounded-3xl p-8 relative overflow-hidden">
          {/* Subtle Glow inside the card */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Seu Nome Completo</label>
              <div className="relative group">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500 transition-colors group-focus-within:text-zinc-300" />
                <input
                  type="text"
                  required
                  placeholder="Ex: João Silva"
                  className="w-full bg-black/40 border border-zinc-800 focus:border-purple-500 text-white placeholder:text-zinc-600 rounded-xl pl-12 pr-4 py-3 outline-none transition-all duration-300"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">O seu melhor E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500 transition-colors group-focus-within:text-zinc-300" />
                <input
                  type="email"
                  required
                  placeholder="seu@melhoremail.com.br"
                  className="w-full bg-black/40 border border-zinc-800 focus:border-purple-500 text-white placeholder:text-zinc-600 rounded-xl pl-12 pr-4 py-3 outline-none transition-all duration-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl py-3.5 px-4 mt-6 flex justify-center items-center gap-2 transition-all duration-300 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">{loading ? 'Liberando o Guia...' : 'Baixar Guia Agora'}</span>
              {!loading && (
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
            <p className="text-center text-xs text-zinc-500 mt-4 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Suas informações estão seguras.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
