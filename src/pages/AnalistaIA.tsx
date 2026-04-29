import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Bot, Sparkles, Loader2, Globe, Copy } from 'lucide-react';

export default function AnalistaIA() {
  const [loading, setLoading] = useState(false);
  const [loadingBusca, setLoadingBusca] = useState(false);
  const [response, setResponse] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState('');
  const [promptInput, setPromptInput] = useState('');
  const [regrasProdutor, setRegrasProdutor] = useState('');

  const copiarTexto = async (texto: string, tipo: string) => {
    if (!texto) return;
    try {
      await navigator.clipboard.writeText(texto);
      toast.success(`${tipo} copiado!`);
    } catch (err) {
      toast.error('Erro ao copiar');
    }
  };

  // Busca de Oportunidades (Principal)
  const iniciarBuscaOportunidades = async () => {
    setLoadingBusca(true);
    setResultadosBusca('');

    const promptBusca = `Você é o Comandar Estrategista 3.1 PRO.

Faça uma busca estratégica de oportunidades de afiliados no nicho de finanças, investimentos, renda extra e automação com IA em 2026.

Ordem obrigatória:
1. EUA (tendências atuais)
2. Brasil (Hotmart, Eduzz, Monetizze, Kiwify, Braip, Ticto...)
3. Europa (Systeme.io, Digistore24, etc.)

Para cada oportunidade liste:
- Nome do curso/produto
- Região/Plataforma
- Comissão aproximada
- Ticket médio
- Por que vale promover agora
- Hook sugerido

Seja objetivo e crítico.`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptBusca })
      });

      const data = await res.json();
      const textoFinal = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                        data.choices?.[0]?.message?.content || "Sem resposta";

      setResultadosBusca(textoFinal);
      toast.success('✅ Busca concluída!');
    } catch (err) {
      toast.error('Erro na busca');
    } finally {
      setLoadingBusca(false);
    }
  };

  const runAnalysis = async () => {
    if (loading || !promptInput.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptInput })
      });

      const data = await res.json();
      const textoFinal = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                        data.choices?.[0]?.message?.content || "Sem resposta";

      setResponse(textoFinal);
      toast.success('Relatório gerado!');
    } catch (err) {
      toast.error('Erro ao gerar análise');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white font-sans pb-20">
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
              <p className="text-[#00A951] text-2xl font-mono">V3.1 PRO</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-16 space-y-16">

        {/* Botão Principal */}
        <div className="text-center">
          <button
            onClick={iniciarBuscaOportunidades}
            disabled={loadingBusca}
            className="w-full max-w-xl mx-auto bg-gradient-to-r from-[#00A951] to-[#00C15E] text-black font-black py-8 rounded-3xl text-2xl flex items-center justify-center gap-4 transition-all active:scale-95"
          >
            {loadingBusca ? <Loader2 className="w-8 h-8 animate-spin" /> : <Globe className="w-8 h-8" />}
            🚀 INICIAR BUSCA DE OPORTUNIDADES
          </button>
          <p className="text-zinc-500 mt-4 text-sm">EUA → Brasil → Europa</p>
        </div>

        {/* Central de Regras */}
        <div className="bg-[#0A0C0B] border border-[#1F2521] rounded-3xl p-8">
          <h3 className="text-xl font-semibold mb-4 text-[#00A951]">📋 Central de Regras do Produtor</h3>
          <textarea
            className="w-full h-44 bg-[#111111] border border-[#1F2521] rounded-2xl p-6 text-base resize-y focus:border-[#00A951]"
            placeholder="Cole aqui as regras, restrições e orientações do produtor..."
            value={regrasProdutor}
            onChange={(e) => setRegrasProdutor(e.target.value)}
          />
        </div>

        {/* Análise Livre */}
        <div className="bg-[#0A0C0B] border border-[#1F2521] rounded-3xl p-8">
          <h3 className="text-xl font-semibold mb-4">Análise Livre</h3>
          <textarea
            className="w-full h-44 bg-[#111111] border border-[#1F2521] rounded-2xl p-6 text-lg placeholder-zinc-500 focus:border-[#00A951]"
            placeholder="Digite qualquer pergunta ou estratégia..."
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
          />
          <button
            onClick={runAnalysis}
            disabled={loading || !promptInput.trim()}
            className="mt-6 w-full bg-[#00A951] hover:bg-[#00C15E] text-black font-black py-6 rounded-2xl text-lg"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
            EXECUTAR ANÁLISE
          </button>
        </div>

        {/* Resultados */}
        {resultadosBusca && (
          <div className="bg-[#0A0C0B] border border-[#00A951]/30 rounded-3xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-[#00A951]">Prateleira de Oportunidades</h3>
              <button onClick={() => copiarTexto(resultadosBusca, "Oportunidades")} className="text-sm flex items-center gap-2">
                <Copy className="w-5 h-5" /> Copiar
              </button>
            </div>
            <div className="whitespace-pre-wrap text-zinc-200 leading-relaxed">{resultadosBusca}</div>
          </div>
        )}

        {response && (
          <div className="bg-[#0A0C0B] border border-[#00A951]/20 rounded-3xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-[#00A951]">Relatório Alpha</h3>
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
