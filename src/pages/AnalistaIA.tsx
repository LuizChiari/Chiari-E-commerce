import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Bot, Sparkles, Loader2, Globe, Copy, Plus } from 'lucide-react';

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
      toast.success(`${tipo} copiado!`);
    } catch (err) {
      toast.error('Erro ao copiar');
    }
  };

  const runAnalysis = async () => { /* mesma função anterior */ };

  const iniciarBuscaOportunidades = async () => { /* mesma função anterior */ };

  // Adicionar curso na Prateleira Ativa (por enquanto manual)
  const adicionarCursoAtivo = () => {
    const nome = prompt("Nome do curso que você quer promover:");
    if (!nome) return;

    const novoCurso = {
      id: Date.now(),
      nome: nome,
      regras: regrasProdutor,
      data: new Date().toLocaleDateString('pt-BR')
    };

    setCursosAtivos([...cursosAtivos, novoCurso]);
    toast.success(`Curso "${nome}" adicionado à Prateleira Ativa!`);
  };

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

      <main className="max-w-5xl mx-auto px-6 pt-12 pb-20 space-y-12">

        {/* Botão Busca Global */}
        <div>
          <button
            onClick={iniciarBuscaOportunidades}
            disabled={loadingBusca}
            className="w-full bg-gradient-to-r from-[#00A951] via-[#00C15E] to-[#00A951] text-black font-black py-7 rounded-3xl text-2xl flex items-center justify-center gap-4 transition-all"
          >
            {loadingBusca ? <Loader2 className="w-8 h-8 animate-spin" /> : <Globe className="w-8 h-8" />}
            🚀 INICIAR BUSCA DE OPORTUNIDADES
          </button>
        </div>

        {/* Central de Regras */}
        <div className="bg-[#0A0C0B] border border-[#1F2521] rounded-3xl p-10">
          <h3 className="text-xl font-semibold mb-4 text-[#00A951]">Central de Regras do Produtor</h3>
          <textarea
            className="w-full h-40 bg-[#111111] border border-[#1F2521] rounded-2xl p-6 text-base"
            placeholder="Cole aqui as regras, restrições e permissões do produtor do curso (ex: palavras proibidas, tom permitido, etc...)"
            value={regrasProdutor}
            onChange={(e) => setRegrasProdutor(e.target.value)}
          />
        </div>

        {/* Análise Manual */}
        <div className="bg-[#0A0C0B] border border-[#1F2521] rounded-3xl p-10">
          <textarea
            className="w-full h-48 bg-[#111111] border border-[#1F2521] rounded-2xl p-7 text-lg placeholder-zinc-500 focus:border-[#00A951]"
            placeholder="Digite aqui qualquer análise ou estratégia..."
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
          />
          <button onClick={runAnalysis} disabled={loading || !promptInput.trim()} className="mt-8 w-full bg-[#00A951] py-6 rounded-2xl text-xl">
            EXECUTAR ANÁLISE PROFISSIONAL
          </button>
        </div>

        {/* Prateleira de Oportunidades */}
        {resultadosBusca && (
          <div className="bg-[#0A0C0B] border border-[#00A951]/30 rounded-3xl p-10">
            <div className="flex justify-between mb-6">
              <div className="text-[#00A951] font-semibold">PRATELEIRA DE OPORTUNIDADES</div>
              <button onClick={() => copiarTexto(resultadosBusca, "Oportunidades")} className="text-sm flex items-center gap-2">
                <Copy className="w-5 h-5" /> Copiar
              </button>
            </div>
            <div className="whitespace-pre-wrap text-zinc-200">{resultadosBusca}</div>
          </div>
        )}

        {/* Prateleira Ativa */}
        <div className="bg-[#0A0C0B] border border-[#1F2521] rounded-3xl p-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-[#00A951]">Prateleira Ativa (Cursos que estou promovendo)</h3>
            <button
              onClick={() => {
                const nome = prompt("Nome do curso para adicionar na Prateleira Ativa:");
                if (nome) {
                  setCursosAtivos([...cursosAtivos, { id: Date.now(), nome, regras: regrasProdutor, data: new Date().toLocaleDateString('pt-BR') }]);
                  toast.success("Curso adicionado à Prateleira Ativa!");
                }
              }}
              className="flex items-center gap-2 bg-zinc-800 px-5 py-2 rounded-xl text-sm hover:bg-zinc-700"
            >
              <Plus className="w-4 h-4" /> Adicionar Curso
            </button>
          </div>

          {cursosAtivos.length === 0 ? (
            <p className="text-zinc-500">Nenhum curso ativo ainda. Adicione um acima.</p>
          ) : (
            <div className="space-y-4">
              {cursosAtivos.map(curso => (
                <div key={curso.id} className="bg-[#111111] p-6 rounded-2xl border border-zinc-700">
                  <h4 className="font-semibold">{curso.nome}</h4>
                  <p className="text-sm text-zinc-400 mt-1">Adicionado em: {curso.data}</p>
                  {curso.regras && (
                    <p className="text-xs text-emerald-400 mt-3">Regras salvas</p>
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
