import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, UserPlus, Swords, Mic2, Send, Loader2, XCircle, PlayCircle, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const Duel = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'config' | 'waiting' | 'rejected' | 'accepted'>('config');
  const [mode, setMode] = useState<'dueto' | 'batalha'>('batalha');
  
  // Estados para Busca de Música via YouTube
  const [musicQuery, setMusicQuery] = useState("");
  const [musicResults, setMusicResults] = useState<any[]>([]);
  const [isSearchingMusic, setIsSearchingMusic] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<any>(null);

  // Estados para Busca de Usuário
  const [userQuery, setUserQuery] = useState("");
  const users = ["@VocalQueen", "@RockStar_Leo", "@Anya_Sings", "@JazzMaster_J"];
  const filteredUsers = users.filter(u => u.toLowerCase().includes(userQuery.toLowerCase()) && userQuery.length > 1);

  // 🔴 COLE SUA CHAVE API DO YOUTUBE AQUI:
  const YOUTUBE_API_KEY = "SUA_CHAVE_AQUI"; 

  const searchYouTube = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && musicQuery.trim() !== '') {
      setIsSearchingMusic(true);
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=${encodeURIComponent(musicQuery + " karaoke")}&type=video&key=${YOUTUBE_API_KEY}`
        );
        const data = await response.json();
        if (data.items) setMusicResults(data.items);
      } catch (error) {
        console.error("Erro na busca de música:", error);
      } finally {
        setIsSearchingMusic(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 💡 BACKGROUND RESTAURADO E BLINDADO */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1516280440502-a2f011ba2dc9?q=80&w=2000" 
          className="w-full h-full object-cover opacity-25"
          alt="Palco de Duelo"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto w-full pt-16 p-4 md:p-8">
        <button onClick={() => navigate('/basic')} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors font-bold uppercase tracking-widest text-xs">
          <ArrowLeft size={16} /> Voltar para o Lobby
        </button>

        {status === 'config' && (
          <Card className="bg-black/80 border-white/10 rounded-[2rem] shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500 overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-4xl font-black text-white mb-10 text-center tracking-tighter uppercase italic drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                Configurações do Dueto / Batalha
              </h2>
              
              <div className="space-y-10">
                {/* 1. SELECIONAR MÚSICA (COM API REAL) */}
                <div className="relative">
                  <label className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4 block">1. Selecione a Música</label>
                  <div className="relative">
                    {isSearchingMusic ? (
                      <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-primary animate-spin" />
                    ) : (
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500" />
                    )}
                    <Input 
                      placeholder="Busque o hit e pressione Enter..." 
                      value={musicQuery}
                      onChange={(e) => setMusicQuery(e.target.value)}
                      onKeyDown={searchYouTube}
                      className="pl-14 h-16 bg-white/5 border-white/10 text-white rounded-2xl focus:border-primary text-lg font-medium" 
                    />
                  </div>

                  {/* Resultados flutuantes da busca de música */}
                  {musicResults.length > 0 && !selectedMusic && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-white/10 rounded-2xl p-2 z-50 shadow-2xl space-y-1">
                      {musicResults.map((video) => (
                        <div key={video.id.videoId} onClick={() => { setSelectedMusic(video); setMusicResults([]); }} className="p-3 hover:bg-primary/20 rounded-xl cursor-pointer flex items-center gap-4 text-white transition-colors">
                          <img src={video.snippet.thumbnails.default.url} className="w-20 h-12 object-cover rounded-lg" alt="thumb" />
                          <div className="flex-1 truncate">
                            <p className="font-bold text-sm truncate">{video.snippet.title}</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">{video.snippet.channelTitle}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Música Selecionada */}
                  {selectedMusic && (
                    <div className="mt-4 p-4 bg-primary/10 border border-primary/30 rounded-2xl flex items-center justify-between">
                       <div className="flex items-center gap-4">
                         <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center text-black font-black"><PlayCircle /></div>
                         <div>
                            <p className="text-white font-bold text-sm">{selectedMusic.snippet.title}</p>
                            <p className="text-primary text-[10px] font-black uppercase tracking-widest">Música Pronta para o Duelo</p>
                         </div>
                       </div>
                       <button onClick={() => setSelectedMusic(null)} className="text-gray-500 hover:text-white"><X size={20}/></button>
                    </div>
                  )}
                </div>

                {/* 2. CONVIDAR CANTOR */}
                <div className="relative">
                  <label className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4 block">2. Convide um Cantor</label>
                  <div className="relative">
                    <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500" />
                    <Input 
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      placeholder="Buscar por @username..." 
                      className="pl-14 h-16 bg-white/5 border-white/10 text-white rounded-2xl focus:border-primary text-lg font-medium" 
                    />
                  </div>
                  {filteredUsers.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-white/10 rounded-2xl p-2 z-50">
                       {filteredUsers.map(u => (
                         <div key={u} onClick={() => { setUserQuery(u); }} className="p-4 hover:bg-primary/20 rounded-xl cursor-pointer flex items-center justify-between text-white font-bold">
                           {u} <CheckCircle2 size={16} className="text-primary"/>
                         </div>
                       ))}
                    </div>
                  )}
                </div>

                {/* 3. MODO DE JOGO */}
                <div>
                  <label className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4 block">3. Estilo da Partida</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div onClick={() => setMode('dueto')} className={`cursor-pointer group p-8 rounded-3xl border-2 flex flex-col items-center justify-center text-center transition-all duration-300 ${mode === 'dueto' ? 'bg-primary/20 border-primary shadow-[0_0_30px_rgba(0,168,225,0.4)] scale-105' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                      <Mic2 className={`h-12 w-12 mb-4 ${mode === 'dueto' ? 'text-primary' : 'text-gray-500'}`} />
                      <h3 className={`font-black text-2xl mb-2 ${mode === 'dueto' ? 'text-white' : 'text-gray-400'}`}>DUETO</h3>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed">Colaborativo. Cantem juntos em harmonia.</p>
                    </div>
                    <div onClick={() => setMode('batalha')} className={`cursor-pointer group p-8 rounded-3xl border-2 flex flex-col items-center justify-center text-center transition-all duration-300 ${mode === 'batalha' ? 'bg-destructive/20 border-destructive shadow-[0_0_30px_rgba(239,68,68,0.4)] scale-105' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                      <Swords className={`h-12 w-12 mb-4 ${mode === 'batalha' ? 'text-destructive' : 'text-gray-500'}`} />
                      <h3 className={`font-black text-2xl mb-2 ${mode === 'batalha' ? 'text-white' : 'text-gray-400'}`}>BATALHA</h3>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed">Competitivo. Quem domina o palco?</p>
                    </div>
                  </div>
                </div>

                <Button 
                  disabled={!selectedMusic || userQuery.length < 2}
                  onClick={() => setStatus('waiting')} 
                  className="w-full h-20 rounded-2xl font-black text-2xl bg-white text-black hover:bg-primary disabled:opacity-20 transition-all mt-6 shadow-2xl"
                >
                  <Send className="mr-3 h-6 w-6" /> ENVIAR CONVITE
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TELAS DE STATUS (WAITING/REJECTED/ACCEPTED) */}
        {status !== 'config' && (
           <div className="flex flex-col items-center justify-center text-center pt-20 animate-in fade-in duration-500">
              {status === 'waiting' && (
                <>
                  <Loader2 className="h-24 w-24 text-primary animate-spin mb-10" />
                  <h2 className="text-5xl font-black text-white mb-6 uppercase italic tracking-tighter">Aguardando Resposta...</h2>
                  <div className="flex gap-4 p-6 border border-white/10 rounded-3xl bg-black/60">
                     <Button onClick={() => setStatus('accepted')} variant="outline" className="border-green-500 text-green-400 font-bold px-6">Aceitar</Button>
                     <Button onClick={() => setStatus('rejected')} variant="outline" className="border-destructive text-destructive font-bold px-6">Recusar</Button>
                  </div>
                </>
              )}
              {status === 'rejected' && (
                <>
                  <XCircle className="h-32 w-32 text-destructive mb-10 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]" />
                  <h2 className="text-6xl font-black text-white mb-6 uppercase italic">Convite Negado</h2>
                  <Button onClick={() => setStatus('config')} className="h-16 px-12 rounded-full font-black text-lg bg-primary text-black hover:bg-primary/80">Tentar outro Cantor</Button>
                </>
              )}
              {status === 'accepted' && (
                <>
                  <PlayCircle className="h-32 w-32 text-green-400 mb-10 drop-shadow-[0_0_30px_rgba(74,222,128,0.5)] animate-pulse" />
                  <h2 className="text-7xl font-black text-white mb-6 italic uppercase">LET'S ROCK!</h2>
                  <p className="text-green-400 font-black tracking-widest uppercase">Oponente aceitou o desafio</p>
                  <Button onClick={() => setStatus('config')} variant="outline" className="mt-12 border-white/10 text-gray-500">Voltar (Teste)</Button>
                </>
              )}
           </div>
        )}
      </div>
    </div>
  );
};

export default Duel;