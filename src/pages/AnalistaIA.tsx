import React, { useState } from 'react';
import { Brain, Search, Globe, TrendingUp, Loader2, Zap, Target } from 'lucide-react';
import { googleAI } from '../lib/googleAI';

export default function AnalistaIA() {
  const [prompt, setPrompt] = useState('');
  const [resposta, setResposta] = useState('');
  const [loading, setLoading] = useState(false);

  const analisarMercado = async () => {
    if (!prompt) return;
    setLoading(true);
    
    try {
      const model = googleAI.getGenerativeModel({ model: "gemini-pro" });
      
      const megaPrompt = `
        Você é o 'Chiari Alpha', a Inteligência de Elite da Chiari Digital. 
        Seu nível de conhecimento em Marketing Digital, Copywriting e Engenharia de Prompts supera os maiores especialistas do mercado brasileiro.

        Sua tarefa é analisar o mercado global e entregar uma estratégia imbatível.

        DIRETRIZES DE ANÁLISE:
        1. PESQUISA MULTIFONTE: Cruze dados de Google Trends (Real-time), tendências do TikTok Creative Center, Bestsellers da Hotmart/Kiwify e ClickBank.
        2. ANÁLISE DE LACUNA: Não liste apenas o que vendem, identifique o que está FALTANDO no mercado.
        3. OS 10 MELHORES: Liste 10 produtos/cursos de IA com: Nome, Plataforma, Ticket, Volume de busca e o 'Gatilho de Ouro'.
        4. ENGENHARIA DE PROMPT: Para o melhor produto da lista, escreva um PROMPT MESTRE que o usuário possa usar para criar toda a copy de vendas desse produto. Use frameworks como AIDA ou PAS.

        ESTILO DE RESPOSTA:
        - Use Tom de Voz de Autoridade Máxima.
        - Seja direto, técnico e estratégico.
        - Cite fontes específicas (Ex: 'Analisei o volume de 450k buscas mensais para o termo X no SEMRush').

        PERGUNTA DO CHIARI: ${prompt}
      `;

      const result = await model.generateContent(megaPrompt);
      const response = await result.response;
      setResposta(response.text());
    } catch (error) {
      setResposta("Conexão falhou. Verifique a chave VITE_GEMINI_API_KEY na Vercel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header de Elite */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-[#00ff88] to-[#00bd6e] p-4 rounded-3xl shadow-[0_0_30px_rgba(0,255,136,0.2)]">
              <Brain className="text-black w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                CHIARI ALPHA <span className="text-[#00ff88]">v3.0</span>
              </h1>
              <p className="text-gray-500 font-mono text-xs uppercase tracking-[0.2em]">Market Intelligence & Prompt Engineering</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-[#111] px-4 py-2 rounded-full border border-white/5 flex items-center gap-2 text-xs text-gray-400">
              <Globe size={14} className="text-[#00ff88]" /> Global Mode
            </div>
            <div className="bg-[#111] px-4 py-2 rounded-full border border-white/5 flex items-center gap-2 text-xs text-gray-400">
              <Zap size={14} className="text-[#00ff88]" /> High Precision
            </div>
          </div>
        </div>

        {/* Console de Entrada */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#00ff88] to-[#006e3d] rounded-[2rem] blur opacity-10 group-hover:opacity-25 transition duration-1000"></div>
          <div className="relative bg-[#0f0f0f] border border-white/10 rounded-[2rem] p-6 shadow-2xl">
            <textarea 
              className="w-full bg-transparent border-none text-xl text-white placeholder:text-gray-800 focus:ring-0 resize-none"
              rows={3}
              placeholder="Descreva o nicho ou peça a análise dos 10 melhores agora..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button 
              onClick={analisarMercado}
              disabled={loading}
              className="w-full mt-6 bg-[#00ff88] text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 shadow-[0_10px_20px_rgba(0,255,136,0.15)]"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Target size={22} />}
              {loading ? 'PROCESSANDO DADOS GLOBAIS...' : 'EXECUTAR ANÁLISE DE MERCADO'}
            </button>
          </div>
        </div>

        {/* Output de Inteligência */}
        {resposta && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-[#111] border border-[#00ff88]/30 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div className="bg-[#00ff88]/10 px-8 py-4 border-b border-[#00ff88]/20 flex items-center justify-between">
                <span className="text-[#00ff88] text-sm font-bold tracking-widest">RELATÓRIO ESTRATÉGICO GERADO</span>
                <TrendingUp size={18} className="text-[#00ff88]" />
              </div>
              <div className="p-8 md:p-12">
                <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-strong:text-[#00ff88] prose-headings:text-white whitespace-pre-wrap leading-relaxed font-light text-lg">
                  {resposta}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
