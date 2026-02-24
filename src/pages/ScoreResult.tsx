"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Trophy, BrainCircuit, ChevronRight, ArrowLeft, Star, Zap, Activity, ShieldAlert, Share2, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function ScoreResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const videoUrl = location.state?.videoUrl;

  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ title: '', text: '', action: '', route: '' });

  useEffect(() => {
    // Strict MVP Scoring (38 to 82) to push Academy
    const generatedScore = Math.floor(Math.random() * (82 - 38 + 1)) + 38;
    setScore(generatedScore);

    // Dynamic Strict Feedback Matrix
    if (generatedScore < 50) {
      setFeedback({
        title: "Diagnóstico: Instabilidade Crítica",
        text: "O motor neural detectou oscilações graves na afinação e perda de fôlego no fim das frases. É normal no início, mas requer base técnica imediata para evitar lesões.",
        action: "Treinar Nível 1: Respiração",
        route: "/academy"
      });
    } else if (generatedScore < 70) {
      setFeedback({
        title: "Diagnóstico: Potencial Detectado",
        text: "Você segurou bem o tom na maior parte do tempo, mas detectamos instabilidade (scooping) nos ataques das notas agudas. Recomendamos focar em exercícios de apoio diafragmático.",
        action: "Treinar Módulo A: Ataque Laser",
        route: "/academy"
      });
    } else {
      setFeedback({
        title: "Diagnóstico: Performance Técnica",
        text: "Sua estabilidade de afinação foi satisfatória, mas o controle de vibrato ainda apresenta irregularidades rítmicas. Excelente base para o próximo nível de maestria.",
        action: "Avançar para Duelo Online",
        route: "/basic"
      });
    }
  }, []);

  const handleShare = async () => {
    if (navigator.share && videoUrl) {
      try {
        await navigator.share({ 
          title: 'Meu Cover - Karaoke Prime', 
          text: `Fiz ${score} pontos no Karaoke Prime! Olha como eu cantei!`, 
          url: videoUrl 
        });
      } catch (error) { 
        console.log('Erro ao compartilhar', error); 
      }
    } else {
      // Fallback: Download the video
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = 'meu-cover-karaoke-prime.webm';
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 border border-primary/30 mb-4">
            <Trophy className="h-10 w-10 text-primary neon-blue-glow" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic">
            Show <span className="text-primary neon-blue-glow">Finalizado!</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Video Preview & Score */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="glass-pillar border-2 border-primary/50 overflow-hidden rounded-3xl">
              <CardContent className="p-0 aspect-video bg-black relative">
                {videoUrl ? (
                  <video 
                    src={videoUrl} 
                    controls 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    Vídeo não disponível
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass-pillar border-2 border-primary/50 overflow-hidden rounded-3xl">
              <CardContent className="p-8 flex flex-col items-center text-center">
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
          </div>

          {/* RIGHT: AI Diagnostic & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="glass-pillar border-2 border-accent/50 relative overflow-hidden rounded-3xl h-full">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <BrainCircuit className="h-32 w-32 text-accent" />
              </div>
              <CardContent className="p-8 space-y-8 relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/20 border border-accent/40">
                    <Activity className="h-6 w-6 text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Relatório do Instrutor IA</h2>
                </div>

                <div className="space-y-4 flex-grow">
                  <h3 className="text-2xl font-bold text-accent neon-gold-glow">{feedback.title}</h3>
                  <p className="text-gray-300 leading-relaxed text-xl">
                    {feedback.text}
                  </p>
                </div>

                <div className="pt-8 border-t border-white/10 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button 
                      onClick={() => navigate(feedback.route)}
                      className={cn(
                        "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500",
                        "text-white font-black py-8 rounded-2xl text-lg shadow-[0_0_20px_rgba(6,182,212,0.5)]",
                        "transition-all duration-300 hover:scale-[1.02] border-none"
                      )}
                    >
                      <Rocket className="mr-2 h-6 w-6" />
                      {feedback.action}
                      <ChevronRight className="ml-2 h-6 w-6" />
                    </Button>
                    <Button 
                      onClick={handleShare}
                      variant="outline"
                      className="bg-primary/10 border-primary/50 text-primary hover:bg-primary/20 py-8 rounded-2xl text-lg font-bold"
                    >
                      <Share2 className="mr-2 h-6 w-6" />
                      Exportar / Compartilhar
                    </Button>
                  </div>
                  
                  <Button 
                    variant="ghost"
                    onClick={() => navigate('/basic')}
                    className="w-full text-gray-400 hover:text-white py-4"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar ao Lobby
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

        {/* Footer Tagline */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl md:text-4xl font-extrabold uppercase tracking-widest text-foreground/20">
            CANTE. EVOLUA. CONQUISTE O MUNDO.
          </h2>
        </div>

      </div>
    </div>
  );
}