"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, Mic, Play, Trophy, Flame, BrainCircuit, 
  ChevronRight, Pause, RotateCcw, Zap, User, Bot, 
  Search, Camera, CameraOff, Users,
  Loader2, Radio
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const API_KEY = "AIzaSyBcRjgGXm-M6Q05F4dw3bEJmkpXMIV9Qvs";

export default function Duel() {
  const navigate = useNavigate();
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState("");
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const micVolumeRef = useRef(0);

  // Search & Config State
  const [songQuery, setSongQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [opponentName, setOpponentName] = useState(() => localStorage.getItem("lastOpponent") || "AI Boss");
  const [duelMode, setDuelMode] = useState<'competitive' | 'duet'>('competitive');
  const [cameraEnabled, setCameraEnabled] = useState(false);

  // Stats
  const [userScore, setUserScore] = useState(0);
  const [userCombo, setUserCombo] = useState(0);
  const [userFeedback, setUserFeedback] = useState("");
  const [aiScore, setAiScore] = useState(0);
  const [aiFeedback, setAiFeedback] = useState("");

  // CAMERA & MIC INIT (Only runs inside the Arena)
  useEffect(() => {
    let stream: MediaStream | null = null;
    let audioContext: AudioContext | null = null;
    let animationFrameId: number;

    // ONLY try to get media if we are NOT configuring
    if (!isConfiguring) {
      navigator.mediaDevices.getUserMedia({ audio: true, video: cameraEnabled })
        .then((s) => {
          stream = s;
          
          // SAFE CHECK BEFORE ASSIGNMENT
          if (cameraEnabled && userVideoRef && userVideoRef.current) {
            userVideoRef.current.srcObject = s;
          }

          // SETUP AUDIO SCORING ENGINE
          audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const analyser = audioContext.createAnalyser();
          const microphone = audioContext.createMediaStreamSource(stream);
          microphone.connect(analyser);
          analyser.fftSize = 256;
          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          
          const checkVolume = () => {
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
            micVolumeRef.current = average;
            animationFrameId = requestAnimationFrame(checkVolume);
          };
          checkVolume();
        })
        .catch(err => {
          console.error("Media access error:", err);
          toast.error("Erro ao acessar microfone/câmera.");
        });
    }

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (audioContext && audioContext.state !== 'closed') audioContext.close();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isConfiguring, cameraEnabled]);

  // AI BOSS SCORING LOGIC
  useEffect(() => {
    let bossInterval: NodeJS.Timeout;
    let delayTimeout: NodeJS.Timeout;

    if (!isConfiguring && !isFinished && !isPaused) {
      delayTimeout = setTimeout(() => {
        bossInterval = setInterval(() => {
          setAiScore(prev => prev + Math.floor(Math.random() * 50) + 50);
          setAiFeedback(Math.random() > 0.5 ? "PERFECT!" : "Ótima energia!");
          setTimeout(() => setAiFeedback(""), 1000);
        }, 2000);
      }, 15000);
    }

    return () => {
      if (bossInterval) clearInterval(bossInterval);
      if (delayTimeout) clearTimeout(delayTimeout);
    };
  }, [isConfiguring, isFinished, isPaused]);

  // USER SCORING LOGIC
  useEffect(() => {
    let userInterval: NodeJS.Timeout;
    let delayTimeout: NodeJS.Timeout;

    if (!isConfiguring && !isFinished && !isPaused) {
      delayTimeout = setTimeout(() => {
        userInterval = setInterval(() => {
          if (micVolumeRef.current > 10) {
            const accuracy = Math.random();
            if (accuracy > 0.7) {
              setUserScore(s => s + 100); setUserCombo(c => c + 1); setUserFeedback("PERFECT!");
            } else if (accuracy > 0.4) {
              setUserScore(s => s + 50); setUserCombo(0); setUserFeedback("Ótima energia!");
            } else {
              setUserCombo(0); setUserFeedback("Atenção!"); // Fixed "SENHORITA" bug
            }
            setTimeout(() => setUserFeedback(""), 1000);
          }
        }, 2000);
      }, 15000);
    }

    return () => {
      if (userInterval) clearInterval(userInterval);
      if (delayTimeout) clearTimeout(delayTimeout);
    };
  }, [isConfiguring, isFinished, isPaused]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songQuery.trim()) return;
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(songQuery + " karaoke")}&type=video&key=${API_KEY}`
      );
      const data = await response.json();
      setSearchResults(data.items || []);
    } catch (error) {
      toast.error("Erro ao buscar músicas.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleStartStage = () => {
    if (!activeVideoId) {
      toast.error("Por favor, selecione uma música antes de começar.");
      return;
    }
    setIsConfiguring(false);
    toast.info("O show vai começar! Prepare-se para a intro de 15s.");
  };

  const handlePause = () => {
    setIsPaused(true);
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo' }), '*');
  };

  const handleResume = () => {
    setIsPaused(false);
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'playVideo' }), '*');
  };

  const handleRestart = () => {
    setIsPaused(false);
    setUserScore(0);
    setUserCombo(0);
    setAiScore(0);
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'seekTo', args: [0, true] }), '*');
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'playVideo' }), '*');
  };

  const isUserWinning = userScore >= aiScore;

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col">
      {/* HEADER */}
      <div className="absolute top-0 left-0 w-full p-6 z-50 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => navigate("/library")}>
            <ArrowLeft className="mr-2 h-5 w-5" /> Sair
          </Button>
          {!isConfiguring && (
            <div className="flex items-center gap-3 px-4 py-1 bg-red-600/20 border border-red-600/50 rounded-full">
              <Radio className="h-4 w-4 text-red-500 animate-pulse" />
              <span className="text-xs font-black text-red-500 uppercase tracking-widest">
                {duelMode === 'duet' ? "LIVE: DUETO EM SINTONIA" : `LIVE: VOCÊ VS ${opponentName.toUpperCase()}`}
              </span>
            </div>
          )}
        </div>

        {!isConfiguring && !isFinished && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="bg-black/60 text-white border-gray-600" onClick={handlePause}>
              <Pause className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setIsFinished(true)}>
              <BrainCircuit className="h-4 w-4" /> FINALIZAR O SHOW
            </Button>
          </div>
        )}
      </div>

      {/* DUET COMBINED SCORE DISPLAY */}
      {!isConfiguring && !isFinished && duelMode === 'duet' && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-5">
          <div className="bg-purple-600/80 border border-purple-400/50 backdrop-blur-md px-8 py-3 rounded-2xl flex flex-col items-center shadow-[0_0_30px_rgba(147,51,234,0.4)]">
            <span className="text-xs font-bold text-purple-200 tracking-widest uppercase">Pontuação da Dupla</span>
            <span className="text-4xl font-black text-white font-mono leading-none">{(userScore + aiScore).toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* MAIN DUEL AREA */}
      <div className="flex-grow flex relative">
        {!isConfiguring && !isFinished && (
          <>
            <div className={cn(
              "flex-1 flex flex-col items-center justify-center transition-all duration-500 border-r border-white/10", 
              duelMode === 'duet' ? "bg-purple-950/5" : (isUserWinning ? "bg-cyan-950/10" : "bg-black/40")
            )}>
              <div className="mb-8 flex flex-col items-center z-10">
                <p className="text-6xl font-black text-white drop-shadow-lg">{userScore.toLocaleString()}</p>
                <p className="text-cyan-400 font-bold text-lg mt-2 h-8">{userFeedback}</p>
              </div>
            </div>
            <div className={cn(
              "flex-1 flex flex-col items-center justify-center transition-all duration-500", 
              duelMode === 'duet' ? "bg-purple-950/5" : (!isUserWinning ? "bg-red-950/10" : "bg-black/40")
            )}>
              <div className="mb-8 flex flex-col items-center z-10">
                <p className="text-6xl font-black text-white drop-shadow-lg">{aiScore.toLocaleString()}</p>
                <p className="text-red-400 font-bold text-lg mt-2 h-8">{aiFeedback}</p>
              </div>
            </div>
            
            {/* YOUTUBE IFRAME */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="w-full max-w-4xl aspect-video bg-black shadow-[0_0_100px_rgba(0,0,0,1)] border border-white/5">
                <iframe 
                  ref={iframeRef}
                  width="100%" height="100%" 
                  src={"https://www.youtube.com/embed/" + activeVideoId + "?autoplay=1&enablejsapi=1&controls=0"} 
                  title="Duel Video" frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* USER VIDEO CIRCLE */}
            {!isConfiguring && cameraEnabled && !isFinished && (
              <div className="absolute bottom-24 left-8 md:bottom-1/3 md:left-16 w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-cyan-500 overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.6)] z-50 bg-black">
                <video ref={userVideoRef} autoPlay muted playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
              </div>
            )}
          </>
        )}
      </div>

      {/* SETUP SCREEN */}
      {isConfiguring && !isFinished && (
        <div 
          className="absolute inset-0 z-[60] bg-cover bg-center flex flex-col items-center justify-center p-6 overflow-y-auto"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2000&auto=format&fit=crop')" }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div className="max-w-2xl w-full space-y-8 relative z-10">
            <div className="text-center">
              <h2 className="text-5xl font-black text-white mb-2 tracking-tighter">CONFIGURAR DUELO</h2>
              <p className="text-gray-400">Escolha sua música e seu oponente para a batalha.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-xs font-bold text-primary uppercase tracking-widest">1. Escolher Música</label>
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Buscar no YouTube..." 
                    className="pl-10 bg-white/5 border-white/10"
                    value={songQuery}
                    onChange={(e) => setSongQuery(e.target.value)}
                  />
                </form>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {isSearching ? (
                    <div className="flex items-center justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                  ) : searchResults.map((video) => (
                    <div 
                      key={video.id.videoId}
                      onClick={() => setActiveVideoId(video.id.videoId)}
                      className={cn(
                        "p-2 rounded-lg border cursor-pointer transition-all flex gap-3 items-center",
                        activeVideoId === video.id.videoId ? "border-primary bg-primary/10" : "border-white/5 bg-white/5 hover:bg-white/10"
                      )}
                    >
                      <img src={video.snippet.thumbnails.default.url} className="w-12 h-12 rounded object-cover" />
                      <p className="text-xs font-medium text-white line-clamp-2">{video.snippet.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-xs font-bold text-primary uppercase tracking-widest">2. Oponente</label>
                  <Input 
                    placeholder="Nome do Oponente..." 
                    className="bg-white/5 border-white/10"
                    value={opponentName}
                    onChange={(e) => setOpponentName(e.target.value)}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-bold text-primary uppercase tracking-widest">3. Modo</label>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className={cn("flex-1", duelMode === 'competitive' ? "border-primary bg-primary/10" : "border-white/10")}
                      onClick={() => setDuelMode('competitive')}
                    >
                      Competitivo
                    </Button>
                    <Button 
                      variant="outline" 
                      className={cn("flex-1", duelMode === 'duet' ? "border-purple-500 bg-purple-500/10" : "border-white/10")}
                      onClick={() => setDuelMode('duet')}
                    >
                      Dueto
                    </Button>
                  </div>
                </div>

                {/* CAMERA TOGGLE */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-primary uppercase tracking-widest">Câmera ao Vivo</label>
                  <Button 
                    variant="outline" 
                    className={cn("w-full flex items-center justify-center gap-2", cameraEnabled ? "border-cyan-500 bg-cyan-500/10 text-cyan-400" : "border-white/10")}
                    onClick={() => setCameraEnabled(!cameraEnabled)}
                  >
                    {cameraEnabled ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
                    {cameraEnabled ? "Câmera: ATIVADA" : "Câmera: DESATIVADA"}
                  </Button>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleStartStage} 
              className="w-full h-16 text-xl bg-primary hover:bg-primary/90 text-black font-black rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.3)]"
            >
              ENTRAR NO PALCO
            </Button>
          </div>
        </div>
      )}

      {/* PAUSE MENU */}
      {isPaused && (
        <div className="absolute inset-0 z-[9999] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center pointer-events-auto animate-in zoom-in-95 duration-200">
          <h2 className="text-6xl font-black text-white mb-2 tracking-widest">SHOW PAUSADO</h2>
          <div className="flex gap-6 mt-12">
            <Button onClick={handleResume} className="px-10 py-12 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-3xl flex flex-col items-center gap-4 h-auto">
              <Play className="w-10 h-10 fill-black" />
              <span className="text-xl tracking-wider">CONTINUAR</span>
            </Button>
            <Button onClick={handleRestart} className="px-10 py-12 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-3xl flex flex-col items-center gap-4 h-auto">
              <RotateCcw className="w-10 h-10 text-gray-300" />
              <span className="text-xl tracking-wider text-gray-300">REINICIAR</span>
            </Button>
          </div>
        </div>
      )}

      {/* FINISH SCREEN */}
      {isFinished && (
        <div className="absolute inset-0 z-[110] flex flex-col items-center justify-center p-6 animate-in fade-in duration-500 bg-black overflow-hidden">
          {/* EXACT REPLACEMENT FOR DUET END SCREEN */}
          {duelMode === 'duet' ? (
            <div 
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516450360452-631a4530d335?q=80&w=2000&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }} 
              className="absolute inset-0 z-[9999] flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-black/85 z-0 backdrop-blur-sm"></div>
              <div className="relative z-10 flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
                <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-8 italic tracking-widest uppercase drop-shadow-2xl">
                  SHOW DA DUPLA!
                </h1>
                <div className="bg-black/40 border border-gray-800 p-10 rounded-3xl backdrop-blur-md mb-8 max-w-2xl w-full mx-4 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
                  <p className="text-gray-300 text-lg md:text-xl mb-6 font-medium tracking-wide">Vocês cantaram em perfeita sintonia e somaram pontos incríveis!</p>
                  <h3 className="text-gray-500 tracking-widest text-sm mb-2 uppercase font-bold">Pontuação Total</h3>
                  <p className="text-6xl md:text-7xl font-black text-white drop-shadow-lg">{userScore + aiScore}</p>
                </div>
                <div className="flex gap-4">
                  <Button className="px-8 py-6 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl text-lg transition-transform hover:scale-105" onClick={() => navigate("/academy")}>
                    Ir para a Academy
                  </Button>
                  <Button variant="outline" className="px-8 py-6 bg-transparent border-gray-600 text-white hover:bg-white/10 font-bold rounded-xl text-lg transition-transform hover:scale-105" onClick={() => navigate("/library")}>
                    Voltar ao Palco
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {userScore > aiScore ? (
                <img src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop" alt="Victory Background" className="absolute inset-0 w-full h-full object-cover z-0 opacity-40" />
              ) : (
                <img src="https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=2000&auto=format&fit=crop" alt="Defeat Background" className="absolute inset-0 w-full h-full object-cover z-0 opacity-40" />
              )}
              
              <div className="max-w-2xl w-full text-center space-y-8 relative z-10">
                <div className={cn(
                  "text-5xl md:text-7xl font-black italic tracking-tighter mb-4 drop-shadow-2xl",
                  isUserWinning ? "text-cyan-400" : "text-red-500"
                )}>
                  {isUserWinning ? "PARABÉNS PELO SHOW!" : "HOJE O SHOW NÃO FOI BOM!!!"}
                </div>
                
                <div className="bg-black/60 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl">
                  <div className="flex justify-around mb-8">
                    <div className="text-center">
                      <p className="text-gray-400 text-sm uppercase font-bold mb-1">Seu Score</p>
                      <p className="text-4xl font-black text-white">{userScore.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-sm uppercase font-bold mb-1">{opponentName}</p>
                      <p className="text-4xl font-black text-white">{aiScore.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 justify-center">
                  <Button className="h-14 px-8 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20" onClick={() => navigate("/academy")}>
                    Ir para a Academy
                  </Button>
                  <Button variant="outline" className="h-14 px-8 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm" onClick={() => navigate("/library")}>
                    VOLTAR AO PALCO
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}