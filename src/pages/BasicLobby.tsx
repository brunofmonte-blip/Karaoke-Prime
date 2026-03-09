// 🚨 ATENÇÃO: ESTE CÓDIGO DEVE FICAR EXCLUSIVAMENTE NO ARQUIVO src/pages/BasicLobby.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic2, Swords, PlayCircle, Music, Users, Crown, Search, History, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const BasicLobby = () => {
  const navigate = useNavigate();
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [playMode, setPlayMode] = useState<'solo' | 'duelo'>('solo'); // 💡 O Cérebro do Layout
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // 🎥 REF DA CÂMERA
  const cameraRef = useRef<HTMLVideoElement>(null);

  // 🔑 COLOQUE SUA CHAVE DA API DO YOUTUBE AQUI ENTRE AS ASPAS:
  const YOUTUBE_API_KEY = "AIzaSyBaCJPLU9kL_Ufu4S2yJX2v5up6vp5R548";

  const recentSearches = [
    { id: "R-vR6Zt2K78", title: "Não Quero Dinheiro", artist: "Tim Maia", youtubeId: "R-vR6Zt2K78" },
    { id: "c2hZ_bS3nN4", title: "Let It Be", artist: "The Beatles", youtubeId: "c2hZ_bS3nN4" },
    { id: "A5iZ91B1A5M", title: "Amor Maior", artist: "Jota Quest", youtubeId: "A5iZ91B1A5M" },
    { id: "bO2t3zHh9Q8", title: "Evidências", artist: "Chitãozinho & Xororó", youtubeId: "bO2t3zHh9Q8" },
    { id: "8-XbS7lR-cM", title: "When I Was Your Man", artist: "Bruno Mars", youtubeId: "8-XbS7lR-cM" },
    { id: "9T88wzEwX4Y", title: "Essa Tal Liberdade", artist: "Só Pra Contrariar", youtubeId: "9T88wzEwX4Y" }
  ];

  // 💡 LIGA A CÂMERA AO ENTRAR NO PALCO
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (activeVideo) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((mediaStream) => {
          stream = mediaStream;
          if (cameraRef.current) cameraRef.current.srcObject = mediaStream;
        })
        .catch(err => console.error("Sem permissão de câmera:", err));
    }
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [activeVideo]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!searchTerm.trim()) { setSearchResults([]); return; }
    if (YOUTUBE_API_KEY === "SUA_CHAVE_API_DO_YOUTUBE_AQUI") {
      alert("⚠️ Comandante, cole sua chave da API do YouTube na linha 20!");
      return;
    }
    setIsSearching(true);
    try {
      const query = encodeURIComponent(`${searchTerm} karaoke`);
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=9&q=${query}&type=video&key=${YOUTUBE_API_KEY}`);
      const data = await response.json();

      if (data.items) {
        const mappedResults = data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'"), 
          artist: item.snippet.channelTitle, 
          youtubeId: item.id.videoId
        }));
        setSearchResults(mappedResults);
      } else if (data.error) {
        alert(`Erro na API: ${data.error.message}`);
      }
    } catch (error) {
      console.error("Erro na busca:", error);
      alert("Falha ao conectar com o YouTube.");
    } finally {
      setIsSearching(false);
    }
  };

  const handlePlay = (youtubeId: string, mode: 'solo' | 'duelo') => {
    setPlayMode(mode);
    setActiveVideo(youtubeId);
  };

  const displaySongs = searchResults.length > 0 ? searchResults : recentSearches;

  return (
    <div className="min-h-screen bg-black relative pb-20 pt-28 px-4 font-sans">
      <img src="https://images.unsplash.com/photo-1516280440502-6178bc57c0e8?q=80&w=2000" alt="Stage" className="absolute inset-0 w-full h-full object-cover opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10 animate-in fade-in duration-700">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors uppercase text-xs font-bold tracking-widest">
          <ArrowLeft size={16} /> Voltar para o Início
        </button>

        <div className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs mb-3 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            <Music size={14} /> Palco Principal
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase drop-shadow-lg leading-tight mb-4">
            Basic <span className="text-primary neon-blue-glow">Lobby</span>
          </h1>
        </div>

        {/* ========================================================= */}
        {/* TELA 1: O PALCO DE KARAOKÊ (COM CÂMERAS)                  */}
        {/* ========================================================= */}
        {activeVideo ? (
          <div className="animate-in zoom-in-95 duration-500 mb-12">
            
            <div className="mb-6 flex justify-center items-center gap-3">
              <Crown className="text-primary h-6 w-6" />
              <h2 className="text-2xl font-black text-white uppercase tracking-widest">
                KARAOKÊ {playMode === 'solo' ? 'SOLO' : '/ DUELO'}
              </h2>
            </div>

            {/* 💡 A MÁGICA DO NOVO LAYOUT MODULAR */}
            <div className="flex flex-col lg:flex-row gap-6 justify-center items-stretch w-full mb-8">
              
              {/* PAINEL ESQUERDO: CÂMERA DO USUÁRIO */}
              <div className="w-full lg:w-1/4 flex flex-col gap-3 order-2 lg:order-1">
                <h3 className="text-center font-black text-white tracking-widest uppercase text-sm">Você</h3>
                <div className="relative w-full aspect-[3/4] lg:h-[450px] bg-black rounded-[2rem] border-[3px] border-cyan-400 shadow-[0_0_40px_rgba(34,211,238,0.2)] overflow-hidden">
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">REC</span>
                  </div>
                  <video ref={cameraRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]"></video>
                </div>
              </div>

              {/* PAINEL CENTRAL: VÍDEO DA MÚSICA (YOUTUBE) */}
              <div className={`${playMode === 'duelo' ? 'lg:w-2/4' : 'lg:w-3/4'} w-full flex flex-col gap-3 transition-all duration-500 order-1 lg:order-2`}>
                <h3 className="text-center font-black text-white tracking-widest uppercase text-sm">Vídeo da Música</h3>
                <div className="w-full aspect-video lg:h-[450px] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-zinc-900 relative">
                  <iframe 
                    width="100%" height="100%" 
                    src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0&modestbranding=1`} 
                    title="Karaoke Video" frameBorder="0" allowFullScreen
                    className="w-full h-full object-cover"
                  ></iframe>
                </div>
              </div>

              {/* PAINEL DIREITO: OPONENTE (SÓ APARECE NO MODO DUELO) */}
              {playMode === 'duelo' && (
                <div className="w-full lg:w-1/4 flex flex-col gap-3 order-3 animate-in fade-in slide-in-from-right-10 duration-500">
                  <h3 className="text-center font-black text-white tracking-widest uppercase text-sm">Oponente (Batalha/Dueto)</h3>
                  <div className="relative w-full aspect-[3/4] lg:h-[450px] bg-zinc-950 rounded-[2rem] border-[3px] border-cyan-400/50 shadow-[0_0_40px_rgba(34,211,238,0.05)] overflow-hidden flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-24 h-24 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mb-6">
                      <Users className="h-10 w-10 text-gray-500" />
                    </div>
                    <Button variant="outline" className="rounded-full border-cyan-400/50 text-cyan-400 hover:bg-cyan-400 hover:text-black font-bold uppercase tracking-widest text-xs transition-all w-full h-14">
                      Convidar Oponente
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-center mt-8">
              <Button onClick={() => setActiveVideo(null)} variant="outline" className="h-14 px-8 rounded-full border-white/20 text-white font-bold hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-xs">
                <ArrowLeft size={16} className="mr-2" /> Escolher Outra Música
              </Button>
            </div>
          </div>

        ) : (

        /* ========================================================= */
        /* TELA 2: BUSCA E CATÁLOGO DE MÚSICAS                       */
        /* ========================================================= */
          <div className="animate-in slide-in-from-bottom-5">
            
            <form onSubmit={handleSearch} className="relative mb-10 group max-w-3xl flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-gray-500 group-focus-within:text-primary transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder="Busque por música, artista ou gênero..." 
                  className="w-full h-16 pl-16 pr-6 bg-zinc-950/80 backdrop-blur-xl border border-white/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-white text-lg rounded-full shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isSearching} className="h-16 px-8 rounded-full bg-primary hover:bg-white text-black font-black uppercase tracking-widest transition-all">
                {isSearching ? <Loader2 className="h-6 w-6 animate-spin" /> : "BUSCAR"}
              </Button>
            </form>

            <div className="flex items-center gap-2 mb-6">
              {searchResults.length > 0 ? (
                <><Search className="text-primary h-5 w-5" /><h3 className="text-sm font-bold text-primary uppercase tracking-widest">Resultados da Busca</h3></>
              ) : (
                <><History className="text-gray-500 h-5 w-5" /><h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Últimas Buscas</h3></>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displaySongs.length > 0 ? (
                displaySongs.map((song) => (
                  <Card key={song.id} className="bg-zinc-950/80 backdrop-blur-xl border-white/10 hover:border-primary/50 transition-all duration-300 rounded-[2rem] p-6 flex flex-col items-center text-center group">
                    <div className="h-16 w-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-[0_0_30px_rgba(0,168,225,0.3)] shrink-0">
                      <Mic2 className="h-6 w-6 text-white group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-lg font-black text-white italic tracking-tighter uppercase mb-1 line-clamp-2 min-h-[56px] flex items-center justify-center">{song.title}</h3>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-6 line-clamp-1">{song.artist}</p>
                    
                    {/* 💡 DOIS BOTÕES: O USUÁRIO AGORA ESCOLHE COMO QUER CANTAR! */}
                    <div className="w-full flex flex-col gap-2 mt-auto">
                      <Button onClick={() => handlePlay(song.youtubeId, 'solo')} className="w-full h-12 rounded-full bg-white hover:bg-primary text-black font-black uppercase tracking-widest text-xs transition-all">
                        CANTAR SOLO <PlayCircle className="ml-2 h-4 w-4" />
                      </Button>
                      <Button onClick={() => handlePlay(song.youtubeId, 'duelo')} variant="outline" className="w-full h-10 rounded-full border-white/10 text-gray-400 hover:text-white hover:border-white/30 font-bold uppercase tracking-widest text-[10px] transition-all">
                        DUETO / BATALHA <Swords className="ml-2 h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-12 text-center bg-zinc-950/50 rounded-[2rem] border border-white/5">
                  <Search className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Nenhuma música encontrada.</p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default BasicLobby;