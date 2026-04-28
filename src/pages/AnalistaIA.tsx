import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Bot, Sparkles, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AnalistaIA() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [promptInput, setPromptInput] = useState('');

  const runAnalysis = async () => {
    if (loading || !promptInput.trim()) return;

    const userPrompt = promptInput.trim();
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
        toast.error(data.error.message || 'Erro ao processar análise');
        return;
      }

      let textoFinal = '';
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        textoFinal = data.candidates[0].content.parts[0].text;
      } else if (data.choices?.[0]?.message?.content) {
        textoFinal = data.choices[0].message.content;
      }

      setResponse(textoFinal);
      toast.success('✅ Relatório Alpha Gerado com sucesso!');
    } catch (err: any) {
      toast.error('Falha na conexão com o Comandar Estrategista');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Toaster position="top-center" richColors />

      {/* Header */}
      <header className="border-b border-zinc-800 py-6 px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Bot className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter">
                CHIARI <span className="text-emerald-400">ALPHA</span>
              </h1>
              <p className="text-emerald-500 text-sm font-mono">V3.1 PRO</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Comandar Estrategista 3.1 PRO</h2>
          <p className="text-zinc-400 text-lg">
            O motor está pronto para processar sua estratégia global.
          </p>
        </div>

        {/* Caixa de Prompt */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 mb-8">
          <textarea
            className="w-full h-40 bg-black border border-zinc-700 rounded-2xl p-6 text-lg 
                       placeholder-zinc-500 focus:border-emerald-500 focus:outline-none resize-none"
            placeholder="Faça uma pesquisa nos EUA sobre o que está acontecendo no Marketing digital..."
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
          />

          <button
            onClick={runAnalysis}
            disabled={loading || !promptInput.trim()}
            className="mt-6 w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-700 
                       text-black font-black py-5 rounded-2xl text-lg flex items-center 
                       justify-center gap-3 transition-all active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Sparkles className="w-6 h-6" />
            )}
            EXECUTAR ANÁLISE PROFISSIONAL
          </button>
        </div>

        {/* Área de Resposta */}
        {response && (
          <div className="bg-zinc-950 border border-emerald-500/30 rounded-3xl p-10">
            <div className="flex items-center gap-3 mb-6 text-emerald-400">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              <span className="font-mono uppercase tracking-widest text-sm">
                RELATÓRIO ALPHA GERADO
              </span>
            </div>
            
            <div className="prose prose-invert prose-zinc max-w-none text-lg leading-relaxed">
              <div className="whitespace-pre-wrap">{response}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
