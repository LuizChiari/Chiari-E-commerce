import React, { useState } from 'react';
import { Brain, Search, Globe, TrendingUp, Loader2 } from 'lucide-react';
import { googleAI } from '../lib/googleAI'; // Certifique-se que este caminho está correto

export default function AnalistaIA() {
  const [prompt, setPrompt] = useState('');
  const [resposta, setResposta] = useState('');
  const [loading, setLoading] = useState(false);

  const analisarMercado = async () => {
    if (!prompt) return;
    setLoading(true);
    
    try {
      const model = googleAI.getGenerativeModel({ model: "gemini-pro" });
      
      // O PROMPT MESTRE QUE O CHIARI SOLICITOU:
      const fullPrompt = `
        Você é o Analista de Mercado Estratégico da Chiari Digital. 
        Sua missão é realizar uma análise profunda e global (World-Wide Research).
        
        CONTEXTO: O usuário quer identificar os 10 cursos/produtos mais vendidos e procurados no nicho de IA e Negócios Digitais.
        
        REGRAS DE RETORNO:
        1. PESQUISA GLOBAL: Baseie-se em tendências do Google Trends, ClickBank, Hotmart, Udemy e LinkedIn Learning (dados de 2024-2026).
        2. LISTA TOP 10: Cite o nome do curso/nicho, ticket médio e volume de busca.
        3. FONTES: Você DEVE citar de onde tirou a informação (ex: "Tendência alta no Google Trends Brasil", "Bestseller na Udemy Global").
        4. ESTRATÉGIA: Explique POR QUE esses produtos estão vendendo (qual a dor do cliente).
        
        PERGUNTA DO USUÁRIO: ${prompt}
      `;

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      setResposta(response.text());
    } catch (error) {
      setResposta("Erro ao conectar com o cérebro da IA. Verifique sua chave na Vercel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-[#00ff88] p-3 rounded-2xl">
            <Brain className="text-black w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">ANALISTA ESTRATÉGICO</h1>
            <p className="text-gray-500 text-sm">Cérebro Chiari Digital • Global Research Mode Active</p>
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-3xl p-6 shadow-2xl mb-8">
          <textarea 
            className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-[#00ff88] transition-all"
            rows={4}
            placeholder="Ex: Quais os 10 cursos de IA mais vendidos no mundo hoje e por que?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button 
            onClick={analisarMercado}
            disabled={loading}
            className="w-full mt-4 bg-[#00ff88] text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#00db75] transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Globe size={20} />}
            {loading ? 'Rastreando Mercado Global...' : 'INICIAR ANÁLISE PROFUNDA'}
          </button>
        </div>

        {resposta && (
          <div className="bg-[#111] border border-[#00ff88]/20 rounded-3xl p-8 prose prose-invert max-w-none shadow-2xl">
            <div className="flex items-center gap-2 text-[#00ff88] mb-4 font-bold uppercase tracking-widest text-xs">
              <TrendingUp size={16} /> Relatório de Inteligência de Mercado
            </div>
            <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
              {resposta}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
