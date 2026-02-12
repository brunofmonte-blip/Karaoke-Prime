import React from 'react';
import { useUserProfile } from '@/hooks/use-user-profile';
import { academyLessons } from '@/data/lessons';
import LessonCard from '@/components/LessonCard';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, Zap, Trophy } from 'lucide-react';

const Tagline: React.FC = () => (
  <div className="text-center py-12 px-4 mt-12 border-t border-border/40">
    <h2 className={cn(
      "text-2xl md:text-4xl font-extrabold uppercase tracking-widest leading-tight",
      "text-foreground drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
    )}>
      CANTE. EVOLUA. CONQUISTAR O 
      <span className="block md:inline-block md:ml-4 text-foreground drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
        MUNDO.
      </span>
    </h2>
  </div>
);

export default function Academy() {
  const { data: profile, isLoading } = useUserProfile();
  
  // Defensive defaults for profile data
  const currentLevel = profile?.academy_level ?? 0;
  const currentXp = profile?.xp ?? 0;
  const bestNote = profile?.best_note ?? 0;
  const maxLevel = 10;
  
  const progressValue = (currentLevel / maxLevel) * 100;
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-8 min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary neon-blue-glow font-bold">Carregando currículo da Academia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-[80vh] bg-background">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-primary neon-blue-glow mb-4 text-center">
          Karaoke Academy: Vocal Mastery
        </h1>
        <p className="text-lg text-muted-foreground mb-8 text-center max-w-3xl mx-auto">
          Siga o currículo de 10 níveis projetado por AI Vocal Coaches. Complete as lições para desbloquear novos recursos e subir no ranking global.
        </p>

        {/* Progress Dashboard */}
        <Card className={cn(
          "mb-12 p-6 rounded-2xl border-2 border-accent/70 shadow-xl",
          "glass-pillar bg-card/80 backdrop-blur-xl"
        )}>
          <CardContent className="p-0 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-card/50 rounded-xl border border-border/50">
              <GraduationCap className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Nível Atual</p>
              <p className="text-4xl font-black text-primary neon-blue-glow">{currentLevel}</p>
            </div>
            
            <div className="text-center p-4 bg-card/50 rounded-xl border border-border/50">
              <Zap className="h-8 w-8 text-accent mx-auto mb-2 amazon-gold-glow" />
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Melhor Nota</p>
              <p className="text-4xl font-black text-accent neon-gold-glow">{bestNote.toFixed(1)}%</p>
            </div>
            
            <div className="text-center p-4 bg-card/50 rounded-xl border border-border/50">
              <Trophy className="h-8 w-8 text-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Total XP</p>
              <p className="text-4xl font-black text-foreground">{currentXp}</p>
            </div>
            
            <div className="md:col-span-3 pt-6 border-t border-border/50">
              <div className="flex justify-between items-end mb-2">
                <p className="text-sm font-bold text-foreground uppercase tracking-widest">
                  Progresso para Vocal Master
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  {currentLevel} / {maxLevel} NÍVEIS
                </p>
              </div>
              <Progress 
                value={progressValue} 
                className="h-4 bg-primary/10 border border-primary/20" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {academyLessons.map((lesson) => (
            <LessonCard key={lesson.level} lesson={lesson} />
          ))}
        </div>

        <Tagline />
      </div>
    </div>
  );
}