import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicDomainLibrary } from '@/data/public-domain-library';
import { useVocalSandbox } from '@/hooks/use-vocal-sandbox';
import { Button } from '@/components/ui/button';
import { PlayCircle, ChevronLeft, Music, Mic2, Activity } from 'lucide-react';
import LyricPlayer from '@/components/LyricPlayer';
import VocalEvolutionChart from '@/components/VocalEvolutionChart';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/utils/cn';

const SongPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    startAnalysis, 
    stopAnalysis, 
    isAnalyzing, 
    currentSong, 
    currentTime, 
    totalDuration, 
    pitchHistory,
    pitchDataHz
  } = useVocalSandbox();

  const song = publicDomainLibrary.find(s => s.id === id);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!song) {
      navigate('/library');
    }
  }, [song, navigate]);

  const handlePlay = () => {
    if (song) {
      startAnalysis(song, false);
      setHasStarted(true);
    }
  };

  if (!song) return null;

  const progressValue = (currentTime / totalDuration) * 100;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col">
      <div className="container mx-auto max-w-5xl flex-grow flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => { stopAnalysis(); navigate('/library'); }} className="rounded-full">
            <ChevronLeft className="h-6 w-6 mr-2" />
            Voltar para Biblioteca
          </Button>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-primary neon-blue-glow">{song.title}</h1>
            <p className="text-muted-foreground">{song.artist}</p>
          </div>
        </div>

        {!hasStarted ? (
          <div className="flex-grow flex flex-col items-center justify-center space-y-8 glass-pillar rounded-3xl border-2 border-primary/30 p-12">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
              <Music className="h-24 w-24 text-primary relative z-10" />
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Pronto para brilhar?</h2>
              <p className="text-muted-foreground max-w-md">
                Clique no botão abaixo para carregar a trilha e iniciar sua performance.
              </p>
            </div>
            <Button 
              onClick={handlePlay}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-12 py-8 text-2xl font-black shadow-2xl shadow-primary/40 transition-transform hover:scale-105"
            >
              <PlayCircle className="h-8 w-8 mr-3" />
              PLAY BACKING TRACK
            </Button>
          </div>
        ) : (
          <div className="flex-grow flex flex-col space-y-8 animate-in fade-in duration-700">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold text-primary uppercase tracking-widest">
                <span>Performance em curso</span>
                <span>{Math.floor(currentTime)}s / {totalDuration}s</span>
              </div>
              <Progress value={progressValue} className="h-3 bg-primary/10" indicatorClassName="bg-primary shadow-lg shadow-primary/50" />
            </div>

            {/* Lyrics Section */}
            <div className="glass-pillar rounded-3xl border-2 border-primary/20 p-8 min-h-[200px] flex items-center justify-center">
              <LyricPlayer lyrics={song.lyrics} currentTime={currentTime} />
            </div>

            {/* Visualizer Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-[300px]">
                <VocalEvolutionChart title="Live Pitch Analysis" data={pitchHistory} />
              </div>
              <div className="glass-pillar rounded-3xl border-2 border-accent/30 p-6 flex flex-col items-center justify-center text-center">
                <Activity className="h-12 w-12 text-accent mb-4 amazon-gold-glow" />
                <h3 className="text-xl font-bold text-accent mb-2">Frequência Real</h3>
                <p className="text-5xl font-black text-white tracking-tighter">
                  {pitchDataHz > 0 ? `${pitchDataHz.toFixed(1)}` : "---"}
                  <span className="text-xl ml-1 text-muted-foreground">Hz</span>
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-green-400 uppercase tracking-widest">
                  <Mic2 className="h-4 w-4" />
                  Microfone Ativo
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongPlayer;