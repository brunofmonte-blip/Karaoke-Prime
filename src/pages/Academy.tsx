import React from 'react';
import { useUserProfile } from '@/hooks/use-user-profile';
import { academyLessons } from '@/data/lessons';
import LessonCard from '@/components/LessonCard';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, Zap, Trophy } from 'lucide-react';

const Academy: React.FC = () => {
  const { data: profile, isLoading } = useUserProfile();
  
  const currentLevel = profile?.academy_level ?? 0;
  const currentXp = profile?.xp ?? 0;
  const bestNote = profile?.best_note ?? 0;
  const maxLevel = 10;
  
  // Calculate progress towards the next level
  const progressValue = (currentLevel / maxLevel) * 100;
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-8 min-h-[80vh] flex items-center justify-center">
        <p className="text-primary neon-blue-glow">Loading Academy data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-[80vh]">
      <h1 className="text-4xl font-bold text-primary neon-blue-glow mb-4 text-center">
        Karaoke Academy: Vocal Mastery
      </h1>
      <p className="text-lg text-muted-foreground mb-8 text-center max-w-3xl mx-auto">
        Follow the 10-level curriculum designed by AI Vocal Coaches. Complete lessons to unlock new features and improve your global ranking.
      </p>

      {/* User Progress Summary Card */}
      <Card className={cn(
        "max-w-4xl mx-auto mb-12 p-6 rounded-2xl border-2 border-accent/70 shadow-xl",
        "glass-pillar bg-card/80 backdrop-blur-xl"
      )}>
        <CardContent className="p-0 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Current Level */}
          <div className="text-center p-3 bg-card/50 rounded-xl border border-border/50">
            <GraduationCap className="h-6 w-6 text-primary mx-auto mb-1" />
            <p className="text-sm text-muted-foreground">Current Level</p>
            <p className="text-3xl font-extrabold text-primary neon-blue-glow">{currentLevel}</p>
          </div>
          
          {/* Best Note */}
          <div className="text-center p-3 bg-card/50 rounded-xl border border-border/50">
            <Zap className="h-6 w-6 text-accent mx-auto mb-1 amazon-gold-glow" />
            <p className="text-sm text-muted-foreground">Best Note Score</p>
            <p className="text-3xl font-extrabold text-accent neon-gold-glow">{bestNote.toFixed(1)}%</p>
          </div>
          
          {/* Total XP */}
          <div className="text-center p-3 bg-card/50 rounded-xl border border-border/50">
            <Trophy className="h-6 w-6 text-foreground mx-auto mb-1" />
            <p className="text-sm text-muted-foreground">Total XP</p>
            <p className="text-3xl font-extrabold text-foreground">{currentXp}</p>
          </div>
          
          {/* Progress Bar */}
          <div className="md:col-span-3 pt-4 border-t border-border/50">
            <p className="text-sm font-medium text-foreground mb-2">
              Progress to Vocal Master (Level 10)
            </p>
            <Progress 
              value={progressValue} 
              className="h-3 bg-primary/20" 
              indicatorClassName="bg-primary shadow-lg shadow-primary/50" 
            />
            <p className="text-xs text-muted-foreground mt-1">
              {currentLevel} / {maxLevel} Levels Completed
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {academyLessons.map((lesson) => (
          <LessonCard key={lesson.level} lesson={lesson} />
        ))}
      </div>
    </div>
  );
};

export default Academy;