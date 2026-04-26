import React, { useState } from 'react';
import { Brain, TrendingUp, Loader2, Target, Globe, Zap } from 'lucide-react';

export default function AnalistaIA() {
  const [prompt, setPrompt] = useState('');
  const [resposta, setResposta] = useState('');
  const [loading, setLoading] = useState(false);

  const analisarMercado = async () => {
    if (!prompt) return;
    setLoading(true);
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `
            Você é o CHIARI ALPHA v3.1 - O Estrategista-Chefe da Chiari Digital.
            Sua missão é superar qualquer especialista de marketing (como Douglas Castro) através de análise de dados global e identificação de brechas de mercado.

            PROTOCOLO DE ANÁLISE:
            1. SCANNER GLOBAL: Identifique tendências de IA nos EUA e Europa (ClickBank, Digistore24) que ainda não chegaram ao Brasil.
            2. ANÁLISE DE BRECHAS: Onde os grandes players estão falhando? Encontre nichos de IA inexplorados.
            3. OPORTUNIDADES DE 7 DÍGITOS: Liste 5 oportunidades reais com ticket médio, público-alvo e potencial de lucro.
            4. AUTOMAÇÃO DE EXECUÇÃO: Para a melhor oportunidade, forneça um PROMPT MESTRE que automatize a criação do funil de vendas, anúncios e conteúdo.

            PERGUNTA DO CHIARI: ${prompt}
          ` }] }]
        })
      });

      const data = await response.json();
      setResposta(data.candidates[0].content.parts[0].text);
    } catch (error) {
      setResposta("ERRO DE CONEXÃO: Verifique a chave VITE_GEMINI_API_KEY no painel da Vercel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="bg-gradient-to-br from-[#00ff88] to-[#00bd6e] p-4 rounded-3xl shadow-[0_0_20px_rgba(0,255,136,0.2)]">
            <Brain className="text-black w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">Chiari Alpha <span className="text-[#00ff88]">v3.1</span></h1>
            <p className="text-gray-500 font-mono text-xs tracking-widest">Global Strategy & Market Gap Analysis</p>
          </div>
        </div>

        <div className="bg-[#0f0f0f] border border-white/10 rounded-[2rem] p-6 shadow-2xl mb-10">
          <textarea 
            className="w-full bg-transparent border-none text-xl text-white placeholder:text-gray-800 focus:ring-0 resize-none"
            rows={4}
            placeholder="Qual brecha de mercado vamos explorar hoje, Mestre?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button 
            onClick={analisarMercado}
            disabled={loading}
            className="w-full mt-6 bg-[#00ff88] text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-all transform hover:-translate-y-1 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Globe size={22} />}
            {loading ? 'RASTREAMENTO GLOBAL EM CURSO...' : 'EXECUTAR ANÁLISE DE MERCADO'}
          </button>
        </div>

        {resposta && (
          <div className="bg-[#111] border border-[#00ff88]/30 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="bg-[#00ff88]/10 px-8 py-4 border-b border-[#00ff88]/20 flex items-center justify-between">
              <span className="text-[#00ff88] text-sm font-bold tracking-widest uppercase">Relatório de Inteligência Alpha</span>
              <Zap size={18} className="text-[#00ff88]" />
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
