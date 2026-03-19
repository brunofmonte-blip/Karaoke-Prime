"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Mic, Play, Trophy, Sword } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export default function DuelRoom() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [user, setUser] = useState<FirebaseUser | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Pontuações
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const micVolumeRef = useRef(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  const handleFinishShow = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo' }), '*');
    }
    // Redireciona para o Resultado
    navigate('/score', { 
      state: { 
        title: "BATALHA ONLINE", 
        artist: "KARAOKE PRIME", 
        score: score, 
        accuracy: score > 0 ? Math.min(99.9, (score / 150) + 40).toFixed(1) : 0, 
        duration: "180" 
      } 
    });
  };

  // Lógica da Câmera e Microfone (A mesma que corrigimos no Solo)
  useEffect(() => {
    let stream: MediaStream | null = null;
    let audioCtx: AudioContext | null = null;
    let animationId: number;

    if (isPlaying) {
      navigator.mediaDevices.getUserMedia({ audio: true, video: cameraEnabled })
        .then((s) => {
          stream = s;
          if (cameraEnabled && videoRef.current) {
            videoRef.current.srcObject = s;
          }
          
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          audioCtx = new AudioContext();
          if (audioCtx.state === 'suspended') {
              audioCtx.resume();
          }

          const analyser = audioCtx.createAnalyser();
          const source = audioCtx.createMediaStreamSource(s);
          source.connect(analyser);
          analyser.fftSize = 256;
          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          
          const updateVolume = () => {
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
            micVolumeRef.current = average;
            animationId = requestAnimationFrame(updateVolume);
          };
          updateVolume();
        })
        .catch(err => {
            console.error("Media access error:", err);
            toast.error("Permissão de câmera/microfone negada.");
        });
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (audioCtx && audioCtx.state !== 'closed') audioCtx.close();
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [isPlaying, cameraEnabled]);

  // Lógica das Notas (Você e Oponente)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        // Sua nota (Baseada em volume real)
        if (micVolumeRef.current > 10) {
          const points = Math.floor(micVolumeRef.current);
          setScore(prev => prev + points);
        }

        // Nota do Oponente simulada pela IA (Gera uma disputa apertada)
        if (Math.random() > 0.3) {
            setOpponentScore(prev => prev + Math.floor(Math.random() * 25) + 10);
        }

      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Define quem está ganhando no momento
  const isWinning = score >= opponentScore;

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col">
      
      {/* HEADER DA BATALHA */}
      <div className="absolute top-0 left-0 w-full p-6 z-50 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
        
        {/* Você (Lado Esquerdo) */}
        <div className="flex items-center gap-4 bg-zinc-950/80 border border-white/10 rounded-full pr-6 p-2 backdrop-blur-md pointer-events-auto">
           <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-cyan-400 shrink-0">
               <img src={user?.photoURL || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80"} alt="Você" className="w-full h-full object-cover" />
           </div>
           <div>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{user?.displayName || "Você"}</p>
               <p className={`text-2xl font-black font-mono leading-none ${isWinning ? 'text-cyan-400' : 'text-white'}`}>{score.toLocaleString()}</p>
           </div>
        </div>

        {/* Botão de Encerrar no Centro */}
        <div className="pointer-events-auto flex flex-col items-center gap-2">
            <div className="bg-red-500/20 px-4 py-1 rounded-full border border-red-500/30 flex items-center gap-2">
                <Sword className="h-4 w-4 text-red-500" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Duel</span>
            </div>
            <Button variant="destructive" onClick={handleFinishShow} className="bg-red-600 hover:bg-red-500 text-xs uppercase font-black rounded-full h-8 px-6 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                Encerrar Combate
            </Button>
        </div>

        {/* Oponente (Lado Direito) */}
        <div className="flex items-center gap-4 bg-zinc-950/80 border border-white/10 rounded-full pl-6 p-2 backdrop-blur-md pointer-events-auto">
           <div className="text-right">
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Maria Clara</p>
               <p className={`text-2xl font-black font-mono leading-none ${!isWinning ? 'text-orange-500' : 'text-white'}`}>{opponentScore.toLocaleString()}</p>
           </div>
           <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-orange-500 shrink-0">
               <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" alt="Oponente" className="w-full h-full object-cover" />
           </div>
        </div>
      </div>

      {/* TELA DE START */}
      {!isPlaying && (
        <div className="absolute inset-0 z-40 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-auto">
          <Sword className="w-20 h-20 text-orange-500 mb-6 drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]" />
          <h2 className="text-5xl font-black text-white mb-2 uppercase italic tracking-tighter">Arena Pronta</h2>
          <p className="text-xl text-gray-400 mb-10 text-center max-w-md">Oponente conectada. Aqueça a voz, o combate vai começar.</p>
          
          <Button 
            variant="outline" 
            onClick={() => setCameraEnabled(!cameraEnabled)}
            className={`mb-6 border-cyan-500 ${cameraEnabled ? 'bg-cyan-500/20 text-cyan-400' : 'bg-transparent text-gray-400'}`}
          >
            {cameraEnabled ? "📷 Câmera ATIVADA" : "📷 Câmera DESATIVADA"}
          </Button>

          <Button onClick={() => setIsPlaying(true)} className="text-2xl px-16 py-8 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase italic rounded-full shadow-[0_0_40px_rgba(249,115,22,0.5)] transition-transform hover:scale-105">
             INICIAR BATALHA
          </Button>
        </div>
      )}

      {/* VÍDEO DO YOUTUBE (CENTRALIZADO NA TELA) */}
      <div className="absolute inset-0 z-10 pt-24 pb-20 bg-[#050505] flex items-center justify-center pointer-events-none">
        <iframe 
          ref={iframeRef}
          width="100%" 
          height="100%" 
          src={`https://www.youtube.com/embed/${id}?autoplay=${isPlaying ? 1 : 0}&start=0&controls=0&modestbranding=1&rel=0&enablejsapi=1&origin=${window.location.origin}`} 
          title="Karaoke Video"
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          className="w-full max-w-5xl h-full object-contain"
        ></iframe>
      </div>

      {/* CÂMERA DO USUÁRIO (ESQUERDA) */}
      {isPlaying && cameraEnabled && (
        <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-12 w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-cyan-400 overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.3)] z-50 bg-zinc-900 animate-in fade-in zoom-in slide-in-from-left-10">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover transform scale-x-[-1]" 
          />
          {isWinning && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-cyan-500 text-black text-[10px] font-black uppercase px-3 py-1 rounded-full">Ganhando</div>
          )}
        </div>
      )}

      {/* CÂMERA DO OPONENTE (DIREITA) */}
      {isPlaying && (
        <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-12 w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-orange-500 overflow-hidden shadow-[0_0_30px_rgba(249,115,22,0.3)] z-50 bg-zinc-900 animate-in fade-in zoom-in slide-in-from-right-10">
           <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300" className="w-full h-full object-cover opacity-80" alt="Oponente" />
           {!isWinning && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-orange-500 text-black text-[10px] font-black uppercase px-3 py-1 rounded-full">Ganhando</div>
          )}
        </div>
      )}

    </div>
  );
}