"use client";

import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BrainCircuit, Lock, Trophy, Star, GraduationCap, Sparkles, Target, Zap, ArrowLeft, Loader2, LogIn, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import InstructorAvatar from '@/components/InstructorAvatar';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useAuth } from '@/integrations/supabase/auth';
import { academyLessons } from '@/data/lessons';

// Importação dos menus de nível
import AcademyModuleMenu from '@/components/AcademyModuleMenu';

export default function Academy() {
  const location = useNavigate();
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: profile, isLoading: isProfileLoading } = useUserProfile();
  
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  // Fallbacks seguros para evitar crashes
  const safeProfile = profile || { academy_level: 0, xp: 0 };
  const currentLevel = safeProfile.academy_level ?? 0;
  const currentXp = safeProfile.xp ?? 0;
  
  // 10 Níveis Fixos para garantir renderização
  const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // 1. Estado de Carregamento (Prevenção de Tela Preta)
  if (isAuthLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="relative">
          <div className="absolute inset-0 blur-3xl bg-primary/30 animate-pulse rounded-full" />
          <Loader2 className="h-16 w-16 text-primary animate-spin relative z-10" />
        </div>
        <p className="text-primary neon-blue-glow mt-8 font-black tracking-[0.2em] uppercase text-xs animate-pulse">
          Sincronizando DNA Vocal...
        </p>
      </div>
    );
  }

  // 2. Estado Não Logado
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="p-8 rounded-full bg-primary/10 border-2 border-primary/30 inline-block mx-auto shadow-[0_0_50px_rgba(0,168,225,0.2)]">
            <Lock className="h-16 w-16 text-primary neon-blue-glow" />
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">
              Academy <span className="text-primary">Locked</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              O currículo científico de 10 níveis é exclusivo para membros da elite Karaoke Prime.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/login')}
            className="w-full py-8 bg-primary hover:bg-primary/90 text-black font-black rounded-2xl shadow-[0_0_30px_rgba(0,168,225,0.4)] text-xl transition-all hover:scale-105"
          >
            <LogIn className="mr-3 h-6 w-6" />
            ENTRAR PARA TREINAR
          </Button>
        </div>
      </div>
    );
  }

  // 3. Renderização Principal (Autenticado)
  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Hero Header */}
      <div className="relative h-[45vh] w-full overflow-hidden flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 opacity-30 scale-110"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2000')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/80 to-background z-10" />
        
        <div className="relative z-20 text-center px-4 animate-in fade-in slide-in-from-top-8 duration-1000">
          <div className="flex justify-center mb-6">
            <InstructorAvatar phase="rest" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none">
            Vocal <span className="text-primary neon-blue-glow">Academy</span>
          </h1>
          <p className="text-gray-400 font-bold tracking-[0.3em] uppercase text-xs md:text-sm mt-4">
            The Scientific Path to Vocal Mastery
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 -mt-16 relative z-30">
        
        {/* Dashboard de Progresso */}
        <Card className="glass-pillar border-2 border-primary/40 mb-16 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2rem]">
          <CardContent className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-[1.5rem] bg-primary/20 border-2 border-primary flex items-center justify-center shadow-[0_0_30px_rgba(0,168,225,0.4)]">
                  <GraduationCap className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Nível Atual</p>
                  <h3 className="text-4xl font-black text-white italic">Nível {currentLevel}</h3>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                  <span className="text-gray-500">Experiência (XP)</span>
                  <span className="text-primary neon-blue-glow">{currentXp} XP</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <div 
                    className="h-full bg-primary shadow-[0_0_15px_rgba(0,168,225,0.8)] transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (currentXp % 1000) / 10)}%` }} 
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Status</p>
                  <p className="text-2xl font-black text-accent neon-gold-glow italic uppercase">
                    {currentLevel >= 8 ? "Pro Artist" : "Academy Student"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedLevel ? (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedLevel(null)}
              className="mb-12 text-gray-400 hover:text-primary group text-xs font-black uppercase tracking-widest"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-2 transition-transform" />
              Voltar ao Currículo
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4 space-y-8">
                <Card className="glass-pillar border-2 border-accent/40 overflow-hidden rounded-[2rem] shadow-2xl">
                  <div className="h-48 bg-black/40 flex items-center justify-center border-b border-white/10">
                    <InstructorAvatar phase="suspend" />
                  </div>
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-black text-white mb-4 italic uppercase tracking-tighter">Nível {selectedLevel}</h2>
                    <p className="text-gray-400 text-sm leading-relaxed mb-8">
                      {academyLessons.find(l => l.level === selectedLevel)?.description || "Módulos de treinamento intensivo."}
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                        <Target className="h-6 w-6 text-accent" />
                        <div>
                          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Foco</p>
                          <p className="text-sm font-bold text-white">Técnica Vocal</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-8">
                <div className="mb-8">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Módulos de Treino</h3>
                  <p className="text-gray-500 text-sm font-medium">Apenas os módulos autorizados estão disponíveis.</p>
                </div>
                {/* Renderiza o menu do nível 1 (com lógica de trava interna) */}
                <AcademyModuleMenu level={selectedLevel} />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {levels.map((lvl) => {
              // LÓGICA ESTRITA: Apenas Nível 1 desbloqueado
              const isUnlocked = lvl === 1;
              const lessonData = academyLessons.find(l => l.level === lvl);

              return (
                <Card 
                  key={lvl}
                  className={cn(
                    "relative overflow-hidden transition-all duration-500 border-2 group cursor-pointer rounded-[2rem]",
                    !isUnlocked ? "bg-black/60 border-white/5 opacity-40 grayscale" : 
                    "glass-pillar border-primary/40 hover:border-primary hover:scale-[1.03] shadow-xl hover:shadow-primary/20"
                  )}
                  onClick={() => isUnlocked && setSelectedLevel(lvl)}
                >
                  {!isUnlocked && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20 backdrop-blur-[2px]">
                      <Lock className="h-12 w-12 text-white/20 mb-2" />
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Locked</span>
                    </div>
                  )}

                  <CardHeader className="p-8 pb-4">
                    <div className="flex justify-between items-start">
                      <div className={cn(
                        "h-12 w-12 rounded-2xl border-2 flex items-center justify-center font-black text-xl italic",
                        !isUnlocked ? "border-white/10 text-gray-600" : "border-primary/40 bg-primary/10 text-primary neon-blue-glow"
                      )}>
                        {lvl}
                      </div>
                      {isUnlocked && <Sparkles className="h-6 w-6 text-primary animate-pulse" />}
                    </div>
                    <CardTitle className={cn(
                      "text-2xl font-black mt-6 uppercase tracking-tighter italic",
                      !isUnlocked ? "text-gray-600" : "text-white"
                    )}>
                      {lessonData?.title || `Nível ${lvl}`}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-8 pt-0 space-y-6">
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 font-medium">
                      {lessonData?.description || "Treinamento avançado de performance."}
                    </p>
                    
                    <div className="pt-6 border-t border-white/5">
                      <Button 
                        variant="ghost"
                        className={cn(
                          "w-full rounded-xl font-black uppercase tracking-[0.2em] text-[10px] py-6",
                          !isUnlocked ? "text-gray-700" : "text-primary hover:bg-primary/10"
                        )}
                      >
                        {isUnlocked ? "Iniciar Treino" : "Bloqueado"}
                        {isUnlocked && <ChevronRight className="ml-2 h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}