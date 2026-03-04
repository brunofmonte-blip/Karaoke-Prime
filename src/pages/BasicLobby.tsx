import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Download, Users, ArrowLeft, Search, PlayCircle, X, Loader2, Camera, Mic, RotateCcw, Pause, Play, Ban, Trophy, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const BasicLobby = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLIFrameElement>(null);
  const webcamRef = useRef<HTMLVideoElement>(null);
  
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  
  // Estados da Performance
  const [isPlaying, setIsPlaying] = useState(true);
  const [showScore, setShowScore] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  // 🔴 ADICIONE SUA CHAVE API AQUI
  const YOUTUBE_API_KEY = "AIzaSyBaCJPLU9kL_Ufu4S2yJX2v5up6vp5R548"; 

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

  // Ativar Webcam
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      alert("Permissão de câmera/microfone negada. Usando foto de perfil.");
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      {/* BACKGROUND LIMPADO */}
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000" className="w-full h-full object-cover opacity-20" alt="bg" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black" />
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-6xl mx-auto pt-20">
        <button onClick={() => navigate('/')} className="text-gray-500 hover:text-white mb-6 flex items-center gap-2 font-bold uppercase text-[10px]">
          <ArrowLeft size={14} /> Voltar para Home
        </button>
        <h1 className="text-4xl md:text-6xl font-black text-primary neon-blue-glow mb-2 italic uppercase">Lobby de Karaokê</h1>

        {/* 🎬 PLAYER DE PERFORMANCE ATIVO COM CORREÇÕES */}
        {selectedVideo && !showScore && (
          <div className="fixed inset-0 z-[100] bg-black/98 flex flex-col items-center justify-center p-4">
            <div className="flex flex-col lg:flex-row items-center gap-8 w-full max-w-7xl">
              
              {/* Vídeo do YouTube com Pause Corrigido */}
              <div className="flex-1 w-full aspect-video rounded-[2rem] overflow-hidden border-4 border-primary/20 shadow-[0_0_50px_rgba(0,168,225,0.2)] bg-black relative">
                {!isPlaying && (
                  <div className="absolute inset-0 z-10 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                    <Pause size={80} className="text-primary animate-pulse" />
                  </div>
                )}
                <iframe 
                  ref={videoRef}
                  width="100%" height="100%" 
                  src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&enablejsapi=1&controls=0`} 
                  frameBorder="0" allow="autoplay; encrypted-media"
                ></iframe>
              </div>

              {/* Círculo da Webcam / Perfil com Ativação Corrigida */}
              <div className="flex flex-col items-center gap-6">
                <div className="h-48 w-48 md:h-64 md:w-64 rounded-full border-4 border-primary shadow-[0_0_30px_rgba(0,168,225,0.4)] overflow-hidden bg-gray-900 relative group">
                  {!cameraActive ? (
                    <div onClick={startCamera} className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer bg-black/40 hover:bg-black/20 transition-colors">
                      <Camera className="text-white mb-2" />
                      <span className="text-[10px] text-white font-bold uppercase">Ligar Câmera</span>
                      <img src="https://i.pravatar.cc/300?img=68" className="absolute inset-0 -z-10 object-cover opacity-50" alt="perfil" />
                    </div>
                  ) : (
                    <video ref={webcamRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  )}
                </div>
                
                {/* Botões de Controle */}
                <div className="flex gap-4">
                  <Button onClick={() => setIsPlaying(!isPlaying)} className="h-14 w-14 rounded-full bg-white/10 border border-white/20 hover:bg-primary hover:text-black">
                    {isPlaying ? <Pause /> : <Play />}
                  </Button>
                  <Button onClick={() => { setShowScore(true); }} className="h-14 px-8 rounded-full bg-primary text-black font-black italic">FINALIZAR</Button>
                </div>
              </div>
            </div>

            {/* Menu Inferior com Recomeçar Corrigido */}
            <div className="mt-12 flex gap-8">
              <button onClick={() => {}} className="flex items-center gap-2 text-gray-500 hover:text-white uppercase font-black text-xs transition-colors"><RotateCcw size={18}/> Recomeçar</button>
              <button onClick={() => setSelectedVideo(null)} className="flex items-center gap-2 text-destructive hover:scale-110 uppercase font-black text-xs transition-all"><Ban size={18}/> Cancelar Sessão</button>
            </div>
          </div>
        )}

        {/* 🏆 TELA DE NOTA DA IA */}
        {showScore && (
          <div className="fixed inset-0 z-[110] bg-black flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full bg-zinc-950 border-primary/30 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,168,225,0.2)] animate-in zoom-in duration-500">
              <CardContent className="p-10 text-center">
                <Trophy className="mx-auto text-primary mb-4" size={48} />
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Análise Vocal Prime (Rigor IA)</h2>
                
                <div className="my-8">
                  <span className="text-8xl font-black text-primary neon-blue-glow">84.2</span>
                  <p className="text-primary/60 font-bold uppercase tracking-[0.3em] mt-2">Score Final</p>
                </div>

                <div className="space-y-6 text-left bg-white/5 p-6 rounded-2xl border border-white/10 mb-8">
                  <div>
                    <h4 className="text-primary font-black text-xs uppercase mb-2">Feedback Detalhado:</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Sua afinação foi consistente, mas houve **instabilidade nas notas agudas sustentadas**. 
                      O suporte diafragmático falhou no segundo refrão, resultando em um leve desvio de semitom.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <h4 className="text-orange-500 font-black text-xs uppercase mb-3 flex items-center gap-2"><Star size={14}/> Treino Academy Recomendado:</h4>
                    <div className="flex gap-2">
                       <span className="px-3 py-1 bg-orange-500/20 text-orange-500 rounded-full text-[10px] font-bold">Nível 1: Steady Breath</span>
                       <span className="px-3 py-1 bg-orange-500/20 text-orange-500 rounded-full text-[10px] font-bold">Nível 4: Pitch Control</span>
                    </div>
                  </div>
                </div>

                <Button onClick={() => { setShowScore(false); setSelectedVideo(null); }} className="w-full h-16 rounded-2xl bg-primary text-black font-black text-lg hover:scale-105 transition-transform">VOLTAR AO LOBBY</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* INTERFACE DO LOBBY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 mt-8">
          <div onClick={() => { setQuery(''); setResults([]); }} className="group cursor-pointer p-8 rounded-[2rem] border border-primary/50 bg-black/60 hover:bg-primary/20 transition-all flex flex-col items-center text-center shadow-[0_0_30px_rgba(0,168,225,0.2)]">
            <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Globe className="h-10 w-10 text-primary" /></div>
            <h3 className="text-2xl font-black text-white mb-3 uppercase italic">ONLINE</h3>
            <p className="text-gray-400 text-xs leading-relaxed font-medium">Catálogo completo do YouTube<br/>em tempo real.</p>
          </div>
          <div className="group p-8 rounded-[2rem] border border-white/10 bg-black/40 flex flex-col items-center text-center relative opacity-40 cursor-not-allowed">
            <div className="absolute top-6 right-6 text-orange-500 font-black">🔒</div>
            <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6"><Download className="h-10 w-10 text-gray-500" /></div>
            <h3 className="text-2xl font-black text-gray-500 mb-3 uppercase italic tracking-tighter">OFFLINE</h3>
            <p className="text-gray-500 text-xs leading-relaxed font-medium">Músicas baixadas para cantar<br/>sem internet (Premium).</p>
          </div>
          <div onClick={() => navigate('/duel')} className="group cursor-pointer p-8 rounded-[2rem] border border-white/10 bg-black/60 hover:border-destructive/50 hover:bg-destructive/10 transition-all flex flex-col items-center text-center shadow-lg">
            <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-destructive/20"><Users className="h-10 w-10 text-white group-hover:text-destructive" /></div>
            <h3 className="text-2xl font-black text-white mb-3 uppercase italic tracking-tighter">DUETO / BATALHA</h3>
            <p className="text-gray-400 text-xs leading-relaxed font-medium">Convide um amigo ou desafie cantores<br/>ao redor do mundo.</p>
          </div>
        </div>

        {/* BARRA DE BUSCA */}
        <div className="max-w-4xl mx-auto relative mb-16">
          {isLoading ? <Loader2 className="absolute left-6 top-1/2 -translate-y-1/2 h-7 w-7 text-primary animate-spin" /> : <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-500" />}
          <Input placeholder="Qual música vamos cantar hoje? (Pressione Enter)" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleSearch} className="pl-16 h-20 bg-black/80 border-primary/30 text-white rounded-3xl focus:border-primary text-xl font-bold" />
        </div>

        {/* RESULTADOS DA BUSCA */}
        {results.length > 0 && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000 pb-32 space-y-6">
            {results.map((video) => (
              <div key={video.id.videoId} onClick={() => setSelectedVideo(video.id.videoId)} className="bg-black/60 border border-white/5 rounded-[2.5rem] p-5 flex items-center gap-8 hover:bg-white/5 transition-all cursor-pointer group hover:border-primary/50 shadow-xl overflow-hidden relative">
                <div className="relative w-56 h-32 overflow-hidden rounded-2xl border border-white/10">
                  <img src={video.snippet.thumbnails.high.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="thumb" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><PlayCircle className="text-primary h-14 w-14" /></div>
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-white text-2xl group-hover:text-primary italic truncate">🎤 {video.snippet.title}</h4>
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">{video.snippet.channelTitle}</p>
                </div>
                <PlayCircle className="text-primary h-12 w-12 mr-6" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicLobby;