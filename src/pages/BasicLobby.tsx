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

  const YOUTUBE_API_KEY = "SUA_CHAVE_AQUI"; 

  useEffect(() => {
    if (selectedVideo && !showScore) {
      const loadVideo = () => {
        if (window.YT && window.YT.Player) {
          playerRef.current = new window.YT.Player('youtube-player', {
            videoId: selectedVideo,
            playerVars: { 'autoplay': 1, 'controls': 1, 'origin': window.location.origin, 'rel': 0 },
            events: { 'onReady': (event: any) => event.target.playVideo() }
          });
        }
      };
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
        window.onYouTubeIframeAPIReady = loadVideo;
      } else { loadVideo(); }
    }
    return () => { if (playerRef.current) playerRef.current.destroy(); };
  }, [selectedVideo, showScore, videoKey]);

  // 🔥 SOLUÇÃO PARA A CÂMERA: Tenta forçar o play a cada segundo se estiver ativa
  useEffect(() => {
    let interval: any;
    if (cameraActive && webcamRef.current) {
      interval = setInterval(() => {
        if (webcamRef.current && webcamRef.current.paused) {
          webcamRef.current.play().catch(() => {});
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cameraActive]);

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim() !== '') {
      setIsLoading(true);
      try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(query + " karaoke")}&type=video&key=${YOUTUBE_API_KEY}`);
        const data = await response.json();
        if (data.items) setResults(data.items);
      } catch (error) { console.error(error); } finally { setIsLoading(false); }
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 640 }, 
        audio: true 
      });
      
      setCameraActive(true);
      
      // 💡 HACK DE RENDERIZAÇÃO: Aguarda o elemento existir no DOM antes de injetar o stream
      setTimeout(() => {
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
          webcamRef.current.play();
        }
      }, 300);
    } catch (err) {
      alert("Permissão negada ou hardware ocupado.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden font-sans">
      
      {/* 1. LOBBY */}
      {!selectedVideo && (
        <div className="relative z-10 p-4 md:p-8 max-w-6xl mx-auto pt-20 text-center">
          <button onClick={() => navigate('/')} className="text-gray-500 mb-6 uppercase text-[10px] flex items-center gap-2 mx-auto">
            <ArrowLeft size={14} /> Voltar
          </button>
          <h1 className="text-4xl md:text-6xl font-black text-primary italic uppercase mb-10 tracking-tighter">Lobby de Karaokê</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div onClick={() => { setQuery(''); setResults([]); }} className="p-8 rounded-[2rem] border border-primary/50 bg-zinc-900/50 cursor-pointer hover:bg-primary/10 transition-all">
              <Globe className="mx-auto mb-4 text-primary" size={32} />
              <h3 className="font-black italic tracking-widest">ONLINE</h3>
            </div>
            <div className="opacity-20 p-8 rounded-[2rem] border border-white/10 bg-zinc-900/50 cursor-not-allowed">
              <Download className="mx-auto mb-4 text-gray-500" size={32} />
              <h3 className="font-black italic tracking-widest">OFFLINE</h3>
            </div>
            <div onClick={() => navigate('/duel')} className="p-8 rounded-[2rem] border border-white/10 bg-zinc-900/50 cursor-pointer hover:bg-white/5 transition-all">
              <Users className="mx-auto mb-4 text-white" size={32} />
              <h3 className="font-black italic tracking-widest text-white">DUETO / BATALHA</h3>
            </div>
          </div>

          <div className="max-w-4xl mx-auto relative mb-16">
            <Input placeholder="Qual hit vamos cantar hoje?" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleSearch} className="pl-12 h-16 bg-zinc-900 border-primary/30 text-white rounded-2xl" />
          </div>

          {results.length > 0 && (
            <div className="max-w-4xl mx-auto space-y-4 pb-20">
              {results.map((video) => (
                <div key={video.id.videoId} onClick={() => setSelectedVideo(video.id.videoId)} className="bg-zinc-900/80 p-4 rounded-2xl flex items-center gap-6 cursor-pointer hover:border-primary border border-transparent transition-all">
                  <img src={video.snippet.thumbnails.high.url} className="w-40 h-24 object-cover rounded-xl" alt="thumb" />
                  <div className="text-left"><h4 className="font-bold text-lg leading-tight">{video.snippet.title}</h4><p className="text-zinc-500 text-sm mt-1">{video.snippet.channelTitle}</p></div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. PERFORMANCE (BLACKOUT TOTAL) */}
      {selectedVideo && !showScore && (
        <div key={videoKey} className="fixed inset-0 z-[100] bg-black flex flex-col lg:flex-row items-center justify-center p-8 gap-12 animate-in fade-in duration-500">
          <div className="flex-1 w-full aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl">
            <div id="youtube-player" className="w-full h-full"></div>
          </div>

          <div className="flex flex-col items-center gap-10">
            {/* CÍRCULO DA CÂMERA COM Z-INDEX REFORÇADO */}
            <div className="h-64 w-64 md:h-80 md:w-80 rounded-full border-2 border-primary overflow-hidden bg-zinc-900 relative z-[110] shadow-[0_0_40px_rgba(0,168,225,0.3)]">
              {!cameraActive ? (
                <div onClick={startCamera} className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer bg-zinc-800 hover:bg-zinc-700 transition-all text-center p-4">
                  <Camera className="mb-3 text-primary" size={32} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Ligar Câmera / Mic</span>
                </div>
              ) : (
                <video 
                  ref={webcamRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover scale-x-[-1] relative z-[120]" 
                />
              )}
            </div>
            
            <div className="flex flex-col gap-6 w-full max-w-[280px]">
              <Button onClick={() => setShowScore(true)} className="h-16 rounded-full bg-primary text-black font-black text-xl italic tracking-tighter hover:bg-white transition-all shadow-xl">FINALIZAR SHOW</Button>
              <div className="flex justify-between px-4">
                 <button onClick={() => setVideoKey(v => v + 1)} className="text-zinc-500 hover:text-white uppercase font-black text-[10px] flex items-center gap-2"><RotateCcw size={14}/> Recomeçar</button>
                 <button onClick={() => { setSelectedVideo(null); setCameraActive(false); }} className="text-destructive/60 hover:text-destructive uppercase font-black text-[10px] flex items-center gap-2"><Ban size={14}/> Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. NOTA (RIGOR IA) */}
      {showScore && (
        <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center p-6 animate-in zoom-in duration-300">
          <Card className="max-w-xl w-full bg-zinc-950 border-white/10 rounded-[3rem] p-10 text-center shadow-[0_0_100px_rgba(0,168,225,0.1)]">
            <Trophy className="mx-auto text-primary mb-6" size={64} />
            <div className="mb-10"><span className="text-9xl font-black text-primary italic tracking-tighter">0.0</span><p className="text-primary/40 font-bold uppercase tracking-[0.4em] text-xs mt-4">Rigor de IA Prime</p></div>
            <div className="bg-white/5 p-8 rounded-[2rem] text-left mb-10 border border-white/5">
               <h4 className="text-primary font-black text-[10px] uppercase mb-4 tracking-widest">Diagnóstico Vocal:</h4>
               <p className="text-zinc-400 italic text-sm leading-relaxed">"O Rigor da IA Prime não detectou entrada de áudio suficiente. Verifique sua conexão de microfone."</p>
            </div>
            <Button onClick={() => { setShowScore(false); setSelectedVideo(null); setCameraActive(false); }} className="w-full h-16 bg-primary text-black font-black rounded-2xl text-xl italic tracking-tighter">VOLTAR AO LOBBY</Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BasicLobby;