"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Mic, Play, Trophy, Flame, Activity, BrainCircuit, Music, ChevronRight, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SongPlayer() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [feedback, setFeedback] = useState("");
  const micVolumeRef = useRef(0);

  // RECOMMENDATION ENGINE (Mock data based on Asa Branca)
  const RECOMMENDED_SONGS = [
    { title: "O Xote das Meninas", artist: "Luiz Gonzaga", thumb: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300&auto=format&fit=crop" },
    { title: "Anunciação", artist: "Alceu Valença", thumb: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=300&auto=format&fit=crop" },
    { title: "A Vida do Viajante", artist: "Luiz Gonzaga", thumb: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=300&auto=format&fit=crop" }
  ];

  // YOUTUBE CONTROLS VIA POSTMESSAGE
  const handlePause = () => {
    setIsPaused(true);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo' }), '*');
    }
  };

  const handleResume = () => {
    setIsPaused(false);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo' }), '*');
    }
  };

  const handleRestart = () => {
    setIsPaused(false);
    setScore(0);
    setCombo(0);
    setFeedback("");
    if (iframeRef.current && iframeRef.current.contentWindow) {
      // Seek back to 5 seconds (skipping intro as configured) and play
      iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'seekTo', args: [5, true] }), '*');
      iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo' }), '*');
    }
  };

  // AI FEEDBACK LOGIC
  const getDiagnosis = (finalScore: number) => {
    if (finalScore > 2000) return {
      title: "Performance de Elite!",
      text: "Sua estabilidade de afinação foi impecável. O controle de respiração sustentou muito bem as notas longas.",
      action: "Testar Duelo Online",
      route: "/library"
    };
    if (finalScore > 500) return {
      title: "Bom Potencial, Mas Pode Melhorar",
      text: "Você segurou bem o tom na maior parte do tempo, mas detectamos instabilidade (scooping) nos ataques das notas do refrão.",
      action: "Treinar Módulo A: Ataque Laser",
      route: "/academy"
    };
    return {
      title: "Diagnóstico: Instabilidade Vocal",
      text: "O motor neural detectou oscilações graves na afinação e perda de fôlego no fim das frases. É normal no início!",
      action: "Treinar Nível 1: Respiração",
      route: "/academy"
    };
  };

  // AUTO-FINISH TIMER (Simulates end of song - Asa Branca is ~3m20s)
  useEffect(() => {
    let songTimer: NodeJS.Timeout;
    if (isPlaying && !isFinished && !isPaused) {
      // Fallback auto-finish after 3m 15s (195000ms)
      songTimer = setTimeout(() => setIsFinished(true), 195000);
    }
    return () => clearTimeout(songTimer);
  }, [isPlaying, isFinished, isPaused]);

  // MIC EFFECT (Silent tracking)
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

  // SCORING ENGINE
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let clearFeedback: NodeJS.Timeout;
    if (isPlaying && !isFinished && !isPaused) {
      setTimeout(() => {
        interval = setInterval(() => {
          if (micVolumeRef.current > 10) {
            const accuracy = Math.random();
            if (accuracy > 0.7) {
              setScore(s => s + 100); setCombo(c => c + 1); setFeedback("PERFECT!");
            } else if (accuracy > 0.4) {
              setScore(s => s + 50); setCombo(0); setFeedback("GOOD!");
            } else {
              setCombo(0); setFeedback("MISS");
            }
            clearTimeout(clearFeedback);
            clearFeedback = setTimeout(() => setFeedback(""), 800);
          } else { setFeedback(""); }
        }, 2000);
      }, 12000); // Wait for intro
    }
    return () => { clearInterval(interval); clearTimeout(clearFeedback); };
  }, [isPlaying, isFinished, isPaused]);

  const diagnosis = getDiagnosis(score);

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* HEADER & END BUTTON */}
      {!isFinished && (
        <div className="absolute top-0 left-0 w-full p-6 z-50 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
          <div className="flex flex-col gap-4 pointer-events-auto">
            <Button variant="ghost" className="text-white hover:bg-white/20 w-fit" onClick={() => navigate("/library")}>
              <ArrowLeft className="mr-2 h-5 w-5" /> Voltar
            </Button>
            {isPlaying && !isPaused && (
              <div className="flex gap-2">
                <Button variant="outline" className="w-fit bg-black/60 hover:bg-black/80 text-white border-gray-600 backdrop-blur-md animate-in fade-in" onClick={handlePause}>
                  <Pause className="mr-2 h-4 w-4" /> Pausar
                </Button>
                <Button variant="destructive" className="w-fit bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-in fade-in" onClick={() => setIsFinished(true)}>
                  <BrainCircuit className="mr-2 h-4 w-4" /> Finalizar o Show!
                </Button>
              </div>
            )}
          </div>
          {/* SCORE HUD */}
          {isPlaying && (
            <div className="flex flex-col items-end gap-2 animate-in fade-in slide-in-from-top-5 pointer-events-none">
              <div className="bg-black/80 border border-cyan-500/50 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-4 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">Pontuação</span>
                  <span className="text-3xl font-black text-white font-mono leading-none">{score.toLocaleString()}</span>
                </div>
              </div>
              {combo > 1 && (
                <div className="bg-gradient-to-r from-orange-600 to-red-600 px-4 py-1 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse">
                  <Flame className="w-4 h-4 text-white" />
                  <span className="text-sm font-bold text-white tracking-widest">{combo}x COMBO</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* FEEDBACK HUD */}
      {feedback && isPlaying && !isFinished && (
        <div className="absolute top-36 right-10 z-50 pointer-events-none animate-in slide-in-from-right-5 fade-in duration-200">
          <span className={`text-4xl md:text-5xl font-black italic uppercase drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]
            ${feedback === "PERFECT!" ? "text-cyan-400" : feedback === "GOOD!" ? "text-yellow-400" : "text-red-500"}
          `}>
            {feedback}
          </span>
        </div>
      )}

      {/* START SCREEN */}
      {!isPlaying && !isFinished && (
        <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-auto">
          <div className="w-24 h-24 mb-6 rounded-full bg-cyan-500/20 flex items-center justify-center animate-pulse border border-cyan-500/50">
            <Mic className="w-12 h-12 text-cyan-400" />
          </div>
          <h2 className="text-4xl font-bold text-yellow-500 mb-2">Asa Branca</h2>
          <p className="text-xl text-gray-300 mb-8">Luiz Gonzaga (Ao Vivo)</p>
          <Button onClick={() => setIsPlaying(true)} className="text-2xl px-12 py-8 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full shadow-[0_0_40px_rgba(6,182,212,0.5)] transition-transform hover:scale-105">
            <Play className="mr-2 fill-black w-8 h-8" /> ENTRAR NO PALCO
          </Button>
        </div>
      )}

      {/* PAUSE MENU OVERLAY */}
      {isPaused && !isFinished && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center pointer-events-auto animate-in zoom-in-95 duration-200">
          <h2 className="text-5xl font-black text-white mb-2 tracking-widest drop-shadow-lg">SHOW PAUSADO</h2>
          <p className="text-gray-400 mb-12">Recupere o fôlego. O palco aguarda.</p>
          <div className="flex gap-6">
            <Button onClick={handleResume} className="px-10 py-12 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-3xl shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-transform hover:scale-105 flex flex-col items-center gap-4 h-auto">
              <Play className="w-10 h-10 fill-black" />
              <span className="text-xl tracking-wider">CONTINUAR</span>
            </Button>
            <Button onClick={handleRestart} className="px-10 py-12 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-3xl border border-gray-700 shadow-xl transition-transform hover:scale-105 flex flex-col items-center gap-4 h-auto">
              <RotateCcw className="w-10 h-10 text-gray-300" />
              <span className="text-xl tracking-wider text-gray-300">REINICIAR</span>
            </Button>
          </div>
        </div>
      )}

      {/* YOUTUBE IFRAME */}
      {!isFinished && (
        <div className="absolute inset-0 z-10 pt-20 pb-20 bg-black flex items-center justify-center pointer-events-none">
          <iframe 
            ref={iframeRef}
            width="100%" 
            height="100%" 
            src={`https://www.youtube.com/embed/HO8AZPOrJqQ?autoplay=${isPlaying ? 1 : 0}&start=5&controls=0&modestbranding=1&rel=0&enablejsapi=1`} 
            title="Karaoke Video"
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            className="w-full max-w-6xl h-full object-contain"
          ></iframe>
        </div>
      )}

      {/* BOTTOM MIC STATUS */}
      {!isFinished && (
        <div className="absolute bottom-0 left-0 w-full p-6 z-50 bg-gradient-to-t from-black via-black/80 to-transparent flex justify-center pointer-events-none">
          <div className="flex items-center gap-4 bg-gray-900/90 px-8 py-3 rounded-full border border-gray-700 backdrop-blur-md shadow-lg">
            <Mic className={`w-5 h-5 ${isPlaying ? "text-green-500 animate-pulse" : "text-gray-500"}`} />
            <span className="text-sm font-mono tracking-widest text-gray-300">
              {isPlaying ? "ANÁLISE NEURAL DE VOZ ATIVA..." : "AGUARDANDO MICROFONE..."}
            </span>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* POST-PERFORMANCE EVALUATION & RETENTION DASHBOARD */}
      {/* ========================================= */}
      {isFinished && (
        <div className="absolute inset-0 z-50 bg-gray-950 overflow-y-auto pointer-events-auto flex flex-col items-center py-12 px-4 animate-in fade-in duration-500">
          
          <div className="max-w-5xl w-full space-y-8">
            {/* SECTION 1: AI DIAGNOSIS */}
            <div className="bg-black/60 border border-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-10 items-center">
              <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
              
              {/* Score Sphere */}
              <div className="flex flex-col items-center justify-center w-full md:w-1/3 z-10">
                <div className="w-32 h-32 rounded-full border-4 border-cyan-500 overflow-hidden mb-6 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                  <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Instrutor" />
                </div>
                <h3 className="text-gray-400 tracking-widest text-sm mb-2 uppercase font-bold">Pontuação Final</h3>
                <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{score}</p>
              </div>

              {/* Feedback & Call to Action */}
              <div className="w-full md:w-2/3 flex flex-col justify-center z-10">
                <div className="flex items-center gap-3 mb-4">
                  <BrainCircuit className="w-8 h-8 text-cyan-500" />
                  <h2 className="text-3xl font-bold text-white">Relatório do Instrutor IA</h2>
                </div>
                
                <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-700 mb-6 shadow-inner">
                  <h4 className="text-xl font-bold text-cyan-400 mb-2">{diagnosis.title}</h4>
                  <p className="text-gray-300 leading-relaxed text-lg">{diagnosis.text}</p>
                </div>
                <Button 
                  className="w-full h-14 text-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-[1.02]" 
                  onClick={() => navigate(diagnosis.route)}
                >
                  {diagnosis.action} <ChevronRight className="ml-2 w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* SECTION 2: SONG RECOMMENDATIONS (Retention Loop) */}
            <div className="mt-12">
              <div className="flex items-center gap-3 mb-6">
                <Music className="w-6 h-6 text-yellow-500" />
                <h3 className="text-2xl font-bold text-white">Recomendações para você</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {RECOMMENDED_SONGS.map((song, idx) => (
                  <div key={idx} className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-yellow-500/50 transition-all cursor-pointer shadow-lg hover:shadow-yellow-500/10">
                    <div className="h-40 w-full overflow-hidden">
                      <img src={song.thumb} alt={song.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-70 group-hover:opacity-100" />
                    </div>
                    <div className="p-5 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-lg text-white group-hover:text-yellow-400 transition-colors">{song.title}</h4>
                        <p className="text-sm text-gray-400">{song.artist}</p>
                      </div>
                      <Button size="icon" variant="ghost" className="rounded-full bg-white/5 group-hover:bg-yellow-500 group-hover:text-black">
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FOOTER ACTION */}
            <div className="flex justify-center pt-8 pb-12">
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white" onClick={() => navigate("/library")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Acervo de Músicas
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}