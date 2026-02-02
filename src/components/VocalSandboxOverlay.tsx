import React, { useEffect, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, StopCircle, Music, X, ChevronRight } from 'lucide-react';
import { useVocalSandbox } from '@/hooks/use-vocal-sandbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAuth } from '@/integrations/supabase/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query'; // Import useQueryClient

const MIN_SESSION_DURATION_POINTS = 10; // Minimum pitch history points required for a valid session

const VocalSandboxOverlay: React.FC = () => {
  const { 
    isOverlayOpen, 
    closeOverlay, 
    isAnalyzing, 
    startAnalysis, 
    stopAnalysis, 
    pitchData, 
    pitchHistory,
    currentSongTitle,
    currentSongArtist,
    currentLyrics,
  } = useVocalSandbox();
  
  const { user } = useAuth();
  const queryClient = useQueryClient(); // Initialize query client
  const sessionStartTimeRef = useRef<number | null>(null);

  // Start time tracking when analysis begins
  useEffect(() => {
    if (isAnalyzing) {
      sessionStartTimeRef.current = Date.now();
    } else {
      sessionStartTimeRef.current = null;
    }
  }, [isAnalyzing]);

  // Calculate final score when analysis stops
  const finalScore = useMemo(() => {
    if (pitchHistory.length === 0) return 0;
    const totalPitch = pitchHistory.reduce((sum, item) => sum + item.pitch, 0);
    return totalPitch / pitchHistory.length;
  }, [pitchHistory]);

  // Handle session end and data persistence
  useEffect(() => {
    if (!isAnalyzing && pitchHistory.length > 0) {
      // Analysis just stopped and we have data
      handleScorePersistence(finalScore);
    }
  }, [isAnalyzing]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleScorePersistence = async (score: number) => {
    if (!user) {
      toast.warning("Sign in to save your best note!", { duration: 3000 });
      return;
    }

    // --- Anti-Cheat/Validation Layer Mock ---
    if (pitchHistory.length < MIN_SESSION_DURATION_POINTS) {
      toast.error("Score submission failed: Session too short.", { 
        description: "A minimum duration is required to prevent score manipulation.",
        duration: 5000 
      });
      return;
    }
    // ----------------------------------------

    const { error } = await supabase
      .from('profiles')
      .update({ best_note: score })
      .eq('id', user.id);

    if (error) {
      console.error("[VocalSandboxOverlay] Error updating best_note:", error);
      toast.error("Failed to save score.", { description: error.message });
    } else {
      toast.success(`New Best Note recorded: ${score.toFixed(1)}%`, { duration: 4000 });
      // Invalidate relevant queries to trigger UI updates (Profile Card, Rankings)
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['globalRankings'] });
    }
  };

  if (!isOverlayOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col p-4 md:p-8 overflow-y-auto">
      
      {/* Header and Close Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-primary neon-blue-glow">
          Live Vocal Sandbox
        </h1>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={closeOverlay}
          className="text-foreground hover:bg-primary/10 rounded-full"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex-grow space-y-8">
        
        {/* Control Panel & Current Track */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Control Panel */}
          <Card className={cn("lg:col-span-1 glass-pillar h-fit")}>
            <CardHeader>
              <CardTitle className="text-accent neon-gold-glow">Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={startAnalysis} 
                  disabled={isAnalyzing}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/30"
                >
                  <Mic className="h-5 w-5 mr-2" />
                  Start Singing
                </Button>
                <Button 
                  onClick={stopAnalysis} 
                  disabled={!isAnalyzing}
                  variant="destructive"
                  className="rounded-xl shadow-lg shadow-destructive/30"
                >
                  <StopCircle className="h-5 w-5 mr-2" />
                  Stop Analysis
                </Button>
              </div>

              <div className="pt-4 border-t border-border/50">
                <h3 className="text-lg font-semibold text-foreground mb-2">Current Track</h3>
                <p className="text-sm text-primary font-medium flex items-center">
                  <Music className="h-4 w-4 mr-2" />
                  {currentSongTitle} by {currentSongArtist}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Note: This is a royalty-free track placeholder.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Session Summary / Score Display */}
          <Card className={cn("lg:col-span-2 glass-pillar flex items-center justify-center p-6")}>
            <div className="text-center">
              <p className="text-xl text-muted-foreground mb-2">Current Pitch Accuracy</p>
              <p className={cn(
                "text-6xl font-extrabold",
                isAnalyzing ? "text-primary neon-blue-glow" : "text-accent neon-gold-glow"
              )}>
                {isAnalyzing ? pitchData.toFixed(1) : finalScore.toFixed(1)}%
              </p>
              {!isAnalyzing && pitchHistory.length > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Session ended. Score saved to profile.
                </p>
              )}
            </div>
          </Card>
        </div>
        
        {/* Live Lyrics Display (Glassmorphism Style) */}
        <Card className={cn("glass-pillar")}>
          <CardHeader>
            <CardTitle className="text-primary">Live Lyrics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-medium text-foreground/80 italic">
              {currentLyrics}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Footer Tagline Fix (Cleaned up) */}
      <div className="text-center py-10 mt-auto">
        <h2 className={cn(
          "text-4xl md:text-6xl font-extrabold uppercase tracking-widest",
          "text-foreground drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
        )}>
          SING. EVOLVE. CONQUER THE 
          <span className="relative inline-block ml-4 text-foreground drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            WORLD.
          </span>
        </h2>
      </div>
    </div>
  );
};

export default VocalSandboxOverlay;