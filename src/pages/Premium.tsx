import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Star, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getAccessToken } from '@/lib/auth';
import { useIsPremium } from '@/hooks/use-is-premium';

type Plan = 'monthly' | 'annual';

// As músicas (modo Basic) são sempre gratuitas.
// A assinatura libera a Academy completa e os recursos do Karaoke Prime.
const MONTHLY_FEATURES = [
  'Academy completa: os 10 níveis',
  'Ranking Global ativo',
  'Histórico da sua evolução vocal',
  'Sem anúncios',
];
const ANNUAL_FEATURES = [
  'Tudo do plano Mensal',
  'Economia de 2 meses no ano',
  'Prioridade nos novos recursos',
];

export default function Premium() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null);
  const { isPremium } = useIsPremium();

  const subscribe = async (plan: Plan) => {
    setLoadingPlan(plan);
    try {
      const token = await getAccessToken();
      if (!token) {
        toast.info('Entre na sua conta para assinar.');
        navigate('/login');
        return;
      }
      const res = await fetch('/api/stripe-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Erro ao iniciar pagamento');
      window.location.href = data.url;
    } catch (err: any) {
      toast.error(err.message || 'Não foi possível iniciar o pagamento.');
      setLoadingPlan(null);
    }
  };

  const buttonContent = (plan: Plan, label: string) =>
    loadingPlan === plan ? <Loader2 className="h-5 w-5 animate-spin" /> : label;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 pt-24 pb-20 font-sans text-white relative">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/5 via-black to-black z-0 pointer-events-none" />

      <div className="z-10 text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-4">
          ESCOLHA SEU <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">PLANO</span>
        </h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
          Cantar é sempre grátis. A assinatura libera a sua evolução.
        </p>
        {params.get('assinatura') === 'cancelada' && (
          <p className="mt-4 text-sm text-gray-400">Pagamento cancelado. Nada foi cobrado.</p>
        )}
        {isPremium && (
          <p className="mt-4 text-sm font-bold text-cyan-400">Você já é assinante Prime. Obrigado!</p>
        )}
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
            {MONTHLY_FEATURES.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm font-bold text-gray-300">
                <Check className="text-cyan-400 h-5 w-5" /> {item}
              </li>
            ))}
          </ul>
          <button
            onClick={() => subscribe('monthly')}
            disabled={loadingPlan !== null || isPremium}
            className="w-full h-14 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 text-white font-black uppercase tracking-widest flex items-center justify-center transition-all"
          >
            {buttonContent('monthly', 'Assinar Mensal')}
          </button>
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
            {ANNUAL_FEATURES.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm font-bold text-white">
                <Check className="text-cyan-400 h-5 w-5" /> {item}
              </li>
            ))}
          </ul>
          <button
            onClick={() => subscribe('annual')}
            disabled={loadingPlan !== null || isPremium}
            className="w-full h-14 rounded-full bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-black font-black uppercase tracking-widest flex items-center justify-center transition-all"
          >
            {buttonContent('annual', 'Assinar Anual')}
          </button>
        </Card>
      </div>

      <p className="z-10 mt-8 text-xs text-gray-500 max-w-xl text-center">
        Next Success, Next Talent e Backstage serão vendidos à parte quando forem lançados.
        Cancele quando quiser.
      </p>

      <Button onClick={() => navigate('/')} variant="ghost" className="z-10 mt-8 text-gray-500 hover:text-white flex items-center gap-2 uppercase text-[10px] font-black tracking-[0.2em]">
        <ArrowLeft size={16} /> Voltar
      </Button>
    </div>
  );
}
