"use client";

import React, { useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronRight, BookOpen, Lightbulb, Target, Clock, Zap, ShieldCheck, TrendingUp, Wind, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVocalSandbox } from '@/hooks/use-vocal-sandbox';
import { useUserProfile } from '@/hooks/use-user-profile';
import { academyLessons, Lesson } from '@/data/lessons';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const PerformanceSummaryModal: React.FC = () => {
  const { sessionSummary, clearSessionSummary } = useVocalSandbox();
  const { data: profile, isLoading: isProfileLoading } = useUserProfile();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const isOpen = !!sessionSummary;
  const currentLevel = profile?.academy_level ?? 0;
  const currentXp = profile?.xp ?? 0;

  const isBreathing = sessionSummary?.isBreathing;
  const finalScore = sessionSummary?.pitchAccuracy || 0;
  const rhythmPrecision = sessionSummary?.rhythmPrecision || 0;
  const vocalStability = sessionSummary?.vocalStability || 0;
  const improvementTips = sessionSummary?.improvementTips || [];
  const durationSeconds = sessionSummary?.durationSeconds || 0;
  
  const xpGained = Math.floor(durationSeconds * (finalScore / 100) * 5);

  const recommendedLesson: Lesson | undefined = useMemo(() => {
    if (currentLevel < 10) {
      return academyLessons.find(lesson => lesson.level === currentLevel + 1);
    }
    return undefined;
  }, [currentLevel]);

  useEffect(() => {
    if (isOpen && !isProfileLoading && profile) {
      const updateProgress = async () => {
        let newLevel = currentLevel;
        
        // Check if this session unlocks the next level
        if (recommendedLesson && finalScore >= recommendedLesson.required_score) {
          newLevel = currentLevel + 1;
          toast.success(`PARABÉNS! Você subiu para o Nível ${newLevel} da Academy!`, {
            description: `Lição "${recommendedLesson.title}" completada com sucesso.`,
            duration: 6000
          });
        }

        const { error } = await supabase
          .from('profiles')
          .update({ 
            academy_level: newLevel,
            xp: currentXp + xpGained,
            best_note: Math.max(profile.best_note || 0, finalScore)
          })
          .eq('id', profile.id);

        if (!error) {
          queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        }
      };
      updateProgress();
    }
  }, [isOpen, isProfileLoading, profile, currentLevel, queryClient, finalScore, recommendedLesson, xpGained, currentXp]);

  const handleGoToAcademy = () => {
    clearSessionSummary();
    navigate('/academy');
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={clearSessionSummary}>
      <DialogContent className={cn(
        "sm:max-w-lg w-full rounded-3xl border-2 border-primary/70 shadow-2xl p-6 md:p-8",
        "glass-pillar bg-card/80 backdrop-blur-xl"
      )}>
        <DialogHeader className="text-center">
          {isBreathing ? (
            <Wind className="h-12 w-12 text-primary mx-auto mb-4 icon-neon-glow" />
          ) : (
            <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4 icon-neon-glow" />
          )}
          <DialogTitle className="text-3xl font-bold text-primary neon-blue-glow">
            Resumo de Performance
          </DialogTitle>
          <p className="text-muted-foreground mt-1">
            {isBreathing ? "Seu treino de fôlego está completo." : "Sua sessão vocal está completa."}
          </p>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Main Score Area */}
          <div className="text-center p-6 bg-card/50 rounded-xl border border-border/50">
            {isBreathing ? (
              <>
                <p className="text-xl text-muted-foreground font-medium">Tempo de Sustentação</p>
                <p className="text-6xl font-extrabold text-accent neon-gold-glow mt-2">
                  {durationSeconds} <span className="text-2xl">Segundos</span>
                </p>
              </>
            ) : (
              <>
                <p className="text-xl text-muted-foreground font-medium">Precisão Geral do Tom</p>
                <p className="text-6xl font-extrabold text-accent neon-gold-glow mt-2">
                  {finalScore.toFixed(1)}%
                </p>
              </>
            )}
            <div className="flex items-center justify-center mt-4 text-green-400 font-bold">
              <TrendingUp className="h-5 w-5 mr-2" />
              +{xpGained} XP Ganho
            </div>
          </div>

          {/* Secondary Metrics Area */}
          {isBreathing ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl text-center">
                <Activity className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Estabilidade</p>
                <p className="text-xl font-bold text-foreground">{finalScore.toFixed(1)}%</p>
              </div>
              <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl text-center">
                <Target className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Séries</p>
                <p className="text-xl font-bold text-foreground">3 / 3</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-card/50 rounded-xl border border-border/50 text-center">
                <Target className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Ritmo</p>
                <p className="font-semibold text-foreground">{rhythmPrecision.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-card/50 rounded-xl border border-border/50 text-center">
                <Zap className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Estabilidade</p>
                <p className="font-semibold text-foreground">{vocalStability.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-card/50 rounded-xl border border-border/50 text-center">
                <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Duração</p>
                <p className="font-semibold text-foreground">{durationSeconds} Segundos</p>
              </div>
            </div>
          )}

          {/* Feedback Area */}
          <div className="p-4 bg-accent/10 border border-accent/50 rounded-xl">
            <h4 className="text-lg font-bold text-accent flex items-center mb-2">
              <Lightbulb className="h-5 w-5 mr-2 amazon-gold-glow" /> Observação de Melhoria
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
                <li className="text-sm text-foreground">Nenhuma observação específica. Continue assim!</li>
              )}
            </ul>
          </div>

          {/* Next Lesson Area */}
          {recommendedLesson && (
            <div className="p-4 bg-primary/10 border border-primary/50 rounded-xl">
              <h4 className="text-lg font-bold text-primary flex items-center mb-1">
                <BookOpen className="h-5 w-5 mr-2" /> Próxima Lição
              </h4>
              <p className="text-sm text-foreground font-medium">{recommendedLesson.title}</p>
              <p className="text-xs text-muted-foreground mt-1">Foco: {recommendedLesson.focus} | Requer: {recommendedLesson.required_score}%</p>
            </div>
          )}
        </div>

        <Button 
          onClick={handleGoToAcademy}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-8 py-3 shadow-lg shadow-primary/30"
        >
          Ir para a Academia
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PerformanceSummaryModal;