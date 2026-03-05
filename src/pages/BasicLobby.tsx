import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Download, Users, ArrowLeft, Search, PlayCircle, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

const BasicLobby = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // 🔴 ADICIONE SUA CHAVE API AQUI
  const YOUTUBE_API_KEY = "SUA_CHAVE_AQUI"; 

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim() !== '') {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(query + " karaoke")}&type=video&key=${YOUTUBE_API_KEY}`
        );
        const data = await response.json();
        
        if (data.items) {
          setResults(data.items);
        }
      } catch (error) {
        console.error("Erro na busca:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      {/* BACKGROUND BLINDADO */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000" 
          className="w-full h-full object-cover opacity-20"
          alt="Studio Background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black" />
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-6xl mx-auto pt-20 animate-in fade-in duration-700">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
          <ArrowLeft size={14} /> Voltar para Home
        </button>
        
        <h1 className="text-4xl md:text-6xl font-black text-primary neon-blue-glow mb-2 tracking-tighter italic uppercase">Lobby de Karaokê</h1>
        <p className="text-white font-bold uppercase tracking-widest mb-10 text-xs opacity-60">Escolha o seu palco</p>

        {/* PLAYER DE VÍDEO REAL */}
        {selectedVideo && (
          <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-md">
            <button onClick={() => setSelectedVideo(null)} className="absolute top-6 right-6 text-white hover:text-primary transition-colors flex items-center gap-2 font-black tracking-tighter text-lg italic border-b-2 border-primary p-2">
               FECHAR PLAYER <X size={24} />
            </button>
            <div className="w-full max-w-5xl aspect-video rounded-[2.5rem] overflow-hidden border-4 border-primary/30 shadow-[0_0_80px_rgba(0,168,225,0.4)]">
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`} 
                frameBorder="0" 
                allow="autoplay; encrypted-media" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div onClick={() => { setQuery(''); setResults([]); }} className="group cursor-pointer p-8 rounded-[2rem] border border-primary/50 bg-black/60 hover:bg-primary/20 transition-all flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Globe className="h-10 w-10 text-primary" /></div>
            <h3 className="text-2xl font-black text-white mb-3 uppercase italic">ONLINE</h3>
            <p className="text-gray-400 text-xs leading-relaxed font-medium">Cante com o catálogo completo do YouTube<br/>em tempo real.</p>
          </div>

          <div className="group p-8 rounded-[2rem] border border-white/10 bg-black/40 flex flex-col items-center text-center relative opacity-40 cursor-not-allowed">
            <div className="absolute top-6 right-6 text-orange-500 font-black">🔒</div>
            <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6"><Download className="h-10 w-10 text-gray-500" /></div>
            <h3 className="text-2xl font-black text-gray-500 mb-3 uppercase italic">OFFLINE</h3>
            <p className="text-gray-500 text-xs leading-relaxed font-medium">Músicas baixadas para cantar<br/>sem internet (Premium).</p>
          </div>

          <div onClick={() => navigate('/duel')} className="group cursor-pointer p-8 rounded-[2rem] border border-white/10 bg-black/60 hover:border-destructive/50 hover:bg-destructive/10 transition-all flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-destructive/20"><Users className="h-10 w-10 text-white group-hover:text-destructive" /></div>
            <h3 className="text-2xl font-black text-white mb-3 uppercase italic">DUETO / BATALHA</h3>
            <p className="text-gray-400 text-xs leading-relaxed font-medium">Convide um amigo ou desafie cantores<br/>ao redor do mundo.</p>
          </div>
        </div>

        {/* BARRA DE BUSCA REAL */}
        <div className="max-w-4xl mx-auto relative mb-16">
          {isLoading ? (
            <Loader2 className="absolute left-6 top-1/2 -translate-y-1/2 h-7 w-7 text-primary animate-spin" />
          ) : (
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-500" />
          )}
          <Input 
            placeholder="Qual música vamos cantar hoje? (Pressione Enter)" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            onKeyDown={handleSearch} 
            className="pl-16 h-20 bg-black/80 border-primary/30 text-white rounded-3xl focus:border-primary text-xl font-bold" 
          />
        </div>

        {/* RESULTADOS DINÂMICOS DA API */}
        {results.length > 0 && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000 pb-32">
            <div className="space-y-6">
              {results.map((video) => (
                <div 
                  key={video.id.videoId} 
                  onClick={() => setSelectedVideo(video.id.videoId)} 
                  className="bg-black/60 border border-white/5 rounded-[2.5rem] p-5 flex items-center gap-8 hover:bg-white/5 transition-all cursor-pointer group hover:border-primary/50"
                >
                  <div className="relative w-56 h-32 overflow-hidden rounded-2xl border border-white/10">
                    <img src={video.snippet.thumbnails.high.url} className="w-full h-full object-cover" alt={video.snippet.title} />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <PlayCircle className="text-primary h-14 w-14" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-white text-xl group-hover:text-primary italic truncate">🎤 {video.snippet.title}</h4>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">{video.snippet.channelTitle}</p>
                  </div>
                  <PlayCircle className="text-primary h-12 w-12 mr-6" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicLobby;