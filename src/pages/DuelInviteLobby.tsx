"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sword, Search, PlayCircle, Loader2, UserPlus, CheckCircle2, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { searchYouTube } from '@/services/youtubeService';
import { toast } from 'sonner';

const Duel = () => {
  const navigate = useNavigate();

  // Estados da Música
  const [songQuery, setSongQuery] = useState("");
  const [songResults, setSongResults] = useState<any[]>([]);
  const [loadingSongs, setLoadingSongs] = useState(false);
  const [selectedSong, setSelectedSong] = useState<any | null>(null);

  // Estados do Oponente
  const [opponentQuery, setOpponentQuery] = useState("");
  const [opponentResults, setOpponentResults] = useState<any[]>([]);
  const [loadingOpponents, setLoadingOpponents] = useState(false);
  const [selectedOpponent, setSelectedOpponent] = useState<any | null>(null);

  // Estado do Convite
  const [isInviting, setIsInviting] = useState(false);

  // Busca de Músicas
  const performSongSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setLoadingSongs(true);
    try {
      const items = await searchYouTube(searchTerm + ' karaoke');
      setSongResults(items || []);
    } catch (error) {
      toast.error("Erro na busca do YouTube.");
    } finally {
      setLoadingSongs(false);
    }
  }, []);

  useEffect(() => {
    performSongSearch("popular");
  }, [performSongSearch]);

  // Busca de Usuários (Simulada)
  const performOpponentSearch = () => {
    if (!opponentQuery.trim()) return;
    setLoadingOpponents(true);
    setTimeout(() => {
      setOpponentResults([
        { id: 1, name: `${opponentQuery}_Oficial`, level: 14, status: 'Online' },
        { id: 2, name: `Cantor_${opponentQuery}`, level: 7, status: 'Online' },
        { id: 3, name: `${opponentQuery}99`, level: 22, status: 'Em Partida' },
      ]);
      setLoadingOpponents(false);
    }, 800);
  };

  // Lógica do Convite (50% de chance de aceitar ou recusar)
  const handleInvite = () => {
    if (!selectedSong || !selectedOpponent) return;

    setIsInviting(true);
    toast.info(`Aguardando resposta de ${selectedOpponent.name}...`, { duration: 2500 });

    setTimeout(() => {
      setIsInviting(false);
      // Sorteio para simular a decisão do usuário (50/50)
      const accepted = Math.random() > 0.5; 

      if (accepted) {
        toast.success('Desafio aceito! Preparando a Arena...', { duration: 2000 });
        const videoId = typeof selectedSong.id === 'string' ? selectedSong.id : selectedSong.id?.videoId;
        
        setTimeout(() => {
          navigate(`/duel-room?id=${videoId}`);
        }, 1500);
      } else {
        toast.error('Me desculpe, seu oponente recusou o duelo.');
        setSelectedOpponent(null); // Limpa o oponente para você escolher outro
      }
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Visual */}
      <div className="relative h-[30vh] w-full overflow-hidden flex items-center justify-center mb-8">
        <div className="absolute inset-0 bg-cover bg-center z-0 opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2000')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/80 to-background z-10" />
        <div className="relative z-20 text-center px-4">
          <div className="inline-flex p-3 rounded-2xl bg-destructive/20 border-2 border-destructive mb-4 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
            <Sword className="h-8 w-8 text-destructive animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic">
            Configurações da <span className="text-destructive neon-red-glow">Batalha</span>
          </h1>
          <p className="text-gray-400 font-medium tracking-widest uppercase text-xs mt-2">1. Escolha a Música • 2. Escolha o Oponente</p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* COLUNA 1: BUSCA DE MÚSICA */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="bg-destructive text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span> 
              Selecione a Faixa
            </h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Buscar música no YouTube..." 
                className="pl-12 h-14 bg-card/50 border-white/10 text-white"
                value={songQuery}
                onChange={(e) => setSongQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && performSongSearch(songQuery)}
              />
              {loadingSongs && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-destructive animate-spin" />}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {songResults.map((song, index) => {
                const videoId = typeof song.id === 'string' ? song.id : song.id?.videoId;
                if (!videoId) return null;
                const isSelected = selectedSong?.id?.videoId === videoId || selectedSong?.id === videoId;
                
                return (
                  <Card 
                    key={videoId || index} 
                    className={`cursor-pointer transition-all ${isSelected ? 'border-destructive shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'border-white/5 hover:border-white/20'}`}
                    onClick={() => setSelectedSong(song)}
                  >
                    <div className="h-24 bg-cover bg-center relative" style={{ backgroundImage: `url(${song.snippet?.thumbnails?.high?.url || song.snippet?.thumbnails?.default?.url})` }}>
                      {isSelected && <div className="absolute inset-0 bg-destructive/40 flex items-center justify-center"><CheckCircle2 className="text-white h-8 w-8" /></div>}
                    </div>
                    <CardContent className="p-3">
                      <h3 className="text-xs font-bold text-white line-clamp-2" dangerouslySetInnerHTML={{ __html: song.snippet?.title || "Música" }} />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* COLUNA 2: BUSCA DE OPONENTE */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="bg-destructive text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span> 
              Convide o Adversário
            </h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Buscar usuário por nome..." 
                className="pl-12 h-14 bg-card/50 border-white/10 text-white"
                value={opponentQuery}
                onChange={(e) => setOpponentQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && performOpponentSearch()}
              />
              {loadingOpponents && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary animate-spin" />}
            </div>

            <div className="space-y-3 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {opponentResults.length === 0 && !loadingOpponents && (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                  <UserX className="h-12 w-12 mb-2" />
                  <p className="text-sm">Pesquise um usuário para duelar.</p>
                </div>
              )}
              {opponentResults.map((u) => {
                const isSelected = selectedOpponent?.id === u.id;
                return (
                  <div 
                    key={u.id} 
                    onClick={() => u.status === 'Online' && setSelectedOpponent(u)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${u.status !== 'Online' ? 'opacity-50 cursor-not-allowed border-white/5 bg-black/20' : isSelected ? 'border-primary bg-primary/10 cursor-pointer shadow-[0_0_15px_rgba(0,168,225,0.3)]' : 'border-white/10 bg-black/40 cursor-pointer hover:border-white/30'}`}
                  >
                    <div>
                      <p className="text-sm font-bold text-white flex items-center gap-2">
                        {u.name} {isSelected && <CheckCircle2 className="h-4 w-4 text-primary" />}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Lvl {u.level} • <span className={u.status === 'Online' ? 'text-green-400' : 'text-orange-400'}>{u.status}</span></p>
                    </div>
                    {isSelected ? (
                      <div className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full uppercase tracking-widest">Selecionado</div>
                    ) : (
                      <Button size="sm" variant="ghost" className="hover:bg-white/10" disabled={u.status !== 'Online'}>
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* BOTÃO FINAL DE AÇÃO */}
        <div className="mt-12 max-w-xl mx-auto border-t border-white/10 pt-8 text-center">
          <Button 
            onClick={handleInvite}
            disabled={!selectedSong || !selectedOpponent || isInviting}
            className={`w-full h-16 text-lg font-black uppercase tracking-widest rounded-2xl transition-all ${(!selectedSong || !selectedOpponent) ? 'bg-gray-800 text-gray-500' : 'bg-destructive hover:bg-destructive/90 text-white shadow-[0_0_40px_rgba(220,38,38,0.5)]'}`}
          >
            {isInviting ? (
              <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Aguardando Resposta...</>
            ) : (
              <><Sword className="mr-2 h-6 w-6" /> Convidar Para Duelo</>
            )}
          </Button>
          {(!selectedSong || !selectedOpponent) && (
            <p className="text-xs text-gray-500 mt-3 uppercase tracking-widest">Selecione uma música e um oponente para continuar</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Duel; 