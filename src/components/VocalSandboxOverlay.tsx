import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, StopCircle, Music, X, ShieldCheck, Trophy } from 'lucide-react';
import { useVocalSandbox } from '@/hooks/use-vocal-sandbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAuth } from '@/integrations/supabase/auth';
import LyricPlayer from './LyricPlayer';
import { Slider } from '@/components/ui/slider';
import VocalEvolutionChart from './VocalEvolutionChart';

const VocalSandboxOverlay: React.FC = () => {
  const { 
    isOverlayOpen, 
    closeOverlay, 
    isAnalyzing, 
    startAnalysis, 
    stopAnalysis, 
    pitchData, 
    pitchHistory,
    ghostTrace,
    currentSongTitle,
    currentSongArtist,
    currentSong,
    currentTime,
    countdown,
    sensitivity,
    setSensitivity,
    isOnline,
  } = useVocalSandbox();
  
  const { user } = useAuth();

  const finalScore = useMemo(() => {
    if (pitchHistory.length === 0) return 0;
    const totalPitch = pitchHistory.reduce((sum, item) => sum + item.pitch, 0);
    return totalPitch / pitchHistory.length;
  }, [pitchHistory]);

  if (!isOverlayOpen || !currentSong) {
    return null;
  }
  
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
  
  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col p-4 md:p-8 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-primary neon-blue-glow">
          {ghostTrace.length > 0 ? "AI Duel Mode" : "Live Vocal Sandbox"}
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className={cn("lg:col-span-1 glass-pillar h-fit")}>
            <CardHeader>
              <CardTitle className="text-accent neon-gold-glow flex items-center">
                {ghostTrace.length > 0 && <Trophy className="h-5 w-5 mr-2" />}
                Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={() => startAnalysis(currentSong, ghostTrace.length > 0)} 
                  disabled={isAnalyzing}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/30"
                >
                  <Mic className="h-5 w-5 mr-2" />
                  {isAnalyzing ? 'Singing...' : 'Start Singing'}
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
                <h3 className="text-lg font-semibold text-foreground mb-2">Microphone Sensitivity</h3>
                <Slider
                  defaultValue={[sensitivity]}
                  max={200}
                  step={10}
                  onValueChange={(value) => setSensitivity(value[0])}
                  className="w-full"
                  disabled={isAnalyzing}
                />
              </div>
              
              <div className="pt-4 border-t border-border/50">
                <h3 className="text-lg font-semibold text-foreground mb-2">Current Track</h3>
                <p className="text-sm text-primary font-medium flex items-center">
                  <Music className="h-4 w-4 mr-2" />
                  {currentSongTitle}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className={cn("lg:col-span-2 glass-pillar p-6")}>
            <VocalEvolutionChart 
              title="Real-time Vocal Comparison" 
              data={pitchHistory} 
              opponentTrace={ghostTrace}
              height={250}
            />
            <div className="text-center mt-4">
              <p className="text-xl text-muted-foreground">
                Current Pitch Accuracy: <span className="text-primary font-bold">{pitchData.toFixed(1)}%</span>
              </p>
            </div>
          </Card>
        </div>
        
        <Card className={cn("glass-pillar")}>
          <CardHeader>
            <CardTitle className="text-primary">Live Lyrics</CardTitle>
          </CardHeader>
          <CardContent className="py-6">
            <LyricPlayer lyrics={currentSong.lyrics} currentTime={currentTime} />
          </CardContent>
        </Card>
      </div>
      
      <div className="text-center py-10 mt-auto">
        <h2 className={cn(
          "text-4xl md:text-6xl font-extrabold uppercase tracking-widest",
          "text-foreground drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
        )}>
          CANTE. EVOLUA. CONQUISTAR O MUNDO.
        </h2>
      </div>
    </div>
  );
};

export default VocalSandboxOverlay;