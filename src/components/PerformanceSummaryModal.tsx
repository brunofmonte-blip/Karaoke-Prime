import React, { useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, TrendingUp, Mic, ChevronRight, BookOpen, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVocalSandbox } from '@/hooks/use-vocal-sandbox';
import { useUserProfile } from '@/hooks/use-user-profile';
import { academyLessons, Lesson } from '@/data/lessons';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { runScoringEngine, PerformanceInsight } from '@/utils/scoring-engine';
import { publicDomainLibrary } from '@/data/public-domain-library';

const PerformanceSummaryModal: React.FC = () => {
  const { sessionSummary, pitchHistory, clearSessionSummary } = useVocalSandbox();
  const { data: profile, isLoading: isProfileLoading } = useUserProfile();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const isOpen = !!sessionSummary;
  const currentLevel = profile?.academy_level ?? 0;

  // Retrieve the song used for the session
  const currentSong = useMemo(() => {
    if (!sessionSummary) return null;
    // Find the specific song, or default to the first one if not found (safety fallback)
    return publicDomainLibrary.find(s => s.id === sessionSummary.songId) || publicDomainLibrary[0];
  }, [sessionSummary]);

  const performanceInsight: PerformanceInsight = useMemo(() => {
    if (!sessionSummary || !currentSong) return { accuracyScore: 0, maxStability: 0, improvementTips: [] };
    return runScoringEngine(pitchHistory, currentSong);
  }, [sessionSummary, pitchHistory, currentSong]);

  const finalScore = performanceInsight.accuracyScore;
  const maxStability = performanceInsight.maxStability;

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
            Your vocal session is complete. See your results below.
          </p>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Score Display */}
          <div className="text-center p-4 bg-card/50 rounded-xl border border-border/50">
            <p className="text-xl text-muted-foreground">Final Pitch Accuracy</p>
            <p className="text-6xl font-extrabold text-accent neon-gold-glow mt-1">
              {finalScore.toFixed(1)}%
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-card/50 rounded-xl border border-border/50 text-center">
              <TrendingUp className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Session Duration</p>
              <p className="font-semibold text-foreground">{sessionSummary?.durationSeconds}s</p>
            </div>
            <div className="p-3 bg-card/50 rounded-xl border border-border/50 text-center">
              <Mic className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Max Stability</p>
              <p className="font-semibold text-foreground">{maxStability.toFixed(1)}%</p>
            </div>
          </div>

          {/* Improvement Tips */}
          <div className="p-4 bg-accent/10 border border-accent/50 rounded-xl">
            <h4 className="text-lg font-bold text-accent flex items-center mb-2">
              <Lightbulb className="h-5 w-5 mr-2 amazon-gold-glow" /> Performance Insights
            </h4>
            <ul className="space-y-1">
              {performanceInsight.improvementTips.map((tip, index) => (
                <li key={index} className="text-sm text-foreground flex items-start">
                  <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0 text-accent mt-0.5" />
                  {tip}
                </li>
              ))}
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