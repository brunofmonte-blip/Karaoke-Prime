import React, { useState } from "react";
import { ArrowLeft, Mic, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SongPlayer() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* HEADER OVERLAY (Always visible) */}
      <div className="absolute top-0 left-0 w-full p-6 z-50 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <Button 
          variant="ghost" 
          className="text-white hover:bg-white/20 pointer-events-auto" 
          onClick={() => navigate("/library")}
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Voltar
        </Button>
        <div className="text-right">
          <h1 className="text-2xl font-bold text-yellow-400 drop-shadow-md">Asa Branca (Ao Vivo)</h1>
          <p className="text-sm text-gray-300">Luiz Gonzaga</p>
        </div>
      </div>

      {/* PLAY OVERLAY (Bypasses browser autoplay block) */}
      {!isPlaying && (
        <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="w-24 h-24 mb-6 rounded-full bg-yellow-500/20 flex items-center justify-center animate-pulse border border-yellow-500/50">
            <Mic className="w-12 h-12 text-yellow-500" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-8 tracking-wider">Pronto para o palco?</h2>
          <Button 
            onClick={() => setIsPlaying(true)} 
            className="text-2xl px-12 py-8 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-full shadow-[0_0_40px_rgba(234,179,8,0.5)] transition-transform hover:scale-105"
          >
            <Play className="mr-2 fill-black w-8 h-8" /> INICIAR SHOW
          </Button>
        </div>
      )}

      {/* YOUTUBE IFRAME (The Core Engine) */}
      <div className="absolute inset-0 z-10 pt-20 pb-20 bg-black flex items-center justify-center">
        <iframe 
          width="100%" 
          height="100%" 
          src={`https://www.youtube.com/embed/HO8AZPOrJqQ?autoplay=${isPlaying ? 1 : 0}&start=5&controls=0&modestbranding=1&rel=0`} 
          title="Karaoke Video" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          className="w-full max-w-6xl h-full object-contain shadow-[0_0_50px_rgba(0,0,0,1)]"
        ></iframe>
      </div>

      {/* BOTTOM OVERLAY (Mic Status) */}
      <div className="absolute bottom-0 left-0 w-full p-6 z-50 bg-gradient-to-t from-black via-black/80 to-transparent flex justify-center pointer-events-none">
        <div className="flex items-center gap-4 bg-gray-900/90 px-8 py-3 rounded-full border border-gray-700 backdrop-blur-md shadow-lg">
          <Mic className={`w-5 h-5 ${isPlaying ? "text-green-500 animate-pulse" : "text-gray-500"}`} />
          <span className="text-sm font-mono tracking-widest text-gray-300">
            {isPlaying ? "MICROFONE ABERTO - CANTANDO" : "AGUARDANDO..."}
          </span>
        </div>
      </div>
    </div>
  );
}