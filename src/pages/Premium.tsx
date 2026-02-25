"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function Premium() {
  const navigate = useNavigate();
  const primeBenefits = [
    "Acesso total aos 10 Níveis da Karaoke Academy.",
    "Análises ilimitadas da Inteligência Artificial.",
    "Modo Offline: Baixe aulas e treinos.",
    "Selo exclusivo 'Prime Member' no seu perfil.",
    "Prioridade máxima na vitrine de Trend Topics."
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto p-4 md:p-8 max-w-6xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft className="mr-2 h-5 w-5" /> Voltar
        </Button>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">
            KARAOKE <span className="text-primary neon-blue-glow">PRIME</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Escolha o plano ideal para sua jornada vocal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Monthly Plan */}
          <Card className="glass-pillar border-2 border-white/10 rounded-3xl overflow-hidden">
            <CardContent className="p-10 flex flex-col items-center text-center">
              <h2 className="text-2xl font-bold text-white uppercase tracking-widest mb-6">Plano Mensal</h2>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-2xl font-bold text-gray-400">R$</span>
                <span className="text-6xl font-black text-white tracking-tighter">19</span>
                <span className="text-2xl font-bold text-gray-400">,90</span>
              </div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-10">Por Mês</p>
              <Button variant="outline" className="w-full py-6 rounded-xl border-primary text-primary hover:bg-primary/10">
                ASSINAR MENSAL
              </Button>
            </CardContent>
          </Card>

          {/* Annual Plan */}
          <Card className="glass-pillar border-2 border-primary/50 rounded-3xl overflow-hidden relative">
            <div className="absolute top-0 right-0 bg-primary text-black text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-widest">
              Melhor Valor
            </div>
            <CardContent className="p-10 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Crown className="h-6 w-6 text-primary neon-blue-glow" />
              </div>
              <h2 className="text-2xl font-bold text-primary neon-blue-glow uppercase tracking-widest mb-6">Plano Anual</h2>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-2xl font-bold text-gray-400">R$</span>
                <span className="text-6xl font-black text-white tracking-tighter">119</span>
                <span className="text-2xl font-bold text-gray-400">,90</span>
              </div>
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-2">Equivalente a R$ 9,99/mês</p>
              <p className="text-xs text-muted-foreground mb-10">Cobrado anualmente</p>
              <Button className="w-full py-6 rounded-xl bg-primary hover:bg-primary/90 text-black font-bold shadow-lg shadow-primary/20">
                ASSINAR ANUAL
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-8 text-center uppercase tracking-widest">Benefícios Prime</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {primeBenefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}