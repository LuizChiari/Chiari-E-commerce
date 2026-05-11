import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Termos() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-300 p-8 md:p-16 font-sans selection:bg-purple-500/30">
      <div className="max-w-3xl mx-auto">
        <Link to="/captura" className="inline-flex items-center gap-2 text-purple-500 hover:text-purple-400 mb-8 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        
        <h1 className="text-4xl font-bold text-white mb-2">Termos de Uso</h1>
        <p className="text-sm text-zinc-500 mb-10">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        
        <div className="space-y-8 text-base leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">1. Aceitação dos Termos</h2>
            <p>Ao acessar e utilizar este site e os materiais disponibilizados (como guias e PDFs), você concorda integralmente com estes Termos de Uso. Caso não concorde, recomendamos que não utilize nossos serviços.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">2. Isenção de Responsabilidade</h2>
            <p>Os conteúdos e estratégias fornecidos, incluindo análises de inteligência artificial e recomendações de produtos afiliados, possuem caráter estritamente educativo e informativo. Não garantimos resultados financeiros ou promessas de ganhos. O sucesso da aplicação das estratégias depende exclusivamente do esforço, dedicação e contexto de cada usuário.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">3. Links de Terceiros e Afiliação</h2>
            <p>Este site contém links de afiliados que redirecionam para plataformas de terceiros. Podemos receber comissões por compras realizadas através desses links, sem qualquer custo adicional para você. Não nos responsabilizamos pelos produtos, serviços, políticas de privacidade ou práticas operacionais de sites de terceiros.</p>
          </section>
        </div>
      </div>
    </div>
  );
}