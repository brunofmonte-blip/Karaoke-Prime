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
    "Acesso total aos 10 Níveis da Karaoke Academy.", 
    "Análises ilimitadas da Inteligência Artificial.", 
    "Selo exclusivo 'Prime Member' no seu perfil.", 
    "Prioridade máxima na vitrine de Trend Topics."
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
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
                KARAOKE <span className="text-primary neon-blue-glow">PRIME</span>
              </h1>
              <p className="text-xl text-gray-400 font-medium">
                Desbloqueie seu verdadeiro potencial vocal com a tecnologia mais avançada do mundo.
              </p>
            </div>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-gray-300 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <Card className="glass-pillar border-2 border-primary/50 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <CardContent className="p-10 flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,168,225,0.4)]">
                <Crown className="h-10 w-10 text-primary neon-blue-glow" />
              </div>
              
              <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-2">Plano Anual</h2>
              
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-2xl font-bold text-gray-400">R$</span>
                <span className="text-7xl font-black text-white tracking-tighter">29</span>
                <span className="text-2xl font-bold text-gray-400">,90</span>
              </div>
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-10">Por Mês</p>

              <Button className="w-full py-8 text-xl font-black bg-primary hover:bg-primary/90 text-black rounded-2xl shadow-[0_0_30px_rgba(0,168,225,0.5)] transition-all">
                ASSINAR AGORA
              </Button>
              
              <p className="mt-6 text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                Pagamento Seguro • Cancelamento a qualquer momento
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}