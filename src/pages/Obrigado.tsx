import React, { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight, Clock } from 'lucide-react';

export default function Obrigado() {
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutos

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center px-4 py-12 font-sans">
      <div className="max-w-2xl w-full text-center">
        <div className="text-[#00ff88] font-bold text-xl mb-8 tracking-widest">CHIARI DIGITAL</div>
        
        <div className="flex justify-center mb-6">
          <CheckCircle className="text-[#00ff88] w-16 h-16" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">Tudo certo! O Guia foi enviado.</h1>
        <p className="text-gray-400 text-lg mb-10">
          Enquanto o e-mail chega, assista ao vídeo abaixo. Ele revela como escalar seus ganhos usando Inteligência Artificial.
        </p>

        {/* Espaço para o Vídeo */}
        <div className="aspect-video bg-[#1a1a1a] border-2 border-[#333] rounded-2xl flex items-center justify-center mb-10 shadow-2xl">
          <p className="text-gray-600">[VÍDEO DE VENDAS DO PARCEIRO]</p>
        </div>

        <a 
          href="#" 
          className="bg-gradient-to-r from-[#00ff88] to-[#00bd6e] text-black font-bold py-5 px-8 rounded-full text-xl inline-flex items-center gap-3 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,255,136,0.3)]"
        >
          QUERO ACESSAR O MÉTODO COMPLETO <ArrowRight />
        </a>

        <div className="mt-8 flex items-center justify-center gap-2 text-red-500 font-bold">
          <Clock size={18} />
          <span>ESTA OFERTA EXCLUSIVA EXPIRA EM: {formatTime(timeLeft)}</span>
        </div>
      </div>
    </div>
  );
}
