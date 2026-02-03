import React, { useEffect, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, StopCircle, Music, X, ShieldCheck, Loader2 } from 'lucide-react';
import { useVocalSandbox } from '@/hooks/use-vocal-sandbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAuth } from '@/integrations/supabase/auth';
import LyricPlayer from './LyricPlayer';
import { useDuel } from '@/hooks/use-duel-engine';
import { Slider } from '@/components/ui/slider';

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
    currentSong,
    currentTime,
    sessionSummary,
    isDuelMode,
    countdown, // New
    sensitivity, // New
    setSensitivity, // New
    isOnline, // New
  } = useVocalSandbox();
  
  const { currentTurn } = useDuel();
  
  const { user } = useAuth();
  const sessionStartTimeRef = useRef<number | null>(null);

  // Calculate final score when analysis stops (used for display before summary modal opens)
  const finalScore = useMemo(() => {
    if (pitchHistory.length === 0) return 0;
    const totalPitch = pitchHistory.reduce((sum, item) => sum + item.pitch, 0);
    return totalPitch / pitchHistory.length;
  }, [pitchHistory]);

  if (!isOverlayOpen) {
    return null;
  }
  
  if (!currentSong) {
    return (
      <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center">
        <p className="text-primary neon-blue-glow">Loading song data...</p>
      </div>
    );
  }
  
  // If countdown is active, show the large countdown screen
  if (countdown !== null) {
    return (
      <div className="fixed inset-0 z-[101] bg-background/95 backdrop-blur-xl flex items-center justify-center">
        <div className="text-center">
          <p className="text-8xl font-extrabold text-primary neon-blue-glow animate-pulse">
            {countdown === 0 ? 'GO!' : countdown}
          </p>
          <p className="text-xl text-muted-foreground mt-4">
            Get ready to sing "{currentSongTitle}"
          </p>
        </div>
      </div>
    );
  }
  
  const player1Name = user?.email?.split('@')[0] || 'Player 1';
  const player2Name = 'Local Opponent (AI)';
  
  const currentPlayerName = currentTurn === 1 ? player1Name : player2Name;
  
  const overlayTitle = isDuelMode 
    ? `Duel Mode: Turn ${currentTurn} (${currentPlayerName})`
    : 'Live Vocal Sandbox';

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col p-4 md:p-8 overflow-y-auto">
      
      {/* Header and Close Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-primary neon-blue-glow">
          {overlayTitle}
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
                  {isAnalyzing ? 'Singing...' : (isDuelMode && currentTurn === 2 ? `Start ${player2Name}'s Turn` : 'Start Singing')}
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

              {/* Microphone Sensitivity Control */}
              <div className="pt-4 border-t border-border/50">
                <h3 className="text-lg font-semibold text-foreground mb-2">Microphone Sensitivity</h3>
                <Slider
                  defaultValue={[sensitivity]}
                  max={200}
                  step={10}
                  onValueChange={(value) => setSensitivity(value[0])}
                  className="w-full"
                  disabled={isAnalyzing}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Current Threshold: {sensitivity} (Lower = More Sensitive)
                </p>
              </div>
              
              {/* Online Status Indicator */}
              <div className="pt-4 border-t border-border/50">
                <h3 className="text-lg font-semibold text-foreground mb-2">Sync Status</h3>
                <p className={cn(
                  "text-sm font-medium flex items-center",
                  isOnline ? "text-green-400" : "text-destructive"
                )}>
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  {isOnline ? "Online & Syncing" : "Offline (Local Save Active)"}
                </p>
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
              <p className="text-xl text-muted-foreground mb-2">
                {isDuelMode ? `Current Pitch (${currentPlayerName})` : 'Current Pitch Accuracy'}
              </p>
              <p className={cn(
                "text-6xl font-extrabold",
                isAnalyzing ? "text-primary neon-blue-glow" : "text-accent neon-gold-glow"
              )}>
                {isAnalyzing ? pitchData.toFixed(1) : finalScore.toFixed(1)}%
              </p>
              {!isAnalyzing && pitchHistory.length > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  {isDuelMode 
                    ? (currentTurn === 2 ? `Player 1 score recorded. Waiting for Player 2.` : 'Duel finished. Results saved locally.')
                    : 'Session ended. Score saved to profile.'
                  }
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
          <CardContent className="py-6">
            <LyricPlayer lyrics={currentSong.lyrics} currentTime={currentTime} />
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