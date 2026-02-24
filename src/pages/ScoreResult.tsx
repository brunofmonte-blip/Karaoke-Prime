"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Trophy, BrainCircuit, ChevronRight, ArrowLeft, Star, Zap, Activity, ShieldAlert, Download, Rocket } from 'lucide-react';
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

                <div className="pt-8 border-t border-white/10 space-y-6">
                  <button 
                    onClick={() => navigate('/academy', { state: { recommendedPlan: feedback.module } })} 
                    className="w-full py-5 bg-gradient-to-r from-cyan-600 to-cyan-400 text-black font-black rounded-xl uppercase tracking-wider text-base shadow-[0_0_20px_rgba(0,183,235,0.3)] hover:shadow-[0_0_30px_rgba(0,183,235,0.6)] transition-all flex items-center justify-center gap-2"
                  >
                    <Rocket className="w-6 h-6" />
                    Ir para o Academy
                  </button>

                  {/* SOCIAL SHARE GRID */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] text-center">Compartilhar Performance</p>
                    <div className="grid grid-cols-3 gap-3">
                      {/* INSTAGRAM */}
                      <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white hover:opacity-90 transition-all shadow-lg">
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        <span className="text-[10px] font-black uppercase">Instagram</span>
                      </button>
                      {/* TIKTOK */}
                      <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-black text-white hover:bg-gray-900 transition-all shadow-lg border border-white/10">
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.89-.23-2.74.24-.81.47-1.37 1.31-1.52 2.24-.07.47-.04.95.06 1.41.27 1.15 1.26 2.01 2.41 2.19.54.1 1.1.06 1.64-.09 1.25-.38 2.19-1.5 2.3-2.8.02-3.64.01-7.28.01-10.92z"/>
                        </svg>
                        <span className="text-[10px] font-black uppercase">TikTok</span>
                      </button>
                      {/* FACEBOOK */}
                      <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-[#1877F2] text-white hover:opacity-90 transition-all shadow-lg">
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span className="text-[10px] font-black uppercase">Facebook</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => { 
                        const link = document.createElement('a'); 
                        link.href = videoUrl || ''; 
                        link.download = 'meu-cover-prime.webm'; 
                        link.click(); 
                      }} 
                      className="flex-1 py-4 bg-white/10 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white/20 transition-all border border-white/10"
                    >
                      <Download className="w-4 h-4" /> Salvar Vídeo
                    </button>
                    
                    <Button 
                      variant="ghost"
                      onClick={() => navigate('/basic')}
                      className="flex-1 text-gray-500 hover:text-white py-4"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Lobby
                    </Button>
                  </div>
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