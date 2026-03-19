import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic2, Search, PlayCircle, Swords, RotateCcw, ListMusic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { searchKaraokeVideos } from '@/services/youtubeService';

export default function BasicLobby() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const defaultSongs = [
    { title: "NÃO QUERO DINHEIRO", artist: "TIM MAIA", videoId: "5eJwf_k68r8" },
    { title: "LET IT BE", artist: "THE BEATLES", videoId: "OCdB7yFeg00" },
    { title: "AMOR MAIOR", artist: "JOTA QUEST", videoId: "yYSr8k7Bm0A" },
    { title: "EVIDÊNCIAS", artist: "CHITÃOZINHO E XORORÓ", videoId: "ePjtnSPFWK8" },
    { title: "SHALLOW", artist: "LADY GAGA", videoId: "bo_efYhYU2A" },
    { title: "BOHEMIAN RHAPSODY", artist: "QUEEN", videoId: "fJ9rUzIMcZQ" },
  ];

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error("Digite o nome de uma música ou artista.");
      return;
    }
    setIsLoading(true);
    setHasSearched(true);
    try {
      const videos = await searchKaraokeVideos(query);
      setResults(videos);
    } catch (error: any) {
      toast.error(error.message || "Erro ao buscar músicas no YouTube.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const displayList = hasSearched ? results : defaultSongs;

  return (
    <div className="min-h-screen bg-black font-sans text-white p-6 pt-24">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 uppercase text-[10px] font-black tracking-widest transition-colors w-fit bg-zinc-900/50 px-4 py-2 rounded-full border border-white/5">
          <ArrowLeft size={16} /> Voltar para o Início
        </button>

        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/20 px-3 py-1 rounded-full text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-4">
             <Mic2 size={14} /> PALCO PRINCIPAL
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-tight drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            BASIC <span className="text-cyan-400">LOBBY</span>
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-16">
          <div className="bg-zinc-950 border border-white/10 rounded-full flex items-center w-full p-2 px-6 shadow-inner focus-within:border-cyan-500/50 transition-colors">
            <Search className="text-gray-500 h-6 w-6 mr-4" />
            <input type="text" placeholder="Qual música você quer cantar hoje?" className="bg-transparent border-none text-white focus:outline-none w-full text-lg placeholder:text-gray-600 font-medium" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown} />
          </div>
          <Button onClick={handleSearch} disabled={isLoading} className="bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-sm rounded-full px-12 h-16 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all shrink-0">
            {isLoading ? "Buscando..." : "Buscar"}
          </Button>
        </div>

        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
          {hasSearched ? <ListMusic className="text-cyan-400 h-5 w-5" /> : <RotateCcw className="text-gray-400 h-5 w-5" />}
          <h3 className="font-black italic text-2xl uppercase tracking-tighter text-white">
            {hasSearched ? "RESULTADOS NO YOUTUBE" : "ÚLTIMAS BUSCAS"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayList.map((item, idx) => {
            const isYouTube = hasSearched;
            const title = isYouTube ? item.snippet.title : item.title;
            const artistOrChannel = isYouTube ? item.snippet.channelTitle : item.artist;
            const videoId = isYouTube ? (item.id.videoId || item.id) : item.videoId;

            return (
              <Card key={idx} className="bg-zinc-950 border border-white/5 rounded-[2rem] p-8 flex flex-col items-center text-center hover:border-cyan-500/30 hover:bg-zinc-900 transition-all group">
                <div className="h-16 w-16 rounded-full bg-black flex items-center justify-center mb-6 border border-white/5 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10 transition-colors shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  <Mic2 className="text-gray-500 group-hover:text-cyan-400 h-7 w-7 transition-colors" />
                </div>
                <h4 className="font-black italic text-xl uppercase text-white mb-2 line-clamp-2 min-h-[56px] flex items-center justify-center leading-tight" dangerouslySetInnerHTML={{ __html: title }}></h4>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-10">{artistOrChannel}</p>
                <div className="w-full space-y-3 mt-auto">
                  
                  <Button onClick={() => navigate(`/play/${videoId}`)} className="w-full bg-white hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-[10px] rounded-full h-12 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                    CANTAR SOLO <PlayCircle className="ml-2 h-4 w-4" />
                  </Button>
                  
                  {/* 🚨 CORREÇÃO FEITA AQUI: ID embutido na URL da Batalha */}
                  <Button onClick={() => navigate(`/duel-invite?id=${videoId}`)} variant="ghost" className="w-full text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10 font-black uppercase tracking-widest text-[9px] rounded-full h-10 transition-all border border-transparent hover:border-cyan-500/20">
                    DUETO / BATALHA <Swords className="ml-2 h-3 w-3" />
                  </Button>

                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  );
}