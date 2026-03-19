"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Mic, Play, BrainCircuit, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function SongPlayer() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [score, setScore] = useState(0);
  const micVolumeRef = useRef(0);

  const handlePause = () => {
    setIsPaused(true);
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo' }), '*');
      }
    } catch (e) {}
  };

  const handleResume = () => {
    setIsPaused(false);
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo' }), '*');
      }
    } catch (e) {}
  };

  const handleRestart = () => {
    setIsPaused(false);
    setScore(0);
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'seekTo', args: [0, true] }), '*');
        iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo' }), '*');
      }
    } catch (e) {}
  };

  // 🚨 CORREÇÃO: Redirecionamento imediato e forçado (sem delays que causam tela preta ou redirecionamento falso)
  const handleFinishShow = () => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo' }), '*');
      }
    } catch (e) {}
    
    const finalAccuracy = score > 0 ? Number(Math.min(99.9, (score / 150) + 40).toFixed(1)) : 0;
    
    navigate('/score', { 
      replace: true, // Força a sobreposição da rota (não deixa o React se perder)
      state: { 
        title: "MÚSICA SELECIONADA", 
        artist: "YOUTUBE", 
        score: score, 
        accuracy: finalAccuracy, 
        duration: "180" 
      } 
    });
  };

  useEffect(() => {
    let stream: MediaStream | null = null;
    let audioCtx: AudioContext | null = null;
    let animationId: number;

    if (isPlaying && !isPaused) {
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
  }, [isPlaying, isPaused, cameraEnabled]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isPaused) {
      interval = setInterval(() => {
        if (micVolumeRef.current > 25) {
          const points = Math.floor(micVolumeRef.current / 2);
          setScore(prev => prev + points);
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isPaused]);

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full p-6 z-50 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="flex flex-col gap-4 pointer-events-auto">
          <Button variant="ghost" className="text-white hover:bg-white/20 w-fit" onClick={() => navigate("/basic")}>
            <ArrowLeft className="mr-2 h-5 w-5" /> Voltar ao Lobby
          </Button>
          {isPlaying && !isPaused && (
            <div className="flex gap-2">
              <Button variant="outline" className="w-fit bg-black/60 hover:bg-black/80 text-white border-gray-600 backdrop-blur-md animate-in fade-in" onClick={handlePause}>
                <Pause className="mr-2 h-4 w-4" /> Pausar
              </Button>
              <Button variant="destructive" className="w-fit bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-in fade-in" onClick={handleFinishShow}>
                <BrainCircuit className="mr-2 h-4 w-4" /> Finalizar o Show!
              </Button>
            </div>
          )}
        </div>
        
        {isPlaying && score > 0 && (
          <div className="pointer-events-none bg-black/50 border border-white/10 px-6 py-2 rounded-full backdrop-blur-md">
            <span className="text-cyan-400 font-mono font-black text-xl">{score.toLocaleString()} pts</span>
          </div>
        )}
      </div>

      {!isPlaying && (
        <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-auto">
          <div className="w-24 h-24 mb-6 rounded-full bg-cyan-500/20 flex items-center justify-center animate-pulse border border-cyan-500/50">
            <Mic className="w-12 h-12 text-cyan-400" />
          </div>
          <h2 className="text-4xl font-bold text-yellow-500 mb-2">Pronto para o Show?</h2>
          <p className="text-xl text-gray-300 mb-8">Aqueça a voz e prepare-se para brilhar.</p>
          
          <Button 
            variant="outline" 
            onClick={() => setCameraEnabled(!cameraEnabled)}
            className={`mb-6 border-cyan-500 ${cameraEnabled ? 'bg-cyan-500/20 text-cyan-400' : 'bg-transparent text-gray-400'}`}
          >
            {cameraEnabled ? "📷 Câmera ATIVADA" : "📷 Câmera DESATIVADA"}
          </Button>

          <Button onClick={() => setIsPlaying(true)} className="text-2xl px-12 py-8 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full shadow-[0_0_40px_rgba(6,182,212,0.5)] transition-transform hover:scale-105">
            <Play className="mr-2 fill-black w-8 h-8" /> ENTRAR NO PALCO
          </Button>
        </div>
      )}

      {isPaused && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center pointer-events-auto animate-in zoom-in-95 duration-200">
          <h2 className="text-5xl font-black text-white mb-2 tracking-widest drop-shadow-lg">SHOW PAUSADO</h2>
          <p className="text-gray-400 mb-12">Recupere o fôlego. O palco aguarda.</p>
          <div className="flex gap-6">
            <Button onClick={handleResume} className="px-10 py-12 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-3xl shadow-[0_0_30px_rgba(6,182,212,0.4)] flex flex-col items-center gap-4 h-auto">
              <Play className="w-10 h-10 fill-black" />
              <span className="text-xl tracking-wider">CONTINUAR</span>
            </Button>
            <Button onClick={handleRestart} className="px-10 py-12 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-3xl border border-gray-700 shadow-xl flex flex-col items-center gap-4 h-auto">
              <RotateCcw className="w-10 h-10 text-gray-300" />
              <span className="text-xl tracking-wider text-gray-300">REINICIAR</span>
            </Button>
          </div>
        </div>
      )}

      <div className="absolute inset-0 z-10 pt-20 pb-20 bg-black flex items-center justify-center pointer-events-none">
        <iframe 
          ref={iframeRef}
          width="100%" 
          height="100%" 
          src={`https://www.youtube.com/embed/${id}?autoplay=${isPlaying ? 1 : 0}&start=0&controls=0&modestbranding=1&rel=0&enablejsapi=1&origin=${window.location.origin}`} 
          title="Karaoke Video"
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          className="w-full max-w-6xl h-full object-contain"
        ></iframe>
      </div>

      {isPlaying && cameraEnabled && videoRef && (
        <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-12 w-40 h-40 md:w-48 md:h-48 rounded-full border-[3px] border-cyan-400 overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.4)] z-50 bg-zinc-900 animate-in fade-in zoom-in">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover transform scale-x-[-1]" 
          />
        </div>
      )}

      <div className="absolute bottom-0 left-0 w-full p-6 z-50 bg-gradient-to-t from-black via-black/80 to-transparent flex justify-center pointer-events-none">
        <div className="flex items-center gap-4 bg-gray-900/90 px-8 py-3 rounded-full border border-gray-700 backdrop-blur-md shadow-lg">
          <Mic className={`w-5 h-5 ${isPlaying ? "text-cyan-400 animate-pulse" : "text-gray-500"}`} />
          <span className="text-sm font-mono tracking-widest text-gray-300">
            {isPlaying ? "IA KARAOKE PRIME ATIVA..." : "AGUARDANDO MICROFONE..."}
          </span>
        </div>
      </div>
    </div>
  );
}