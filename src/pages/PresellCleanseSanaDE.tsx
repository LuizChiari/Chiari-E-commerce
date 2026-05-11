import React from 'react';
import { ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react';

export default function PresellCleanseSanaDE() {
  // ⚠️ WICHTIG (IMPORTANTE): 
  // Mude este link para o SLUG do seu produto no painel admin (ex: "/cleanse-sana")
  const AFFILIATE_SLUG_URL = "/cleanse-sana";

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Header (Gera credibilidade para o Google Ads) */}
      <header className="w-full bg-blue-900 py-3 px-4 text-center">
        <p className="text-white text-sm font-bold tracking-wide uppercase">
          Advertorial | Gesundheit & Wohlbefinden
        </p>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 md:py-16">
        {/* Headline em Alemão */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-900 mb-6">
            Entdecken Sie das einfache Morgenritual, das eine gesunde Verdauung und natürliche Entgiftung unterstützt
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Tausende von Menschen nutzen bereits diese ungewöhnliche tägliche Methode, um ihren Körper zu unterstützen, ihre Darmgesundheit zu fördern und sich jeden Tag leichter zu fühlen.
          </p>
        </div>

        {/* Main Image (Substitua a URL abaixo caso queira usar uma foto própria) */}
        <div className="w-full rounded-2xl overflow-hidden mb-8 shadow-lg border border-slate-200">
          <img src="https://images.unsplash.com/photo-1542691457-cbe4df041eb2?q=80&w=1000&auto=format&fit=crop" alt="Gesundes Getränk" className="w-full h-auto object-cover aspect-video" />
        </div>
        
        {/* Parágrafo extra para aprovação do Google Ads (Evitar Bridge Page) */}
        <div className="mb-10 text-slate-700 leading-relaxed space-y-4">
          <p>Experten sind sich einig, dass ein gesunder Darm der Schlüssel zu allgemeinem Wohlbefinden, mehr Energie und einem funktionierenden Stoffwechsel ist. Viele herkömmliche Methoden erfordern jedoch drastische Diäten oder anstrengende Routinen, die im Alltag schwer durchzuhalten sind.</p>
          <p>Zum Glück gibt es jetzt eine neue Herangehensweise, die von Ernährungsexperten gelobt wird und sich problemlos in jeden Morgen integrieren lässt.</p>
        </div>

        {/* Bullet Points de Benefícios */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 md:p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">Warum geht das viral?</h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-lg text-slate-700">
              <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
              <span><strong>100% Natürlich:</strong> Hergestellt aus wissenschaftlich fundierten Inhaltsstoffen.</span>
            </li>
            <li className="flex items-start gap-3 text-lg text-slate-700">
              <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
              <span><strong>Darmunterstützung:</strong> Fördert eine gesunde Verdauung und Regelmäßigkeit.</span>
            </li>
            <li className="flex items-start gap-3 text-lg text-slate-700">
              <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
              <span><strong>Energieschub:</strong> Anwender berichten von mehr Energie im Alltag, ganz ohne plötzlichen Leistungsabfall.</span>
            </li>
          </ul>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-sm text-slate-500 mb-3 uppercase tracking-wider font-semibold">
            Schritt 1: Sehen Sie sich die kostenlose Präsentation an
          </p>
          <a 
            href={AFFILIATE_SLUG_URL}
            className="inline-flex items-center justify-center gap-2 w-full md:w-auto bg-green-600 hover:bg-green-500 text-white font-black text-xl py-5 px-10 rounded-full transition-transform hover:scale-105 shadow-[0_10px_20px_rgba(22,163,74,0.3)] mb-4"
          >
            JETZT DAS VIDEO ANSEHEN <ArrowRight className="w-6 h-6" />
          </a>
          <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mt-2">
            <ShieldCheck className="w-4 h-4" /> Sichere SSL-Verbindung
          </p>
        </div>
      </main>

      {/* Footer / Compliance (Obrigatório para o Google Ads) */}
      <footer className="w-full bg-slate-50 border-t border-slate-200 py-8 px-4 mt-10 text-center">
        <p className="text-xs text-slate-400 max-w-2xl mx-auto mb-4 leading-relaxed">
          Die Aussagen zu diesen Produkten wurden nicht von der Europäischen Arzneimittel-Agentur bewertet. Dieses Produkt ist nicht zur Diagnose, Behandlung, Heilung oder Vorbeugung von Krankheiten bestimmt. Dies ist ein Advertorial und keine Nachrichtenartikel, Blog oder Gesundheitsupdate.
        </p>
        <div className="flex justify-center gap-4 text-sm text-slate-500">
          <a href="/privacidade" className="hover:underline">Datenschutzrichtlinie</a>
          <a href="/termos" className="hover:underline">Nutzungsbedingungen</a>
        </div>
      </footer>
    </div>
  );
}