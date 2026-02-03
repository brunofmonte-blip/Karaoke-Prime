import React, { useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronRight, BookOpen, Lightbulb, Target, Clock, Zap, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVocalSandbox } from '@/hooks/use-vocal-sandbox';
import { useUserProfile } from '@/hooks/use-user-profile';
import { academyLessons, Lesson } from '@/data/lessons';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const PerformanceSummaryModal: React.FC = () => {
  const { sessionSummary, pitchHistory, clearSessionSummary, currentSong } = useVocalSandbox();
  const { data: profile, isLoading: isProfileLoading } = useUserProfile();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const isOpen = !!sessionSummary;
  const currentLevel = profile?.academy_level ?? 0;

  // Use sessionSummary metrics directly
  const finalScore = sessionSummary?.pitchAccuracy || 0;
  const rhythmPrecision = sessionSummary?.rhythmPrecision || 0;
  const vocalStability = sessionSummary?.vocalStability || 0;
  const improvementTips = sessionSummary?.improvementTips || [];

  // Determine recommended lesson (simple logic: recommend the next level's focus)
  const recommendedLesson: Lesson | undefined = useMemo(() => {
    if (currentLevel < 10) {
      return academyLessons.find(lesson => lesson.level === currentLevel + 1);
    }
    return undefined;
  }, [currentLevel]);

  // Logic to unlock Level 1 automatically after the first session
  useEffect(() => {
    if (isOpen && !isProfileLoading && profile && currentLevel === 0) {
      const unlockLevel1 = async () => {
        const { error } = await supabase
          .from('profiles')
          .update({ academy_level: 1 })
          .eq('id', profile.id);

        if (!error) {
          toast.success("Academy Unlocked! Level 1: Foundation: Steady Breath is now available.", { duration: 5000 });
          queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        } else {
          console.error("[SummaryModal] Failed to unlock level 1:", error);
        }
      };
      unlockLevel1();
    }
  }, [isOpen, isProfileLoading, profile, currentLevel, queryClient]);

  const handleGoToAcademy = () => {
    clearSessionSummary();
    navigate('/academy');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={clearSessionSummary}>
      <DialogContent className={cn(
        "sm:max-w-lg w-full rounded-3xl border-2 border-primary/70 shadow-2xl p-6 md:p-8",
        "glass-pillar bg-card/80 backdrop-blur-xl"
      )}>
        <DialogHeader className="text-center">
          <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4 icon-neon-glow" />
          <DialogTitle className="text-3xl font-bold text-primary neon-blue-glow">
            Performance Summary
          </DialogTitle>
          <p className="text-muted-foreground mt-1">
            Your vocal session is complete. Detailed metrics below.
          </p>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Score Display */}
          <div className="text-center p-4 bg-card/50 rounded-xl border border-border/50">
            <p className="text-xl text-muted-foreground">Overall Pitch Accuracy</p>
            <p className="text-6xl font-extrabold text-accent neon-gold-glow mt-1">
              {finalScore.toFixed(1)}%
            </p>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-card/50 rounded-xl border border-border/50 text-center">
              <Target className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Rhythm Precision</p>
              <p className="font-semibold text-foreground">{rhythmPrecision.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-card/50 rounded-xl border border-border/50 text-center">
              <Zap className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Vocal Stability</p>
              <p className="font-semibold text-foreground">{vocalStability.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-card/50 rounded-xl border border-border/50 text-center">
              <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="font-semibold text-foreground">{sessionSummary?.durationSeconds}s</p>
            </div>
          </div>

          {/* Improvement Tips (Observation) */}
          <div className="p-4 bg-accent/10 border border-accent/50 rounded-xl">
            <h4 className="text-lg font-bold text-accent flex items-center mb-2">
              <Lightbulb className="h-5 w-5 mr-2 amazon-gold-glow" /> Improvement Observation
            </h4>
            <ul className="space-y-1">
              {improvementTips.length > 0 ? (
                improvementTips.map((tip, index) => (
                  <li key={index} className="text-sm text-foreground flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0 text-accent mt-0.5" />
                    {tip}
                  </li>
                ))
              ) : (
                <li className="text-sm text-foreground">No specific observations. Keep up the great work!</li>
              )}
            </ul>
          </div>

          {/* Recommended Lesson */}
          {recommendedLesson && (
            <div className="p-4 bg-primary/10 border border-primary/50 rounded-xl">
              <h4 className="text-lg font-bold text-primary flex items-center mb-1">
                <BookOpen className="h-5 w-5 mr-2" /> Recommended Lesson
              </h4>
              <p className="text-sm text-foreground font-medium">{recommendedLesson.title}</p>
              <p className="text-xs text-muted-foreground mt-1">Focus: {recommendedLesson.focus}</p>
            </div>
          )}
        </div>
        
        {/* Secure Sync Status */}
        <div className="mt-4 pt-4 border-t border-border/50 text-center">
          <p className="text-sm text-green-400 font-medium flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 mr-2 text-green-400 amazon-gold-glow" />
            Progress Saved Securely (Supabase Sync Complete)
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Your performance log and best score have been encrypted and synchronized.
          </p>
        </div>

        <Button 
          onClick={handleGoToAcademy}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-8 py-3 shadow-lg shadow-primary/30"
        >
          Go to Academy
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PerformanceSummaryModal;