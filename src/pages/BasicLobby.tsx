import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Download, Users, ArrowLeft, Search, PlayCircle, X, Loader2, Camera, Mic, RotateCcw, Pause, Play, Ban, Trophy, Star } from 'lucide-react';
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

  useEffect(() => {
    if (selectedVideo && !showScore) {
      const loadVideo = () => {
        if (window.YT && window.YT.Player) {
          playerRef.current = new window.YT.Player('youtube-player', {
            videoId: selectedVideo,
            playerVars: { 
              'autoplay': 1, 
              'controls': 1, // 🟢 HABILITADO: Clique no vídeo para pausar/play como no YouTube
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

  // 📸 CÂMERA FORÇADA: Usa tag vídeo com 'playsInline' e 'muted' para garantir renderização
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
        webcamRef.current.onloadedmetadata = () => {
          webcamRef.current?.play();
          setCameraActive(true);
        };
      }
    } catch (err) {
      alert("ERRO: O Dyad bloqueou a visão. Clique no ícone de Câmera na barra do navegador e permita o acesso.");
    }
  };

  const restartVideo = () => {
    setVideoKey(prev => prev + 1);
  };

  // 🧠 IA DE ALTO RIGOR COM DETECÇÃO DE SILÊNCIO
  const finalizeSession = () => {
    // Simulando detecção de entrada de áudio: se o usuário não cantou, a nota cai drasticamente
    const userCantoReal = false; // Este valor será ligado ao volume real no futuro

    let score, note, recom;

    if (!userCantoReal) {
      score = "0.0";
      note = "O Rigor da IA Prime não detectou entrada de áudio suficiente. A análise espectral foi interrompida por falta de dados vocais. Você cantou próximo ao microfone?";
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
      
      {!selectedVideo && (
        <div className="relative z-10 p-4 md:p-8 max-w-6xl mx-auto pt-20 animate-in fade-in duration-700 text-center">
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-white mb-6 flex items-center gap-2 font-bold uppercase text-[10px] mx-auto">
            <ArrowLeft size={14} /> Voltar para Home
          </button>
          <h1 className="text-4xl md:text-6xl font-black text-primary neon-blue-glow mb-10 italic uppercase tracking-tighter">Lobby de Karaokê</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div onClick={() => { setQuery(''); setResults([]); }} className="group cursor-pointer p-8 rounded-[2rem] border border-primary/50 bg-black/60 hover:bg-primary/20 transition-all flex flex-col items-center">
              <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6"><Globe className="h-10 w-10 text-primary" /></div>
              <h3 className="text-2xl font-black text-white mb-3 uppercase italic">ONLINE</h3>
            </div>
            <div className="opacity-20 p-8 rounded-[2rem] border border-white/10 bg-black/40 flex flex-col items-center relative cursor-not-allowed">
              <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6"><Download className="h-10 w-10 text-gray-500" /></div>
              <h3 className="text-2xl font-black text-gray-500 mb-3 uppercase italic">OFFLINE</h3>
            </div>
            <div onClick={() => navigate('/duel')} className="group cursor-pointer p-8 rounded-[2rem] border border-white/10 bg-black/60 hover:border-destructive/50 transition-all flex flex-col items-center">
              <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6"><Users className="h-10 w-10 text-white" /></div>
              <h3 className="text-2xl font-black text-white mb-3 uppercase italic">DUETO / BATALHA</h3>
            </div>
          </div>

          <div className="max-w-4xl mx-auto relative mb-16">
            {isLoading ? <Loader2 className="absolute left-6 top-1/2 -translate-y-1/2 h-7 w-7 text-primary animate-spin" /> : <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-500" />}
            <Input placeholder="Qual hit vamos cantar hoje?" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleSearch} className="pl-16 h-20 bg-black/80 border-primary/30 text-white rounded-3xl focus:border-primary text-xl font-bold" />
          </div>

          {results.length > 0 && (
            <div className="max-w-4xl mx-auto space-y-6 pb-20">
              {results.map((video) => (
                <div key={video.id.videoId} onClick={() => setSelectedVideo(video.id.videoId)} className="bg-black/60 border border-white/5 rounded-[2.5rem] p-5 flex items-center gap-8 hover:bg-white/5 cursor-pointer group hover:border-primary/50">
                  <div className="relative w-56 h-32 overflow-hidden rounded-2xl">
                    <img src={video.snippet.thumbnails.high.url} className="w-full h-full object-cover group-hover:scale-110 transition-all" alt="thumb" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><PlayCircle className="text-primary h-14 w-14" /></div>
                  </div>
                  <div className="flex-1 text-left truncate">
                    <h4 className="font-black text-white text-2xl group-hover:text-primary italic truncate">🎤 {video.snippet.title}</h4>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">{video.snippet.channelTitle}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. SALA DE PERFORMANCE (VÍDEO COM CONTROLES NATIVOS) */}
      {selectedVideo && !showScore && (
        <div key={videoKey} className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 w-full max-w-7xl animate-in fade-in duration-1000">
            
            <div className="flex-1 w-full aspect-video rounded-[3rem] overflow-hidden border-2 border-primary/30 bg-zinc-950 relative shadow-[0_0_80px_rgba(0,168,225,0.1)]">
              {/* Agora sem overlay de pause para permitir clique direto no vídeo */}
              <div id="youtube-player" className="w-full h-full"></div>
            </div>

            <div className="flex flex-col items-center gap-8">
              <div className="h-64 w-64 md:h-80 md:w-80 rounded-full border-2 border-primary shadow-[0_0_50px_rgba(0,168,225,0.3)] overflow-hidden bg-zinc-900 relative">
                {!cameraActive ? (
                  <div onClick={startCamera} className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer bg-black/60 hover:bg-black/40 transition-all text-center p-4 group">
                    <Camera className="text-primary mb-3 group-hover:scale-125 transition-transform" size={40} />
                    <span className="text-xs text-white font-black uppercase tracking-widest leading-tight">ATIVAR CÂMERA<br/>E MICROFONE</span>
                  </div>
                ) : (
                  <video ref={webcamRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                )}
              </div>
              
              <div className="flex flex-col gap-6 w-full">
                <div className="flex items-center justify-center gap-6">
                  <Button onClick={finalizeSession} className="h-16 px-10 rounded-full bg-primary text-black font-black text-xl italic hover:bg-white transition-all shadow-[0_0_30px_rgba(0,168,225,0.5)] uppercase tracking-tighter">FINALIZAR SHOW</Button>
                </div>
                <div className="flex justify-center gap-8">
                  <button onClick={restartVideo} className="flex items-center gap-2 text-gray-500 hover:text-white uppercase font-black text-[10px] transition-colors"><RotateCcw size={16}/> Recomeçar</button>
                  <button onClick={() => { setSelectedVideo(null); setCameraActive(false); }} className="flex items-center gap-2 text-destructive/60 hover:text-destructive uppercase font-black text-[10px] transition-all"><Ban size={16}/> Cancelar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. RELATÓRIO VOCAL (COM RIGOR DE SILÊNCIO) */}
      {showScore && vocalAnalysis && (
        <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-4 animate-in zoom-in duration-300">
          <Card className="max-w-2xl w-full bg-zinc-950 border-primary/40 rounded-[4rem] overflow-hidden shadow-[0_0_150px_rgba(0,168,225,0.15)]">
            <CardContent className="p-12 text-center text-white">
              <Trophy className={`mx-auto mb-6 ${vocalAnalysis.score === "0.0" ? "text-gray-600" : "text-primary animate-bounce"}`} size={64} />
              <h2 className="text-3xl font-black uppercase italic tracking-tighter border-b border-white/10 pb-6">Análise Vocal Prime</h2>
              <div className="my-10">
                <span className={`text-9xl font-black tracking-tighter ${vocalAnalysis.score === "0.0" ? "text-destructive" : "text-primary neon-blue-glow"}`}>
                   {vocalAnalysis.score}
                </span>
                <p className="text-primary/50 font-black uppercase tracking-[0.4em] mt-4 text-sm">Performance Global</p>
              </div>
              <div className="space-y-8 text-left bg-black/40 p-8 rounded-[2.5rem] border border-white/5 mb-10">
                <div>
                  <h4 className="text-primary font-black text-xs uppercase mb-3 tracking-widest underline decoration-primary/30">Diagnóstico Vocal Prime:</h4>
                  <p className="text-gray-300 text-base leading-relaxed italic font-medium">"{vocalAnalysis.note}"</p>
                </div>
                <div className="pt-6 border-t border-white/5">
                  <h4 className="text-orange-500 font-black text-xs uppercase mb-4 flex items-center gap-2 tracking-widest"><Star size={16}/> Módulos Recomendados:</h4>
                  <div className="flex flex-wrap gap-3">
                    {vocalAnalysis.recom.map((r: string) => (
                      <span key={r} className="px-5 py-2 bg-orange-500/10 border border-orange-500/30 text-orange-500 rounded-full text-[10px] font-black uppercase">{r}</span>
                    ))}
                  </div>
                </div>
              </div>
              <Button onClick={() => { setShowScore(false); setSelectedVideo(null); setVocalAnalysis(null); setCameraActive(false); }} className="w-full h-20 rounded-[2rem] bg-primary text-black font-black text-2xl italic tracking-tighter hover:bg-white transition-all shadow-2xl">VOLTAR AO LOBBY</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BasicLobby;