import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lesson } from '@/data/lessons';
import { cn } from '@/lib/utils';
import { CheckCircle, Lock, PlayCircle, Target, Zap } from 'lucide-react';
import { useVocalSandbox } from '@/hooks/use-vocal-sandbox';
import { useUserProfile } from '@/hooks/use-user-profile';
import { publicDomainLibrary } from '@/data/public-domain-library';
import { toast } from 'sonner';

interface LessonCardProps {
  lesson: Lesson;
  isAdminMode?: boolean;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, isAdminMode = false }) => {
  const { data: profile } = useUserProfile();
  const { startAnalysis, openOverlay } = useVocalSandbox();
  
  const currentLevel = profile?.academy_level ?? 0;
  
  // Logic: A lesson is unlocked if the user has completed the previous level OR admin mode is on
  const isUnlocked = isAdminMode || currentLevel >= lesson.level - 1;
  const isCompleted = !isAdminMode && currentLevel >= lesson.level;
  const isCurrent = isAdminMode || currentLevel === lesson.level - 1;

  const lessonSong = publicDomainLibrary.find(song => 
    song.genre === 'Vocal Exercises' && song.title.includes(lesson.focus.split(' ')[0])
  ) || publicDomainLibrary.find(song => song.genre === 'Vocal Exercises');

  const handleStartLesson = () => {
    if (!isUnlocked) {
      toast.error(`Lição Trancada: Complete o Nível ${lesson.level - 1} primeiro.`);
      return;
    }
    
    // Level 1 is the Conservatory Menu, so we don't start analysis here
    if (lesson.level === 1) {
      return;
    }

    if (!lessonSong) {
      toast.error("Material da lição não encontrado.");
      return;
    }

    startAnalysis(lessonSong, false);
    openOverlay();
    toast.info(`Iniciando Nível ${lesson.level}: ${lesson.title}`, { duration: 3000 });
  };

  const getStatusText = () => {
    if (isCompleted) return "Completado";
    if (isCurrent) return "Foco Atual";
    if (isUnlocked) return "Pronto para Iniciar";
    return `Requer Nível ${lesson.level - 1}`;
  };

  return (
    <Card className={cn(
      "rounded-2xl border-2 transition-all duration-300 h-full flex flex-col",
      isCompleted ? "border-green-500/70 shadow-green-500/30" :
      isCurrent ? "border-primary/70 shadow-primary/50" :
      "border-border/50 opacity-70"
    )}>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className={cn(
            "text-xl font-bold",
            isCurrent ? "text-primary neon-blue-glow" : "text-foreground"
          )}>
            Nível {lesson.level}: {lesson.title}
          </CardTitle>
          <div className={cn(
            "text-xs font-semibold px-2 py-1 rounded-full border",
            isCompleted ? "border-green-500 text-green-400 bg-green-500/10" :
            isCurrent ? "border-primary text-primary bg-primary/10" :
            "border-gray-500 text-gray-400 bg-gray-500/10"
          )}>
            {getStatusText()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex flex-col flex-grow">
        <p className="text-sm text-muted-foreground mb-3 flex-grow">{lesson.description}</p>
        
        <div className="space-y-2 mb-4 pt-2 border-t border-border/50">
          <div className="flex items-center text-sm text-accent font-medium">
            <Target className="h-4 w-4 mr-2 amazon-gold-glow" />
            Foco: {lesson.focus}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Zap className="h-4 w-4 mr-2 text-primary" />
            Nota de Aprovação: {lesson.required_score}%
          </div>
        </div>

        <Button
          onClick={handleStartLesson}
          disabled={!isUnlocked || (isCompleted && !isAdminMode)}
          className={cn(
            "w-full rounded-xl font-semibold",
            isCurrent ? 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30' :
            isCompleted ? 'bg-green-600/50 text-green-400 hover:bg-green-600/60' :
            'bg-secondary text-secondary-foreground hover:bg-secondary/90'
          )}
        >
          {isCompleted ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Revisar Lição
            </>
          ) : isUnlocked ? (
            <>
              <PlayCircle className="h-4 w-4 mr-2" />
              Iniciar Lição
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Trancado
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default LessonCard;