import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Download, Users, ArrowLeft, Search, PlayCircle, X, Loader2, Camera, RotateCcw, Ban, Trophy, Star } from 'lucide-react';
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
  const streamRef = useRef<MediaStream | null>(null); // Referência direta para desligar o hardware
  
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  
  const [showScore, setShowScore] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [vocalAnalysis, setVocalAnalysis] = useState<any>(null);

  const YOUTUBE_API_KEY = "SUA_CHAVE_AQUI"; 

  // Limpeza de segurança ao desmontar o componente ou trocar de tela
  useEffect(() => {
    return () => stopAllHardware();
  }, []);

  const stopAllHardware = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }
    setCameraActive(false);
  };

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
  }, [selectedVideo, showScore]);

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
        video: { width: 480, height: 480 }, 
        audio: true 
      });
      
      streamRef.current = stream;
      setCameraActive(true);
      
      setTimeout(() => {
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
          webcamRef.current.play().catch(console.error);
        }
      }, 100);
    } catch (err) {
      alert("Permissão de câmera negada.");
    }
  };

  const closePerformance = () => {
    stopAllHardware();
    setSelectedVideo(null);
    setShowScore(false);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      
      {!selectedVideo && (
        <div className="relative z-10 p-4 md:p-8 max-w-6xl mx-auto pt-20 text-center animate-in fade-in duration-500">
          <button onClick={() => navigate('/')} className="text-gray-500 mb-6 uppercase text-[10px] flex items-center gap-2 mx-auto hover:text-white transition-colors">
            <ArrowLeft size={14} /> Voltar para Home
          </button>
          <h1 className="text-4xl md:text-6xl font-black text-primary italic uppercase mb-10 tracking-tighter">Lobby de Karaokê</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="p-8 rounded-[2rem] border border-primary/50 bg-zinc-900/50">
              <Globe className="mx-auto mb-4 text-primary" size={32} />
              <h3 className="font-black italic">ONLINE</h3>
            </div>
            <div className="opacity-20 p-8 rounded-[2rem] border border-white/10 bg-zinc-900/50">
              <Download className="mx-auto mb-4 text-gray-500" size={32} />
              <h3 className="font-black italic">OFFLINE</h3>
            </div>
            <div onClick={() => navigate('/duel')} className="p-8 rounded-[2rem] border border-white/10 bg-zinc-900/50 cursor-pointer hover:bg-white/5 transition-all">
              <Users className="mx-auto mb-4 text-white" size={32} />
              <h3 className="font-black italic">DUETO / BATALHA</h3>
            </div>
          </div>

          <div className="max-w-4xl mx-auto relative mb-16">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <Input placeholder="Buscar música..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleSearch} className="pl-12 h-16 bg-zinc-900 border-primary/30 text-white rounded-2xl" />
          </div>

          <div className="max-w-4xl mx-auto space-y-4 pb-20">
            {results.map((video) => (
              <div key={video.id.videoId} onClick={() => setSelectedVideo(video.id.videoId)} className="bg-zinc-900/80 p-4 rounded-2xl flex items-center gap-6 cursor-pointer border border-transparent hover:border-primary transition-all">
                <img src={video.snippet.thumbnails.high.url} className="w-40 h-24 object-cover rounded-xl" alt="thumb" />
                <div className="text-left"><h4 className="font-bold text-lg leading-tight truncate max-w-md">{video.snippet.title}</h4></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedVideo && !showScore && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col lg:flex-row items-center justify-center p-8 gap-12 animate-in zoom-in duration-300">
          <div className="flex-1 w-full aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 bg-zinc-950">
            <div id="youtube-player" className="w-full h-full"></div>
          </div>

          <div className="flex flex-col items-center gap-10">
            <div className="h-64 w-64 md:h-80 md:w-80 rounded-full border-2 border-primary overflow-hidden bg-zinc-900 relative shadow-[0_0_40px_rgba(0,168,225,0.3)]">
              {!cameraActive ? (
                <div onClick={startCamera} className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer bg-zinc-800 hover:bg-zinc-700 transition-all text-center p-4">
                  <Camera className="mb-3 text-primary" size={32} />
                  <span className="text-[10px] font-black uppercase text-white">Ligar Câmera</span>
                </div>
              ) : (
                <video ref={webcamRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
              )}
            </div>
            
            <div className="flex flex-col gap-6 w-full max-w-[280px]">
              <Button onClick={() => setShowScore(true)} className="h-16 rounded-full bg-primary text-black font-black text-xl italic hover:bg-white transition-all">FINALIZAR SHOW</Button>
              <div className="flex justify-center">
                 <button onClick={closePerformance} className="text-destructive/60 hover:text-destructive uppercase font-black text-[10px] flex items-center gap-2"><Ban size={14}/> Cancelar e Voltar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showScore && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-6 animate-in fade-in">
          <Card className="max-w-xl w-full bg-zinc-950 border-white/10 rounded-[3rem] p-10 text-center shadow-[0_0_100px_rgba(0,168,225,0.1)]">
            <Trophy className="mx-auto text-primary mb-6" size={64} />
            <div className="mb-10 text-9xl font-black text-primary italic">0.0</div>
            <p className="text-zinc-400 italic mb-10 text-sm">"Áudio não detectado pela IA Prime."</p>
            <Button onClick={closePerformance} className="w-full h-16 bg-primary text-black font-black rounded-2xl text-xl italic">VOLTAR AO LOBBY</Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BasicLobby;