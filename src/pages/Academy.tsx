"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, GraduationCap, Sparkles, Target, ArrowLeft, Loader2, LogIn, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import InstructorAvatar from '@/components/InstructorAvatar';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useAuth } from '@/integrations/supabase/auth';
import { academyLessons } from '@/data/lessons';
import AcademyModuleMenu from '@/components/AcademyModuleMenu';

// Hardcoded fallback levels to ensure .map() never fails
const ACADEMY_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function Academy() {
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: profile, isLoading: isProfileLoading } = useUserProfile();
  
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  // 1. Loading State - Safe and centered
  if (isAuthLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-primary neon-blue-glow font-bold uppercase tracking-widest text-xs">
          Sincronizando Academy...
        </p>
      </div>
    );
  }

  // 2. AUTHENTICATION GATE: Locked screen for non-logged users
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="p-8 rounded-full bg-primary/10 border-2 border-primary/30 inline-block mx-auto shadow-[0_0_50px_rgba(0,168,225,0.2)]">
            <Lock className="h-16 w-16 text-primary neon-blue-glow" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              ACADEMY <span className="text-primary">LOCKED</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              O currículo de 10 níveis é exclusivo para membros.
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

  // Safe data extraction with nullish coalescing
  const currentLevel = profile?.academy_level ?? 0;
  const currentXp = profile?.xp ?? 0;
  const userName = user?.displayName || (user as any)?.user_metadata?.full_name || "Vocalist";

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header Section - Clean stacking, no negative margins */}
      <div className="relative w-full pt-20 pb-16 flex flex-col items-center justify-center text-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2000')] bg-cover bg-center opacity-10" />
        <div className="relative z-10 px-4">
          <div className="flex justify-center mb-8">
            <InstructorAvatar phase="rest" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
            VOCAL <span className="text-primary neon-blue-glow">ACADEMY</span>
          </h1>
          <p className="text-gray-500 font-bold tracking-[0.3em] uppercase text-xs mt-6">
            The Scientific Path to Vocal Mastery
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 mt-12 space-y-12">
        
        {/* Status Card - Cleanly separated from header */}
        <Card className="glass-pillar border-2 border-primary/40 overflow-hidden shadow-2xl rounded-[2rem]">
          <CardContent className="p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 rounded-2xl bg-primary/20 border-2 border-primary flex items-center justify-center shadow-[0_0_20px_rgba(0,168,225,0.3)]">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Artista: {userName}</p>
                  <h3 className="text-3xl font-black text-white italic">Nível {currentLevel}</h3>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-gray-500">Experiência</span>
                  <span className="text-primary neon-blue-glow">{currentXp} XP</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <div 
                    className="h-full bg-primary shadow-[0_0_10px_rgba(0,168,225,0.8)] transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (currentXp % 1000) / 10)}%` }} 
                  />
                </div>
              </div>

              <div className="text-right">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Status</p>
                <p className="text-xl font-black text-accent neon-gold-glow italic uppercase">
                  {currentLevel >= 8 ? "Pro Artist" : "Academy Student"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedLevel ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedLevel(null)}
              className="mb-8 text-gray-400 hover:text-primary group text-xs font-black uppercase tracking-widest"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Voltar ao Currículo
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4">
                <Card className="glass-pillar border-2 border-accent/40 overflow-hidden rounded-[2rem] sticky top-24">
                  <div className="h-40 bg-black/40 flex items-center justify-center border-b border-white/10">
                    <InstructorAvatar phase="suspend" />
                  </div>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-black text-white mb-2 italic uppercase">Nível {selectedLevel}</h2>
                    <p className="text-gray-400 text-xs leading-relaxed mb-6">
                      {academyLessons?.find(l => l.level === selectedLevel)?.description || "Módulos de treinamento intensivo."}
                    </p>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                      <Target className="h-5 w-5 text-accent" />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Foco: Técnica Vocal</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-black text-white uppercase italic">Módulos de Treino</h3>
                </div>
                <AcademyModuleMenu level={selectedLevel} />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ACADEMY_LEVELS.map((lvl) => {
              // Logic: Level 1 is always unlocked. Others require previous level.
              const isUnlocked = lvl === 1 || currentLevel >= lvl - 1;
              const lessonData = academyLessons?.find(l => l.level === lvl);

              return (
                <Card 
                  key={lvl}
                  className={cn(
                    "relative overflow-hidden transition-all duration-500 border-2 group cursor-pointer rounded-[2rem]",
                    !isUnlocked ? "bg-black/60 border-white/5 opacity-40 grayscale" : 
                    "glass-pillar border-primary/40 hover:border-primary hover:scale-[1.02] shadow-xl"
                  )}
                  onClick={() => isUnlocked && setSelectedLevel(lvl)}
                >
                  {!isUnlocked && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20 backdrop-blur-[1px]">
                      <Lock className="h-8 w-8 text-white/20 mb-2" />
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Locked</span>
                    </div>
                  )}

                  <CardHeader className="p-6 pb-2">
                    <div className="flex justify-between items-start">
                      <div className={cn(
                        "h-10 w-10 rounded-xl border-2 flex items-center justify-center font-black text-lg italic",
                        !isUnlocked ? "border-white/10 text-gray-600" : "border-primary/40 bg-primary/10 text-primary neon-blue-glow"
                      )}>
                        {lvl}
                      </div>
                      {isUnlocked && <Sparkles className="h-5 w-5 text-primary animate-pulse" />}
                    </div>
                    <CardTitle className={cn(
                      "text-xl font-black mt-4 uppercase italic",
                      !isUnlocked ? "text-gray-600" : "text-white"
                    )}>
                      {lessonData?.title || `Nível ${lvl}`}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-6 pt-0">
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-6">
                      {lessonData?.description || "Treinamento avançado de performance."}
                    </p>
                    <Button 
                      variant="ghost"
                      className={cn(
                        "w-full rounded-xl font-black uppercase tracking-widest text-[9px] py-4",
                        !isUnlocked ? "text-gray-700" : "text-primary hover:bg-primary/10"
                      )}
                    >
                      {isUnlocked ? "Iniciar Treino" : "Bloqueado"}
                      {isUnlocked && <ChevronRight className="ml-2 h-3 w-3" />}
                    </Button>
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