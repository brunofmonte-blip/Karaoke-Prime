"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Mic, Play, Trophy, Flame, BrainCircuit, ChevronRight, Pause, RotateCcw, Zap, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Duel() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // User Stats
  const [userScore, setUserScore] = useState(0);
  const [userCombo, setUserCombo] = useState(0);
  const [userFeedback, setUserFeedback] = useState("");
  const micVolumeRef = useRef(0);

  // AI Stats
  const [aiScore, setAiScore] = useState(0);
  const [aiFeedback, setAiFeedback] = useState("");

  const VIDEO_ID = "HO8AZPOrJqQ"; // Luiz Gonzaga - Asa Branca

  // YOUTUBE CONTROLS
  const handlePause = () => {
    setIsPaused(true);
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo' }), '*');
    }
  };

  const handleResume = () => {
    setIsPaused(false);
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo' }), '*');
    }
  };

  const handleRestart = () => {
    setIsPaused(false);
    setUserScore(0);
    setUserCombo(0);
    setAiScore(0);
    setUserFeedback("");
    setAiFeedback("");
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'seekTo', args: [5, true] }), '*');
      iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo' }), '*');
    }
  };

  // MIC DETECTION
  useEffect(() => {
    let audioCtx: AudioContext;
    let analyser: AnalyserNode;
    let animationId: number;
    if (isPlaying && !isFinished && !isPaused) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateVolume = () => {
          analyser.getByteFrequencyData(dataArray);
          const sum = dataArray.reduce((a, b) => a + b, 0);
          micVolumeRef.current = sum / dataArray.length;
          animationId = requestAnimationFrame(updateVolume);
        };
        updateVolume();
      }).catch(err => console.error(err));
    }
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (audioCtx && audioCtx.state !== 'closed') audioCtx.close();
    };
  }, [isPlaying, isFinished, isPaused]);

  // SCORING ENGINE (User & AI)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isFinished && !isPaused) {
      interval = setInterval(() => {
        // User Scoring
        if (micVolumeRef.current > 10) {
          const accuracy = Math.random();
          if (accuracy > 0.7) {
            setUserScore(s => s + 100); setUserCombo(c => c + 1); setUserFeedback("PERFECT!");
          } else if (accuracy > 0.4) {
            setUserScore(s => s + 50); setUserCombo(0); setUserFeedback("GOOD!");
          } else {
            setUserCombo(0); setUserFeedback("MISS");
          }
        } else {
          setUserFeedback("");
        }

        // AI Scoring (Simulated Boss)
        const aiAccuracy = Math.random();
        if (aiAccuracy > 0.3) {
          setAiScore(s => s + 90); setAiFeedback("PERFECT!");
        } else {
          setAiScore(s => s + 60); setAiFeedback("GOOD!");
        }

        setTimeout(() => {
          setUserFeedback("");
          setAiFeedback("");
        }, 1000);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isFinished, isPaused]);

  const isUserWinning = userScore >= aiScore;

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col">
      {/* VS NEON SIGN */}
      {isPlaying && !isFinished && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
          <div className="text-6xl md:text-8xl font-black italic text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] animate-pulse">
            VS
          </div>
        </div>
      )}

      {/* HEADER */}
      {!isFinished && (
        <div className="absolute top-0 left-0 w-full p-6 z-50 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
          <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => navigate("/library")}>
            <ArrowLeft className="mr-2 h-5 w-5" /> Sair do Duelo
          </Button>
          {isPlaying && !isPaused && (
            <div className="flex gap-2">
              <Button variant="outline" className="bg-black/60 text-white border-gray-600" onClick={handlePause}>
                <Pause className="mr-2 h-4 w-4" /> Pausar
              </Button>
              <Button variant="destructive" onClick={() => setIsFinished(true)}>
                <BrainCircuit className="mr-2 h-4 w-4" /> Finalizar
              </Button>
            </div>
          )}
        </div>
      )}

      {/* SPLIT SCREEN UI */}
      <div className="flex-grow flex relative">
        {/* USER SIDE (LEFT) */}
        <div className={cn(
          "flex-1 flex flex-col items-center justify-center transition-all duration-500 border-r border-white/10",
          isUserWinning ? "bg-cyan-950/20" : "bg-black"
        )}>
          <div className="mb-8 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50 mb-4">
              <User className="w-10 h-10 text-cyan-400" />
            </div>
            <h3 className="text-cyan-400 font-bold tracking-widest uppercase text-sm">Você</h3>
            <p className="text-5xl font-black text-white mt-2">{userScore.toLocaleString()}</p>
            {userCombo > 1 && <p className="text-orange-500 font-bold mt-1 animate-bounce">{userCombo}x COMBO</p>}
            <p className={cn(
              "text-2xl font-black mt-4 h-8 transition-all",
              userFeedback === "PERFECT!" ? "text-cyan-400 scale-110" : "text-yellow-400"
            )}>{userFeedback}</p>
          </div>
        </div>

        {/* AI SIDE (RIGHT) */}
        <div className={cn(
          "flex-1 flex flex-col items-center justify-center transition-all duration-500",
          !isUserWinning ? "bg-red-950/20" : "bg-black"
        )}>
          <div className="mb-8 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/50 mb-4">
              <Bot className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-red-400 font-bold tracking-widest uppercase text-sm">AI Boss</h3>
            <p className="text-5xl font-black text-white mt-2">{aiScore.toLocaleString()}</p>
            <p className={cn(
              "text-2xl font-black mt-4 h-8 transition-all",
              aiFeedback === "PERFECT!" ? "text-red-400 scale-110" : "text-yellow-400"
            )}>{aiFeedback}</p>
          </div>
        </div>

        {/* YOUTUBE IFRAME (CENTERED OVERLAY) */}
        {!isFinished && isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="w-full max-w-4xl aspect-video bg-black shadow-[0_0_50px_rgba(0,0,0,1)] border border-white/10">
              <iframe 
                ref={iframeRef}
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&start=5&controls=0&modestbranding=1&rel=0&enablejsapi=1`} 
                title="Duel Video"
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        )}
      </div>

      {/* START SCREEN */}
      {!isPlaying && !isFinished && (
        <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center">
          <Zap className="w-16 h-16 text-yellow-500 mb-6 animate-pulse" />
          <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">MODO DUELO</h2>
          <p className="text-xl text-gray-400 mb-12">Você vs. AI Vocal Engine</p>
          <Button onClick={() => setIsPlaying(true)} className="text-2xl px-12 py-8 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-transform hover:scale-105">
            INICIAR BATALHA
          </Button>
        </div>
      )}

      {/* PAUSE OVERLAY */}
      {isPaused && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
          <h2 className="text-5xl font-black text-white mb-12">DUELO PAUSADO</h2>
          <div className="flex gap-6">
            <Button onClick={handleResume} className="px-10 py-12 bg-cyan-500 text-black font-bold rounded-3xl flex flex-col items-center gap-4 h-auto">
              <Play className="w-10 h-10 fill-black" />
              <span>CONTINUAR</span>
            </Button>
            <Button onClick={handleRestart} className="px-10 py-12 bg-gray-900 text-white font-bold rounded-3xl border border-gray-700 flex flex-col items-center gap-4 h-auto">
              <RotateCcw className="w-10 h-10" />
              <span>REINICIAR</span>
            </Button>
          </div>
        </div>
      )}

      {/* VICTORY / DEFEAT OVERLAY */}
      {isFinished && (
        <div className="absolute inset-0 z-50 bg-gray-950 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="max-w-2xl w-full text-center space-y-8">
            <div className={cn(
              "text-7xl md:text-9xl font-black italic tracking-tighter mb-4",
              isUserWinning ? "text-cyan-400 drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]" : "text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]"
            )}>
              {isUserWinning ? "VITÓRIA!" : "DERROTA"}
            </div>
            
            <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl">
              <div className="flex justify-around mb-8">
                <div className="text-center">
                  <p className="text-gray-400 text-sm uppercase font-bold mb-1">Seu Score</p>
                  <p className="text-4xl font-black text-white">{userScore.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm uppercase font-bold mb-1">AI Score</p>
                  <p className="text-4xl font-black text-white">{aiScore.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-left bg-black/40 p-6 rounded-2xl border border-gray-700">
                <BrainCircuit className="w-8 h-8 text-cyan-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-white mb-1">Dica do Instrutor AI</h4>
                  <p className="text-gray-400">
                    {isUserWinning 
                      ? "Impressionante! Sua precisão rítmica superou meus algoritmos. Você está pronto para o Next Talent."
                      : "O AI Boss manteve uma estabilidade de 95%. Foque em Academy Nível 2 para melhorar seu ataque laser."}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="h-14 px-8 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl" onClick={() => navigate("/academy")}>
                Ir para a Academy
              </Button>
              <Button variant="outline" className="h-14 px-8 border-gray-700 text-gray-300" onClick={() => navigate("/library")}>
                Voltar à Biblioteca
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}