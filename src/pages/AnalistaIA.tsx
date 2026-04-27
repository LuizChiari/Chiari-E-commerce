import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Bot, Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AnalistaIA() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [promptInput, setPromptInput] = useState('');

  const runAnalysis = async () => {
    if (loading) return;
    setLoading(true);
    setResponse('');

    try {
      // CHAMADA PROFISSIONAL: Fala com o seu arquivo api/chat.ts na Vercel
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: promptInput.trim() || "Analise tendências globais de marketing para 2026 e sugira 3 nichos de alta conversão em dólar." 
        })
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message || "Erro na resposta da IA");
      }

      // O Gemini retorna os dados dentro de candidates[0].content.parts[0].text
      const textoFinal = data.candidates[0].content.parts[0].text;
      setResponse(textoFinal);
      toast.success('Análise Alpha Gerada!');

    } catch (err) {
      console.error(err);
      toast.error('Erro: ' + (err instanceof Error ? err.message : 'Falha na conexão'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      <Toaster position="top-right" richColors />
      
      <header className="bg-white border-b border-slate-200 py-6 px-8 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="p-2 hover:bg-slate-100 rounded-full transition-all">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Bot className="text-white w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight underline decoration-purple-500">
                CHIARI ALPHA <span className="text-purple-600 font-mono text-sm">v3.1 PRO</span>
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 mt-10">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl mb-8 transform transition-all">
          <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
            Comandar Estrategista 3.1 PRO
          </h2>
          <p className="text-slate-500 mb-6 font-medium">O motor Gemini 3.1 está pronto para processar sua estratégia global.</p>
          
          <textarea 
            className="w-full h-40 p-5 border-2 border-slate-100 rounded-2xl mb-4 focus:border-purple-500 focus:ring-0 outline-none resize-none transition-all text-slate-700 text-lg shadow-inner"
            placeholder="Ex: Crie um plano de automação de voz para uma imobiliária faturando R$ 200k/mês..."
            value={promptInput}
            onChange={e => setPromptInput(e.target.value)}
          />
          
          <button 
            onClick={runAnalysis}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-black text-white px-8 py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-purple-200"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
            {loading ? 'SINCRONIZANDO NÚCLEO ALPHA...' : 'EXECUTAR ANÁLISE DE ALTO NÍVEL'}
          </button>
        </div>

        {response && (
          <div className="bg-slate-900 text-slate-100 p-10 rounded-[2.5rem] shadow-2xl border-t-4 border-purple-500 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-sm font-black text-purple-400 mb-6 flex items-center gap-2 uppercase tracking-[0.2em]">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              Relatório Estratégico Gerado
            </h3>
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap leading-relaxed text-lg font-light">{response}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
