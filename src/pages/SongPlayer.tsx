import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Mic, Play, Pause, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";

export default function SongPlayer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Hardcoded asset for testing "Asa Branca"
  const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1516916759473-600c07bc99d7?q=80&w=2000&auto=format&fit=crop";
  // Copyright-free acoustic track for testing audio engine
  const TEST_AUDIO_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", () => setIsPlaying(false));
    return () => audio.removeEventListener("timeupdate", updateProgress);
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white">
      {/* 1. LAYER: BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img src={BACKGROUND_IMAGE} className="h-full w-full object-cover opacity-40 blur-sm" alt="Background" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
      </div>

      {/* 2. LAYER: HEADER */}
      <div className="relative z-20 flex items-center justify-between p-6">
        <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => navigate("/library")}>
          <ArrowLeft className="mr-2 h-6 w-6" /> Voltar
        </Button>
        <div className="text-right">
          <h1 className="text-2xl font-bold text-cyan-400">Asa Branca</h1>
          <p className="text-sm text-gray-300">Luiz Gonzaga</p>
        </div>
      </div>

      {/* 3. LAYER: MAIN STAGE (Lyrics & Visuals) */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center pb-32">
        {!isPlaying ? (
          /* START OVERLAY */
          <div className="text-center animate-in fade-in zoom-in duration-500">
            <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-cyan-500/20 ring-4 ring-cyan-500/50 mx-auto">
              <Music2 className="h-16 w-16 text-cyan-400" />
            </div>
            <h2 className="mb-4 text-4xl font-bold">Pronto para o Show?</h2>
            <Button 
              onClick={togglePlay} 
              className="h-14 bg-cyan-500 px-8 text-xl font-bold hover:bg-cyan-400"
            >
              <Play className="mr-2 fill-current" /> INICIAR SHOW
            </Button>
          </div>
        ) : (
          /* LIVE LYRICS */
          <div className="text-center space-y-8">
            <p className="text-2xl text-gray-400 blur-[1px]">Quando olhei a terra ardendo</p>
            <p className="text-5xl font-extrabold text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-pulse">
              Qual fogueira de São João
            </p>
            <p className="text-2xl text-gray-400 blur-[1px]">Eu perguntei a Deus do céu, ai</p>
          </div>
        )}
      </div>

      {/* 4. LAYER: CONTROLS & GRAPH */}
      <div className="absolute bottom-0 z-30 w-full bg-black/80 p-6 backdrop-blur-md">
        {/* Pitch Graph Placeholder */}
        <div className="mb-4 h-24 w-full rounded-lg border border-cyan-900 bg-black/50 p-2 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-cyan-700 text-sm">
            [VISUALIZAÇÃO DE FREQUÊNCIA EM TEMPO REAL]
          </div>
          {isPlaying && (
            <div 
              className="absolute bottom-0 left-0 h-full w-full opacity-30 animate-pulse bg-gradient-to-r from-transparent via-cyan-500 to-transparent transition-transform duration-[2000ms]" 
              style={{ transform: `translateX(${progress - 100}%)` }} 
            />
          )}
        </div>
        {/* Progress Bar & Buttons */}
        <div className="flex items-center gap-4">
          <Button size="icon" variant="ghost" onClick={togglePlay} className="h-12 w-12 rounded-full border border-white/20 hover:bg-white/10">
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-800">
            <div className="h-full bg-cyan-500 transition-all duration-100" style={{ width: `${progress}%` }} />
          </div>
          <Mic className={`h-6 w-6 ${isPlaying ? "text-red-500 animate-pulse" : "text-gray-500"}`} />
        </div>
      </div>
      {/* HIDDEN AUDIO ELEMENT */}
      <audio ref={audioRef} src={TEST_AUDIO_URL} preload="auto" />
    </div>
  );
}