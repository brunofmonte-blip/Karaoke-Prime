import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, StopCircle, Music, X, ShieldCheck, Trophy, Wind, AlertCircle, Activity, Target, Volume2 } from 'lucide-react';
import { useVocalSandbox } from '@/hooks/use-vocal-sandbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import LyricPlayer from './LyricPlayer';
import { Slider } from '@/components/ui/slider';
import VocalEvolutionChart from './VocalEvolutionChart';
import { Progress } from '@/components/ui/progress';
import FarinelliExercise from './FarinelliExercise';
import PitchCalibrationExercise from './PitchCalibrationExercise';

// --- Subcomponente: Visualizador Neon Cibernético ---
const NeonWaveVisualizer = ({ isAnalyzing, frequency }: { isAnalyzing: boolean, frequency: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const phaseRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Redimensionar canvas para evitar distorção
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const render = () => {
      // Efeito de "rastro" (trail effect)
      ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 3;

      if (!isAnalyzing) {
        // Linha plana quando ocioso
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.strokeStyle = '#334155'; // slate-700
        ctx.shadowBlur = 0;
        ctx.stroke();
        animationRef.current = requestAnimationFrame(render);
        return;
      }

      // Estilo da onda baseado em se há som ou não
      const isSinging = frequency > 0;
      ctx.strokeStyle = isSinging ? '#06b6d4' : '#64748b'; // Cyan neon ou cinza
      ctx.shadowBlur = isSinging ? 15 : 0;
      ctx.shadowColor = isSinging ? '#06b6d4' : 'transparent';

      ctx.beginPath();
      
      // Dinâmica da onda: Amplitude e comprimento variam com o Pitch (Hz)
      const amplitude = isSinging ? canvas.height / 3 : 5;
      const waveLength = isSinging ? Math.max(20, 8000 / frequency) : 100;
      
      // Velocidade da onda
      phaseRef.current += isSinging ? 0.15 : 0.02;

      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + Math.sin((x / waveLength) + phaseRef.current) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isAnalyzing, frequency]);

  return (
    <div className="relative w-full h-24 mt-6 mb-2 overflow-hidden bg-slate-950 rounded-xl border border-slate-800 shadow-inner">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {!isAnalyzing && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500 font-medium uppercase tracking-widest">
          Aguardando Motor
        </div>
      )}
    </div>
  );
};

// --- Componente Principal ---
const VocalSandboxOverlay: React.FC = () => {
  const { 
    isOverlayOpen, 
    closeOverlay, 
    isAnalyzing, 
    startAnalysis, 
    stopAnalysis, 
    pitchDataHz,
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
    manualProgress,
    activeModule,
    activeExerciseId,
  } = useVocalSandbox();
  
  const isBreathingExercise = activeModule === 'farinelli' || activeModule === 'sovt' || activeModule === 'panting' || activeModule === 'alexander' || activeModule === 'rhythm';
  const isPitchCalibration = activeModule === 'pitch-calibration' || (activeExerciseId && activeExerciseId.startsWith('l5-'));
  
  const progressValue = isBreathingExercise ? manualProgress : (currentTime / totalDuration) * 100;

  if (!isOverlayOpen || !currentSong) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col p-4 md:p-8 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-bold text-primary neon-blue-glow">
            {isBreathingExercise ? "Conservatório Vocal" : isPitchCalibration ? "Laboratório de Calibração" : "Sandbox Vocal ao Vivo"}
          </h1>
          {!isBreathingExercise && !isPitchCalibration && (
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Music className="h-4 w-4" />
              {currentSongTitle} — {currentSongArtist}
            </p>
          )}
        </div>
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
          <span className="flex items-center gap-2">
            {isAnalyzing && <Volume2 className="h-4 w-4 text-primary animate-pulse" />}
            {isAnalyzing ? "Áudio Ativo" : "Aguardando Início"}
          </span>
          <span>{Math.min(100, progressValue).toFixed(0)}%</span>
        </div>
        <Progress value={progressValue} className="h-3 bg-primary/20" indicatorClassName="bg-primary shadow-lg shadow-primary/50" />
      </div>

      <div className="flex-grow space-y-8">
        {isBreathingExercise ? (
          <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
            <FarinelliExercise moduleType={activeModule} />
          </div>
        ) : isPitchCalibration ? (
          <div className="max-w-5xl mx-auto w-full">
            <PitchCalibrationExercise 
              subModule={activeModule} 
              frequency={pitchDataHz} 
              currentTime={currentTime} 
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className={cn("lg:col-span-1 glass-pillar h-fit")}>
              <CardHeader>
                <CardTitle className="text-accent neon-gold-glow flex items-center">
                  {ghostTrace.length > 0 && <Trophy className="h-5 w-5 mr-2" />}
                  Controles de Captação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center space-x-4">
                  <Button 
                    onClick={() => startAnalysis(currentSong, ghostTrace.length > 0)} 
                    disabled={isAnalyzing || countdown !== null}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/30"
                  >
                    <Mic className="h-5 w-5 mr-2" />
                    {countdown !== null ? `Iniciando em ${countdown}...` : isAnalyzing ? 'Analisando...' : 'Começar'}
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

                {/* VISUALIZADOR INJETADO AQUI */}
                <NeonWaveVisualizer isAnalyzing={isAnalyzing} frequency={pitchDataHz} />

                <div className="pt-4 border-t border-border/50">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-foreground">Sensibilidade do Microfone</h3>
                    <span className="text-xs text-muted-foreground font-mono">{sensitivity}</span>
                  </div>
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
                title="Análise de Tom em Tempo Real" 
                data={pitchHistory} 
                opponentTrace={ghostTrace}
                height={250}
              />
            </Card>
          </div>
        )}
        
        {!isBreathingExercise && !isPitchCalibration && (
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
          CANTE. EVOLUA. CONQUISTE.
        </h2>
      </div>
    </div>
  );
};

export default VocalSandboxOverlay;