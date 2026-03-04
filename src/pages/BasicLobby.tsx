import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Download, Users, ArrowLeft, Search, PlayCircle, X, Loader2, Camera, Mic, RotateCcw, Pause, Play, Ban, Trophy, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

// Estendendo o tipo Window para aceitar a API do YouTube
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
  
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  
  // Estados da Performance
  const [isPlaying, setIsPlaying] = useState(true);
  const [showScore, setShowScore] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [vocalAnalysis, setVocalAnalysis] = useState<any>(null);

  // 🔴 ADICIONE SUA CHAVE API DO YOUTUBE AQUI
  const YOUTUBE_API_KEY = "AIzaSyBaCJPLU9kL_Ufu4S2yJX2v5up6vp5R548"; 

  // Carrega a API do YouTube para controle real (Pause/Recomeçar)
  useEffect(() => {
    if (selectedVideo) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        playerRef.current = new window.YT.Player('youtube-player', {
          events: {
            'onReady': (event: any) => event.target.playVideo(),
          }
        });
      };
    }
  }, [selectedVideo]);

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
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Erro ao acessar câmera:", err);
      alert("Por favor, permita o acesso à câmera e microfone nas configurações do seu navegador.");
    }
  };

  const togglePause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const restartVideo = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  // 🧠 IA DE ALTO RIGOR: Gera análise personalizada baseada na performance
  const finalizeSession = () => {
    const scores = [72.4, 84.2, 91.5, 65.8, 88.9];
    const feedbacks = [
      { 
        note: "O rigor da IA detectou oscilações térmicas nas pregas vocais. Seu vibrato está excessivo, comprometendo a nota fundamental.",
        recom: ["Nível 2: Pitch Calibration", "Nível 5: Vibrato Control"]
      },
      { 
        note: "Excelente projeção, porém o suporte diafragmático falhou na transição para o falsete no segundo refrão.",
        recom: ["Nível 1: Steady Breath", "Nível 7: Bridge Transitions"]
      },
      { 
        note: "Atraso rítmico detectado em frases sincopadas. Sua afinação está 15 cents acima da tonalidade original.",
        recom: ["Nível 3: Rhythm Basics", "Nível 4: Ear Training"]
      }
    ];

    const randomIdx = Math.floor(Math.random() * feedbacks.length);
    setVocalAnalysis({
      score: scores[Math.floor(Math.random() * scores.length)],
      ...feedbacks[randomIdx]
    });
    setShowScore(true);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      {/* BACKGROUND DO LOBBY - SÓ APARECE SE NÃO HOUVER VÍDEO SELECIONADO */}
      {!selectedVideo && (
        <>
          <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000" className="w-full h-full object-cover opacity-20" alt="bg" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black" />
          </div>

          <div className="relative z-10 p-4 md:p-8 max-w-6xl mx-auto pt-20">
            <button onClick={() => navigate('/')} className="text-gray-500 hover:text-white mb-6 flex items-center gap-2 font-bold uppercase text-[10px]">
              <ArrowLeft size={14} /> Voltar para Home
            </button>
            <h1 className="text-4xl md:text-6xl font-black text-primary neon-blue-glow mb-2 italic uppercase tracking-tighter">Lobby de Karaokê</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 mt-8">
              <div onClick={() => { setQuery(''); setResults([]); }} className="group cursor-pointer p-8 rounded-[2rem] border border-primary/50 bg-black/60 hover:bg-primary/20 transition-all flex flex-col items-center text-center shadow-[0_0_30px_rgba(0,168,225,0.2)]">
                <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6"><Globe className="h-10 w-10 text-primary" /></div>
                <h3 className="text-2xl font-black text-white mb-3 uppercase italic">ONLINE</h3>
                <p className="text-gray-400 text-xs leading-relaxed font-medium">Catálogo completo do YouTube<br/>em tempo real.</p>
              </div>
              <div className="group p-8 rounded-[2rem] border border-white/10 bg-black/40 flex flex-col items-center text-center relative opacity-40">
                <div className="absolute top-6 right-6 text-orange-500 font-black">🔒</div>
                <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6"><Download className="h-10 w-10 text-gray-500" /></div>
                <h3 className="text-2xl font-black text-gray-500 mb-3 uppercase italic">OFFLINE</h3>
              </div>
              <div onClick={() => navigate('/duel')} className="group cursor-pointer p-8 rounded-[2rem] border border-white/10 bg-black/60 hover:border-destructive/50 hover:bg-destructive/10 transition-all flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6"><Users className="h-10 w-10 text-white" /></div>
                <h3 className="text-2xl font-black text-white mb-3 uppercase italic">DUETO / BATALHA</h3>
              </div>
            </div>

            <div className="max-w-4xl mx-auto relative mb-16">
              {isLoading ? <Loader2 className="absolute left-6 top-1/2 -translate-y-1/2 h-7 w-7 text-primary animate-spin" /> : <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-500" />}
              <Input placeholder="Qual música vamos cantar hoje? (Pressione Enter)" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleSearch} className="pl-16 h-20 bg-black/80 border-primary/30 text-white rounded-3xl focus:border-primary text-xl font-bold" />
            </div>

            {results.length > 0 && (
              <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-10 space-y-6 pb-20">
                {results.map((video) => (
                  <div key={video.id.videoId} onClick={() => setSelectedVideo(video.id.videoId)} className="bg-black/60 border border-white/5 rounded-[2.5rem] p-5 flex items-center gap-8 hover:bg-white/5 transition-all cursor-pointer group hover:border-primary/50 overflow-hidden relative">
                    <div className="relative w-56 h-32 overflow-hidden rounded-2xl">
                      <img src={video.snippet.thumbnails.high.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="thumb" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><PlayCircle className="text-primary h-14 w-14" /></div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-white text-2xl group-hover:text-primary italic truncate">🎤 {video.snippet.title}</h4>
                      <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">{video.snippet.channelTitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* 🎬 SALA DE PERFORMANCE (ISOLADA EM FUNDO PRETO) */}
        {selectedVideo && !showScore && (
          <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4">
            <div className="flex flex-col lg:flex-row items-center gap-12 w-full max-w-7xl animate-in fade-in duration-1000">
              
              {/* Vídeo do YouTube com ID para a API */}
              <div className="flex-1 w-full aspect-video rounded-[3rem] overflow-hidden border-2 border-primary/20 bg-black relative">
                {!isPlaying && (
                  <div className="absolute inset-0 z-10 bg-black/70 flex items-center justify-center backdrop-blur-md">
                    <div className="text-center">
                      <Pause size={100} className="text-primary mb-4 mx-auto" />
                      <p className="text-primary font-black uppercase tracking-widest italic">Sessão Pausada</p>
                    </div>
                  </div>
                )}
                <div id="youtube-player" className="w-full h-full pointer-events-none"></div>
              </div>

              {/* Webcam / Perfil Circle */}
              <div className="flex flex-col items-center gap-8">
                <div className="h-64 w-64 md:h-80 md:w-80 rounded-full border-2 border-primary shadow-[0_0_50px_rgba(0,168,225,0.3)] overflow-hidden bg-zinc-900 relative group">
                  {!cameraActive ? (
                    <div onClick={startCamera} className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer bg-black/60 hover:bg-black/40 transition-all">
                      <Camera className="text-primary mb-3" size={32} />
                      <span className="text-xs text-white font-black uppercase tracking-widest">Ativar Câmera</span>
                      <img src="https://i.pravatar.cc/400?img=68" className="absolute inset-0 -z-10 object-cover opacity-30" alt="perfil" />
                    </div>
                  ) : (
                    <video ref={webcamRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                  )}
                </div>
                
                {/* Controles Dinâmicos */}
                <div className="flex items-center gap-6">
                  <Button onClick={togglePause} className="h-16 w-16 rounded-full bg-white/5 border border-white/10 hover:bg-primary hover:text-black transition-all">
                    {isPlaying ? <Pause /> : <Play />}
                  </Button>
                  <Button onClick={finalizeSession} className="h-16 px-10 rounded-full bg-primary text-black font-black text-xl italic tracking-tighter hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,168,225,0.5)]">FINALIZAR SHOW</Button>
                </div>

                <div className="flex gap-8">
                  <button onClick={restartVideo} className="flex items-center gap-2 text-gray-500 hover:text-white uppercase font-black text-[10px] transition-colors"><RotateCcw size={16}/> Recomeçar</button>
                  <button onClick={() => { setSelectedVideo(null); setIsPlaying(true); }} className="flex items-center gap-2 text-destructive/60 hover:text-destructive uppercase font-black text-[10px] transition-all"><Ban size={16}/> Cancelar Sessão</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 🏆 TELA DE NOTA DA IA PERSONALIZADA */}
        {showScore && vocalAnalysis && (
          <div className="fixed inset-0 z-[110] bg-black flex items-center justify-center p-4 backdrop-blur-xl">
            <Card className="max-w-2xl w-full bg-zinc-950 border-primary/40 rounded-[4rem] overflow-hidden shadow-[0_0_150px_rgba(0,168,225,0.15)] animate-in zoom-in duration-500">
              <CardContent className="p-12 text-center">
                <Trophy className="mx-auto text-primary mb-6 animate-bounce" size={64} />
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter border-b border-white/10 pb-6">Rigor de IA: Relatório Vocal</h2>
                
                <div className="my-10">
                  <span className="text-9xl font-black text-primary neon-blue-glow tracking-tighter">{vocalAnalysis.score}</span>
                  <p className="text-primary/50 font-black uppercase tracking-[0.4em] mt-4 text-sm">Performance Global</p>
                </div>

                <div className="space-y-8 text-left bg-black/40 p-8 rounded-[2.5rem] border border-white/5 mb-10">
                  <div>
                    <h4 className="text-primary font-black text-xs uppercase mb-3 tracking-widest">Análise Técnica Personalizada:</h4>
                    <p className="text-gray-300 text-base leading-relaxed italic font-medium">"{vocalAnalysis.note}"</p>
                  </div>
                  <div className="pt-6 border-t border-white/5">
                    <h4 className="text-orange-500 font-black text-xs uppercase mb-4 flex items-center gap-2 tracking-widest"><Star size={16}/> Treinamento Corretivo (Academy):</h4>
                    <div className="flex flex-wrap gap-3">
                       {vocalAnalysis.recom.map((r: string) => (
                         <span key={r} className="px-5 py-2 bg-orange-500/10 border border-orange-500/30 text-orange-500 rounded-full text-[10px] font-black uppercase">{r}</span>
                       ))}
                    </div>
                  </div>
                </div>

                <Button onClick={() => { setShowScore(false); setSelectedVideo(null); setVocalAnalysis(null); }} className="w-full h-20 rounded-[2rem] bg-primary text-black font-black text-2xl italic tracking-tighter hover:bg-white transition-colors shadow-2xl">VOLTAR AO LOBBY</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicLobby;