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

      let textoFinal = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                       data.choices?.[0]?.message?.content || 
                       "Sem resposta";

      setResponse(textoFinal);
      toast.success('✅ Relatório Alpha Gerado');
    } catch (err: any) {
      toast.error('Falha na conexão com o Comandar Estrategista');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden">
      <Toaster position="top-center" richColors />

      {/* Header */}
      <header className="border-b border-zinc-900 py-8 px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#00FF9F] rounded-2xl flex items-center justify-center shadow-[0_0_25px_#00FF9F]">
              <Bot className="w-8 h-8 text-black" />
            </div>
            <div>
              <h1 className="text-5xl font-black tracking-[-2px]">
                CHIARI <span className="text-[#00FF9F]">ALPHA</span>
              </h1>
              <p className="text-[#00FF9F] text-xl font-mono tracking-widest mt-1">V3.1 PRO</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Comandar Estrategista 3.1 PRO</h2>
          <p className="text-zinc-400 text-lg">O motor está pronto para processar sua estratégia global.</p>
        </div>

        {/* Caixa de Input */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-10 mb-10 shadow-2xl">
          <textarea
            className="w-full h-44 bg-black border border-zinc-700 rounded-2xl p-7 text-lg 
                       placeholder-zinc-500 focus:border-[#00FF9F] focus:ring-2 focus:ring-[#00FF9F]/30 
                       outline-none resize-none transition-all"
            placeholder="Faça uma pesquisa nos EUA sobre o que está acontecendo no Marketing digital..."
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
          />

          <button
            onClick={runAnalysis}
            disabled={loading || !promptInput.trim()}
            className="mt-8 w-full bg-[#00FF9F] hover:bg-[#00FF9F]/90 disabled:bg-zinc-700 
                       text-black font-black py-6 rounded-2xl text-xl flex items-center 
                       justify-center gap-3 transition-all active:scale-[0.97] shadow-[0_0_30px_#00FF9F80]"
          >
            {loading ? (
              <Loader2 className="w-7 h-7 animate-spin" />
            ) : (
              <Sparkles className="w-7 h-7" />
            )}
            EXECUTAR ANÁLISE PROFISSIONAL
          </button>
        </div>

        {/* Resposta */}
        {response && (
          <div className="bg-zinc-950 border border-[#00FF9F]/30 rounded-3xl p-10 shadow-xl">
            <div className="flex items-center gap-3 mb-8 text-[#00FF9F]">
              <div className="w-4 h-4 bg-[#00FF9F] rounded-full animate-pulse" />
              <span className="font-mono uppercase tracking-[3px] text-sm font-semibold">
                RELATÓRIO ALPHA GERADO
              </span>
            </div>
            
            <div className="prose prose-invert prose-zinc max-w-none text-[17px] leading-relaxed">
              <div className="whitespace-pre-wrap text-zinc-100">{response}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
