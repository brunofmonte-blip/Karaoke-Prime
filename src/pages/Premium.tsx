import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Premium() {
const navigate = useNavigate();

return (
<div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 pt-24 pb-20 font-sans text-white relative">
<div className="absolute inset-0 bg-gradient-to-b from-cyan-400/5 via-black to-black z-0 pointer-events-none" />

  <div className="z-10 text-center mb-12">
    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-4">
      ESCOLHA SEU <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">PLANO</span>
    </h1>
    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
      Desbloqueie o poder total da Arena Karaoke Prime
    </p>
  </div>

  <div className="z-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
    {/* PLANO MENSAL */}
    <Card className="bg-zinc-950 border-white/10 p-10 rounded-[3rem] flex flex-col relative">
      <h3 className="text-2xl font-black text-white italic uppercase mb-2">Mensal</h3>
      <div className="flex items-baseline gap-2 mb-8">
        <span className="text-5xl font-black text-white">R$ 19,90</span>
        <span className="text-gray-500 font-bold text-sm">/mês</span>
      </div>
      <ul className="space-y-4 mb-10 flex-1">
        {['Acesso ilimitado ao Basic', 'Treinamento Academy AI', 'Ranking Global Ativo', 'Sem Anúncios'].map((item, i) => (
          <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-300">
            <Check className="text-cyan-400 h-5 w-5" /> {item}
          </li>
        ))}
      </ul>
      <a 
        href="https://buy.stripe.com/test_9B600i10C9fGg6Cb8g5sA00 (https://buy.stripe.com/test_9B600i10C9fGg6Cb8g5sA00)"
        target="_top"
        className="w-full h-14 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest flex items-center justify-center transition-all cursor-pointer"
      >
        Assinar Mensal
      </a>
    </Card>

    {/* PLANO ANUAL */}
    <Card className="bg-zinc-950 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.15)] p-10 rounded-[3rem] flex flex-col relative transform md:-translate-y-4">
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-400 text-black text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full flex items-center gap-2">
        <Star size={12} /> Mais Popular
      </div>
      <h3 className="text-2xl font-black text-cyan-400 italic uppercase mb-2">Anual</h3>
      <div className="flex items-baseline gap-2 mb-8">
        <span className="text-5xl font-black text-white">R$ 119,90</span>
        <span className="text-gray-500 font-bold text-sm">/ano</span>
      </div>
      <ul className="space-y-4 mb-10 flex-1">
        {['Tudo do plano Mensal', 'Músicas Originais IA (Next Success)', 'Acesso ao Backstage Profissional', 'Dois meses grátis'].map((item, i) => (
          <li key={i} className="flex items-center gap-3 text-sm font-bold text-white">
            <Check className="text-cyan-400 h-5 w-5" /> {item}
          </li>
        ))}
      </ul>
      <a 
        href="[https://buy.stripe.com/test_cNi00iaBc4ZqaMi9085sA01](https://buy.stripe.com/test_cNi00iaBc4ZqaMi9085sA01)"
        target="_top"
        className="w-full h-14 rounded-full bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase tracking-widest flex items-center justify-center transition-all cursor-pointer"
      >
        Assinar Anual
      </a>
    </Card>
  </div>

  <Button onClick={() => navigate('/')} variant="ghost" className="z-10 mt-12 text-gray-500 hover:text-white flex items-center gap-2 uppercase text-[10px] font-black tracking-[0.2em]">
    <ArrowLeft size={16} /> Voltar
  </Button>
</div>
);
}