import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getSupabase } from '../lib/supabase';
import { Toaster, toast } from 'sonner';
import { ArrowRight, Mail, User, ShieldCheck, Sparkles, Download } from 'lucide-react';

export default function Captura() {
  const [searchParams] = useSearchParams();

  // ==========================================
  // 🔧 CONFIGURAÇÕES DA PÁGINA DE VENDAS
  // ==========================================
  const VIDEO_ID_YOUTUBE = "SEU_ID_DO_VIDEO"; // O código do vídeo. Ex: se for youtube.com/watch?v=dQw4w9WgXcQ, coloque apenas dQw4w9WgXcQ
  const MEU_LINK_DE_AFILIADO = "/cleanse-sana"; // Link 100% camuflado redirecionando para a oferta
  // ==========================================

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutos em segundos

  // Captura a origem dinâmica via ?origem=anuncio_fb_01 na URL (se não houver, seta "organico-hub")
  const origin = searchParams.get('origin') || searchParams.get('origem') || 'organico-hub';

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (success) {
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [success]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

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
      <div className="min-h-screen bg-[#0a0a0a] text-white font-sans text-center p-5 flex justify-center">
        <div className="max-w-[800px] w-full pt-12">
          <div className="text-2xl font-bold text-[#00ff88] mb-8 uppercase">Chiari Digital</div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Tudo certo! O seu Guia está pronto.</h1>
          
          <div className="mb-10">
            <a 
              href="/guia-prompts.pdf" 
              download="Guia_Definitivo_Prompts_Chiari.pdf"
              className="inline-flex items-center gap-3 bg-purple-600 text-white font-bold py-4 px-8 rounded-full hover:bg-purple-500 transition-transform hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
            >
              <Download className="w-6 h-6" />
              BAIXAR MEU GUIA EM PDF AGORA
            </a>
          </div>

          <p className="text-[#aaaaaa] text-lg leading-relaxed mb-8">
            <strong>Atenção:</strong> Assista ao vídeo abaixo. Ele revela como escalar seus ganhos usando a Inteligência Artificial que você acabou de baixar.
          </p>
          
          {/* Vídeo de Vendas (VSL) */}
          <div className="bg-[#1a1a1a] border-2 border-[#333] rounded-[15px] p-2 my-8 aspect-video flex items-center justify-center overflow-hidden shadow-2xl">
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${VIDEO_ID_YOUTUBE}?autoplay=1`}
              title="Vídeo de Vendas" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="rounded-lg bg-black"
            ></iframe>
          </div>

          <a 
            href={MEU_LINK_DE_AFILIADO}
            className="bg-gradient-to-r from-[#00ff88] to-[#00bd6e] text-black py-5 px-10 rounded-full no-underline font-bold text-lg md:text-xl inline-block transition-transform duration-300 hover:scale-105 shadow-[0_0_20px_rgba(0,255,136,0.3)]"
          >
            QUERO ACESSAR O MÉTODO COMPLETO →
          </a>
          
          <div className="text-sm text-[#ff4444] mt-6 font-bold tracking-wide">
            ESTA OFERTA EXCLUSIVA EXPIRA EM: <span>{formatTime(timeLeft)}</span>
          </div>
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
            
            <p className="text-center text-[10px] text-zinc-600 mt-2 leading-tight">
              Ao prosseguir, você concorda com nossos <a href="/termos" className="underline hover:text-zinc-400">Termos de Uso</a> e <a href="/privacidade" className="underline hover:text-zinc-400">Política de Privacidade</a>, além de consentir com o recebimento de comunicações.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
