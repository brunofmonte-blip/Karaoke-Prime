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

  // Simulando resultados que agora "funcionam" ao clicar
  const mockResults = [
    { id: "1", videoId: "I_fW0X_oG_0", title: "Não Quero Dinheiro - Tim Maia - Karaokê", channel: "Viguiba Karaokê", img: "https://picsum.photos/seed/tm1/160/90" },
    { id: "2", videoId: "L9Xv6MAnkS0", title: "Descobridor dos Sete Mares - Tim Maia - Karaokê", channel: "Karaokê Show Oficial", img: "https://picsum.photos/seed/tm2/160/90" },
    { id: "3", videoId: "8_v-D-GzK80", title: "Gostava Tanto de Você - Karaokê", channel: "Viguiba Karaokê", img: "https://picsum.photos/seed/tm3/160/90" },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 relative overflow-x-hidden">
      <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000" alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-[0.15]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-background to-background z-0" />

      <div className="relative z-10 max-w-6xl mx-auto pt-20 animate-in fade-in duration-700">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 transition-colors"><ArrowLeft size={20} /> Voltar para Home</button>
        <h1 className="text-4xl md:text-5xl font-black text-primary neon-blue-glow mb-2 tracking-tighter italic uppercase">Lobby de Karaokê</h1>
        <p className="text-white font-bold uppercase tracking-widest mb-10 text-sm opacity-70">Escolha o modo de jogo</p>

        {/* Player de Vídeo (Aparece quando clica na música) */}
        {selectedVideo && (
          <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4">
            <button onClick={() => setSelectedVideo(null)} className="absolute top-10 right-10 text-white hover:text-primary transition-colors flex items-center gap-2 font-bold"><X size={32} /> FECHAR PLAYER</button>
            <div className="w-full max-w-5xl aspect-video rounded-3xl overflow-hidden border-4 border-primary/30 shadow-[0_0_50px_rgba(0,168,225,0.3)]">
              <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`} title="Karaoke Player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            </div>
            <p className="mt-8 text-primary font-black text-2xl animate-pulse tracking-widest uppercase italic">Gravando Performance Vocal...</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div onClick={() => { setQuery(''); setShowResults(false); }} className="group cursor-pointer p-8 rounded-2xl border border-primary/50 bg-black/40 hover:bg-primary/10 transition-all flex flex-col items-center text-center shadow-[0_0_15px_rgba(0,168,225,0.2)]">
            <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Globe className="h-8 w-8 text-primary" /></div>
            <h3 className="text-xl font-bold text-white mb-2">Solo Online</h3><p className="text-gray-400 text-xs leading-relaxed">Cante com o catálogo completo do YouTube.</p>
          </div>
          <div className="group p-8 rounded-2xl border border-white/10 bg-black/40 flex flex-col items-center text-center relative opacity-50 cursor-not-allowed">
            <div className="absolute top-4 right-4 text-orange-500">🔒</div>
            <div className="h-16 w-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-4"><Download className="h-8 w-8 text-orange-500" /></div>
            <h3 className="text-xl font-bold text-gray-300 mb-2">Solo Offline</h3><p className="text-gray-500 text-xs leading-relaxed">Músicas baixadas (Premium).</p>
          </div>
          <div onClick={() => navigate('/duel')} className="group cursor-pointer p-8 rounded-2xl border border-white/10 bg-black/40 hover:border-destructive/50 hover:bg-destructive/10 transition-all flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-destructive/20"><Users className="h-8 w-8 text-white group-hover:text-destructive" /></div>
            <h3 className="text-xl font-bold text-white mb-2">Dueto / Batalha</h3><p className="text-gray-400 text-xs leading-relaxed">Cante com um amigo ou desafie o mundo.</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto relative mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
          <Input placeholder="Qual música vamos cantar hoje? (Pressione Enter)" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleSearch} className="pl-14 h-16 bg-black/60 border-primary/30 text-white rounded-2xl focus:border-primary transition-colors text-xl font-medium" />
        </div>

        {showResults && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2"><div className="h-2 w-2 bg-primary rounded-full animate-ping"/> Resultados Encontrados no YouTube</h3>
            <div className="space-y-4">
              {mockResults.map((result) => (
                <div key={result.id} onClick={() => setSelectedVideo(result.videoId)} className="bg-black/60 border border-white/10 rounded-3xl p-4 flex items-center gap-6 hover:bg-white/5 transition-all cursor-pointer group hover:border-primary/50 shadow-lg">
                  <div className="relative w-48 h-28 overflow-hidden rounded-2xl border border-white/10 flex-shrink-0">
                    <img src={result.img} alt={result.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><PlayCircle className="text-white h-12 w-12" /></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-xl mb-1 group-hover:text-primary transition-colors">🎤 {result.title}</h4>
                    <p className="text-gray-400 font-medium">{result.channel}</p>
                  </div>
                  <Button className="rounded-full h-12 w-12 p-0 bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-black transition-all mr-4"><PlayCircle /></Button>
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