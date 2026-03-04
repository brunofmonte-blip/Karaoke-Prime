"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sword, Search, CheckCircle2, Loader2, UserPlus, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const Duel = () => {
  const navigate = useNavigate();
  const [songQuery, setSongQuery] = useState("");
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const [opponentQuery, setOpponentQuery] = useState("");
  const [selectedOpponent, setSelectedOpponent] = useState<any | null>(null);
  const [isInviting, setIsInviting] = useState(false);

  // Simulação rápida de busca para não travar na API do Youtube
  const mockSongs = [
    { id: 'dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up (Karaoke)', thumb: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
    { id: 'lPI-yZfOepY', title: 'Tim Maia - Gostava Tanto de Você (Karaoke)', thumb: 'https://img.youtube.com/vi/lPI-yZfOepY/hqdefault.jpg' }
  ];

  const handleInvite = () => {
    if (!selectedSongId || !selectedOpponent) return;
    setIsInviting(true);
    toast.info(`Aguardando resposta de ${selectedOpponent.name}...`, { duration: 2500 });

    setTimeout(() => {
      setIsInviting(false);
      const accepted = Math.random() > 0.3; // 70% de chance de aceitar
      if (accepted) {
        toast.success('Desafio aceito! Preparando a Arena...');
        setTimeout(() => navigate(`/duel-room?id=${selectedSongId}`), 1000);
      } else {
        toast.error('Me desculpe, seu oponente recusou o duelo.');
        setSelectedOpponent(null);
      }
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-24 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <Sword className="h-12 w-12 text-destructive mx-auto mb-4 animate-pulse" />
        <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase">Configurações da <span className="text-destructive">Batalha</span></h1>
        <p className="text-gray-400 mt-2 text-sm uppercase tracking-widest">1. Escolha a Música • 2. Escolha o Oponente</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Lado Esquerdo - Música */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><span className="bg-destructive text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span> Selecione a Faixa</h2>
          <Input placeholder="Buscar música..." value={songQuery} onChange={(e) => setSongQuery(e.target.value)} className="h-14 bg-card/50" />
          <div className="grid grid-cols-2 gap-4">
            {mockSongs.map((song) => (
              <Card key={song.id} className={`cursor-pointer ${selectedSongId === song.id ? 'border-destructive' : 'border-white/10'}`} onClick={() => setSelectedSongId(song.id)}>
                <div className="h-24 bg-cover bg-center relative" style={{ backgroundImage: `url(${song.thumb})` }}>
                  {selectedSongId === song.id && <div className="absolute inset-0 bg-destructive/40 flex items-center justify-center"><CheckCircle2 className="text-white h-8 w-8" /></div>}
                </div>
                <CardContent className="p-2"><p className="text-xs text-white truncate">{song.title}</p></CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Lado Direito - Oponente */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><span className="bg-destructive text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span> Convide o Adversário</h2>
          <Input placeholder="Buscar usuário..." value={opponentQuery} onChange={(e) => setOpponentQuery(e.target.value)} className="h-14 bg-card/50" />
          <div className="p-4 border border-white/10 rounded-xl bg-black/40 flex justify-between items-center cursor-pointer hover:border-primary" onClick={() => setSelectedOpponent({ name: 'VocalKing_99' })}>
            <div>
              <p className="text-white font-bold flex items-center gap-2">VocalKing_99 {selectedOpponent && <CheckCircle2 className="h-4 w-4 text-primary" />}</p>
              <p className="text-xs text-green-400">Online</p>
            </div>
            {selectedOpponent ? <span className="text-primary text-xs font-bold uppercase">Selecionado</span> : <UserPlus className="h-5 w-5 text-gray-400" />}
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Button onClick={handleInvite} disabled={!selectedSongId || !selectedOpponent || isInviting} className="w-full max-w-md h-16 text-lg font-black uppercase bg-destructive hover:bg-destructive/90 text-white rounded-2xl">
          {isInviting ? <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Aguardando...</> : <><Sword className="mr-2 h-6 w-6" /> Convidar Para Duelo</>}
        </Button>
      </div>
    </div>
  );
};
export default Duel;