import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, StopCircle, Music, X, ShieldCheck, Trophy, Wind, AlertCircle } from 'lucide-react';
import { useVocalSandbox } from '@/hooks/use-vocal-sandbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAuth } from '@/integrations/supabase/auth';
import LyricPlayer from './LyricPlayer';
import { Slider } from '@/components/ui/slider';
import VocalEvolutionChart from './VocalEvolutionChart';
import { Progress } from '@/components/ui/progress';

const BreathingSphere = () => {
  const { breathingPhase, breathingProgress, isAirflowLow } = useVocalSandbox();
  
  const scale = breathingPhase === 'inhale' 
    ? 0.6 + (breathingProgress * 0.6) 
    : 1.2 - (breathingProgress * 0.6);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        {/* Metronome Pulse Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
        
        {/* The Sphere */}
        <div 
          className={cn(
            "h-48 w-48 rounded-full transition-all duration-100 flex items-center justify-center shadow-2xl",
            breathingPhase === 'inhale' ? "bg-primary/40 border-4 border-primary" : "bg-accent/40 border-4 border-accent",
            isAirflowLow && "bg-destructive/40 border-destructive animate-shake"
          )}
          style={{ transform: `scale(${scale})` }}
        >
          <Wind className={cn(
            "h-12 w-12",
            breathingPhase === 'inhale' ? "text-primary" : "text-accent",
            isAirflowLow && "text-destructive"
          )} />
        </div>
      </div>

      <div className="mt-8 text-center">
        <h2 className={cn(
          "text-4xl font-black tracking-tighter uppercase",
          breathingPhase === 'inhale' ? "text-primary neon-blue-glow" : "text-accent neon-gold-glow",
          isAirflowLow && "text-destructive"
        )}>
          {breathingPhase === 'inhale' ? "INALAR PROFUNDO" : "EXALAR CONSTANTE (Sssss)"}
        </h2>
        {isAirflowLow && (
          <p className="text-destructive font-bold mt-2 flex items-center justify-center gap-2">
            <AlertCircle className="h-5 w-5" />
            SOPRO FRACO! SUSTENTE O AR
          </p>
        )}
      </div>
    </div>
  );
};

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
    totalDuration,
    countdown,
    sensitivity,
    setSensitivity,
    breathingPhase,
  } = useVocalSandbox();
  
  const progressValue = (currentTime / totalDuration) * 100;
  const isBreathingExercise = currentSong?.genre === 'Vocal Exercises';

  if (!isOverlayOpen || !currentSong) {
    return null;
  }
  
  if (countdown !== null) {
    return (
      <div className="fixed inset-0 z-[101] bg-background/95 backdrop-blur-xl flex items-center justify-center">
        <div className="text-center">
          <p className="text-8xl font-extrabold text-primary neon-blue-glow animate-pulse">
            {countdown === 0 ? 'VAI!' : countdown}
          </p>
          <p className="text-xl text-muted-foreground mt-4">
            Prepare-se para o Treinamento: "{currentSongTitle}"
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col p-4 md:p-8 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-primary neon-blue-glow">
          {isBreathingExercise ? "Treinamento de Respiração" : "Sandbox Vocal ao Vivo"}
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

      <div className="w-full max-w-4xl mx-auto mb-8 space-y-2">
        <div className="flex justify-between text-sm font-medium text-muted-foreground">
          <span>Progresso da Sessão</span>
          <span>{Math.min(100, progressValue).toFixed(0)}%</span>
        </div>
        <Progress value={progressValue} className="h-3 bg-primary/20" indicatorClassName="bg-primary shadow-lg shadow-primary/50" />
      </div>

      <div className="flex-grow space-y-8">
        {isBreathingExercise ? (
          <BreathingSphere />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className={cn("lg:col-span-1 glass-pillar h-fit")}>
              <CardHeader>
                <CardTitle className="text-accent neon-gold-glow flex items-center">
                  {ghostTrace.length > 0 && <Trophy className="h-5 w-5 mr-2" />}
                  Controles
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
                    {isAnalyzing ? 'Analisando...' : 'Começar'}
                  </Button>
                  <Button 
                    onClick={stopAnalysis} 
                    disabled={!isAnalyzing}
                    variant="destructive"
                    className="rounded-xl shadow-lg shadow-destructive/30"
                  >
                    <StopCircle className="h-5 w-5 mr-2" />
                    Parar
                  </Button>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Sensibilidade</h3>
                  <Slider
                    defaultValue={[sensitivity]}
                    max={200}
                    step={10}
                    onValueChange={(value) => setSensitivity(value[0])}
                    className="w-full"
                    disabled={isAnalyzing}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className={cn("lg:col-span-2 glass-pillar p-6")}>
              <VocalEvolutionChart 
                title="Análise de Fluxo de Ar e Tom" 
                data={pitchHistory} 
                opponentTrace={ghostTrace}
                height={250}
              />
            </Card>
          </div>
        )}
        
        {!isBreathingExercise && (
          <Card className={cn("glass-pillar")}>
            <CardHeader>
              <CardTitle className="text-primary">Letras</CardTitle>
            </CardHeader>
            <CardContent className="py-6">
              <LyricPlayer lyrics={currentSong.lyrics} currentTime={currentTime} />
            </CardContent>
          </Card>
        )}
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