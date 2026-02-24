"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ShieldCheck, Zap, ArrowLeft, Crown, Star, Music, Mic2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function Premium() {
  const navigate = useNavigate();

  const benefits = [
    { title: "Academy Completa", desc: "Acesso total aos 10 Níveis da Karaoke Academy.", icon: Crown },
    { title: "IA Ilimitada", desc: "Análises ilimitadas da Inteligência Artificial em tempo real.", icon: Zap },
    { title: "Modo Offline", desc: "Baixe músicas para cantar sem internet em qualquer lugar.", icon: Music },
    { title: "Selo Prime", desc: "Selo exclusivo 'Prime Member' no seu perfil e rankings.", icon: ShieldCheck },
    { title: "Destaque Global", desc: "Prioridade máxima na vitrine de Trend Topics e Audições.", icon: Star }
  ];

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed relative flex items-center justify-center p-4 md:p-8"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600')" }}
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-0" />

      <div className="container max-w-5xl relative z-10">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="text-white hover:bg-white/10 mb-8"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Voltar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Value Proposition */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
                KARAOKE <span className="text-primary neon-blue-glow">PRIME</span>
              </h1>
              <p className="text-xl text-gray-400 font-medium">
                Desbloqueie seu verdadeiro potencial vocal com a tecnologia mais avançada do mundo.
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 group">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/30 group-hover:border-primary transition-colors">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{benefit.title}</h3>
                    <p className="text-sm text-gray-400">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Pricing Card */}
          <Card className="glass-pillar border-2 border-primary/50 rounded-[2.5rem] overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
            <CardContent className="p-10 flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,168,225,0.4)]">
                <Crown className="h-10 w-10 text-primary neon-blue-glow" />
              </div>
              
              <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-2">Plano Anual</h2>
              <p className="text-gray-400 mb-8">O melhor custo-benefício para sua evolução.</p>
              
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-2xl font-bold text-gray-400">R$</span>
                <span className="text-7xl font-black text-white tracking-tighter">29</span>
                <span className="text-2xl font-bold text-gray-400">,90</span>
              </div>
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-10">Por Mês</p>

              <div className="w-full space-y-4">
                <Button className="w-full py-8 text-xl font-black bg-primary hover:bg-primary/90 text-black rounded-2xl shadow-[0_0_30px_rgba(0,168,225,0.5)] transition-all">
                  ASSINAR AGORA
                </Button>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                  Cancelamento fácil a qualquer momento • Pagamento Seguro
                </p>
              </div>

              <div className="mt-10 pt-8 border-t border-white/10 w-full flex justify-center gap-8 opacity-50">
                <ShieldCheck className="h-8 w-8 text-white" />
                <Mic2 className="h-8 w-8 text-white" />
                <Zap className="h-8 w-8 text-white" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}