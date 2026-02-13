import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SongPlayer() {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* LAYER 1: BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1516916759473-600c07bc99d7?q=80&w=2000&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-40 blur-sm" 
          alt="Background" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
      </div>

      {/* LAYER 2: YOUTUBE EMBED (Audio Source) */}
      <div className="absolute bottom-24 right-6 z-50 w-64 h-36 border-2 border-yellow-500 rounded-lg overflow-hidden shadow-2xl bg-black">
        <iframe 
          width="100%" 
          height="100%" 
          src="https://www.youtube.com/embed/zsFSHg2hxbc?autoplay=0&controls=1" 
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
        <div className="bg-black/80 text-white text-[10px] text-center p-1 font-bold">
          FONTE DE ÁUDIO (CLIQUE PLAY)
        </div>
      </div>

      {/* LAYER 3: INTERFACE & LYRICS */}
      <div className="relative z-10 flex flex-col h-full p-6">
        <Button 
          variant="ghost" 
          className="self-start text-white mb-10 hover:bg-white/10" 
          onClick={() => navigate("/library")}
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Voltar
        </Button>
        
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] uppercase tracking-tighter">
              Asa Branca
            </h1>
            <h2 className="text-xl text-gray-300 font-medium">Luiz Gonzaga</h2>
          </div>
          
          <div className="space-y-8 max-w-3xl">
            <div className="space-y-2">
              <p className="text-3xl font-bold text-white leading-relaxed drop-shadow-lg">
                "Quando olhei a terra ardendo"
              </p>
              <p className="text-4xl font-black text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]">
                "Qual fogueira de São João"
              </p>
            </div>
            
            <div className="space-y-2 opacity-50">
              <p className="text-2xl text-gray-400 blur-[0.5px]">
                "Eu perguntei a Deus do céu, ai"
              </p>
              <p className="text-2xl text-gray-400 blur-[0.5px]">
                "Por que tamanha judiação"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2 text-yellow-500/50 text-xs font-bold uppercase tracking-widest">
        <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
        Live Performance Mode
      </div>
    </div>
  );
}