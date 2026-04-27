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
    
    const userPrompt = promptInput.trim();
    if (!userPrompt) {
      toast.error('Por favor, digite sua estratégia ou pergunta.');
      return;
    }

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt })
      });

      const data = await res.json();

      if (data.error) {
        const errorMsg = data.error.message || data.error.status || 'Erro desconhecido na API';
        
        // Mensagens amigáveis para erros comuns
        if (errorMsg.includes('API key not valid') || errorMsg.includes('invalid API key')) {
          toast.error('❌ Chave da API inválida. Verifique a GEMINI_API_KEY no Vercel.');
        } else if (errorMsg.includes('not found') || errorMsg.includes('model')) {
          toast.error('❌ Modelo não encontrado. Verifique GEMINI_MODEL no Vercel.');
        } else {
          toast.error(`Erro: ${errorMsg}`);
        }
        
        throw new Error(errorMsg);
      }

      // Extração robusta da resposta do Gemini
      let textoFinal = '';
      
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        textoFinal = data.candidates[0].content.parts[0].text;
      } else if (data.candidates?.[0]?.content?.text) {
        textoFinal = data.candidates[0].content.text;
      } else if (typeof data === 'string') {
        textoFinal = data;
      } else {
        textoFinal = JSON.stringify(data, null, 2);
      }

      if (!textoFinal) {
        throw new Error('Resposta vazia da IA');
      }

      setResponse(textoFinal);
      toast.success('✅ Análise Alpha Gerada com sucesso!');

    } catch (err: any) {
      console.error('Erro na análise:', err);
      toast.error(err.message || 'Falha na conexão com o Comandar Estrategista');
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
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
            Comandar Estrategista 3.1 PRO
          </h2>
          <p className="text-slate-500 mb-6 font-medium">
            O motor Gemini 3.1 está pronto para processar sua estratégia global.
          </p>
          
          <textarea 
            className="w-full h-40 p-5 border-2 border-slate-100 rounded-2xl mb-4 
                       focus:border-purple-500 focus:ring-0 outline-none resize-none 
                       transition-all text-slate-700 text-lg shadow-inner"
            placeholder="Ex: Analise FNO marketing para 2026, sugira 3 nichos de alta conversão em dólar ou crie um plano de automação para imobiliária..."
            value={promptInput}
            onChange={e => setPromptInput(e.target.value)}
          />
          
          <button 
            onClick={runAnalysis}
            disabled={loading || !promptInput.trim()}
            className="w-full bg-purple-600 hover:bg-black text-white px-8 py-5 rounded-2xl font-black 
                       flex items-center justify-center gap-3 transition-all active:scale-95 
                       disabled:opacity-50 shadow-lg shadow-purple-200 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Sparkles className="w-6 h-6" />
            )}
            {loading ? 'SINCRONIZANDO NÚCLEO ALPHA...' : 'EXECUTAR ANÁLISE DE ALTO NÍVEL'}
          </button>
        </div>

        {response && (
          <div className="bg-slate-900 text-slate-100 p-10 rounded-[2.5rem] shadow-2xl border-t-4 border-purple-500 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-sm font-black text-purple-400 mb-6 flex items-center gap-2 uppercase tracking-[0.2em]">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              RELATÓRIO ESTRATÉGICO GERADO
            </h3>
            <div className="prose prose-invert max-w-none text-lg leading-relaxed">
              <div className="whitespace-pre-wrap">{response}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
