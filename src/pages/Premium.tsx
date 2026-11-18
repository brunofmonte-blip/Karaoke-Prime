import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Star, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getAccessToken } from '@/lib/auth';
import { useIsPremium } from '@/hooks/use-is-premium';

import { useI18n } from '@/i18n';
type Plan = 'monthly' | 'annual';

// As músicas (modo Basic) são sempre gratuitas.
// A assinatura libera a Academy completa e os recursos do Karaoke Prime.
const MONTHLY_FEATURES: [string, string][] = [
  ['Academy completa: os 10 níveis', 'Full Academy: all 10 levels'],
  ['Ranking Global ativo', 'Global Ranking'],
  ['Histórico da sua evolução vocal', 'Your vocal progress history'],
];
const ANNUAL_FEATURES: [string, string][] = [
  ['Tudo do plano Mensal', 'Everything in Monthly'],
  ['Economia de 2 meses no ano', '2 months free every year'],
  ['Prioridade nos novos recursos', 'Early access to new features'],
];

export default function Premium() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null);
  const { isPremium } = useIsPremium();
  const { tr } = useI18n();

  const subscribe = async (plan: Plan) => {
    setLoadingPlan(plan);
    try {
      const token = await getAccessToken();
      if (!token) {
        toast.info(tr('Entre na sua conta para assinar.', 'Sign in to subscribe.'));
        navigate('/login');
        return;
      }
      const res = await fetch('/api/stripe-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || tr('Erro ao iniciar pagamento', 'Could not start checkout'));
      window.location.href = data.url;
    } catch (err: any) {
      toast.error(err.message || tr('Não foi possível iniciar o pagamento.', 'Could not start checkout.'));
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
          {tr('ESCOLHA SEU', 'CHOOSE YOUR')} <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">{tr('PLANO', 'PLAN')}</span>
        </h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
          {tr('Cantar é sempre grátis. A assinatura libera a sua evolução.', 'Singing is always free. Subscribe to level up your voice.')}
        </p>
        {params.get('assinatura') === 'cancelada' && (
          <p className="mt-4 text-sm text-gray-400">{tr('Pagamento cancelado. Nada foi cobrado.', 'Checkout canceled. You were not charged.')}</p>
        )}
        {isPremium && (
          <p className="mt-4 text-sm font-bold text-cyan-400">{tr('Você já é assinante Prime. Obrigado!', "You're already a Prime member. Thank you!")}</p>
        )}
      </div>

      <div className="z-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        {/* PLANO MENSAL */}
        <Card className="bg-zinc-950 border-white/10 p-10 rounded-[3rem] flex flex-col relative">
          <h3 className="text-2xl font-black text-white italic uppercase mb-2">{tr('Mensal', 'Monthly')}</h3>
          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-5xl font-black text-white">R$ 19,90</span>
            <span className="text-gray-500 font-bold text-sm">{tr('/mês', '/month')}</span>
          </div>
          <ul className="space-y-4 mb-10 flex-1">
            {MONTHLY_FEATURES.map(([pt, en]) => (
              <li key={pt} className="flex items-center gap-3 text-sm font-bold text-gray-300">
                <Check className="text-cyan-400 h-5 w-5" /> {tr(pt, en)}
              </li>
            ))}
          </ul>
          <button
            onClick={() => subscribe('monthly')}
            disabled={loadingPlan !== null || isPremium}
            className="w-full h-14 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 text-white font-black uppercase tracking-widest flex items-center justify-center transition-all"
          >
            {buttonContent('monthly', tr('Assinar Mensal', 'Subscribe Monthly'))}
          </button>
        </Card>

        {/* PLANO ANUAL */}
        <Card className="bg-zinc-950 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.15)] p-10 rounded-[3rem] flex flex-col relative transform md:-translate-y-4">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-400 text-black text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full flex items-center gap-2">
            <Star size={12} /> {tr('Mais Popular', 'Most Popular')}
          </div>
          <h3 className="text-2xl font-black text-cyan-400 italic uppercase mb-2">{tr('Anual', 'Annual')}</h3>
          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-5xl font-black text-white">R$ 119,90</span>
            <span className="text-gray-500 font-bold text-sm">{tr('/ano', '/year')}</span>
          </div>
          <ul className="space-y-4 mb-10 flex-1">
            {ANNUAL_FEATURES.map(([pt, en]) => (
              <li key={pt} className="flex items-center gap-3 text-sm font-bold text-white">
                <Check className="text-cyan-400 h-5 w-5" /> {tr(pt, en)}
              </li>
            ))}
          </ul>
          <button
            onClick={() => subscribe('annual')}
            disabled={loadingPlan !== null || isPremium}
            className="w-full h-14 rounded-full bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-black font-black uppercase tracking-widest flex items-center justify-center transition-all"
          >
            {buttonContent('annual', tr('Assinar Anual', 'Subscribe Annual'))}
          </button>
        </Card>
      </div>

      <p className="z-10 mt-8 text-xs text-gray-500 max-w-xl text-center">
        {tr('Next Success, Next Talent e Backstage serão vendidos à parte quando forem lançados. Cancele quando quiser.', 'Next Success, Next Talent and Backstage will be sold separately when they launch. Cancel anytime.')}
      </p>

      <Button onClick={() => navigate('/')} variant="ghost" className="z-10 mt-8 text-gray-500 hover:text-white flex items-center gap-2 uppercase text-[10px] font-black tracking-[0.2em]">
        <ArrowLeft size={16} /> {tr('Voltar', 'Back')}
      </Button>
    </div>
  );
}
