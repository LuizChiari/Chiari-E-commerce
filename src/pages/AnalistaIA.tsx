import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Bot, Sparkles, Loader2, Globe, Copy, Plus, Target } from 'lucide-react';

export default function AnalistaIA() {
  const [loading, setLoading] = useState(false);
  const [loadingBusca, setLoadingBusca] = useState(false);
  const [response, setResponse] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState('');
  const [promptInput, setPromptInput] = useState('');
  const [regrasProdutor, setRegrasProdutor] = useState('');
  const [cursosAtivos, setCursosAtivos] = useState<any[]>([]);

  const copiarTexto = async (texto: string, tipo: string) => {
    if (!texto) return;
    try {
      await navigator.clipboard.writeText(texto);
      toast.success(`${tipo} copiado para a área de transferência!`);
    } catch (err) {
      toast.error('Erro ao copiar texto');
    }
  };

  const runAnalysis = async () => {
    if (loading || !promptInput.trim()) return;
    // ... (mesma função)
  };

  const iniciarBuscaOportunidades = async () => {
    setLoadingBusca(true);
    setResultadosBusca('');

    const promptBusca = `Você é o Comandar Estrategista 3.1 PRO...

Faça uma busca completa...`; // Use o prompt mestre completo que te passei antes

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptBusca })
      });

      const data = await res.json();
      const textoFinal = data.candidates?.[0]?.content?.parts?.[0]?.text || data.choices?.[0]?.message?.content || "Sem resposta";

      setResultadosBusca(textoFinal);
      toast.success('✅ Busca concluída com sucesso!');
    } catch (err) {
      toast.error('Erro na busca');
    } finally {
      setLoadingBusca(false);
    }
  };

  const adicionarCursoAtivo = () => {
    const nome = prompt("Digite o nome do curso que você quer promover:");
    if (!nome) return;

    const novoCurso = {
      id: Date.now(),
      nome,
      regras: regrasProdutor || "Nenhuma regra definida ainda",
      data: new Date().toLocaleDateString('pt-BR')
    };

    setCursosAtivos([...cursosAtivos, novoCurso]);
    toast.success(`"${nome}" adicionado à Prateleira Ativa!`);
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white font-sans pb-20">
      <Toaster position="top-center" richColors />

      <header className="border-b border-[#0A0C0B] py-8 px-8 sticky top-0 bg-[#111111] z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-[#00A951] rounded-2xl flex items-center justify-center shadow-[0_0_30px_#00A951]">
              <Bot className="w-8 h-8 text-black" />
            </div>
            <div>
              <h1 className="text-5xl font-black tracking-[-1.5px]">
                CHIARI <span className="text-[#00A951]">ALPHA</span>
              </h1>
              <p className="text-[#00A951] text-2xl font-mono tracking-[2px]">V3.1 PRO</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-12 space-y-16">

        {/* Botão Busca Global */}
        <div className="text-center">
          <button
            onClick={iniciarBuscaOportunidades}
            disabled={loadingBusca}
            className="w-full max-w-2xl mx-auto bg-gradient-to-r from-[#00A951] to-[#00C15E] text-black font-black py-8 rounded-3xl text-3xl flex items-center justify-center gap-5 transition-all active:scale-[0.98]"
          >
            {loadingBusca ? <Loader2 className="w-9 h-9 animate-spin" /> : <Target className="w-9 h-9" />}
            🚀 INICIAR BUSCA DE OPORTUNIDADES
          </button>
          <p className="text-zinc-500 mt-4">EUA → Brasil → Europa</p>
        </div>

        {/* Central de Regras */}
        <div>
          <h3 className="text-2xl font-bold mb-6 text-[#00A951] flex items-center gap-3">
            📋 Central de Regras do Produtor
          </h3>
          <textarea
            className="w-full h-52 bg-[#0A0C0B] border border-[#1F2521] rounded-3xl p-8 text-base resize-y focus:border-[#00A951]"
            placeholder="Cole aqui todas as regras, restrições, tom de voz permitido, palavras proibidas e orientações do produtor..."
            value={regrasProdutor}
            onChange={(e) => setRegrasProdutor(e.target.value)}
          />
        </div>

        {/* Análise Manual */}
        <div>
          <h3 className="text-2xl font-bold mb-6">Análise Livre</h3>
          <textarea
            className="w-full h-52 bg-[#0A0C0B] border border-[#1F2521] rounded-3xl p-8 text-lg"
            placeholder="Digite qualquer pergunta, estratégia ou análise que quiser..."
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
          />
          <button onClick={runAnalysis} disabled={loading || !promptInput.trim()} className="mt-6 w-full bg-[#00A951] py-6 rounded-3xl text-xl font-black">
            EXECUTAR ANÁLISE PROFISSIONAL
          </button>
        </div>

        {/* Prateleira de Oportunidades */}
        {resultadosBusca && (
          <div className="bg-[#0A0C0B] border border-[#00A951]/30 rounded-3xl p-10">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-[#00A951]">Prateleira de Oportunidades</h3>
              <button onClick={() => copiarTexto(resultadosBusca, "Oportunidades")} className="flex items-center gap-2 text-sm">
                <Copy className="w-5 h-5" /> Copiar tudo
              </button>
            </div>
            <div className="whitespace-pre-wrap text-zinc-100 leading-relaxed">{resultadosBusca}</div>
          </div>
        )}

        {/* Prateleira Ativa */}
        <div className="bg-[#0A0C0B] border border-[#1F2521] rounded-3xl p-10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-[#00A951]">Prateleira Ativa - Cursos em Promoção</h3>
            <button
              onClick={adicionarCursoAtivo}
              className="flex items-center gap-3 bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-2xl text-sm"
            >
              <Plus className="w-5 h-5" /> Adicionar Curso Manualmente
            </button>
          </div>

          {cursosAtivos.length === 0 ? (
            <p className="text-zinc-500 italic">Nenhum curso ativo ainda. Use o botão acima para adicionar.</p>
          ) : (
            <div className="grid gap-6">
              {cursosAtivos.map((curso) => (
                <div key={curso.id} className="bg-[#111111] p-8 rounded-2xl border border-zinc-700">
                  <h4 className="text-xl font-semibold">{curso.nome}</h4>
                  <p className="text-sm text-emerald-400 mt-2">Adicionado em {curso.data}</p>
                  {curso.regras && curso.regras !== "Nenhuma regra definida ainda" && (
                    <div className="mt-4 text-xs bg-zinc-900 p-4 rounded-xl">
                      <strong>Regras salvas:</strong><br />
                      {curso.regras.substring(0, 200)}{curso.regras.length > 200 ? '...' : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
