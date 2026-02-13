import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicDomainLibrary } from '@/data/public-domain-library';
import { useVocalSandbox } from '@/hooks/use-vocal-sandbox';
import { Button } from '@/components/ui/button';
import { PlayCircle, ChevronLeft, Music, Mic2, Activity, Pause, Volume2 } from 'lucide-react';
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
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Hardcoded test audio for proof of sound
  const TEST_AUDIO_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
  
  // Thematic background for Asa Branca or default
  const BG_IMAGE_URL = song?.id === 'pd-5' || song?.id === 'pd-20' 
    ? "https://images.unsplash.com/photo-1516916759473-600c07bc99d7?q=80&w=2000&auto=format&fit=crop"
    : song?.imageUrl || "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2070&auto=format&fit=crop";

  useEffect(() => {
    if (!song) {
      navigate('/library');
    }
  }, [song, navigate]);

  const handlePlay = () => {
    if (song) {
      // We use the sandbox's startAnalysis which handles the audio engine internally
      // but we ensure the user interaction triggers it here.
      startAnalysis(song, false);
      setHasStarted(true);
      setIsPlaying(true);
    }
  };

  if (!song) return null;

  const progressValue = (currentTime / totalDuration) * 100;

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden flex flex-col">
      {/* 1. Visual Overhaul: The Stage Look */}
      <div className="absolute inset-0 z-0">
        <img 
          src={BG_IMAGE_URL} 
          className="w-full h-full object-cover blur-md opacity-40 scale-110 transition-transform duration-[10000ms] ease-linear" 
          alt="Stage Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      {/* Header Controls */}
      <div className="relative z-20 p-4 md:p-8 flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => { stopAnalysis(); navigate('/library'); }} 
          className="rounded-full text-white hover:bg-white/10"
        >
          <ChevronLeft className="h-6 w-6 mr-2" />
          Voltar
        </Button>
        
        <div className="text-right">
          <h1 className="text-xl font-bold text-primary neon-blue-glow">{song.title}</h1>
          <p className="text-sm text-gray-400">{song.artist}</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-grow flex flex-col items-center justify-center px-4">
        {!hasStarted ? (
          <div className="flex flex-col items-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full animate-pulse" />
              <div className="h-32 w-32 rounded-full border-4 border-primary/50 flex items-center justify-center bg-black/40 backdrop-blur-md relative z-10">
                <Music className="h-16 w-16 text-primary" />
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-black tracking-tighter">PRONTO PARA O SHOW?</h2>
              <p className="text-gray-400 max-w-md mx-auto">
                O microfone está calibrado. Clique abaixo para soltar a voz.
              </p>
            </div>

            <Button 
              onClick={handlePlay}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-12 py-10 text-3xl font-black shadow-2xl shadow-primary/40 transition-all hover:scale-110 active:scale-95"
            >
              <PlayCircle className="h-10 w-10 mr-4" />
              TOCAR MÚSICA
            </Button>
          </div>
        ) : (
          <div className="w-full max-w-5xl flex flex-col items-center space-y-12 animate-in fade-in duration-1000">
            {/* Lyrics: Large, Glowing, Centered */}
            <div className="w-full py-12 flex items-center justify-center min-h-[300px]">
              <div className="w-full text-center drop-shadow-[0_0_15px_rgba(0,168,225,0.5)]">
                <LyricPlayer lyrics={song.lyrics} currentTime={currentTime} />
              </div>
            </div>

            {/* Live Feedback Bar */}
            <div className="w-full max-w-3xl space-y-4">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
                    <Mic2 className="h-5 w-5 text-primary animate-pulse" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Frequência Real</p>
                    <p className="text-2xl font-black text-white">
                      {pitchDataHz > 0 ? pitchDataHz.toFixed(1) : "---"} <span className="text-xs text-gray-500">Hz</span>
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Progresso</p>
                  <p className="text-xl font-mono text-white">
                    {Math.floor(currentTime)}s / {totalDuration}s
                  </p>
                </div>
              </div>
              
              <Progress 
                value={progressValue} 
                className="h-2 bg-white/10" 
                indicatorClassName="bg-primary shadow-[0_0_10px_rgba(0,168,225,0.8)]" 
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Visualizer: Semi-transparent at the bottom */}
      {hasStarted && (
        <div className="relative z-10 h-48 w-full bg-gradient-to-t from-black to-transparent px-4 md:px-8 pb-4">
          <div className="h-full w-full opacity-60 hover:opacity-100 transition-opacity duration-500">
            <VocalEvolutionChart title="" data={pitchHistory} height="100%" />
          </div>
        </div>
      )}

      {/* Floating Status Indicator */}
      {hasStarted && (
        <div className="absolute bottom-6 right-6 z-30 flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
          <div className="flex items-center gap-2 text-xs font-bold text-green-400">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-ping" />
            LIVE ANALYSIS
          </div>
          <div className="h-4 w-px bg-white/20" />
          <Volume2 className="h-4 w-4 text-primary" />
        </div>
      )}
    </div>
  );
};

export default SongPlayer;