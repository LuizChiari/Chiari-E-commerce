import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Bot, Sparkles, Loader2 } from 'lucide-react';

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
        toast.error(data.error.message || 'Erro ao processar');
        return;
      }

      const textoFinal = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                        data.choices?.[0]?.message?.content || 
                        "Sem resposta da IA";

      setResponse(textoFinal);
      toast.success('Relatório Alpha Gerado com sucesso!');
    } catch (err) {
      toast.error('Falha na conexão com o Comandar Estrategista');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white font-sans">
      <Toaster position="top-center" richColors />

      {/* Header */}
      <header className="border-b border-[#0A0C0B] py-8 px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            {/* Ícone com glow */}
            <div className="w-14 h-14 bg-[#00A951] rounded-2xl flex items-center justify-center shadow-[0_0_30px_#00A951]">
              <Bot className="w-8 h-8 text-black" />
            </div>

            <div>
              <h1 className="text-5xl font-black tracking-[-1.5px]">
                CHIARI <span className="text-[#00A951]">ALPHA</span>
              </h1>
              <p className="text-[#00A951] text-2xl font-mono tracking-[2px] mt-1">V3.1 PRO</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-white">Comandar Estrategista 3.1 PRO</h2>
          <p className="text-zinc-400 mt-2">O motor está pronto para processar sua estratégia global.</p>
        </div>

        {/* Caixa do Prompt */}
        <div className="bg-[#0A0C0B] border border-[#1F2521] rounded-3xl p-10 mb-10">
          <textarea
            className="w-full h-48 bg-[#111111] border border-[#1F2521] rounded-2xl p-7 text-lg 
                       placeholder-zinc-500 focus:border-[#00A951] focus:ring-1 focus:ring-[#00A951]/50 
                       outline-none resize-none transition-all"
            placeholder="Faça uma pesquisa nos EUA sobre o que está acontecendo no Marketing digital..."
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
          />

          {/* Botão com verde exato da foto */}
          <button
            onClick={runAnalysis}
            disabled={loading || !promptInput.trim()}
            className="mt-8 w-full bg-[#00A951] hover:bg-[#00C15E] disabled:bg-zinc-700 
                       text-black font-black py-6 rounded-2xl text-xl flex items-center 
                       justify-center gap-3 transition-all active:scale-[0.97] 
                       shadow-[0_0_25px_#00A95180] disabled:shadow-none"
          >
            {loading ? (
              <Loader2 className="w-7 h-7 animate-spin" />
            ) : (
              <Sparkles className="w-7 h-7" />
            )}
            EXECUTAR ANÁLISE PROFISSIONAL
          </button>
        </div>

        {/* Área da Resposta */}
        {response && (
          <div className="bg-[#0A0C0B] border border-[#00A951]/20 rounded-3xl p-10">
            <div className="flex items-center gap-3 mb-6 text-[#00A951]">
              <div className="w-3 h-3 bg-[#00A951] rounded-full animate-pulse" />
              <span className="font-mono uppercase tracking-widest text-sm font-semibold">
                RELATÓRIO ALPHA GERADO
              </span>
            </div>
            
            <div className="prose prose-invert max-w-none text-[17px] leading-relaxed text-zinc-200">
              <div className="whitespace-pre-wrap">{response}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
