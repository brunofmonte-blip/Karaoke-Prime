import React, { useState, useEffect } from 'react';
import { useUserProfile } from '@/hooks/use-user-profile';
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
import InstructorAvatar from '@/components/InstructorAvatar';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, Zap, Trophy, ShieldAlert, ChevronLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Academy = () => {
  const { data: profile, isLoading } = useUserProfile();
  const [isAdminMode, setIsAdminMode] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  
  const currentLevel = profile?.academy_level ?? 0;
  const currentXp = profile?.xp ?? 0;
  const bestNote = profile?.best_note ?? 0;
  const maxLevel = 10;
  
  const progressValue = (currentLevel / maxLevel) * 100;
  
  const currentLesson = selectedLevel ? academyLessons.find(l => l.level === selectedLevel) : null;
  const bgImage = currentLesson?.bgImage || "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1600";

  // Scroll to top whenever the selected level changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedLevel]);

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
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 min-h-[80vh] flex items-center justify-center">
        <p className="text-primary neon-blue-glow animate-pulse">Carregando dados da Academia...</p>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed transition-all duration-1000"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="min-h-screen bg-background/80 backdrop-blur-md p-4 md:p-8">
        <div className="container mx-auto max-w-6xl">
          
          {!selectedLevel && (
            <div className="flex flex-col items-center text-center mb-12 animate-in fade-in slide-in-from-top-8 duration-1000">
              <InstructorAvatar />
              <h1 className="text-4xl md:text-6xl font-black text-white mt-6 mb-4 tracking-tighter">
                KARAOKE <span className="text-primary neon-blue-glow">ACADEMY</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl font-medium leading-relaxed">
                Bem-vindo à Academia. Seu diagnóstico vocal de 10 níveis começa aqui. 
                Siga o currículo projetado por AI para atingir a maestria.
              </p>
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 mb-2">
                {selectedLevel && (
                  <Button variant="ghost" size="icon" onClick={() => setSelectedLevel(null)} className="rounded-full text-white hover:bg-white/10">
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                )}
                <h2 className="text-3xl font-bold text-primary neon-blue-glow">
                  {selectedLevel ? `Nível ${selectedLevel}: ${currentLesson?.title}` : "Seu Currículo Vocal"}
                </h2>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={cn(
                "rounded-xl border-2 transition-all duration-300",
                isAdminMode ? "border-accent text-accent bg-accent/10" : "border-white/20 text-gray-400 bg-white/5"
              )}
            >
              <ShieldAlert className="h-4 w-4 mr-2" />
              {isAdminMode ? "Admin Bypass: ON" : "Admin Bypass: OFF"}
            </Button>
          </div>

          {!selectedLevel && (
            <Card className={cn(
              "mb-12 p-6 rounded-3xl border-2 border-primary/30 shadow-2xl",
              "glass-pillar bg-card/40 backdrop-blur-xl"
            )}>
              <CardContent className="p-0 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                  <GraduationCap className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nível Atual</p>
                  <p className="text-4xl font-black text-white">{currentLevel}</p>
                </div>
                
                <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                  <Zap className="h-8 w-8 text-accent mx-auto mb-2 amazon-gold-glow" />
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Melhor Nota</p>
                  <p className="text-4xl font-black text-accent neon-gold-glow">{bestNote.toFixed(1)}%</p>
                </div>
                
                <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                  <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total XP</p>
                  <p className="text-4xl font-black text-white">{currentXp}</p>
                </div>
                
                <div className="md:col-span-3 pt-6 border-t border-white/10">
                  <div className="flex justify-between items-end mb-3">
                    <p className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Progresso para Vocal Master
                    </p>
                    <span className="text-xs font-bold text-primary">{progressValue.toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={progressValue} 
                    className="h-4 bg-white/10" 
                    indicatorClassName="bg-primary shadow-[0_0_15px_rgba(0,168,225,0.6)]"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {selectedLevel ? (
              <div className="col-span-full">
                {renderLevelMenu(selectedLevel)}
              </div>
            ) : (
              academyLessons.map((lesson) => (
                <div 
                  key={lesson.level} 
                  onClick={() => (lesson.level >= 1 && lesson.level <= 10) && setSelectedLevel(lesson.level)}
                  className={cn(
                    "transition-transform duration-300",
                    (lesson.level >= 1 && lesson.level <= 10) && "cursor-pointer hover:scale-[1.02]"
                  )}
                >
                  <LessonCard lesson={lesson} isAdminMode={isAdminMode} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Academy;