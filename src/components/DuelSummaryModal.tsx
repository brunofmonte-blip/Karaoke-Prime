import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, Frown, ChevronRight, Mic2, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDuel } from '@/hooks/use-duel-engine';
import { useAuth } from '@/integrations/supabase/auth';
import { useNavigate } from 'react-router-dom';

const DuelSummaryModal: React.FC = () => {
  const { duelSummary, duelSong, clearDuel, getDuelFeedback } = useDuel();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const isOpen = !!duelSummary && !!user;

  if (!isOpen || !duelSong) return null;

  const { winner: isWinner, feedback, userMetrics, opponentMetrics } = getDuelFeedback(user.id);
  
  // Determine scores safely
  const userScore = duelSummary.user1Id === user.id ? duelSummary.user1Score : duelSummary.user2Score;
  const opponentScore = duelSummary.user1Id === user.id ? duelSummary.user2Score : duelSummary.user1Score;

  const handleClose = () => {
    clearDuel();
    navigate('/library'); // Go back to library after duel
  };

  const MetricDisplay: React.FC<{ label: string, userValue: number, opponentValue: number }> = ({ label, userValue, opponentValue }) => {
    const isUserBetter = userValue > opponentValue;
    const Icon = label === 'Rhythm' ? Target : Zap;
    
    return (
      <div className="flex justify-between items-center text-sm p-2 rounded-lg bg-card/50 border border-border/50">
        <div className="flex items-center text-muted-foreground">
          <Icon className="h-4 w-4 mr-2 text-primary" />
          {label}
        </div>
        <div className="flex space-x-4 font-semibold">
          <span className={cn(isUserBetter ? 'text-primary' : 'text-muted-foreground')}>{userValue.toFixed(1)}%</span>
          <span className={cn(!isUserBetter ? 'text-accent' : 'text-muted-foreground')}>{opponentValue.toFixed(1)}%</span>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={cn(
        "sm:max-w-lg w-full rounded-3xl border-2 shadow-2xl p-6 md:p-8",
        isWinner ? "border-accent/70 glass-pillar bg-card/80" : "border-primary/70 glass-pillar bg-card/80"
      )}>
        <DialogHeader className="text-center">
          {isWinner ? (
            <Trophy className="h-12 w-12 text-accent mx-auto mb-4 amazon-gold-glow" />
          ) : (
            <Frown className="h-12 w-12 text-primary mx-auto mb-4 icon-neon-glow" />
          )}
          <DialogTitle className={cn(
            "text-3xl font-bold",
            isWinner ? "text-accent neon-gold-glow" : "text-primary neon-blue-glow"
          )}>
            {isWinner ? 'VICTORY!' : 'DEFEAT'}
          </DialogTitle>
          <p className="text-muted-foreground mt-1">
            Duel results for "{duelSong.title}"
          </p>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Score Comparison */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl border border-border/50 bg-card/50">
              <p className="text-xs text-muted-foreground">Metric</p>
            </div>
            <div className="p-4 rounded-xl border border-primary/50 bg-primary/10">
              <p className="text-xs text-muted-foreground">You</p>
              <p className="text-xl font-extrabold text-primary mt-1">{userScore.toFixed(1)}%</p>
            </div>
            <div className="p-4 rounded-xl border border-accent/50 bg-accent/10">
              <p className="text-xs text-muted-foreground">Opponent</p>
              <p className="text-xl font-extrabold text-accent mt-1">{opponentScore.toFixed(1)}%</p>
            </div>
          </div>
          
          {/* Detailed Metrics Comparison */}
          <div className="space-y-2">
            <MetricDisplay 
              label="Pitch Accuracy" 
              userValue={userMetrics.pitchAccuracy} 
              opponentValue={opponentMetrics.pitchAccuracy} 
            />
            <MetricDisplay 
              label="Rhythm" 
              userValue={userMetrics.rhythmPrecision} 
              opponentValue={opponentMetrics.rhythmPrecision} 
            />
            <MetricDisplay 
              label="Stability" 
              userValue={userMetrics.vocalStability} 
              opponentValue={opponentMetrics.vocalStability} 
            />
          </div>

          {/* Feedback */}
          <div className="p-4 bg-card/50 border border-border/50 rounded-xl">
            <h4 className="text-lg font-bold text-foreground flex items-center mb-2">
              <Mic2 className="h-5 w-5 mr-2 text-primary" /> Vocal Insight
            </h4>
            <p className="text-sm text-muted-foreground">{feedback}</p>
          </div>
        </div>

        <Button 
          onClick={handleClose}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-8 py-3 shadow-lg shadow-primary/30"
        >
          Continue to Library
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DuelSummaryModal;