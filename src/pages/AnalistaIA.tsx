import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Bot, Sparkles, Loader2, Globe, Copy } from 'lucide-react';

export default function AnalistaIA() {
  const [loading, setLoading] = useState(false);
  const [loadingBusca, setLoadingBusca] = useState(false);
  const [response, setResponse] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState('');
  const [promptInput, setPromptInput] = useState('');
  const [regrasProdutor, setRegrasProdutor] = useState(''); // Nova: Regras do produtor

  const copiarTexto = async (texto: string, tipo: string) => {
    if (!texto) return;
    try {
      await navigator.clipboard.writeText(texto);
      toast.success(`${tipo} copiado!`);
    } catch (err) {
      toast.error('Erro ao copiar');
    }
  };

  const runAnalysis = async () => { /* mesma função anterior */ };

  const iniciarBuscaOportunidades = async () => { /* mesma função anterior */ };

  return (
    <div className="min-h-screen bg-[#111111] text-white font-sans">
      <Toaster position="top-center" richColors />

      <header className="border-b border-[#0A0C0B] py-8 px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
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

      <main className="max-w-5xl mx-auto px-6 pt-12 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-white">Comandar Estrategista 3.1 PRO</h2>
          <p className="text-zinc-400 mt-2">Sua Central de Marketing Automatizado</p>
        </div>

        {/* Botão Busca de Oportunidades */}
        <div className="mb-12">
          <button
            onClick={iniciarBuscaOportunidades}
            disabled={loadingBusca}
            className="w-full bg-gradient-to-r from-[#00A951] via-[#00C15E] to-[#00A951] text-black font-black py-7 rounded-3xl text-2xl flex items-center justify-center gap-4 transition-all active:scale-[0.97]"
          >
            {loadingBusca ? <Loader2 className="w-8 h-8 animate-spin" /> : <Globe className="w-8 h-8" />}
            🚀 INICIAR BUSCA DE OPORTUNIDADES
          </button>
        </div>

        {/* Central de Regras do Produtor */}
        <div className="bg-[#0A0C0B] border border-[#1F2521] rounded-3xl p-10 mb-12">
          <h3 className="text-xl font-semibold mb-4 text-[#00A951]">Central de Regras do Produtor</h3>
          <p className="text-zinc-400 mb-4">Cole aqui as regras, permissões e restrições do produtor do curso que você está promovendo:</p>
          <textarea
            className="w-full h-40 bg-[#111111] border border-[#1F2521] rounded-2xl p-6 text-base resize-y"
            placeholder="Ex: Não posso prometer 'ganhe 10 mil em 30 dias', usar tom motivacional, mencionar suporte, etc..."
            value={regrasProdutor}
            onChange={(e) => setRegrasProdutor(e.target.value)}
          />
        </div>

        {/* Caixa de Análise Manual */}
        <div className="bg-[#0A0C0B] border border-[#1F2521] rounded-3xl p-10 mb-12">
          <textarea
            className="w-full h-48 bg-[#111111] border border-[#1F2521] rounded-2xl p-7 text-lg placeholder-zinc-500 focus:border-[#00A951] outline-none resize-none"
            placeholder="Digite aqui qualquer análise ou estratégia..."
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
          />
          <button onClick={runAnalysis} disabled={loading || !promptInput.trim()} className="mt-8 w-full bg-[#00A951] ...">
            EXECUTAR ANÁLISE PROFISSIONAL
          </button>
        </div>

        {/* Resultados da Busca */}
        {resultadosBusca && (
          <div className="bg-[#0A0C0B] border border-[#00A951]/30 rounded-3xl p-10 mb-12">
            <div className="flex justify-between mb-6">
              <div className="flex items-center gap-3 text-[#00A951]">
                <Globe className="w-5 h-5" />
                PRATELEIRA DE OPORTUNIDADES
              </div>
              <button onClick={() => copiarTexto(resultadosBusca, "Oportunidades")} className="text-sm flex items-center gap-2">
                <Copy className="w-5 h-5" /> Copiar
              </button>
            </div>
            <div className="whitespace-pre-wrap text-zinc-200">{resultadosBusca}</div>
          </div>
        )}

        {response && (
          <div className="bg-[#0A0C0B] border border-[#00A951]/20 rounded-3xl p-10">
            <div className="flex justify-between mb-6">
              <div className="flex items-center gap-3 text-[#00A951]">
                RELATÓRIO ALPHA GERADO
              </div>
              <button onClick={() => copiarTexto(response, "Relatório")} className="text-sm flex items-center gap-2">
                <Copy className="w-5 h-5" /> Copiar
              </button>
            </div>
            <div className="whitespace-pre-wrap text-zinc-200">{response}</div>
          </div>
        )}
      </main>
    </div>
  );
}
