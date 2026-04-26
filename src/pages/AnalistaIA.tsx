import React, { useState } from 'react';
import { Brain, Loader2, Globe, Zap } from 'lucide-react';

export default function AnalistaIA() {
  const [prompt, setPrompt] = useState('');
  const [resposta, setResposta] = useState('');
  const [loading, setLoading] = useState(false);

  const analisarMercado = async () => {
    if (!prompt) return;
    setLoading(true);
    setResposta(""); // Limpa resposta anterior
    
    // CHAVE EXTRAÍDA DO SEU PRINT 1000028467.jpg
    const KEY = "AIzaSyBL88l_16dsos4holVoOBUhtl3T7t7RRpM".trim();

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Você é o CHIARI ALPHA v3.1. Analise com profundidade: ${prompt}` }] }]
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      if (data.candidates && data.candidates[0].content) {
        setResposta(data.candidates[0].content.parts[0].text);
      } else {
        throw new Error("O Google não retornou texto. Tente outro prompt.");
      }

    } catch (error) {
      setResposta("ERRO ALPHA: " + (error instanceof Error ? error.message : "Chave inválida ou bloqueada."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="bg-[#00ff88] p-4 rounded-3xl">
            <Brain className="text-black w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black uppercase">Chiari Alpha <span className="text-[#00ff88]">v3.1</span></h1>
        </div>

        <div className="bg-[#0f0f0f] border border-white/10 rounded-[2rem] p-6 mb-10">
          <textarea 
            className="w-full bg-transparent border-none text-xl text-white focus:ring-0 resize-none"
            rows={4}
            placeholder="Mande sua análise difícil aqui..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button 
            onClick={analisarMercado}
            disabled={loading}
            className="w-full mt-6 bg-[#00ff88] text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Globe size={22} />}
            {loading ? 'PROCESSANDO LÓGICA...' : 'EXECUTAR ANÁLISE PESADA'}
          </button>
        </div>

        {resposta && (
          <div className="bg-[#111] border border-[#00ff88]/30 rounded-[2.5rem] p-8 md:p-12 text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
            {resposta}
          </div>
        )}
      </div>
    </div>
  );
}
