// 🚨 ATENÇÃO: ESTE CÓDIGO DEVE FICAR EXCLUSIVAMENTE NO ARQUIVO src/pages/BasicLobby.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic2, Swords, PlayCircle, Music, Users, Crown, Search, History, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const BasicLobby = () => {
  const navigate = useNavigate();
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  
  // Estados da Busca Real
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 🔑 COLOQUE SUA CHAVE DA API DO YOUTUBE AQUI ENTRE AS ASPAS:
  const YOUTUBE_API_KEY = "AIzaSyBaCJPLU9kL_Ufu4S2yJX2v5up6vp5R548";

  // Nosso histórico fixo (Aparece quando a busca está vazia)
  const recentSearches = [
    { id: "R-vR6Zt2K78", title: "Não Quero Dinheiro", artist: "Tim Maia", youtubeId: "R-vR6Zt2K78" },
    { id: "c2hZ_bS3nN4", title: "Let It Be", artist: "The Beatles", youtubeId: "c2hZ_bS3nN4" },
    { id: "A5iZ91B1A5M", title: "Amor Maior", artist: "Jota Quest", youtubeId: "A5iZ91B1A5M" },
    { id: "bO2t3zHh9Q8", title: "Evidências", artist: "Chitãozinho & Xororó", youtubeId: "bO2t3zHh9Q8" },
    { id: "8-XbS7lR-cM", title: "When I Was Your Man", artist: "Bruno Mars", youtubeId: "8-XbS7lR-cM" },
    { id: "9T88wzEwX4Y", title: "Essa Tal Liberdade", artist: "Só Pra Contrariar", youtubeId: "9T88wzEwX4Y" }
  ];

  // 🚀 FUNÇÃO QUE FAZ A BUSCA REAL NO YOUTUBE
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que a página recarregue
    
    if (!searchTerm.trim()) {
      setSearchResults([]); // Se estiver vazio, limpa os resultados
      return;
    }

    if (YOUTUBE_API_KEY === "AIzaSyBaCJPLU9kL_Ufu4S2yJX2v5up6vp5R548") {
      alert("⚠️ Comandante, você precisa colar sua chave da API do YouTube na linha 15 do código!");
      return;
    }

    setIsSearching(true);
    
    try {
      // Adicionamos "karaoke" de forma invisível para garantir que venham vídeos com letras
      const query = encodeURIComponent(`${searchTerm} karaoke`);
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=9&q=${query}&type=video&key=${YOUTUBE_API_KEY}`);
      const data = await response.json();

      if (data.items) {
        // Mapeia os dados malucos do YouTube para o nosso formato limpo de Card
        const mappedResults = data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'"), // Limpa caracteres estranhos
          artist: item.snippet.channelTitle, // Usamos o nome do canal como artista/autor
          youtubeId: item.id.videoId
        }));
        setSearchResults(mappedResults);
      } else if (data.error) {
        alert(`Erro na API: ${data.error.message}`);
      }
    } catch (error) {
      console.error("Erro na busca do YouTube:", error);
      alert("Falha ao conectar com o YouTube. Verifique sua conexão.");
    } finally {
      setIsSearching(false);
    }
  };

  // Define o que vamos mostrar: Resultados da busca ou as "Últimas Buscas"
  const displaySongs = searchResults.length > 0 ? searchResults : recentSearches;

  return (
    <div className="min-h-screen bg-black relative pb-20 pt-28 px-4 font-sans">
      <img src="https://images.unsplash.com/photo-1516280440502-6178bc57c0e8?q=80&w=2000" alt="Stage" className="absolute inset-0 w-full h-full object-cover opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10 animate-in fade-in duration-700">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors uppercase text-xs font-bold tracking-widest">
          <ArrowLeft size={16} /> Voltar para o Início
        </button>

        <div className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs mb-3 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            <Music size={14} /> Palco Principal
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase drop-shadow-lg leading-tight mb-4">
            Basic <span className="text-primary neon-blue-glow">Lobby</span>
          </h1>
          <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto md:mx-0">
            O palco é seu. Cante sucessos usando nosso player otimizado ou desafie outros cantores na Arena de Batalhas.
          </p>
        </div>

        {/* ARENA MULTIPLAYER */}
        {!activeVideo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 animate-in slide-in-from-bottom-5">
            <Card onClick={() => navigate('/duel')} className="bg-gradient-to-br from-orange-600/20 to-red-900/20 hover:from-orange-600/40 hover:to-red-900/40 border-orange-500/30 hover:border-orange-500 transition-all duration-300 rounded-[2rem] p-8 flex items-center gap-6 cursor-pointer group shadow-[0_0_30px_rgba(249,115,22,0.1)] hover:shadow-[0_0_50px_rgba(249,115,22,0.3)]">
              <div className="h-20 w-20 rounded-full bg-orange-500/20 border border-orange-500/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Swords className="h-10 w-10 text-orange-500" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">Batalhas de Voz</h3>
                <p className="text-gray-400 font-medium text-sm">Desafie artistas do mundo todo em duelos vocais em tempo real.</p>
              </div>
            </Card>

            <Card onClick={() => navigate('/duel')} className="bg-gradient-to-br from-blue-600/20 to-indigo-900/20 hover:from-blue-600/40 hover:to-indigo-900/40 border-blue-500/30 hover:border-blue-500 transition-all duration-300 rounded-[2rem] p-8 flex items-center gap-6 cursor-pointer group shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:shadow-[0_0_50px_rgba(59,130,246,0.3)]">
              <div className="h-20 w-20 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Users className="h-10 w-10 text-blue-500" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">Duetos Colaborativos</h3>
                <p className="text-gray-400 font-medium text-sm">Cante em harmonia com seus amigos e crie colaborações épicas.</p>
              </div>
            </Card>
          </div>
        )}

        <div className="mb-8 flex items-center gap-3">
          <Crown className="text-primary h-6 w-6" />
          <h2 className="text-2xl font-black text-white uppercase tracking-widest">Karaokê Solo</h2>
        </div>

        {/* ÁREA PRINCIPAL: VÍDEO OU BUSCA */}
        {activeVideo ? (
          <div className="animate-in zoom-in-95 duration-500 mb-12">
            <div className="w-full aspect-video rounded-[2rem] overflow-hidden border border-primary/30 shadow-[0_0_80px_rgba(0,168,225,0.2)] bg-zinc-900 mb-6 relative">
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0&modestbranding=1`} 
                title="Karaoke Video" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="flex justify-center">
              <Button onClick={() => setActiveVideo(null)} variant="outline" className="h-14 px-8 rounded-full border-white/20 text-white font-bold hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-xs">
                <ArrowLeft size={16} className="mr-2" /> Escolher Outra Música
              </Button>
            </div>
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-5">
            
            {/* 💡 BARRA DE BUSCA REAL (Transformada em Formulário para rodar no 'Enter') */}
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
                    {/* O YouTube traz títulos muito longos, então limitamos para não quebrar o layout (line-clamp) */}
                    <h3 className="text-lg font-black text-white italic tracking-tighter uppercase mb-1 line-clamp-2 min-h-[56px] flex items-center justify-center">{song.title}</h3>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-6 line-clamp-1">{song.artist}</p>
                    
                    <Button onClick={() => setActiveVideo(song.youtubeId)} className="w-full h-12 rounded-full bg-white hover:bg-primary text-black font-black uppercase tracking-widest text-xs transition-all mt-auto">
                      CANTAR <PlayCircle className="ml-2 h-4 w-4" />
                    </Button>
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