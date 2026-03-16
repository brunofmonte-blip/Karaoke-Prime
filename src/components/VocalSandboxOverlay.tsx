import React, { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, StopCircle, Music, X, ShieldCheck, Trophy, Wind, AlertCircle, Activity, Target, Volume2, Sparkles, Star } from 'lucide-react';
import { useVocalSandbox } from '@/hooks/use-vocal-sandbox';
import { useAudioAnalyzer } from '@/hooks/use-audio-analyzer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import LyricPlayer from './LyricPlayer';
import { Slider } from '@/components/ui/slider';
import VocalEvolutionChart from './VocalEvolutionChart';
import { Progress } from '@/components/ui/progress';
import FarinelliExercise from './FarinelliExercise';
import PitchCalibrationExercise from './PitchCalibrationExercise';
import { toast } from 'sonner';

// Novo import do VocalAnalyzer refatorado
import VocalAnalyzer from './VocalAnalyzer';

const VocalSandboxOverlay: React.FC = () => {
  const { 
    isOverlayOpen, 
    closeOverlay, 
    isAnalyzing, 
    startAnalysis, 
    stopAnalysis, 
    // pitchDataHz, // REMOVIDO, pois agora usamos o useAudioAnalyzer diretamente
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
    // Adicionado para receber o resumo
    sessionSummary,
    clearSessionSummary,
  } = useVocalSandbox();

  // Novo estado para o VocalAnalyzer props-consumer
  const [vocalError, setVocalError] = useState<string | null>(null);

  // NOVO: Call useAudioAnalyzer here to start the engine and get the data for the chart and display
  const { pitchDataHz, isAnalyzing: isMicActive } = useAudioAnalyzer();

  const startAnalysisWithHandling = async () => {
    try {
      setVocalError(null);
      await startAnalysis(currentSong, ghostTrace.length > 0);
    } catch (err) {
      console.error("Erro ao iniciar captação no Sandbox:", err);
      setVocalError("Erro de hardware ou permissão negada.");
    }
  };

  const stopAnalysisWithHandling = () => {
    stopAnalysis();
    setVocalError(null);
  }

  // Teoria musical para o VocalAnalyzer props-consumer (mantida no componente mas aqui para tipar)
  const NOTE_STRINGS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const currentNote = useMemo(() => {
    if (pitchDataHz <= 0) return '--';
    const noteNum = 12 * (Math.log(pitchDataHz / 440) / Math.log(2));
    const midiNote = Math.round(noteNum) + 69;
    const octave = Math.floor(midiNote / 12) - 1;
    const noteName = NOTE_STRINGS[midiNote % 12];
    return `${noteName}${octave}`;
  }, [pitchDataHz]);
  
  // Explicit Routing Logic: Map modules and Level 5 IDs to the correct Engine
  const isBreathingExercise = activeModule === 'farinelli' || activeModule === 'sovt' || activeModule === 'panting' || activeModule === 'alexander' || activeModule === 'rhythm';
  
  // Force Pitch Calibration Engine for 'pitch-calibration' module OR any Level 5 exercise
  const isPitchCalibration = activeModule === 'pitch-calibration' || (activeExerciseId && activeExerciseId.startsWith('l5-'));
  
  const progressValue = isBreathingExercise ? manualProgress : (currentTime / totalDuration) * 100;

  if (!isOverlayOpen || !currentSong) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col p-4 md:p-8 overflow-y-auto">
      
      {/* HEADER GERAL */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-bold text-primary neon-blue-glow">
            {sessionSummary ? "Resumo de Performance" : isBreathingExercise ? "Conservatório Vocal" : isPitchCalibration ? "Laboratório de Calibração" : "Sandbox Vocal ao Vivo"}
          </h1>
          {!isBreathingExercise && !isPitchCalibration && !sessionSummary && (
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

      {/* --- ITEM C RESOLVIDO: TELA DE FEEDBACK --- */}
      {sessionSummary ? (
        <div className="flex-grow space-y-8 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto w-full bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl">
          <Sparkles className="h-16 w-16 text-cyan-400 mb-4 animate-pulse" />
          <h2 className="text-5xl font-extrabold text-white tracking-tight">Performance Concluída!</h2>
          <p className="text-xl text-slate-300">Confira seus números cirúrgicos para evoluir.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full pt-8">
            <div className="flex flex-col items-center justify-center p-6 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <Star className="h-6 w-6 text-cyan-400 mb-2" />
              <span className="text-sm font-medium text-slate-400">Precisão da Voz</span>
              <span className="text-5xl font-mono font-bold text-cyan-300">{sessionSummary.pitchAccuracy.toFixed(1)}<span className="text-3xl">%</span></span>
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <ShieldCheck className="h-6 w-6 text-cyan-400 mb-2" />
              <span className="text-sm font-medium text-slate-400">Pontuação Total</span>
              <span className="text-5xl font-mono font-bold text-white">{sessionSummary.totalScore}</span>
            </div>
             <div className="flex flex-col items-center justify-center p-6 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <Trophy className="h-6 w-6 text-cyan-400 mb-2" />
              <span className="text-sm font-medium text-slate-400">Rank</span>
              <span className="text-5xl font-mono font-bold text-white">#{sessionSummary.performanceRank}</span>
            </div>
             <div className="flex flex-col items-center justify-center p-6 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <Activity className="h-6 w-6 text-cyan-400 mb-2" />
              <span className="text-sm font-medium text-slate-400">Duração</span>
              <span className="text-5xl font-mono font-bold text-white">{sessionSummary.durationSeconds}<span className="text-3xl">s</span></span>
            </div>
          </div>

          <div className="w-full pt-8 text-left space-y-3 bg-slate-800/40 p-6 rounded-xl border border-slate-700/40">
            <h4 className="text-xl font-semibold text-white flex items-center"><AlertCircle className="h-5 w-5 text-cyan-400 mr-2" /> Dicas de IA para Melhoria</h4>
            <p className="text-sm text-slate-300">Analisamos sua voz cirurgicamente. Aqui estão seus próximos passos:</p>
            {sessionSummary.improvementTips.length > 0 ? (
                <ul className="list-disc list-inside space-y-1.5 text-slate-200">
                    {sessionSummary.improvementTips.map((tip, idx) => (
                        <li key={idx} className="text-sm">{tip}</li>
                    ))}
                </ul>
            ) : (
                <p className="text-slate-400 text-sm italic pt-1">Nenhuma dica gerada. Continue treinando!</p>
            )}
          </div>

          <div className="pt-10">
            <Button size="lg" onClick={clearSessionSummary} className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full px-12">
              Voltar ao Início
            </Button>
          </div>
        </div>
      ) : (
        /* --- TELA DE PERFORMANCE NORMAL (ITEM B RESOLVIDO) --- */
        <>
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
                  subModule={activeSubModule} 
                  frequency={pitchDataHz} 
                  currentTime={currentTime} 
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Painel de Controle e Telemetria (compacto) na esquerda */}
                <div className="lg:col-span-1 h-fit">
                  <VocalAnalyzer
                    isAnalyzing={isAnalyzing}
                    pitch={pitchDataHz}
                    note={currentNote}
                    error={vocalError}
                    startAnalysis={startAnalysisWithHandling}
                    stopAnalysis={stopAnalysisWithHandling}
                  />
                  
                  <div className="pt-4 border-t border-border/50 mt-4 px-4 bg-slate-900 rounded-2xl shadow-xl border border-slate-800">
                    <h3 className="text-sm font-semibold text-foreground mb-2 px-1">Sensibilidade</h3>
                    <Slider
                      defaultValue={[sensitivity]}
                      max={200}
                      step={10}
                      onValueChange={(value) => setSensitivity(value[0])}
                      className="w-full pb-3"
                      disabled={isAnalyzing}
                    />
                  </div>
                </div>

                {/* Gráfico de Evolução centralizado, fed by hook data */}
                <Card className={cn("lg:col-span-2 glass-pillar p-6")}>
                  <VocalEvolutionChart 
                    title="Análise de Fluxo de Air e Tom" 
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
              CANTE. EVOLUA. CONQUISTAR O MUNDO.
            </h2>
          </div>
        </>
      )}
    </div>
  );
};

export default VocalSandboxOverlay;