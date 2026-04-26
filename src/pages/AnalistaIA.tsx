import React, { useState } from 'react';
import React, { useState } from 'react';
import { Brain, Loader2, Globe, Zap } from 'lucide-react';

export default function AnalistaIA() {
  const [prompt, setPrompt] = useState('');
  const [resposta, setResposta] = useState('');
  const [loading, setLoading] = useState(false);

  const analisarMercado = async () => {
    if (!prompt) return;
    setLoading(true);
    setResposta(""); 

    try {
      // Agora chamamos a NOSSA API, não a do Google diretamente
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      
      if (data.error) {
        setResposta("SISTEMA ALPHA: " + (data.error.message || "Erro na conexão."));
      } else {
        setResposta(data.candidates[0].content.parts[0].text);
      }
    } catch (e) {
      setResposta("ERRO CRÍTICO: O servidor Alpha não respondeu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-3xl mx-auto text-center md:text-left">
        <h1 className="text-3xl font-black mb-8 flex items-center justify-center md:justify-start gap-3">
          <div className="bg-[#00ff88] p-2 rounded-lg text-black shadow-[0_0_20px_rgba(0,255,136,0.3)]"><Brain /></div>
          CHIARI ALPHA <span className="text-[#00ff88]">V3.1 PRO</span>
        </h1>
        
        <div className="bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] p-6 shadow-2xl">
          <textarea 
            className="w-full bg-transparent border-none text-xl text-white focus:ring-0 resize-none placeholder:text-gray-700"
            rows={5}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Comande o estrategista... (Sem VPN necessária)"
          />
          <button 
            onClick={analisarMercado}
            disabled={loading}
            className="w-full mt-6 bg-[#00ff88] text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-all transform active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Zap size={22} />}
            {loading ? 'RASTREAMENTO GLOBAL...' : 'EXECUTAR ANÁLISE PROFISSIONAL'}
          </button>
        </div>

        {resposta && (
          <div className="mt-8 p-8 bg-[#0a0a0a] border border-[#00ff88]/20 rounded-[2.5rem] text-gray-300 leading-relaxed text-lg whitespace-pre-wrap text-left shadow-2xl">
            <div className="flex items-center gap-2 mb-4 text-[#00ff88] font-bold uppercase text-xs tracking-widest">
              <Globe size={14} /> Relatório Alpha Gerado
            </div>
            {resposta}
          </div>
        )}
      </div>
    </div>
  );
}
