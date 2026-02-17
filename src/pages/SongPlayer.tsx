import React, { useState, useEffect } from "react";
import { ArrowLeft, Mic, Settings2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function SongPlayer() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [offset, setOffset] = useState(0); // User manual sync

  // TIMESTAMPS: CALIBRATED FOR "AO VIVO" VERSION (Skipping first 5s, vocals start at 10s)
  const LYRICS = [
    { time: 0, text: "🎵 [INTRODUÇÃO] 🎵" },
    { time: 10, text: "Quando olhei a terra ardendo" },
    { time: 16, text: "Qual fogueira de São João" },
    { time: 22, text: "Eu perguntei a Deus do céu, ai" },
    { time: 28, text: "Por que tamanha judiação" },
    { time: 34, text: "Eu perguntei a Deus do céu, ai" },
    { time: 40, text: "Por que tamanha judiação" },
    { time: 46, text: "Que braseiro, que fornalha" },
    { time: 52, text: "Nem um pé de plantação" },
    { time: 58, text: "Por falta d'água, perdi meu gado" },
    { time: 64, text: "Morreu de sede meu alazão" },
  ];

  // TIMER ENGINE
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // LOGIC: Current Time + User Offset vs Lyric Time
  const activeIndex = LYRICS.findLastIndex((line) => (currentTime + offset) >= line.time);

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-black overflow-hidden">
      {/* LEFT SIDE: LYRICS & CONTROLS */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col p-6 border-r border-gray-800 bg-gray-950 relative">
        <div className="flex justify-between items-center mb-4 z-20">
          <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => navigate("/library")}>
            <ArrowLeft className="mr-2 h-5 w-5" /> Sair
          </Button>
          
          {/* SYNC WIDGET */}
          <div className="flex items-center gap-3 bg-gray-900/80 p-2 rounded-full border border-yellow-500/30 backdrop-blur-sm">
            <Settings2 className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-mono text-gray-300 w-16 text-center">
              Sync: {offset > 0 ? `+${offset}s` : `${offset}s`}
            </span>
            <Button size="icon" variant="outline" className="h-8 w-8 rounded-full border-gray-600 hover:bg-gray-800" onClick={() => setOffset(o => o - 1)}>-</Button>
            <Button size="icon" variant="outline" className="h-8 w-8 rounded-full border-gray-600 hover:bg-gray-800" onClick={() => setOffset(o => o + 1)}>+</Button>
          </div>
        </div>
        
        {/* LYRICS DISPLAY */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 overflow-hidden py-10">
          <div className="w-full transition-all duration-700 ease-in-out transform" style={{ transform: `translateY(-${activeIndex * 60}px)` }}>
            {LYRICS.map((line, index) => {
              const isActive = index === activeIndex;
              const isPast = index < activeIndex;
              return (
                <p 
                  key={index}
                  className={cn(
                    "transition-all duration-500 text-center font-bold px-4 py-2",
                    isActive ? "text-3xl md:text-5xl text-yellow-400 scale-105 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" : 
                    isPast ? "text-lg text-gray-700 blur-[1px]" : "text-lg text-gray-600"
                  )}
                >
                  {line.text}
                </p>
              );
            })}
          </div>
        </div>

        {/* MIC INDICATOR */}
        <div className="h-20 w-full mt-2 bg-gray-900/50 rounded-xl border border-gray-800 flex items-center justify-center gap-4">
          <Mic className={cn("w-6 h-6", isPlaying ? "text-green-500 animate-pulse" : "text-gray-500")} />
          <div className="text-xs text-gray-500 font-mono">
            {isPlaying ? "CAPTANDO ÁUDIO..." : "AGUARDANDO..."}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: THE SHOW (Luiz Gonzaga) */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full relative bg-black flex items-center justify-center">
        {/* PLAY OVERLAY */}
        {!isPlaying && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center flex-col gap-4">
            <h2 className="text-3xl font-bold text-yellow-500">Modo Show Ao Vivo</h2>
            <p className="text-gray-300 mb-4">Cante com a banda original</p>
            <Button 
              onClick={() => setIsPlaying(true)} 
              className="text-xl px-12 py-8 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-full shadow-[0_0_40px_rgba(234,179,8,0.4)] transition-transform hover:scale-105"
            >
              <Play className="mr-2 fill-black h-6 w-6" /> ENTRAR NO PALCO
            </Button>
          </div>
        )}
        
        {/* YOUTUBE EMBED - USER SELECTED LIVE VERSION WITH 5S START OFFSET */}
        <iframe 
          width="100%" 
          height="100%" 
          src={`https://www.youtube.com/embed/HO8AZPOrJqQ?autoplay=${isPlaying ? 1 : 0}&start=5&controls=0&modestbranding=1&rel=0&enablejsapi=1`} 
          title="Karaoke Video" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          className="w-full h-full object-cover"
          style={{ pointerEvents: isPlaying ? 'none' : 'auto' }}
        ></iframe>
      </div>
    </div>
  );
}