import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Privacidade() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-300 p-8 md:p-16 font-sans selection:bg-purple-500/30">
      <div className="max-w-3xl mx-auto">
        <Link to="/captura" className="inline-flex items-center gap-2 text-purple-500 hover:text-purple-400 mb-8 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        
        <h1 className="text-4xl font-bold text-white mb-2">Política de Privacidade</h1>
        <p className="text-sm text-zinc-500 mb-10">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        
        <div className="space-y-8 text-base leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">1. Coleta de Dados</h2>
            <p>Coletamos informações que você nos fornece diretamente, como nome e endereço de e-mail, quando você preenche nossos formulários para baixar materiais gratuitos ou se cadastra em nossas listas de comunicação.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">2. Uso das Informações</h2>
            <p>Utilizamos os seus dados exclusivamente para enviar os materiais solicitados, comunicações de marketing, ofertas de produtos afiliados e atualizações relevantes. Você pode cancelar a sua inscrição (opt-out) a qualquer momento clicando no link disponível no rodapé de nossos e-mails.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">3. Cookies e Rastreamento de Terceiros</h2>
            <p>Nosso site utiliza tecnologias de rastreamento, como cookies, Pixels da Meta (Facebook/Instagram), TikTok Ads e Google Analytics. Essas ferramentas nos ajudam a entender o comportamento dos visitantes, medir conversões e otimizar nossas campanhas publicitárias. Ao continuar navegando, você consente com a utilização dessas tecnologias.</p>
          </section>
          
          <p className="mt-12 text-sm text-zinc-500 border-t border-zinc-800 pt-8">
            Se tiver dúvidas sobre como tratamos seus dados, entre em contato através dos nossos canais oficiais de suporte.
          </p>
        </div>
      </div>
    </div>
  );
}