import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Bot, Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GoogleGenAI } from '@google/genai';

export default function AnalistaIA() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [promptInput, setPromptInput] = useState('');

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Chave VITE_GEMINI_API_KEY não encontrada nos Segredos.');
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const defaultPrompt = "Analise as tendências globais de mercado e sugira 3 nichos de produtos lucrativos que pagam comissão em Dólar ou Euro, além de fornecer um modelo curto de copy (texto persuasivo) de vendas para um deles.";
      const finalPrompt = promptInput.trim() ? promptInput : defaultPrompt;

      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: "Você é um Analista de Marketing Digital Especialista em Tráfego Pago e Produtos Afiliados. Responda em português de Portugal/Brasil de forma clara e profissional.\n\n" + finalPrompt,
      });

      setResponse(result.text || "Sem resposta do modelo.");
      toast.success('Análise gerada com sucesso!');
    } catch (err: any) {
      console.error(err);
      toast.error('Erro na análise IA: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Toaster position="top-right" />
      
      <header className="bg-white border-b border-slate-200 py-6 px-8 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div className="flex items-center gap-2">
              <Bot className="text-purple-600 w-8 h-8" />
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analista Estratégico <span className="text-purple-600">IA</span></h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 mt-10">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Comandar Analista</h2>
          <p className="text-slate-500 mb-6">Peça estratégias de conversão, copys de vendas ou análise de nicho gringo.</p>
          
          <textarea 
            className="w-full h-32 p-4 border rounded-xl mb-4 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
            placeholder="Opcional: Descreva especificamente o que você precisa (ex: Crie uma copy para um produto de emagrecimento nos EUA voltado para o YouTube Ads)... Se vazio, gerarei tendências gerais."
            value={promptInput}
            onChange={e => setPromptInput(e.target.value)}
          />
          
          <button 
            onClick={runAnalysis}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            Analisar Tendências Globais e Gerar Copy
          </button>
        </div>

        {response && (
          <div className="bg-slate-900 text-slate-100 p-8 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-5 h-5" /> Resultado da Análise Estratégica
            </h3>
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap">{response}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
