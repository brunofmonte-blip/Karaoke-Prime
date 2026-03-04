import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Download, Users, ArrowLeft, Search, PlayCircle, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

const BasicLobby = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim() !== '') {
      setShowResults(true);
    }
  };

  const mockResults = [
    { id: "1", videoId: "I_fW0X_oG_0", title: "Não Quero Dinheiro - Tim Maia - Karaokê", channel: "Viguiba Karaokê", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400" },
    { id: "2", videoId: "L9Xv6MAnkS0", title: "Descobridor dos Sete Mares - Tim Maia - Karaokê", channel: "Karaokê Show Oficial", img: "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f40f?q=80&w=400" },
    { id: "3", videoId: "8_v-D-GzK80", title: "Gostava Tanto de Você - Karaokê", channel: "Viguiba Karaokê", img: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=400" },
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      {/* BACKGROUND FORÇADO */}
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

        {/* PLAYER DE VÍDEO */}
        {selectedVideo && (
          <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-md">
            <button onClick={() => setSelectedVideo(null)} className="absolute top-6 right-6 text-white hover:text-primary transition-colors flex items-center gap-2 font-black tracking-tighter text-lg italic border-b-2 border-primary">
               FECHAR PLAYER <X size={24} />
            </button>
            <div className="w-full max-w-5xl aspect-video rounded-[2.5rem] overflow-hidden border-4 border-primary/30 shadow-[0_0_80px_rgba(0,168,225,0.4)]">
              <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`} frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div onClick={() => { setQuery(''); setShowResults(false); }} className="group cursor-pointer p-8 rounded-[2rem] border border-primary/50 bg-black/60 hover:bg-primary/20 transition-all flex flex-col items-center text-center">
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
            <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-destructive/20"><Users className="h-10 w-10 text-white group-hover:text-destructive" /></div>
            <h3 className="text-2xl font-black text-white mb-3 uppercase italic">DUETO / BATALHA</h3>
            <p className="text-gray-400 text-xs leading-relaxed font-medium">Convide um amigo ou desafie cantores<br/>ao redor do mundo.</p>
          </div>
        </div>

        {/* BUSCA FUNCIONAL */}
        <div className="max-w-4xl mx-auto relative mb-16">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-500" />
          <Input 
            placeholder="Qual música vamos cantar hoje? (Pressione Enter)" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            onKeyDown={handleSearch} 
            className="pl-16 h-20 bg-black/80 border-primary/30 text-white rounded-3xl focus:border-primary text-xl font-bold" 
          />
        </div>

        {showResults && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000 pb-32">
            <div className="space-y-6">
              {mockResults.map((result) => (
                <div key={result.id} onClick={() => setSelectedVideo(result.videoId)} className="bg-black/60 border border-white/5 rounded-[2.5rem] p-5 flex items-center gap-8 hover:bg-white/5 transition-all cursor-pointer group hover:border-primary/50">
                  <div className="relative w-56 h-32 overflow-hidden rounded-2xl border border-white/10">
                    <img src={result.img} className="w-full h-full object-cover" alt={result.title} />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <PlayCircle className="text-primary h-14 w-14" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-white text-2xl group-hover:text-primary italic truncate">🎤 {result.title}</h4>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">{result.channel}</p>
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