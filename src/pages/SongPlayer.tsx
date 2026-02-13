import React, { useState, useEffect } from "react";
import { ArrowLeft, Mic, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SongPlayer() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [offset, setOffset] = useState(0); // Sync Offset in seconds

  // TIMESTAMPS FOR "KARAOKE VIOLÃO" VERSION (Estimated)
  const LYRICS = [
    { time: 0, text: "🎵 [INTRODUÇÃO] 🎵" },
    { time: 13, text: "Quando olhei a terra ardendo" },
    { time: 19, text: "Qual fogueira de São João" },
    { time: 25, text: "Eu perguntei a Deus do céu, ai" },
    { time: 31, text: "Por que tamanha judiação" },
    { time: 37, text: "Eu perguntei a Deus do céu, ai" },
    { time: 43, text: "Por que tamanha judiação" },
    { time: 49, text: "Que braseiro, que fornalha" },
    { time: 55, text: "Nem um pé de plantação" },
    { time: 61, text: "Por falta d'água, perdi meu gado" },
    { time: 67, text: "Morreu de sede meu alazão" },
  ];

  // SIMULATED TIMER (Syncs with Video Play)
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Logic: Adjust current time by offset to find active line
  const activeIndex = LYRICS.findLastIndex((line) => (currentTime + offset) >= line.time);

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-black overflow-hidden">
      {/* LEFT SIDE: LYRICS (50%) */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col p-8 border-r border-gray-800 bg-gray-950 relative">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" className="text-white z-50 hover:bg-white/10" onClick={() => navigate("/library")}>
            <ArrowLeft className="mr-2 h-5 w-5" /> Sair
          </Button>
          
          {/* SYNC CONTROLS */}
          <div className="flex items-center gap-2 bg-gray-900 p-2 rounded-lg border border-gray-700">
            <Settings2 className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">Sync: {offset > 0 ? `+${offset}s` : `${offset}s`}</span>
            <Button size="sm" variant="secondary" className="h-6 px-2" onClick={() => setOffset(o => o - 0.5)}>-</Button>
            <Button size="sm" variant="secondary" className="h-6 px-2" onClick={() => setOffset(o => o + 0.5)}>+</Button>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center space-y-6 overflow-hidden">
          <div className="w-full transition-all duration-700 ease-in-out transform" style={{ transform: `translateY(-${activeIndex * 40}px)` }}>
            {LYRICS.map((line, index) => {
              const isActive = index === activeIndex;
              const isPast = index < activeIndex;
              return (
                <p 
                  key={index}
                  className={`transition-all duration-500 text-center font-bold py-2
                    ${isActive ? "text-4xl text-yellow-400 scale-110 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]" : 
                      isPast ? "text-xl text-gray-700 blur-[1px]" : "text-xl text-gray-600"}
                  `}
                >
                  {line.text}
                </p>
              );
            })}
          </div>
        </div>

        {/* Pitch Graph Overlay */}
        <div className="h-32 w-full mt-4 bg-gray-900/50 rounded-xl border border-gray-800 relative flex flex-col items-center justify-center overflow-hidden">
          <div className="flex items-center mb-2">
            <Mic className="text-cyan-500 animate-pulse mr-2 h-4 w-4" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">MICROFONE ABERTO</span>
          </div>
          <div className="w-full h-12 flex items-end justify-center gap-1 px-4">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="w-1 bg-cyan-500/40 rounded-t-full transition-all duration-150"
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
        {!isPlaying && (
          <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-6 h-24 w-24 rounded-full bg-yellow-500/20 flex items-center justify-center ring-4 ring-yellow-500/50">
              <Mic className="h-12 w-12 text-yellow-400" />
            </div>
            <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Asa Branca</h2>
            <p className="text-gray-400 mb-8">Versão Instrumental / Karaokê Violão</p>
            <Button 
              onClick={() => setIsPlaying(true)} 
              className="text-2xl px-12 py-8 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-full shadow-[0_0_30px_rgba(234,179,8,0.5)] transition-transform hover:scale-105 active:scale-95"
            >
              INICIAR KARAOKE
            </Button>
          </div>
        )}
        
        {/* INSTRUMENTAL VIDEO SOURCE */}
        <iframe 
          width="100%" 
          height="100%" 
          src={`https://www.youtube.com/embed/tvAtWam6V0E?autoplay=${isPlaying ? 1 : 0}&controls=0&modestbranding=1&rel=0&enablejsapi=1`} 
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