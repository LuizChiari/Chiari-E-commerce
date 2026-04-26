import React, { useState } from 'react';
import { Brain, Search, Globe, TrendingUp, Loader2, Zap, Target } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function AnalistaIA() {
  const [prompt, setPrompt] = useState('');
  const [resposta, setResposta] = useState('');
  const [loading, setLoading] = useState(false);

  const analisarMercado = async () => {
    if (!prompt) return;
    setLoading(true);
    
    try {
      // Puxa a chave direto das variáveis da Vercel
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const megaPrompt = `
        Você é o 'Chiari Alpha', a Inteligência de Elite da Chiari Digital. 
        Analise o mercado global de IA e Negócios Digitais (2024-2026).
        
        TAREFA:
        1. Liste os 10 produtos/cursos de IA mais procurados e vendidos no mundo.
        2. Para cada um, cite: Nome, Plataforma, Por que vende e a Fonte do dado.
        3. No final, crie um PROMPT MESTRE para o Chiari usar no ChatGPT para vender o melhor produto da lista.
        
        PERGUNTA DO CHIARI: ${prompt}
      `;

      const result = await model.generateContent(megaPrompt);
      const response = await result.response;
      setResposta(response.text());
    } catch (error) {
      setResposta("ERRO CRÍTICO: Verifique se a VITE_GEMINI_API_KEY está correta na Vercel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-[#00ff88] to-[#00bd6e] p-4 rounded-3xl">
              <Brain className="text-black w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter">CHIARI ALPHA <span className="text-[#00ff88]">v3.0</span></h1>
              <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Global Intelligence System</p>
            </div>
          </div>
        </div>

        <div className="bg-[#0f0f0f] border border-white/10 rounded-[2rem] p-6 shadow-2xl">
          <textarea 
            className="w-full bg-transparent border-none text-xl text-white focus:ring-0 resize-none"
            rows={3}
            placeholder="O que vamos analisar hoje, Mestre?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button 
            onClick={analisarMercado}
            disabled={loading}
            className="w-full mt-6 bg-[#00ff88] text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.01] transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Target size={22} />}
            {loading ? 'RASTREAMENTO GLOBAL EM CURSO...' : 'EXECUTAR ANÁLISE ALPHA'}
          </button>
        </div>

        {resposta && (
          <div className="mt-12 bg-[#111] border border-[#00ff88]/30 rounded-[2.5rem] overflow-hidden">
            <div className="bg-[#00ff88]/10 px-8 py-4 border-b border-[#00ff88]/20 flex items-center justify-between">
              <span className="text-[#00ff88] text-sm font-bold">RELATÓRIO DE INTELIGÊNCIA</span>
              <TrendingUp size={18} className="text-[#00ff88]" />
            </div>
            <div className="p-8 md:p-12 text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
              {resposta}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
