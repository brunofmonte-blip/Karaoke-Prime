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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Search & Selection State
  const [songQuery, setSongQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState("HO8AZPOrJqQ"); // Default to a popular karaoke track
  const [opponentName, setOpponentName] = useState(() => localStorage.getItem("lastOpponent") || "AI Boss");
  const [duelMode, setDuelMode] = useState<'competitive' | 'duet'>('competitive');
  const [isCameraActive, setIsCameraActive] = useState(false);

  // User Stats
  const [userScore, setUserScore] = useState(0);
  const [userCombo, setUserCombo] = useState(0);
  const [userFeedback, setUserFeedback] = useState("");
  const micVolumeRef = useRef(0);

  // AI/Opponent Stats
  const [aiScore, setAiScore] = useState(0);
  const [aiFeedback, setAiFeedback] = useState("");

  // YouTube Search Logic
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

  // Camera Logic
  const toggleCamera = async () => {
    if (isCameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (userVideoRef.current) userVideoRef.current.srcObject = null;
      setIsCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
      } catch (err) {
        toast.error("Não foi possível acessar a câmera.");
      }
    }
  };

  // YouTube Controls
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
    setUserFeedback("");
    setAiFeedback("");
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'seekTo', args: [0, true] }), '*');
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'playVideo' }), '*');
  };

  // Mic Detection & Scoring with 15s Delay
  // CRITICAL: AudioContext is initialized only after user clicks "ENTRAR NO PALCO"
  useEffect(() => {
    let audioCtx: AudioContext;
    let analyser: AnalyserNode;
    let animationId: number;
    let scoreInterval: NodeJS.Timeout;
    let delayTimeout: NodeJS.Timeout;

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

        // 15-second intro delay before scoring starts for BOTH User and AI
        delayTimeout = setTimeout(() => {
          toast.info("SHOW TIME: PONTUAÇÃO ATIVA!", { duration: 3000 });
          
          scoreInterval = setInterval(() => {
            // User Scoring Logic
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

            // AI Scoring Logic (Boss)
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
        }, 15000);

      }).catch(err => toast.error("Microfone não detectado. Verifique as permissões."));
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (audioCtx && audioCtx.state !== 'closed') audioCtx.close();
      if (scoreInterval) clearInterval(scoreInterval);
      if (delayTimeout) clearTimeout(delayTimeout);
    };
  }, [isPlaying, isFinished, isPaused]);

  // Ensure camera stream is attached to video element when playing
  useEffect(() => {
    if (isCameraActive && userVideoRef.current && streamRef.current) {
      userVideoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraActive, isPlaying]);

  const isUserWinning = userScore >= aiScore;
  const teamScore = userScore + aiScore;

  return (
    <div className="relative h-screen w-full bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 overflow-hidden flex flex-col">
      {/* PULSE EFFECT LAYER */}
      <div className="absolute inset-0 bg-primary/5 animate-pulse pointer-events-none" />

      {/* HEADER */}
      <div className="absolute top-0 left-0 w-full p-6 z-50 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => navigate("/library")}>
            <ArrowLeft className="mr-2 h-5 w-5" /> Sair
          </Button>
          {isPlaying && (
            <div className="flex items-center gap-3 px-4 py-1 bg-red-600/20 border border-red-600/50 rounded-full">
              <Radio className="h-4 w-4 text-red-500 animate-pulse" />
              <span className="text-xs font-black text-red-500 uppercase tracking-widest">LIVE: VOCÊ VS {opponentName.toUpperCase()}</span>
            </div>
          )}
        </div>

        {isPlaying && !isFinished && (
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

      {/* VS NEON SIGN (CENTERED) */}
      {isPlaying && !isFinished && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
          <div className="text-7xl md:text-9xl font-black italic text-white/20 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] animate-pulse select-none">
            VS
          </div>
        </div>
      )}

      {/* CAMERA BUBBLES */}
      {isPlaying && !isFinished && isCameraActive && (
        <>
          <div className="absolute bottom-24 left-6 z-50 w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-cyan-500 overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.5)] bg-gray-900">
            <video ref={userVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-cyan-500 text-[10px] font-bold px-2 py-0.5 rounded text-black">VOCÊ</div>
          </div>
          <div className="absolute bottom-24 right-6 z-50 w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-red-500 overflow-hidden shadow-[0_0_20px_rgba(239,68,68,0.5)] bg-gray-900">
            <div className="w-full h-full flex items-center justify-center bg-red-950/20">
              <Bot className="w-12 h-12 text-red-500/50" />
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-red-500 text-[10px] font-bold px-2 py-0.5 rounded text-white">{opponentName.toUpperCase()}</div>
          </div>
        </>
      )}

      {/* MAIN DUEL AREA */}
      <div className="flex-grow flex relative">
        {/* COMPETITIVE MODE SPLIT */}
        {duelMode === 'competitive' ? (
          <>
            <div className={cn("flex-1 flex flex-col items-center justify-center transition-all duration-500 border-r border-white/10", isUserWinning ? "bg-cyan-950/10" : "bg-black/40")}>
              <div className="mb-8 flex flex-col items-center z-10">
                <p className="text-6xl font-black text-white drop-shadow-lg">{userScore.toLocaleString()}</p>
                <p className="text-cyan-400 font-bold text-lg mt-2 h-8">{userFeedback}</p>
              </div>
            </div>
            <div className={cn("flex-1 flex flex-col items-center justify-center transition-all duration-500", !isUserWinning ? "bg-red-950/10" : "bg-black/40")}>
              <div className="mb-8 flex flex-col items-center z-10">
                <p className="text-6xl font-black text-white drop-shadow-lg">{aiScore.toLocaleString()}</p>
                <p className="text-red-400 font-bold text-lg mt-2 h-8">{aiFeedback}</p>
              </div>
            </div>
          </>
        ) : (
          /* DUET MODE UNIFIED */
          <div className="flex-1 flex flex-col items-center justify-end pb-32 bg-gradient-to-t from-purple-900/20 to-transparent">
            <div className="text-center space-y-4 z-10">
              <p className="text-xs font-bold text-purple-400 uppercase tracking-[0.3em]">Team Score</p>
              <p className="text-8xl font-black text-white drop-shadow-[0_0_30px_rgba(168,85,247,0.6)]">{teamScore.toLocaleString()}</p>
              <div className="flex gap-12 justify-center">
                <p className="text-cyan-400 font-bold text-xl">{userFeedback}</p>
                <p className="text-red-400 font-bold text-xl">{aiFeedback}</p>
              </div>
            </div>
          </div>
        )}

        {/* YOUTUBE IFRAME */}
        {!isFinished && isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="w-full max-w-4xl aspect-video bg-black shadow-[0_0_100px_rgba(0,0,0,1)] border border-white/5">
              <iframe 
                ref={iframeRef}
                width="100%" height="100%" 
                src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&controls=0&modestbranding=1&rel=0&enablejsapi=1`} 
                title="Duel Video" frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                className="w-full h-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* SETUP SCREEN */}
      {!isPlaying && !isFinished && (
        <div 
          className="absolute inset-0 z-[60] bg-cover bg-center flex flex-col items-center justify-center p-6 overflow-y-auto"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2070')" }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Microphone Stands (Visual Framing) */}
          <div className="absolute left-10 bottom-0 h-[70vh] w-1 bg-gray-400/30 hidden lg:block">
            <div className="absolute -top-10 -left-4 p-4 bg-gray-800 rounded-full border-2 border-gray-600 shadow-2xl">
              <Mic className="h-12 w-12 text-gray-400" />
            </div>
          </div>
          <div className="absolute right-10 bottom-0 h-[70vh] w-1 bg-gray-400/30 hidden lg:block">
            <div className="absolute -top-10 -left-4 p-4 bg-gray-800 rounded-full border-2 border-gray-600 shadow-2xl">
              <Mic className="h-12 w-12 text-gray-400" />
            </div>
          </div>

          <div className="max-w-2xl w-full space-y-8 relative z-10">
            <div className="text-center">
              <h2 className="text-5xl font-black text-white mb-2 tracking-tighter">CONFIGURAR DUELO</h2>
              <p className="text-gray-400">Escolha sua música e seu oponente para a batalha.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Song Selection */}
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
                      onClick={() => setSelectedVideoId(video.id.videoId)}
                      className={cn(
                        "p-2 rounded-lg border cursor-pointer transition-all flex gap-3 items-center",
                        selectedVideoId === video.id.videoId ? "border-primary bg-primary/10" : "border-white/5 bg-white/5 hover:bg-white/10"
                      )}
                    >
                      <img src={video.snippet.thumbnails.default.url} className="w-12 h-12 rounded object-cover" />
                      <p className="text-xs font-medium text-white line-clamp-2">{video.snippet.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Opponent & Mode */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-xs font-bold text-primary uppercase tracking-widest">2. Oponente</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input 
                      placeholder="Nome do Oponente..." 
                      className="pl-10 bg-white/5 border-white/10"
                      value={opponentName}
                      onChange={(e) => {
                        setOpponentName(e.target.value);
                        localStorage.setItem("lastOpponent", e.target.value);
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-primary uppercase tracking-widest">3. Modo de Jogo</label>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className={cn("flex-1 rounded-xl", duelMode === 'competitive' ? "border-primary bg-primary/10" : "border-white/10")}
                      onClick={() => setDuelMode('competitive')}
                    >
                      Competitivo
                    </Button>
                    <Button 
                      variant="outline" 
                      className={cn("flex-1 rounded-xl", duelMode === 'duet' ? "border-purple-500 bg-purple-500/10" : "border-white/10")}
                      onClick={() => setDuelMode('duet')}
                    >
                      Dueto
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3">
                    {isCameraActive ? <Camera className="text-green-500" /> : <CameraOff className="text-gray-500" />}
                    <span className="text-sm font-medium text-white">Câmera ao Vivo</span>
                  </div>
                  <Button size="sm" variant="ghost" onClick={toggleCamera} className="text-primary">
                    {isCameraActive ? "Desativar" : "Ativar"}
                  </Button>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => setIsPlaying(true)} 
              className="w-full h-16 text-xl bg-primary hover:bg-primary/90 text-black font-black rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.3)]"
            >
              ENTRAR NO PALCO
            </Button>
          </div>
        </div>
      )}

      {/* PAUSE MENU OVERLAY (HIGH PRIORITY) */}
      {isPaused && !isFinished && (
        <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center pointer-events-auto animate-in zoom-in-95 duration-200">
          <h2 className="text-6xl font-black text-white mb-2 tracking-widest drop-shadow-lg">SHOW PAUSADO</h2>
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

      {/* FINISH SCREEN */}
      {isFinished && (
        <div className="absolute inset-0 z-[110] bg-gray-950 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="max-w-2xl w-full text-center space-y-8">
            <div className={cn(
              "text-7xl md:text-9xl font-black italic tracking-tighter mb-4",
              duelMode === 'duet' ? "text-purple-400" : isUserWinning ? "text-cyan-400" : "text-red-500"
            )}>
              {duelMode === 'duet' ? "SHOW COMPLETO!" : isUserWinning ? "VITÓRIA!" : "DERROTA"}
            </div>
            
            <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl">
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

              <div className="flex items-start gap-4 text-left bg-black/40 p-6 rounded-2xl border border-gray-700">
                <BrainCircuit className="w-8 h-8 text-cyan-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-white mb-1">Diagnóstico do Duelo</h4>
                  <p className="text-gray-400">
                    {duelMode === 'duet' 
                      ? `Excelente harmonia! Juntos vocês atingiram ${teamScore.toLocaleString()} pontos. A sincronia rítmica foi o ponto forte.`
                      : isUserWinning 
                        ? `Você superou ${opponentName}! Sua precisão nos agudos garantiu a vantagem final.`
                        : `${opponentName} levou a melhor. Foque em Academy Nível 2 para melhorar sua estabilidade de tom.`}
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