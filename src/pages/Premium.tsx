"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Crown, ArrowLeft } from 'lucide-react';

export default function Premium() {
  const navigate = useNavigate();

  // ==========================================
  // LINKS DE PAGAMENTO DEFINITIVOS (MULTI-MOEDAS)
  // ==========================================
  const STRIPE_LINK_MENSAL = 'https://buy.stripe.com/test_aFa14mgZA8bCdYu0tC5sA02';
  const STRIPE_LINK_ANUAL = 'https://buy.stripe.com/test_9B63cueRs1NebQmdgo5sA03';

  const primeBenefits = [
    "Acesso total aos 10 Níveis da Karaoke Academy.",
    "Análises ilimitadas da Inteligência Artificial.",
    "Modo Offline: Baixe aulas e treinos.",
    "Selo exclusivo 'Prime Member' no seu perfil.",
    "Prioridade máxima na vitrine de Trend Topics."
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white text-sm mb-8 flex items-center gap-2 transition-colors">
          <ArrowLeft size={16} /> Voltar
        </button>
        
        <div className="text-center mb-12">
          <div className="inline-flex p-3 bg-gradient-to-tr from-cyan-900 to-cyan-700 rounded-full mb-6 border border-cyan-500 shadow-[0_0_30px_rgba(0,183,235,0.3)]">
            <Crown className="text-cyan-400" size={40} />
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-white mb-4 uppercase italic tracking-tighter">
            KARAOKE <span className="text-cyan-500">PRIME</span>
          </h1>
          <p className="text-gray-400 text-lg">Escolha o plano ideal para sua jornada vocal e desbloqueie 100% da IA.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* PLANO MENSAL */}
          <div className="bg-gray-950 border border-gray-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:border-cyan-500/50 transition-colors relative shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest">Plano Mensal</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-2xl font-bold text-gray-500">R$</span>
              <span className="text-7xl font-black text-white">19</span>
              <span className="text-2xl font-bold text-gray-400">,90</span>
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-8">Por Mês</p>
            <button 
              onClick={() => window.location.href = STRIPE_LINK_MENSAL}
              className="w-full py-4 bg-transparent border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black font-black rounded-xl uppercase tracking-wider transition-colors"
            >
              Assinar Mensal
            </button>
          </div>

          {/* PLANO ANUAL */}
          <div className="bg-gray-950 border-2 border-cyan-500 rounded-3xl p-8 flex flex-col items-center justify-center text-center relative shadow-[0_0_40px_rgba(0,183,235,0.2)]">
            <div className="absolute -top-4 right-8 bg-cyan-500 text-black px-4 py-1.5 rounded-md font-black text-[10px] uppercase tracking-widest shadow-lg">Melhor Valor</div>
            
            <h3 className="text-xl font-bold text-cyan-500 mb-6 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(0,183,235,0.8)]">Plano Anual</h3>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-2xl font-bold text-gray-500">R$</span>
              <span className="text-7xl font-black text-white">119</span>
              <span className="text-2xl font-bold text-gray-400">,90</span>
            </div>
            <p className="text-cyan-500 text-xs font-bold uppercase tracking-widest mb-2">Por Ano</p>
            <p className="text-gray-500 text-[10px] mb-8 uppercase tracking-widest">Equivale a apenas R$ 9,99/mês</p>
            <button 
              onClick={() => window.location.href = STRIPE_LINK_ANUAL}
              className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black rounded-xl uppercase tracking-wider transition-colors shadow-[0_0_20px_rgba(0,183,235,0.4)]"
            >
              Assinar Anual
            </button>
          </div>
        </div>

        <div className="bg-gray-950/50 border border-gray-800 rounded-3xl p-8 backdrop-blur-sm mb-8">
          <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6 text-center">Tudo que você ganha no Prime</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {primeBenefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="text-cyan-500 shrink-0 mt-0.5" size={18} />
                <span className="text-gray-300 text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center border-t border-gray-900 pt-8 mt-8">
          <p className="text-gray-600 text-[10px] uppercase tracking-widest">Pagamento 100% seguro processado por Stripe</p>
        </div>
      </div>
    </div>
  );
}