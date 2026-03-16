// 🚨 ATENÇÃO: ESTE CÓDIGO DEVE FICAR EXCLUSIVAMENTE NO ARQUIVO src/pages/BasicLobby.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Mic2, Swords, PlayCircle, Music, Users, Crown, 
  Search, History, Loader2, Info, Activity, Trophy, ShieldCheck, 
  Sparkles, Star, Mic, StopCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// NOSSAS IMPORTAÇÕES DO MOTOR CORE
import { useVocalSandbox } from '@/hooks/use-vocal-sandbox';
import VocalEvolutionChart from '@/components/VocalEvolutionChart';

const BasicLobby = () => {
  const navigate = useNavigate();
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [activeVideoTitle, setActiveVideoTitle] = useState<string>("Música");
  const [playMode, setPlayMode] = useState<'solo' | 'duelo'>('solo');
  
  const [musicSearchTerm, setMusicSearchTerm] = useState('');
  const [musicSearchResults, setMusicSearchResults] = useState<any[]>([]);
  const [isSearchingMusic, setIsSearchingMusic] = useState(false);
  
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userChallengeSent, setUserChallengeSent] = useState<string | null>(null);

  const cameraRef = useRef<HTMLVideoElement>(null);

  // 🚨 CORREÇÃO: Extraindo o ghostTrace do Motor
  const {
    isAnalyzing,
    startAnalysis,
    stopAnalysis,
    pitchHistory,
    ghostTrace, 
    sessionSummary,
    clearSessionSummary
  } = useVocalSandbox();

  const YOUTUBE_API_KEY = "XXXXXXXXXXXXXX";

  const recentSearches = [
    { id: "R-vR6Zt2K78", title: "Não Quero Dinheiro", artist: "Tim Maia", youtubeId: "R-vR6Zt2K78" },
    { id: "c2hZ_bS3nN4", title: "Let It Be", artist: "The Beatles", youtubeId: "c2hZ_bS3nN4" },
    { id: "A5iZ91B1A5M", title: "Amor Maior", artist: "Jota Quest", youtubeId: "A5iZ91B1A5M" },
    { id: "bO2t3zHh9Q8", title: "Evidências", artist: "Chitãozinho & Xororó", youtubeId: "bO2t3zHh9Q8" },
    { id: "8-XbS7lR-cM", title: "When I Was Your Man", artist: "Bruno Mars", youtubeId: "8-XbS7lR-cM" },
    { id: "9T88wzEwX4Y", title: "Essa Tal Liberdade", artist: "Só Pra Contrariar", youtubeId: "9T88wzEwX4Y" }
  ];

  const onlineUsers = [
    { id: "1", name: "Maria Clara", level: 12, status: "Online", avatar: "https://i.pravatar.cc/150?u=maria" },
    { id: "2", name: "João Pedro (JP)", level: 8, status: "Em Batalha", avatar: "https://i.pravatar.cc/150?u=jp" },
    { id: "3", name: "Ana Beatriz", level: 15, status: "Online", avatar: "https://i.pravatar.cc/150?u=ana" },
    { id: "4", name: "Lucas Fernandes", level: 5, status: "Online", avatar: "https://i.pravatar.cc/150?u=lucas" },
    { id: "5", name: "Sofia Silva", level: 22, status: "Online", avatar: "https://i.pravatar.cc/150?u=sofia" }
  ];

  const normalizeText = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const filteredUsers = onlineUsers.filter(user => normalizeText(user.name).includes(normalizeText(userSearchTerm)));

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (activeVideo && !sessionSummary) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((mediaStream) => { stream = mediaStream; if (cameraRef.current) cameraRef.current.srcObject = mediaStream; })
        .catch(err => console.error("Sem permissão de câmera:", err));
    }
    return () => { if (stream) stream.getTracks().forEach(track => track.stop()); };
  }, [activeVideo, sessionSummary]);

  const handleMusicSearch = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!musicSearchTerm.trim()) { setMusicSearchResults([]); return; }
    if (YOUTUBE_API_KEY === "SUA_CHAVE_API_DO_YOUTUBE_AQUI") { alert("⚠️ Comandante, cole sua chave da API do YouTube na linha correspondente!"); return; }
    setIsSearchingMusic(true);
    try {
      const query = encodeURIComponent(`${musicSearchTerm} karaoke`);
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=9&q=${query}&type=video&key=${YOUTUBE_API_KEY}`);
      const data = await response.json();
      if (data.items) {
        const mappedResults = data.items.map((item: any) => ({
          id: item.id.videoId, title: item.snippet.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'"), 
          artist: item.snippet.channelTitle, youtubeId: item.id.videoId
        }));
        setMusicSearchResults(mappedResults);
      }
    } catch (error) { console.error("Erro na busca:", error); } finally { setIsSearchingMusic(false); }
  };

  const handlePlay = (youtubeId: string, title: string, mode: 'solo' | 'duelo') => {
    setPlayMode(mode);
    setActiveVideo(youtubeId);
    setActiveVideoTitle(title);
  };

  const handleChallenge = (user: any) => {
    alert(`Convite de batalha enviado para ${user.name}! Aguardando aceitação...`);
    setUserChallengeSent(user.id);
  };

  const handleStartEngine = () => {
    const mockSong: any = {
      id: activeVideo,
      title: activeVideoTitle,
      artist: "YouTube",
      lyrics: [] 
    };
    startAnalysis(mockSong, playMode === 'duelo');
  };

  const handleClosePlayer = () => {
    if (isAnalyzing) stopAnalysis();
    clearSessionSummary();
    setActiveVideo(null);
  };

  const displaySongs = musicSearchResults.length > 0 ? musicSearchResults : recentSearches;

  return (
    <div className="min-h-screen relative pb-20 pt-28 px-4 font-sans overflow-hidden">
      
      {/* CAMADAS DE FUNDO (Z-INDEX 0 a 20) */}
      <div className="absolute inset-0 bg-black z-0" />
      <img 
        src="https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=2000&q=80" 
        alt="Microfone no Palco" 
        className="absolute inset-0 w-full h-full object-cover opacity-50 z-10" 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black z-20" />
      
      {/* CONTEÚDO PRINCIPAL (Z-INDEX 30) */}
      <div className="max-w-7xl mx-auto relative z-30 animate-in fade-in duration-700">
        
        {!sessionSummary && (
          <>
            <button onClick={() => { if(isAnalyzing) stopAnalysis(); navigate('/'); }} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors uppercase text-xs font-bold tracking-widest">
              <ArrowLeft size={16} /> Voltar para o Início
            </button>

            <div className="mb-12 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs mb-3 bg-primary/10 px-3 py-1 rounded-full border border-primary/20 backdrop-blur-md">
                <Music size={14} /> Palco Principal
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] leading-tight mb-4">
                Basic <span className="text-primary neon-blue-glow">Lobby</span>
              </h1>
            </div>
          </>
        )}

        {/* --- TELA DE RESUMO DE PERFORMANCE --- */}
        {sessionSummary ? (
          <div className="flex-grow space-y-8 flex flex-col items-center justify-center p-8 text-center max-w-4xl mx-auto w-full bg-zinc-950/90 backdrop-blur-xl rounded-[3rem] border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] animate-in zoom-in-95 duration-500">
            <Sparkles className="h-16 w-16 text-cyan-400 mb-2 animate-pulse" />
            <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">Performance Concluída!</h2>
            <p className="text-lg text-gray-400 font-bold tracking-widest uppercase">Confira seus números cirúrgicos na música {activeVideoTitle}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full pt-8">
              <div className="flex flex-col items-center justify-center p-6 bg-black/50 rounded-2xl border border-white/5">
                <Star className="h-6 w-6 text-cyan-400 mb-2" />
                <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Precisão da Voz</span>
                <span className="text-4xl font-mono font-black text-cyan-400">{sessionSummary.pitchAccuracy.toFixed(1)}<span className="text-2xl">%</span></span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 bg-black/50 rounded-2xl border border-white/5">
                <ShieldCheck className="h-6 w-6 text-cyan-400 mb-2" />
                <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Pontuação Total</span>
                <span className="text-4xl font-mono font-black text-white">{sessionSummary.totalScore}</span>
              </div>
               <div className="flex flex-col items-center justify-center p-6 bg-black/50 rounded-2xl border border-white/5">
                <Trophy className="h-6 w-6 text-cyan-400 mb-2" />
                <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Rank</span>
                <span className="text-4xl font-mono font-black text-white">#{sessionSummary.performanceRank}</span>
              </div>
               <div className="flex flex-col items-center justify-center p-6 bg-black/50 rounded-2xl border border-white/5">
                <Activity className="h-6 w-6 text-cyan-400 mb-2" />
                <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Duração</span>
                <span className="text-4xl font-mono font-black text-white">{sessionSummary.durationSeconds}<span className="text-2xl">s</span></span>
              </div>
            </div>

            <div className="w-full pt-6 text-left space-y-3 bg-black/40 p-6 rounded-2xl border border-white/5 mt-4">
              <h4 className="text-lg font-black text-white uppercase tracking-widest flex items-center"><Activity className="h-5 w-5 text-cyan-400 mr-2" /> Dicas de IA para Melhoria</h4>
              {sessionSummary.improvementTips.length > 0 ? (
                  <ul className="list-disc list-inside space-y-2 text-gray-300 font-medium">
                      {sessionSummary.improvementTips.map((tip: string, idx: number) => (
                          <li key={idx} className="text-sm">{tip}</li>
                      ))}
                  </ul>
              ) : (
                  <p className="text-gray-500 text-sm italic pt-1">Nenhuma dica gerada. Continue treinando!</p>
              )}
            </div>

            <div className="pt-8">
              <Button size="lg" onClick={handleClosePlayer} className="h-14 px-12 rounded-full bg-cyan-400 hover:bg-white text-black font-black uppercase tracking-widest text-xs transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                Cantar Outra Música
              </Button>
            </div>
          </div>
        ) : activeVideo ? (
          
          /* --- SALA DE KARAOKÊ COM VÍDEO E MOTOR DE ÁUDIO --- */
          <div className="animate-in zoom-in-95 duration-500 mb-12">
            
            <div className="mb-6 flex justify-center items-center gap-3">
              <Crown className="text-primary h-6 w-6" />
              <h2 className="text-2xl font-black text-white uppercase tracking-widest drop-shadow-md">
                KARAOKÊ {playMode === 'solo' ? 'SOLO' : '/ DUELO'}
              </h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 justify-center items-stretch w-full mb-8">
              
              <div className="w-full lg:w-1/4 flex flex-col gap-3 order-2 lg:order-1">
                <h3 className="text-center font-black text-white tracking-widest uppercase text-sm drop-shadow-md">Você</h3>
                <div className="relative w-full aspect-[3/4] lg:h-[450px] bg-black rounded-[2rem] border-[3px] border-cyan-400 shadow-[0_0_40px_rgba(34,211,238,0.2)] overflow-hidden">
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">REC</span>
                  </div>
                  <video ref={cameraRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]"></video>
                </div>
              </div>

              <div className={`${playMode === 'duelo' ? 'lg:w-2/4' : 'lg:w-3/4'} w-full flex flex-col gap-3 transition-all duration-500 order-1 lg:order-2`}>
                <h3 className="text-center font-black text-white tracking-widest uppercase text-sm drop-shadow-md">Vídeo da Música</h3>
                
                <div className="w-full aspect-video lg:h-[300px] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-zinc-900 relative">
                  <iframe 
                    width="100%" height="100%" 
                    src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0&modestbranding=1`} 
                    title="Karaoke Video" frameBorder="0" allowFullScreen
                    className="w-full h-full object-cover"
                  ></iframe>
                </div>

                {/* 🚨 CORREÇÃO BLINDADA AQUI 🚨 */}
                <div className="w-full h-32 lg:h-40 bg-zinc-950/80 backdrop-blur-md rounded-[1.5rem] border border-white/10 p-3 shadow-inner flex flex-col justify-center">
                   <VocalEvolutionChart 
                    title="Ondas Vocais" 
                    data={pitchHistory} 
                    opponentTrace={ghostTrace || []} 
                    height={100}
                  />
                </div>

                <div className="flex justify-center items-center gap-4 mt-2">
                  {!isAnalyzing ? (
                    <Button onClick={handleStartEngine} className="h-12 px-8 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                      <Mic className="mr-2 h-4 w-4" /> Iniciar Captação
                    </Button>
                  ) : (
                    <Button onClick={stopAnalysis} variant="destructive" className="h-12 px-8 rounded-full bg-red-500 hover:bg-red-400 text-white font-black uppercase tracking-widest text-xs transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse">
                      <StopCircle className="mr-2 h-4 w-4" /> Finalizar e Ver Nota
                    </Button>
                  )}
                </div>

              </div>

              {playMode === 'duelo' && (
                <div className="w-full lg:w-1/4 flex flex-col gap-3 order-3 animate-in fade-in slide-in-from-right-10 duration-500">
                  <h3 className="text-center font-black text-white tracking-widest uppercase text-sm drop-shadow-md">Oponente</h3>
                  <div className="relative w-full aspect-[3/4] lg:h-[450px] bg-zinc-950/90 backdrop-blur-xl rounded-[2rem] border-[3px] border-cyan-400/50 shadow-[0_0_40px_rgba(34,211,238,0.05)] overflow-hidden flex flex-col items-center justify-start p-6 text-center">
                    
                    <div className="relative w-full mb-6 group shrink-0">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Buscar cantor..." 
                        className="w-full h-10 pl-10 pr-4 bg-zinc-900 border border-white/10 focus:border-cyan-400 focus:outline-none text-white text-xs rounded-full transition-all"
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                      />
                    </div>

                    <div className="flex-1 w-full space-y-3 overflow-y-auto pr-2 custom-scrollbar-cyan">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <div key={user.id} className="bg-zinc-900/80 border border-white/5 p-3 rounded-2xl flex items-center gap-3 w-full animate-in fade-in">
                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-white/10 shrink-0" />
                            <div className="text-left flex-1 min-w-0">
                              <p className="text-xs font-black text-white uppercase tracking-widest truncate">{user.name}</p>
                              <div className="flex items-center gap-1.5 text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                                <Info size={10} className="text-cyan-500" /> Nível {user.level}
                              </div>
                            </div>
                            <Button onClick={() => handleChallenge(user)} disabled={user.challengeSent || user.status !== 'Online'} className="h-8 px-4 rounded-full bg-cyan-400 hover:bg-white text-black font-black uppercase tracking-widest text-[8px] transition-all">
                              {user.id === userChallengeSent ? 'Enviado' : 'Convidar'}
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nenhum cantor online.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {!isAnalyzing && (
              <div className="flex justify-center mt-4">
                <Button onClick={handleClosePlayer} variant="outline" className="h-14 px-8 rounded-full border-white/20 text-white font-bold hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-xs backdrop-blur-sm">
                  <ArrowLeft size={16} className="mr-2" /> Escolher Outra Música
                </Button>
              </div>
            )}
          </div>

        ) : (
          
          /* --- SALA DE BUSCA INICIAL --- */
          <div className="animate-in slide-in-from-bottom-5">
            <form onSubmit={handleMusicSearch} className="relative mb-10 group max-w-3xl flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10">
                  <Search className="h-6 w-6 text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder="Busque por música, artista ou gênero..." 
                  className="w-full h-16 pl-16 pr-6 bg-zinc-950/80 backdrop-blur-xl border border-white/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-white text-lg rounded-full shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all relative z-0"
                  value={musicSearchTerm}
                  onChange={(e) => setMusicSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isSearchingMusic} className="h-16 px-8 rounded-full bg-primary hover:bg-white text-black font-black uppercase tracking-widest transition-all shadow-lg">
                {isSearchingMusic ? <Loader2 className="h-6 w-6 animate-spin" /> : "BUSCAR"}
              </Button>
            </form>

            <div className="flex items-center gap-2 mb-6">
              {musicSearchResults.length > 0 ? (
                <><Search className="text-primary h-5 w-5 drop-shadow-md" /><h3 className="text-sm font-bold text-primary uppercase tracking-widest drop-shadow-md">Resultados da Busca</h3></>
              ) : (
                <><History className="text-gray-300 h-5 w-5 drop-shadow-md" /><h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest drop-shadow-md">Últimas Buscas</h3></>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displaySongs.map((song) => (
                <Card key={song.id} className="bg-zinc-950/70 backdrop-blur-xl border-white/10 hover:border-primary/50 transition-all duration-300 rounded-[2rem] p-6 flex flex-col items-center text-center group shadow-2xl">
                  <div className="h-16 w-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-[0_0_30px_rgba(0,168,225,0.3)] shrink-0">
                    <Mic2 className="h-6 w-6 text-white group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-lg font-black text-white italic tracking-tighter uppercase mb-1 line-clamp-2 min-h-[56px] flex items-center justify-center">{song.title}</h3>
                  <p className="text-gray-300 font-bold uppercase tracking-widest text-[10px] mb-6 line-clamp-1">{song.artist}</p>
                  
                  <div className="w-full flex flex-col gap-2 mt-auto">
                    <Button onClick={() => handlePlay(song.youtubeId, song.title, 'solo')} className="w-full h-12 rounded-full bg-white hover:bg-primary text-black font-black uppercase tracking-widest text-xs transition-all">
                      CANTAR SOLO <PlayCircle className="ml-2 h-4 w-4" />
                    </Button>
                    <Button onClick={() => handlePlay(song.youtubeId, song.title, 'duelo')} variant="outline" className="w-full h-10 rounded-full border-white/10 text-gray-300 hover:text-white hover:border-white/30 hover:bg-white/5 font-bold uppercase tracking-widest text-[10px] transition-all">
                      DUETO / BATALHA <Swords className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BasicLobby;