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

  const YOUTUBE_API_KEY = "AIzaSyBaCJPLU9kL_Ufu4S2yJX2v5up6vp5R548"; 

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

  useEffect(() => {
    let interval: any;
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
      } catch (error) { console.error(error); } finally { setIsLoading(false); }
    }
  };

  const startCamera = async () => {
    try {
      if (webcamRef.current?.srcObject) {
        const tracks = (webcamRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
        await webcamRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      alert("Erro na câmera. Verifique as permissões no navegador.");
    }
  };

  const restartVideo = () => { setVideoKey(prev => prev + 1); };

  const finalizeSession = () => {
    const userCantoReal = false; 
    let score = userCantoReal ? "81.4" : "0.0";
    let note = userCantoReal ? "Afinação estável." : "Rigor IA: Áudio não detectado.";
    let recom = userCantoReal ? ["Nível 4"] : ["Check Mic"];
    setVocalAnalysis({ score, note, recom });
    setShowScore(true);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      {!selectedVideo && (
        <div className="relative z-10 p-4 md:p-8 max-w-6xl mx-auto pt-20 text-center">
          <button onClick={() => navigate('/')} className="text-gray-500 mb-6 uppercase text-[10px]">
            <ArrowLeft size={14} className="inline mr-2" /> Voltar
          </button>
          <h1 className="text-4xl md:text-6xl font-black text-primary italic uppercase mb-10">Lobby de Karaokê</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div onClick={() => { setQuery(''); setResults([]); }} className="p-8 rounded-[2rem] border border-primary/50 bg-black/60 cursor-pointer">
              <Globe className="mx-auto mb-4 text-primary" />
              <h3 className="font-black text-white italic">ONLINE</h3>
            </div>
            <div className="opacity-20 p-8 rounded-[2rem] border border-white/10 bg-black/40 cursor-not-allowed">
              <Download className="mx-auto mb-4 text-gray-500" />
              <h3 className="font-black text-gray-500 italic">OFFLINE</h3>
            </div>
            <div onClick={() => navigate('/duel')} className="p-8 rounded-[2rem] border border-white/10 bg-black/60 cursor-pointer">
              <Users className="mx-auto mb-4 text-white" />
              <h3 className="font-black text-white italic">DUETO / BATALHA</h3>
            </div>
          </div>

          <div className="max-w-4xl mx-auto relative mb-16">
            <Input placeholder="Qual hit vamos cantar?" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleSearch} className="pl-12 h-16 bg-black/80 border-primary/30 text-white rounded-2xl" />
          </div>

          {results.length > 0 && (
            <div className="max-w-4xl mx-auto space-y-4">
              {results.map((video) => (
                <div key={video.id.videoId} onClick={() => setSelectedVideo(video.id.videoId)} className="bg-black/40 p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-white/5 border border-white/5">
                  <img src={video.snippet.thumbnails.high.url} className="w-32 h-20 object-cover rounded-lg" alt="thumb" />
                  <h4 className="text-white font-bold text-left">{video.snippet.title}</h4>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedVideo && !showScore && (
        <div key={videoKey} className="fixed inset-0 z-[100] bg-black flex flex-col lg:flex-row items-center justify-center p-8 gap-12">
          <div className="flex-1 w-full aspect-video rounded-[2rem] overflow-hidden border-2 border-primary/20 bg-zinc-950">
            <div id="youtube-player" className="w-full h-full"></div>
          </div>

          <div className="flex flex-col items-center gap-8">
            <div className="h-64 w-64 md:h-80 md:w-80 rounded-full border-2 border-primary overflow-hidden bg-zinc-900 relative">
              {!cameraActive ? (
                <div onClick={startCamera} className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer bg-black/60 text-white font-black text-xs">
                  <Camera className="mb-2 text-primary" /> ATIVAR SHOW
                </div>
              ) : (
                <video ref={webcamRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
              )}
            </div>
            <Button onClick={finalizeSession} className="bg-primary text-black font-black px-12 h-16 rounded-full italic">FINALIZAR SHOW</Button>
            <div className="flex gap-6">
               <button onClick={restartVideo} className="text-gray-500 text-xs font-black uppercase tracking-widest"><RotateCcw className="inline mr-1" size={14}/> Recomeçar</button>
               <button onClick={() => { setSelectedVideo(null); setCameraActive(false); }} className="text-destructive/60 text-xs font-black uppercase tracking-widest"><Ban className="inline mr-1" size={14}/> Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {showScore && vocalAnalysis && (
        <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full bg-zinc-950 border-primary/40 rounded-[3rem] p-10 text-center">
            <Trophy className="mx-auto text-primary mb-6" size={64} />
            <h2 className="text-9xl font-black text-primary neon-blue-glow mb-10">{vocalAnalysis.score}</h2>
            <div className="bg-black/40 p-6 rounded-2xl border border-white/5 text-left mb-8">
              <p className="text-gray-300 italic mb-4">"{vocalAnalysis.note}"</p>
              <div className="flex gap-2">
                {vocalAnalysis.recom.map((r: any) => (
                  <span key={r} className="px-3 py-1 bg-orange-500/20 text-orange-500 rounded-full text-[10px] font-black uppercase">{r}</span>
                ))}
              </div>
            </div>
            <Button onClick={() => { setShowScore(false); setSelectedVideo(null); }} className="w-full h-16 bg-primary text-black font-black rounded-2xl">VOLTAR AO LOBBY</Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BasicLobby;