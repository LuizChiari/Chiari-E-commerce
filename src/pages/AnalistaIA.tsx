import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Bot, Sparkles, Loader2, Globe, Copy } from 'lucide-react';

export default function AnalistaIA() {
  const [loading, setLoading] = useState(false);
  const [loadingBusca, setLoadingBusca] = useState(false);
  const [response, setResponse] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState('');
  const [promptInput, setPromptInput] = useState('');

  // Função para copiar texto
  const copiarTexto = async (texto: string, tipo: string) => {
    if (!texto) return;
    try {
      await navigator.clipboard.writeText(texto);
      toast.success(`${tipo} copiado com sucesso!`);
    } catch (err) {
      toast.error('Erro ao copiar texto');
    }
  };

  // Análise manual livre
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

  // Busca de Oportunidades (EUA → Brasil → Europa)
  const iniciarBuscaOportunidades = async () => {
    setLoadingBusca(true);
    setResultadosBusca('');

    const promptBusca = `Você é o Comandar Estrategista 3.1 PRO, especialista em marketing de afiliados e tendências globais.

Faça uma busca completa e estratégica de oportunidades de afiliados no nicho de finanças pessoais, investimentos, renda extra, automação com IA e marketing digital em 2026.

Siga exatamente esta ordem:

1. **EUA** (Primeira prioridade)
   - Quais são as maiores tendências atuais em marketing digital, finanças e IA nos Estados Unidos?
   - Quais tipos de produtos estão vendendo mais?
   - Quais ângulos e estratégias estão funcionando bem lá?

2. **Brasil**
   - Plataformas: Hotmart, Eduzz, Monetizze, Kiwify, Braip, Ticto e outras brasileiras.
   - Liste os melhores cursos/produtos no nicho de finanças, investimentos, IA e renda extra.

3. **Europa**
   - Plataformas como Systeme.io, Digistore24, Clickbank Europa, etc.
   - Oportunidades relevantes no nicho.

Para cada oportunidade encontrada, forneça:
- Nome completo do curso ou produto
- Região (EUA, Brasil ou Europa)
- Plataforma
- Link da página de vendas ou afiliação (se disponível)
- Comissão aproximada
- Ticket médio aproximado
- Pontos fortes
- Por que vale promover agora
- Ângulo de venda sugerido (hook principal)

Seja crítico e priorize alto potencial de conversão.`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptBusca })
      });

      const data = await res.json();

      if (data.error) {
        toast.error(data.error.message || 'Erro na busca');
        return;
      }

      const textoFinal = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                        data.choices?.[0]?.message?.content || 
                        "Sem resposta da IA";

      setResultadosBusca(textoFinal);
      toast.success('✅ Busca de Oportunidades concluída!');

    } catch (err) {
      toast.error('Erro ao realizar a busca de oportunidades');
    } finally {
      setLoadingBusca(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white font-sans">
      <Toaster position="top-center" richColors />

      {/* Header */}
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
          <p className="text-zinc-400 mt-2">Central de Marketing Inteligente para Afiliados</p>
        </div>

        {/* Botão Principal - Busca de Oportunidades */}
        <div className="mb-12">
          <button
            onClick={iniciarBuscaOportunidades}
            disabled={loadingBusca}
            className="w-full bg-gradient-to-r from-[#00A951] via-[#00C15E] to-[#00A951] hover:brightness-110
                       text-black font-black py-7 rounded-3xl text-2xl flex items-center justify-center gap-4 
                       transition-all active:scale-[0.97] shadow-[0_0_35px_#00A95180]"
          >
            {loadingBusca ? <Loader2 className="w-8 h-8 animate-spin" /> : <Globe className="w-8 h-8" />}
            🚀 INICIAR BUSCA DE OPORTUNIDADES
          </button>
          <p className="text-center text-zinc-500 text-sm mt-3">
            EUA → Brasil → Europa | Nicho: Finanças + IA + Marketing Digital
          </p>
        </div>

        {/* Caixa de Análise Manual Livre */}
        <div className="bg-[#0A0C0B] border border-[#1F2521] rounded-3xl p-10 mb-12">
          <textarea
            className="w-full h-48 bg-[#111111] border border-[#1F2521] rounded-2xl p-7 text-lg 
                       placeholder-zinc-500 focus:border-[#00A951] focus:ring-1 focus:ring-[#00A951]/50 
                       outline-none resize-none transition-all"
            placeholder="Digite aqui qualquer análise, estratégia ou pergunta que quiser..."
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
          />

          <button
            onClick={runAnalysis}
            disabled={loading || !promptInput.trim()}
            className="mt-8 w-full bg-[#00A951] hover:bg-[#00C15E] disabled:bg-zinc-700 
                       text-black font-black py-6 rounded-2xl text-xl flex items-center justify-center gap-3 transition-all"
          >
            {loading ? <Loader2 className="w-7 h-7 animate-spin" /> : <Sparkles className="w-7 h-7" />}
            EXECUTAR ANÁLISE PROFISSIONAL
          </button>
        </div>

        {/* Resultados da Busca de Oportunidades */}
        {resultadosBusca && (
          <div className="bg-[#0A0C0B] border border-[#00A951]/30 rounded-3xl p-10 mb-12">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3 text-[#00A951]">
                <Globe className="w-5 h-5" />
                <span className="font-mono uppercase tracking-widest text-sm font-semibold">
                  PRATELEIRA DE OPORTUNIDADES
                </span>
              </div>
              <button
                onClick={() => copiarTexto(resultadosBusca, "Busca de Oportunidades")}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm transition-colors"
              >
                <Copy className="w-5 h-5" />
                Copiar
              </button>
            </div>
            <div className="prose prose-invert max-w-none text-[17px] leading-relaxed text-zinc-200">
              <div className="whitespace-pre-wrap">{resultadosBusca}</div>
            </div>
          </div>
        )}

        {/* Resposta da Análise Manual */}
        {response && (
          <div className="bg-[#0A0C0B] border border-[#00A951]/20 rounded-3xl p-10">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3 text-[#00A951]">
                <div className="w-3 h-3 bg-[#00A951] rounded-full animate-pulse" />
                <span className="font-mono uppercase tracking-widest text-sm font-semibold">
                  RELATÓRIO ALPHA GERADO
                </span>
              </div>
              <button
                onClick={() => copiarTexto(response, "Relatório")}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm transition-colors"
              >
                <Copy className="w-5 h-5" />
                Copiar
              </button>
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
