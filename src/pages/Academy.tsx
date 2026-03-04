"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Trophy, Star, BookOpen, PlayCircle, ChevronRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUserProfile } from '@/hooks/use-user-profile';
import { academyLessons } from '@/data/lessons';
import { cn } from '@/lib/utils';
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

const Academy = () => {
  const navigate = useNavigate();
  const { data: profile } = useUserProfile();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  
  const currentLevel = profile?.academy_level ?? 0;
  const xp = profile?.xp ?? 0;

  const renderLevelMenu = (level: number) => {
    switch(level) {
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
      default: return null;
    }
  };

  if (selectedLevel) {
    const lesson = academyLessons.find(l => l.level === selectedLevel);
    return (
      <div className="min-h-screen bg-background pb-20 pt-28 px-4 max-w-6xl mx-auto">
        <Button variant="ghost" onClick={() => setSelectedLevel(null)} className="mb-8 text-muted-foreground hover:text-primary">
          <ChevronRight className="mr-2 h-5 w-5 rotate-180" /> Voltar para Níveis
        </Button>
        
        <div className="mb-12">
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">
            Nível {selectedLevel}: <span className="text-primary">{lesson?.title}</span>
          </h1>
          <p className="text-gray-400 max-w-2xl">{lesson?.description}</p>
        </div>

        {renderLevelMenu(selectedLevel)}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-28 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex p-4 rounded-2xl bg-primary/10 border-2 border-primary/30 mb-6">
          <GraduationCap className="h-10 w-10 text-primary neon-blue-glow" />
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase">
          VOCAL <span className="text-primary neon-blue-glow">ACADEMY</span>
        </h1>
        <p className="text-gray-400 mt-4 uppercase tracking-[0.3em] text-xs font-bold">Do iniciante ao pro-vocal em 10 estágios</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="glass-pillar border-primary/30">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/20"><Trophy className="text-primary h-6 w-6" /></div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Nível Atual</p>
              <p className="text-3xl font-black text-white">{currentLevel}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-pillar border-accent/30">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-accent/20"><Star className="text-accent h-6 w-6" /></div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">XP Acumulado</p>
              <p className="text-3xl font-black text-white">{xp.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-pillar border-white/10">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-white/10"><BookOpen className="text-gray-400 h-6 w-6" /></div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Progresso</p>
              <p className="text-3xl font-black text-white">{currentLevel} / 10</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Levels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {academyLessons.map((lesson) => {
          const isUnlocked = currentLevel >= lesson.level - 1;
          const isCompleted = currentLevel >= lesson.level;
          const isCurrent = currentLevel === lesson.level - 1;

          return (
            <Card 
              key={lesson.level}
              onClick={() => isUnlocked && setSelectedLevel(lesson.level)}
              className={cn(
                "relative overflow-hidden transition-all duration-500 border-2 cursor-pointer group",
                isCompleted ? "border-green-500/30 bg-green-500/5" :
                isCurrent ? "border-primary bg-primary/5 shadow-lg shadow-primary/20 scale-[1.02]" :
                "border-white/5 bg-white/5 opacity-60 grayscale"
              )}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn(
                    "h-12 w-12 rounded-xl flex items-center justify-center font-black text-xl",
                    isUnlocked ? "bg-primary/20 text-primary" : "bg-white/10 text-gray-600"
                  )}>
                    {lesson.level}
                  </div>
                  {!isUnlocked ? (
                    <Lock className="h-5 w-5 text-gray-600" />
                  ) : isCompleted ? (
                    <ShieldCheck className="h-6 w-6 text-green-500" />
                  ) : (
                    <PlayCircle className="h-6 w-6 text-primary animate-pulse" />
                  )}
                </div>

                <h3 className={cn(
                  "text-xl font-bold mb-2",
                  isUnlocked ? "text-white" : "text-gray-600"
                )}>
                  {lesson.title}
                </h3>
                <p className="text-sm text-gray-500 mb-6 line-clamp-2">{lesson.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{lesson.focus}</span>
                  {isUnlocked && (
                    <span className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform flex items-center">
                      Treinar <ChevronRight size={14} />
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Academy;