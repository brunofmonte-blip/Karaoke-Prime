"use client";

import React, { useState } from 'react';
import { GraduationCap, Trophy, Star, ChevronLeft, LayoutGrid, BookOpen, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { academyLessons } from '@/data/lessons';
import LessonCard from '@/components/LessonCard';
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
import { cn } from '@/lib/utils';
import { useUserProfile } from '@/hooks/use-user-profile';

const Academy = () => {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const { data: profile } = useUserProfile();
  const currentLevel = profile?.academy_level ?? 0;

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
      default: return <AcademyModuleMenu level={1} />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Section */}
      <div className="relative h-[30vh] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center z-0 opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2000')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/80 to-background z-10" />
        <div className="relative z-20 text-center px-4">
          <div className="inline-flex p-4 rounded-2xl bg-primary/20 border-2 border-primary mb-4 shadow-[0_0_30px_rgba(0,168,225,0.3)]">
            <GraduationCap className="h-10 w-10 text-primary animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic">
            Vocal <span className="text-primary neon-blue-glow">Academy</span>
          </h1>
          <p className="text-gray-400 font-medium tracking-widest uppercase text-xs md:text-sm mt-2">
            Do iniciante ao Pro-Vocal em 10 estágios
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 -mt-10 relative z-30">
        {selectedLevel ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedLevel(null)}
                className="text-muted-foreground hover:text-primary"
              >
                <ChevronLeft className="mr-2 h-5 w-5" /> Voltar aos Níveis
              </Button>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest">
                <ShieldCheck className="h-3 w-3" />
                Nível {selectedLevel} Ativo
              </div>
            </div>

            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">
                {academyLessons.find(l => l.level === selectedLevel)?.title}
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                {academyLessons.find(l => l.level === selectedLevel)?.description}
              </p>
            </div>

            {renderLevelMenu(selectedLevel)}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-pillar p-6 rounded-3xl border-2 border-primary/30 flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Nível Atual</p>
                  <p className="text-2xl font-black text-white">{currentLevel}</p>
                </div>
              </div>
              <div className="glass-pillar p-6 rounded-3xl border-2 border-accent/30 flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-accent/10 text-accent">
                  <Star className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">XP Acumulado</p>
                  <p className="text-2xl font-black text-white">{profile?.xp || 0}</p>
                </div>
              </div>
              <div className="glass-pillar p-6 rounded-3xl border-2 border-white/10 flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white/5 text-white">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Lições Concluídas</p>
                  <p className="text-2xl font-black text-white">{currentLevel} / 10</p>
                </div>
              </div>
            </div>

            {/* Levels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {academyLessons.map((lesson) => (
                <div 
                  key={lesson.level} 
                  onClick={() => (currentLevel >= lesson.level - 1) && setSelectedLevel(lesson.level)}
                  className={cn(
                    "cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]",
                    currentLevel < lesson.level - 1 && "cursor-not-allowed"
                  )}
                >
                  <LessonCard lesson={lesson} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Academy;