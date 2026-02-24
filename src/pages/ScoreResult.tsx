"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Trophy, BrainCircuit, ChevronRight, ArrowLeft, Star, Zap, Activity, ShieldAlert, Share2, Download, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function ScoreResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const videoUrl = location.state?.videoUrl;

  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ title: '', text: '', module: '' });

  useEffect(() => {
    // SCORING CARRASCO (25 a 62)
    const generatedScore = Math.floor(Math.random() * (62 - 25 + 1)) + 25;
    setScore(generatedScore);

    const issues = [
      { 
        id: 'breath', 
        title: "Instabilidade de Fluxo", 
        text: "O motor neural detectou perda de pressão subglótica. Você está 'vazando' ar, o que impede a sustentação de notas longas e causa fadiga precoce.", 
        module: "Nível 1: Respiração" 
      },
      { 
        id: 'pitch', 
        title: "Desvio de Frequência", 
        text: "Sua afinação oscilou fora da margem de tolerância de 20 cents. Detectamos 'scooping' (escorregar para a nota) em 70% dos ataques.", 
        module: "Módulo A: Ataque Laser" 
      },
      { 
        id: 'rhythm', 
        title: "Inconsistência Rítmica", 
        text: "Seu ataque vocal está sistematicamente atrasado em relação ao pulso (BPM). Isso indica falta de coordenação entre audição e emissão.", 
        module: "Rhythm Basics" 
      }
    ];
    
    const selectedIssue = issues[Math.floor(Math.random() * issues.length)];
    setFeedback({
      title: selectedIssue.title,
      text: selectedIssue.text,
      module: selectedIssue.module
    });
  }, []);

  const handleShare = async () => {
    if (navigator.share && videoUrl) {
      try {
        await navigator.share({ 
          title: 'Meu Cover - Karaoke Prime', 
          text: `Fiz ${score} pontos no Karaoke Prime! Preciso treinar mais na Academy!`, 
          url: videoUrl 
        });
      } catch (error) { 
        console.log('Erro ao compartilhar', error); 
      }
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
            <Card className="glass-pillar border-2 border-primary/50 overflow-hidden rounded-3xl shadow-2xl">
              <CardContent className="p-0 aspect-video bg-black relative">
                {videoUrl ? (
                  <video src={videoUrl} controls className="w-full h-full object-cover" />
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

                <div className="space-y-6 flex-grow">
                  <div>
                    <h3 className="text-2xl font-bold text-accent neon-gold-glow mb-2">{feedback.title}</h3>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {feedback.text}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30">
                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Plano de Treino Recomendado</p>
                    <p className="text-xl font-black text-white">{feedback.module}</p>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10 space-y-4">
                  <button 
                    onClick={() => navigate('/academy', { state: { recommendedPlan: feedback.module } })} 
                    className="w-full py-4 bg-gradient-to-r from-cyan-600 to-cyan-400 text-black font-black rounded-xl uppercase tracking-wider text-sm shadow-[0_0_20px_rgba(0,183,235,0.3)] hover:shadow-[0_0_30px_rgba(0,183,235,0.6)] transition-all flex items-center justify-center gap-2"
                  >
                    <Rocket className="w-5 h-5" />
                    Ir para o Academy
                  </button>

                  <div className="flex gap-4">
                    <button 
                      onClick={handleShare}
                      className="flex-[2] py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-black rounded-xl uppercase tracking-wider text-xs shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                    >
                      <Share2 className="w-4 h-4" /> Compartilhar (TikTok/Insta/FB)
                    </button>
                    
                    {videoUrl && (
                      <button 
                        onClick={() => { 
                          const link = document.createElement('a'); 
                          link.href = videoUrl; 
                          link.download = 'meu-cover-prime.webm'; 
                          link.click(); 
                        }} 
                        className="flex-1 py-4 bg-white/10 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white/20 transition-all border border-white/10"
                      >
                        <Download className="w-4 h-4" /> Salvar
                      </button>
                    )}
                  </div>
                  
                  <Button 
                    variant="ghost"
                    onClick={() => navigate('/basic')}
                    className="w-full text-gray-500 hover:text-white py-4"
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
          <h2 className="text-2xl md:text-4xl font-extrabold uppercase tracking-widest text-foreground/10">
            CANTE. EVOLUA. CONQUISTE O MUNDO.
          </h2>
        </div>

      </div>
    </div>
  );
}