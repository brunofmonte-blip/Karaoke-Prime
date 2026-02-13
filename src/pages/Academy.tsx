import React, { useState } from 'react';
import { useUserProfile } from '@/hooks/use-user-profile';
import { academyLessons } from '@/data/lessons';
import LessonCard from '@/components/LessonCard';
import AcademyModuleMenu from '@/components/AcademyModuleMenu';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, Zap, Trophy, ShieldAlert, ChevronLeft } from 'lucide-react';
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
      <div className="min-h-screen bg-background/80 backdrop-blur-sm p-4 md:p-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 mb-2">
                {selectedLevel && (
                  <Button variant="ghost" size="icon" onClick={() => setSelectedLevel(null)} className="rounded-full">
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                )}
                <h1 className="text-4xl font-bold text-primary neon-blue-glow">
                  {selectedLevel ? `Nível ${selectedLevel}: Conservatório` : "Karaoke Academy: Vocal Mastery"}
                </h1>
              </div>
              <p className="text-lg text-muted-foreground">
                {selectedLevel 
                  ? "Módulos avançados de fisiologia e técnica vocal profissional." 
                  : "Siga o currículo de 10 níveis projetado por AI Vocal Coaches."}
              </p>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={cn(
                "rounded-xl border-2 transition-all duration-300",
                isAdminMode ? "border-accent text-accent bg-accent/10" : "border-border text-muted-foreground"
              )}
            >
              <ShieldAlert className="h-4 w-4 mr-2" />
              {isAdminMode ? "Admin Bypass: ON" : "Admin Bypass: OFF"}
            </Button>
          </div>

          {!selectedLevel && (
            <Card className={cn(
              "max-w-4xl mx-auto mb-12 p-6 rounded-2xl border-2 border-accent/70 shadow-xl",
              "glass-pillar bg-card/80 backdrop-blur-xl"
            )}>
              <CardContent className="p-0 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-3 bg-card/50 rounded-xl border border-border/50">
                  <GraduationCap className="h-6 w-6 text-primary mx-auto mb-1" />
                  <p className="text-sm text-muted-foreground">Nível Atual</p>
                  <p className="text-3xl font-extrabold text-primary neon-blue-glow">{currentLevel}</p>
                </div>
                
                <div className="text-center p-3 bg-card/50 rounded-xl border border-border/50">
                  <Zap className="h-6 w-6 text-accent mx-auto mb-1 amazon-gold-glow" />
                  <p className="text-sm text-muted-foreground">Melhor Nota</p>
                  <p className="text-3xl font-extrabold text-accent neon-gold-glow">{bestNote.toFixed(1)}%</p>
                </div>
                
                <div className="text-center p-3 bg-card/50 rounded-xl border border-border/50">
                  <Trophy className="h-6 w-6 text-foreground mx-auto mb-1" />
                  <p className="text-sm text-muted-foreground">Total XP</p>
                  <p className="text-3xl font-extrabold text-foreground">{currentXp}</p>
                </div>
                
                <div className="md:col-span-3 pt-4 border-t border-border/50">
                  <p className="text-sm font-medium text-foreground mb-2">
                    Progresso para Vocal Master (Nível 10)
                  </p>
                  <Progress 
                    value={progressValue} 
                    className="h-3 bg-primary/20" 
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {currentLevel} / {maxLevel} Níveis Completados
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedLevel === 1 ? (
              <div className="col-span-full">
                <AcademyModuleMenu level={1} />
              </div>
            ) : (
              academyLessons.map((lesson) => (
                <div key={lesson.level} onClick={() => lesson.level === 1 && setSelectedLevel(1)}>
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