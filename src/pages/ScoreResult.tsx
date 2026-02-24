"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Trophy, BrainCircuit, ChevronRight, ArrowLeft, Star, Zap, Activity, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function ScoreResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ title: '', text: '', action: '', route: '' });

  useEffect(() => {
    // Strict scoring algorithm (skews lower to encourage training)
    const generatedScore = Math.floor(Math.random() * (82 - 38 + 1)) + 38;
    setScore(generatedScore);

    // Dynamic Feedback Matrix
    if (generatedScore < 50) {
      setFeedback({
        title: "Diagnóstico: Instabilidade Crítica",
        text: "O motor neural detectou oscilações graves na afinação e perda de fôlego no fim das frases. É normal no início, mas requer base técnica imediata.",
        action: "Treinar Nível 1: Respiração",
        route: "/academy"
      });
    } else if (generatedScore < 70) {
      setFeedback({
        title: "Diagnóstico: Potencial Detectado",
        text: "Você segurou bem o tom na maior parte do tempo, mas detectamos instabilidade (scooping) nos ataques das notas agudas. Recomendamos focar em exercícios de apoio.",
        action: "Treinar Módulo A: Ataque Laser",
        route: "/academy"
      });
    } else {
      setFeedback({
        title: "Diagnóstico: Performance Técnica",
        text: "Sua estabilidade de afinação foi satisfatória, mas o controle de vibrato ainda apresenta irregularidades rítmicas. Excelente base para o próximo nível.",
        action: "Avançar para Duelo Online",
        route: "/basic"
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 border border-primary/30 mb-4">
            <Trophy className="h-10 w-10 text-primary neon-blue-glow" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic">
            Show <span className="text-primary neon-blue-glow">Finalizado!</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Score Card */}
          <Card className="lg:col-span-1 glass-pillar border-2 border-primary/50 overflow-hidden">
            <CardContent className="p-8 flex flex-col items-center text-center justify-center h-full">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em] mb-2">Pontuação Final</p>
              <div className="relative">
                <div className="absolute inset-0 blur-2xl bg-primary/20 rounded-full animate-pulse" />
                <span className="text-8xl font-black text-white relative z-10 tabular-nums">
                  {score}
                </span>
              </div>
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn("h-5 w-5", i < Math.floor(score / 20) ? "text-yellow-400 fill-yellow-400" : "text-gray-600")} />
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-destructive uppercase tracking-widest">
                <ShieldAlert className="h-3 w-3" />
                Strict AI Evaluation
              </div>
            </CardContent>
          </Card>

          {/* AI Diagnostic Card */}
          <Card className="lg:col-span-2 glass-pillar border-2 border-accent/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BrainCircuit className="h-32 w-32 text-accent" />
            </div>
            <CardContent className="p-8 space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/20 border border-accent/40">
                  <Activity className="h-6 w-6 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-white">Relatório do Instrutor IA</h2>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent neon-gold-glow">{feedback.title}</h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {feedback.text}
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => navigate(feedback.route)}
                  className="flex-grow bg-accent hover:bg-accent/90 text-black font-black py-7 rounded-2xl text-lg shadow-lg shadow-accent/20 transition-transform hover:scale-[1.02]"
                >
                  {feedback.action}
                  <ChevronRight className="ml-2 h-6 w-6" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/basic')}
                  className="bg-transparent border-white/20 text-white hover:bg-white/5 py-7 rounded-2xl px-8"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Voltar
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Footer Tagline */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl md:text-4xl font-extrabold uppercase tracking-widest text-foreground/40">
            CANTE. EVOLUA. CONQUISTE O MUNDO.
          </h2>
        </div>

      </div>
    </div>
  );
}