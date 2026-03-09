// 🚨 ATENÇÃO: ESTE CÓDIGO DEVE FICAR EXCLUSIVAMENTE NO ARQUIVO src/pages/BasicLobby.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic2, Swords, PlayCircle, Music, Users, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const BasicLobby = () => {
  const navigate = useNavigate();
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // 💡 O RETORNO DA PRATICIDADE: Músicas baseadas no YouTube (Você pode adicionar milhares de IDs aqui depois)
  const songs = [
    { id: 1, title: "Someone Like You", artist: "Adele", youtubeId: "hLQl3WQQoQ0" },
    { id: 2, title: "Evidências", artist: "Chitãozinho & Xororó", youtubeId: "bO2t3zHh9Q8" },
    { id: 3, title: "Yellow", artist: "Coldplay", youtubeId: "yKNxeF4KMsY" }
  ];

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

        {/* 💡 A ARENA MULTIPLAYER QUE HAVÍAMOS PERDIDO (AGORA EM DESTAQUE) */}
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

        {/* 💡 O PALCO SOLO COM INTEGRAÇÃO YOUTUBE */}
        <div className="mb-8 flex items-center gap-3">
          <Crown className="text-primary h-6 w-6" />
          <h2 className="text-2xl font-black text-white uppercase tracking-widest">Karaokê Solo</h2>
        </div>

        {activeVideo ? (
          // PLAYER DE VÍDEO DO YOUTUBE ATIVO
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
          // LISTA DE MÚSICAS
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-5">
            {songs.map((song) => (
              <Card key={song.id} className="bg-zinc-950/80 backdrop-blur-xl border-white/10 hover:border-primary/50 transition-all duration-300 rounded-[2rem] p-6 flex flex-col items-center text-center group">
                <div className="h-16 w-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-[0_0_30px_rgba(0,168,225,0.3)]">
                  <Mic2 className="h-6 w-6 text-white group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-1">{song.title}</h3>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-6">{song.artist}</p>
                
                <Button onClick={() => setActiveVideo(song.youtubeId)} className="w-full h-12 rounded-full bg-white hover:bg-primary text-black font-black uppercase tracking-widest text-xs transition-all">
                  CANTAR <PlayCircle className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default BasicLobby;