"use client";

import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BrainCircuit, Lock, PlayCircle, ChevronLeft, Trophy, Star, GraduationCap, Sparkles, Target, Zap, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import InstructorAvatar from '@/components/InstructorAvatar';
import { useUserProfile } from '@/hooks/use-user-profile';
import { academyLessons } from '@/data/lessons';
import AcademyModuleMenu from '@/components/AcademyModuleMenu';
import AcademyLevel2Menu from '@/components/AcademyLevel2Menu';
import AcademyLevel3Menu from '@/components/AcademyLevel3Menu';
import AcademyLevel4Menu from '@/components/AcademyLevel4Menu';
import AcademyLevel5Menu from '@/components/AcademyLevel5Menu';
import AcademyLevel6Menu from '@/components/AcademyLevel6Menu';
import AcademyLevel7Menu from '@/components/AcademyLevel7Menu';
import AcademyLevel8Menu from '@/components/AcademyLevel8Menu';
import AcademyLevel9Menu from '@/components/AcademyLevel9Menu';
import AcademyLevel10Menu from '@/components/AcademyLevel10Menu';

export default function Academy() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: profile } = useUserProfile();
  const recommendedPlan = location.state?.recommendedPlan;

  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const currentLevel = profile?.academy_level ?? 0;
  const currentXp = profile?.xp ?? 0;
  const xpToNextLevel = (currentLevel + 1) * 1000;
  const xpProgress = (currentXp % 1000) / 10;

  const renderLevelMenu = (level: number) => {
    switch (level) {
      case 1: return <AcademyModuleMenu level={1} />;
      case 2: return <AcademyLevel2Menu />;
      case 3: return <AcademyLevel3Menu />;
      case 4: return <AcademyLevel4Menu />;
      case 5: return <AcademyLevel5Menu />;
      case 6: return <AcademyLevel6Menu />;
      case 7: return <AcademyLevel7Menu />;
      case 8: return <AcademyLevel8Menu />;
      case 9: return <AcademyLevel9Menu />;
      case 10: return <AcademyLevel10Menu />;
      default: return <AcademyModuleMenu level={level} />;
    }
  };

  const activeLesson = useMemo(() => {
    return academyLessons.find(l => l.level === selectedLevel);
  }, [selectedLevel]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <div className="relative h-[40vh] w-full overflow-hidden flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 opacity-40"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2000')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background z-10" />
        
        <div className="relative z-20 text-center px-4 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="flex justify-center mb-4">
            <InstructorAvatar phase="rest" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic">
            Vocal <span className="text-primary neon-blue-glow">Academy</span>
          </h1>
          <p className="text-gray-400 font-medium tracking-widest uppercase text-xs md:text-sm mt-2">
            O Caminho Científico para a Maestria Vocal
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 -mt-10 relative z-30">
        
        {/* User Progress Dashboard */}
        <Card className="glass-pillar border-2 border-primary/30 mb-12 overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/20 border-2 border-primary flex items-center justify-center shadow-[0_0_20px_rgba(0,168,225,0.3)]">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Nível Atual</p>
                  <h3 className="text-3xl font-black text-white">Nível {currentLevel}</h3>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                  <span className="text-gray-500">Progresso de XP</span>
                  <span className="text-primary">{currentXp} / {xpToNextLevel} XP</span>
                </div>
                <Progress value={xpProgress} className="h-2 bg-white/5" indicatorClassName="bg-primary shadow-[0_0_10px_rgba(0,168,225,0.8)]" />
              </div>

              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Status da Carreira</p>
                  <p className="text-xl font-bold text-accent neon-gold-glow">
                    {currentLevel >= 8 ? "Pro-Vocal Artist" : currentLevel >= 4 ? "Intermediate Singer" : "Academy Student"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedLevel ? (
          /* Level Detail View */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedLevel(null)}
              className="mb-8 text-muted-foreground hover:text-primary group"
            >
              <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              Voltar para o Currículo
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <Card className="glass-pillar border-2 border-accent/50 overflow-hidden">
                  <div 
                    className="h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(${activeLesson?.bgImage})` }}
                  />
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-black text-white mb-2">Nível {selectedLevel}: {activeLesson?.title}</h2>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">{activeLesson?.description}</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                        <Target className="h-5 w-5 text-accent" />
                        <div>
                          <p className="text-[10px] font-black text-gray-500 uppercase">Foco Principal</p>
                          <p className="text-sm font-bold text-white">{activeLesson?.focus}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                        <Zap className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-[10px] font-black text-gray-500 uppercase">Nota de Corte</p>
                          <p className="text-sm font-bold text-white">{activeLesson?.required_score}% de Precisão</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="p-6 rounded-3xl bg-primary/10 border border-primary/30">
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <BrainCircuit className="h-5 w-5" />
                    <span className="text-xs font-black uppercase tracking-widest">Dica do Instrutor</span>
                  </div>
                  <p className="text-sm text-gray-300 italic">
                    "A consistência é mais importante que a intensidade. Pratique 15 minutos todos os dias para ver resultados reais."
                  </p>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="mb-6">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Módulos de Treinamento</h3>
                  <p className="text-gray-500 text-sm">Selecione um módulo para iniciar os exercícios práticos.</p>
                </div>
                {renderLevelMenu(selectedLevel)}
              </div>
            </div>
          </div>
        ) : (
          /* Curriculum Grid View */
          <div className="space-y-12">
            {recommendedPlan && (
              <div className="p-8 rounded-3xl bg-accent/10 border-2 border-accent/50 animate-in slide-in-from-left duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <BrainCircuit className="h-24 w-24 text-accent" />
                </div>
                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                  <div className="p-4 rounded-2xl bg-accent/20 border border-accent/40">
                    <BrainCircuit className="h-10 w-10 text-accent" />
                  </div>
                  <div className="text-center md:text-left flex-grow">
                    <h3 className="text-2xl font-black text-accent uppercase tracking-widest mb-1">Prescrição do Instrutor IA</h3>
                    <p className="text-white text-lg font-medium">Baseado no seu último show, você deve focar em: <span className="text-accent font-black underline decoration-2 underline-offset-4">{recommendedPlan}</span></p>
                  </div>
                  <Button 
                    onClick={() => setSelectedLevel(currentLevel + 1)}
                    className="bg-accent hover:bg-accent/90 text-black font-black px-8 py-6 rounded-xl shadow-lg shadow-accent/20"
                  >
                    TREINAR AGORA
                  </Button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {academyLessons.map((lesson) => {
                const isLocked = currentLevel < lesson.level - 1;
                const isCompleted = currentLevel >= lesson.level;
                const isCurrent = currentLevel === lesson.level - 1;

                return (
                  <Card 
                    key={lesson.level}
                    className={cn(
                      "relative overflow-hidden transition-all duration-500 border-2 group cursor-pointer",
                      isLocked ? "bg-black/40 border-white/5 opacity-60 grayscale-[0.5]" : 
                      isCompleted ? "glass-pillar border-green-500/50 hover:border-green-500" :
                      "glass-pillar border-primary/50 hover:border-primary hover:scale-[1.02]"
                    )}
                    onClick={() => !isLocked && setSelectedLevel(lesson.level)}
                  >
                    {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
                        <div className="flex flex-col items-center gap-2">
                          <Lock className="h-10 w-10 text-white/50" />
                          <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">Nível Trancado</span>
                        </div>
                      </div>
                    )}

                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className={cn(
                          "h-10 w-10 rounded-xl border flex items-center justify-center font-black text-lg",
                          isLocked ? "border-white/10 bg-white/5 text-gray-500" : 
                          isCompleted ? "border-green-500/50 bg-green-500/10 text-green-500" :
                          "border-primary/50 bg-primary/10 text-primary"
                        )}>
                          {lesson.level}
                        </div>
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : isCurrent ? (
                          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                        ) : null}
                      </div>
                      <CardTitle className={cn(
                        "text-xl font-bold mt-4",
                        isLocked ? "text-gray-500" : "text-white"
                      )}>
                        {lesson.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
                        {lesson.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-[10px] font-black text-accent uppercase tracking-widest">
                        <Target className="h-3 w-3" />
                        Foco: {lesson.focus}
                      </div>

                      <div className="pt-4 border-t border-white/5">
                        <Button 
                          variant="ghost"
                          className={cn(
                            "w-full rounded-xl font-black uppercase tracking-wider text-xs py-6",
                            isLocked ? "text-gray-600" : "text-primary hover:bg-primary/10"
                          )}
                        >
                          {isLocked ? "Bloqueado" : isCompleted ? "Revisar Nível" : "Iniciar Treino"}
                          {!isLocked && <ChevronRight className="ml-2 h-4 w-4" />}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Certification Info */}
        {!selectedLevel && (
          <div className="mt-20 text-center pb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <Star className="h-3 w-3 fill-current" />
              Certificação Pro-Vocal
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Pronto para o Próximo Nível?</h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              Complete todos os 10 níveis para receber seu selo de Artista Verificado e desbloquear o acesso ao Backstage.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import { CheckCircle2 } from 'lucide-react';