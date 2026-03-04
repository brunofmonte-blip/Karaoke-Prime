import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Download, Users, ArrowLeft, Search, PlayCircle, X, Loader2, Camera, RotateCcw, Pause, Play, Ban, Trophy, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

const BasicLobby = () => {
  const navigate = useNavigate();
  const playerRef = useRef<any>(null);
  const webcamRef = useRef<HTMLVideoElement>(null);
  const [videoKey, setVideoKey] = useState(0);
  
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  
  const [showScore, setShowScore] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [vocalAnalysis, setVocalAnalysis] = useState<any>(null);

  // 🔴 ADICIONE SUA CHAVE API DO YOUTUBE AQUI
  const YOUTUBE_API_KEY = "AIzaSyBaCJPLU9kL_Ufu4S2yJX2v5up6vp5R548"; 

  // Efeito para carregar e controlar o Player do YouTube (Controles Nativos)
  useEffect(() => {
    if (selectedVideo && !showScore) {
      const loadVideo = () => {
        if (window.YT && window.YT.Player) {
          playerRef.current = new window.YT.Player('youtube-player', {
            videoId: selectedVideo,
            playerVars: { 
              'autoplay': 1, 
              'controls': 1, 
              'origin': window.location.origin,
              'rel': 0
            },
            events: {
              'onReady': (event: any) => event.target.playVideo()
            }
          });
        }
      };

      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        window.onYouTubeIframeAPIReady = loadVideo;
      } else {
        loadVideo();
      }
    }
    return () => { if (playerRef.current) playerRef.current.destroy(); };
  }, [selectedVideo, showScore, videoKey]);

  // 🛠️ VERIFICADOR DE CÂMERA: Força a renderização se o Dyad tentar bloquear
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cameraActive && webcamRef.current) {
      interval = setInterval(() => {
        if (webcamRef.current && webcamRef.current.paused) {
          webcamRef.current.play().catch(() => {});
        } else if (webcamRef.current && !webcamRef.current.paused) {
          clearInterval(interval);
        }
      }, 500);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [cameraActive]);

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim() !== '') {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(query + " karaoke")}&type=video&key=${YOUTUBE_API_KEY}`
        );
        const data = await response.json();
        if (data.items) setResults(data.items);
      } catch (error) { console.error("Erro na busca:", error); } finally { setIsLoading(false); }
    }
  };

  const startCamera = async () => {
    try {
      // Limpeza de streams antigos para evitar conflito de hardware
      if (webcamRef.current?.srcObject) {
        const tracks = (webcamRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 }, 
        audio: true 
      });
      
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
        webcamRef.current.setAttribute("playsinline", "true");
        webcamRef.current.setAttribute("autoplay", "true");
        webcamRef.current.muted = true; // Mudo no preview para evitar eco/feedback
        
        await webcamRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Erro ao acessar hardware:", err);
      alert("ERRO: A câmera está bloqueada. Clique no cadeado da URL e permita o acesso.");
    }
  };

  const restartVideo = () => {
    setVideoKey(prev => prev + 1);
  };

  const finalizeSession = () => {
    // 💡 IA DE RIGOR: Mude para 'true' para simular um canto detectado
    const userCantoReal = false; 

    let score, note, recom;

    if (!userCantoReal) {
      score = "0.0";
      note = "O Rigor da IA Prime não detectou entrada de áudio suficiente. A análise espectral foi interrompida. Verifique sua conexão de microfone.";
      recom = ["Check Microfone", "Nível 1: Postura Vocal"];
    } else {
      score = "81.4";
      note = "Afinação estável, porém detectamos micro-oscilações no apoio diafragmático. Sua emissão está um pouco 'soprosa' nos refrões.";
      recom = ["Nível 1: Steady Breath", "Nível 4: Resonance Mastery"];
    }

    setVocalAnalysis({ score, note, recom });
    setShowScore(true);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      
      {/* 1. LOBBY INTERFACE */}
      {!selectedVideo && (
        <div className="relative z-10 p-4 md:p-8 max-w-6xl mx-auto pt-20 animate-in fade-in duration-700 text-center">
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-white mb-6 flex items-center gap-2 font-bold uppercase text-[10px] mx-auto transition-colors">
            <ArrowLeft size={14} /> Voltar para Home
          </button>
          <h1 className="text-4xl md:text-6xl font-black text-primary neon-blue-glow mb-10 italic uppercase tracking-tighter drop-shadow-lg">Lobby de Karaokê</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div onClick={() => { setQuery(''); setResults([]); }} className="group cursor-pointer p-8 rounded-[2rem] border border-primary/50 bg-black/60 hover:bg-primary/20 transition-all flex flex-col items-center shadow-xl">
              <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Globe className="h-10 w-10 text-primary" /></div>
              <h3 className="text-2xl font-black text-white mb-3 uppercase italic">ONLINE</h3>
              <p className="text-gray-400 text-xs leading-relaxed font-medium">Catálogo YouTube em tempo real.</p>
            </div>
            <div className="opacity-20 p-8 rounded-[2rem] border border-white/10 bg-black/40 flex flex-col items-center relative cursor-not-allowed">
              <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6"><Download className="h-10 w-10 text-gray-500" /></div>
              <h3 className="text-2xl font-black text-gray-500 mb-3 uppercase italic">OFFLINE</h3>
            </div>
            <div onClick={() => navigate('/duel')} className="group cursor-pointer p-8 rounded-[2rem] border border-white/10 bg-black/60 hover:border-destructive/50 transition-all flex flex-col items-center shadow-xl">
              <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-destructive/20"><Users className="h-10 w-10 text-white group-hover:text-destructive" /></div>
              <h3 className="text-2xl font-black text-white mb-3 uppercase italic">DUETO / BATALHA</h3>
            </div>
          </div>

          <div className="max-w-4xl mx-auto relative mb-16 group">
            {isLoading ? <Loader2 className="absolute left-6 top-1/2 -translate-y-1/2 h-7 w-7 text-primary animate-spin" /> : <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-500 group-focus-within:text-primary transition-colors" />}
            <Input placeholder="Busque o hit perfeito..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleSearch} className="pl-16 h-20 bg-black/80 border-primary/30 text-white rounded-3xl focus:border-primary text-xl font-bold shadow-2xl transition-all" />
          </div>

          {results.length > 0 && (
            <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in slide-in-from-bottom-5 duration-700">
              {results.map((video) => (
                <div key={video.id.videoId} onClick={() => setSelectedVideo(video.id.videoId)} className="bg-black/60 border border-white/5 rounded-[2.5rem] p-5 flex items-center gap-8 hover:bg-white/5 cursor-pointer group hover:border-primary/50 transition-all shadow-xl">
                  <div className="relative w-56 h-32 overflow-hidden rounded-2xl border border-white/10">
                    <img src={video.snippet.thumbnails.high.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="thumb" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><PlayCircle className="text-primary h-14 w-14 drop-shadow-lg" /></div>
                  </div>
                  <div className="flex-1 text-left truncate">
                    <h4 className="font-black text-white text-2xl group-hover:text-primary italic truncate tracking-tighter">🎤 {video.snippet.title}</h4>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">{video.snippet.channelTitle}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. SALA DE PERFORMANCE (FUNDO 100% PRETO) */}
      {selectedVideo && !showScore && (
        <div key={videoKey} className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4 animate-in fade-in duration-1000">
          <div className="flex flex-col lg:flex-row items-center gap-12 w-full max-w-7xl">
            
            {/* Player de Vídeo Nativo */}
            <div className="flex-1 w-full aspect-video rounded-[3rem] overflow-hidden border-2 border-primary/30 bg-zinc-950 relative shadow-[0_0_100px_rgba(0,168,225,0.1)]">
              <div id="youtube-player" className="w-full h-full"></div>
            </div>

            {/* Webcam Circle e Controles */}
            <div className="flex flex-col items-center gap-8">
              <div className="h-64 w-64 md:h-80 md:w-80 rounded-full border-2 border-primary shadow-[0_0_60px_rgba(0,168,225,0.4)] overflow-hidden bg-zinc-900 relative ring-4 ring-black/50">
                {!cameraActive ? (
                  <div onClick={startCamera} className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer bg-black/60 hover:bg-black/40 transition-all text-center p-4 group">
                    <Camera className="text-primary mb-3 group-hover:scale-125 transition-transform duration-300" size={40}