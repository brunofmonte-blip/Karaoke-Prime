import React, { useState, useEffect } from "react";
import { ArrowLeft, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function SongPlayer() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // KARAOKE TIMESTAMPS (Asa Branca)
  const LYRICS = [
    { time: 0, text: "🎵 [INTRODUÇÃO INSTRUMENTAL] 🎵" },
    { time: 16, text: "Quando olhei a terra ardendo" },
    { time: 22, text: "Qual fogueira de São João" },
    { time: 28, text: "Eu perguntei a Deus do céu, ai" },
    { time: 34, text: "Por que tamanha judiação" },
    { time: 40, text: "Eu perguntei a Deus do céu, ai" },
    { time: 46, text: "Por que tamanha judiação" },
    { time: 52, text: "Que braseiro, que fornalha" },
    { time: 58, text: "Nem um pé de plantação" },
    { time: 64, text: "Por farta d'água perdi meu gado" },
    { time: 70, text: "Morreu de sede meu alazão" },
  ];

  // SIMULATED TIMER for lyric synchronization
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const activeIndex = LYRICS.findLastIndex((line) => currentTime >= line.time);

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-black overflow-hidden">
      {/* LEFT SIDE: LYRICS (50%) */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col p-8 border-r border-gray-800 bg-gray-950 relative">
        <Button 
          variant="ghost" 
          className="self-start text-white mb-4 z-50 hover:bg-white/10" 
          onClick={() => navigate("/library")}
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Sair
        </Button>
        
        <div className="flex-1 flex flex-col items-center justify-center space-y-6 overflow-hidden">
          <div className="w-full transition-all duration-700 ease-in-out transform" style={{ transform: `translateY(-${activeIndex * 40}px)` }}>
            {LYRICS.map((line, index) => {
              const isActive = index === activeIndex;
              const isPast = index < activeIndex;
              return (
                <p 
                  key={index}
                  className={cn(
                    "transition-all duration-500 text-center font-bold py-2",
                    isActive ? "text-4xl text-yellow-400 scale-110 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" : 
                    isPast ? "text-xl text-gray-600 blur-[1px]" : "text-xl text-gray-500"
                  )}
                >
                  {line.text}
                </p>
              );
            })}
          </div>
        </div>

        {/* Pitch Graph Overlay Placeholder */}
        <div className="h-32 w-full mt-4 bg-gray-900/50 rounded-xl border border-gray-800 relative flex flex-col items-center justify-center overflow-hidden">
          <div className="flex items-center mb-2">
            <Mic className={cn("h-4 w-4 mr-2", isPlaying ? "text-red-500 animate-pulse" : "text-gray-500")} />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vocal Input Active</span>
          </div>
          <div className="w-full h-12 flex items-end justify-center gap-1 px-4">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="w-1 bg-primary/40 rounded-t-full transition-all duration-150"
                style={{ 
                  height: isPlaying ? `${Math.random() * 100}%` : '10%',
                  opacity: isPlaying ? 0.4 + Math.random() * 0.6 : 0.2
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: VIDEO (50%) */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full relative bg-black flex items-center justify-center">
        {/* Start Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-6 h-24 w-24 rounded-full bg-yellow-500/20 flex items-center justify-center ring-4 ring-yellow-500/50">
              <Mic className="h-12 w-12 text-yellow-400" />
            </div>
            <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Asa Branca</h2>
            <p className="text-gray-400 mb-8">Versão Original / Karaoke</p>
            <Button 
              onClick={() => setIsPlaying(true)} 
              className="text-2xl px-12 py-8 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-2xl shadow-2xl shadow-yellow-500/20 transition-transform hover:scale-105 active:scale-95"
            >
              INICIAR KARAOKE
            </Button>
          </div>
        )}
        
        {/* Functional Video Source */}
        <iframe 
          width="100%" 
          height="100%" 
          src={`https://www.youtube.com/embed/zsFSHg2hxbc?autoplay=${isPlaying ? 1 : 0}&controls=0&modestbranding=1&rel=0&enablejsapi=1`} 
          title="Karaoke Video" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          className="w-full h-full object-cover pointer-events-none"
        ></iframe>

        {/* Live Status Badge */}
        {isPlaying && (
          <div className="absolute top-6 right-6 z-40 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-md flex items-center gap-2 animate-pulse">
            <div className="h-2 w-2 rounded-full bg-white" />
            REC ON AIR
          </div>
        )}
      </div>
    </div>
  );
}