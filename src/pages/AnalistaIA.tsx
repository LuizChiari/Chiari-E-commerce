import React, { useState } from 'react';
import { Brain, TrendingUp, Loader2, Target } from 'lucide-react';

export default function AnalistaIA() {
  const [prompt, setPrompt] = useState('');
  const [resposta, setResposta] = useState('');
  const [loading, setLoading] = useState(false);

  const analisarMercado = async () => {
    if (!prompt) return;
    setLoading(true);
    
    try {
      // Usando a API Fetch direta para evitar erros de biblioteca na Vercel
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Você é o Chiari Alpha v3. Analise globalmente os 10 melhores cursos de IA e crie um prompt mestre de vendas. Pergunta: ${prompt}` }] }]
        })
      });

      const data = await response.json();
      setResposta(data.candidates[0].content.parts[0].text);
    } catch (error) {
      setResposta("ERRO: Verifique a VITE_GEMINI_API_KEY na Vercel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-black mb-8 text-[#00ff88]">CHIARI ALPHA v3.0</h1>
        <textarea 
          className="w-full bg-[#111] border border-white/10 rounded-2xl p-6 text-xl"
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="O que vamos analisar hoje?"
        />
        <button 
          onClick={analisarMercado}
          disabled={loading}
          className="w-full mt-6 bg-[#00ff88] text-black font-bold py-5 rounded-2xl"
        >
          {loading ? 'PROCESSANDO...' : 'EXECUTAR ANÁLISE'}
        </button>
        {resposta && (
          <div className="mt-12 p-8 bg-[#111] rounded-3xl text-left whitespace-pre-wrap border border-[#00ff88]/20">
            {resposta}
          </div>
        )}
      </div>
    </div>
  );
}
