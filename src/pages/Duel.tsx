"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Trophy, Sword, ArrowLeft, Search, Flame, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { publicDomainLibrary, PublicDomainSong } from '@/data/public-domain-library';
import { useDuel } from '@/hooks/use-duel-engine';
import { useUserProfile } from '@/hooks/use-user-profile';

const Duel = () => {
  const navigate = useNavigate();
  const { startLocalDuel } = useDuel();
  const { data: profile } = useUserProfile();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSongs = publicDomainLibrary.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartDuel = (song: PublicDomainSong) => {
    startLocalDuel(song);
    // O hook startLocalDuel já abre o overlay do sandbox
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <div className="relative h-[35vh] w-full overflow-hidden flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2000')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/80 to-background z-10" />
        
        <div className="relative z-20 text-center px-4 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-flex p-4 rounded-2xl bg-destructive/20 border-2 border-destructive mb-4 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
            <Sword className="h-10 w-10 text-destructive animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic">
            Duel <span className="text-destructive neon-red-glow">Arena</span>
          </h1>
          <p className="text-gray-400 font-medium tracking-widest uppercase text-xs md:text-sm mt-2">
            Desafie a IA ou amigos em batalhas vocais épicas
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 -mt-10 relative z-30">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="glass-pillar border-destructive/30">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Vitórias</p>
                <p className="text-2xl font-black text-white">12</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-pillar border-primary/30">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Rank Global</p>
                <p className="text-2xl font-black text-white">#{profile?.ranking_position || '---'}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-pillar border-accent/30">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <Flame className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Win Streak</p>
                <p className="text-2xl font-black text-white">3x</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Selection */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Selecione o Desafio</h2>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar música para o duelo..." 
                className="pl-10 bg-card/50 border-destructive/20 focus:border-destructive rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSongs.map((song) => (
              <Card key={song.id} className="group overflow-hidden border-2 border-white/5 bg-card/30 hover:border-destructive/50 transition-all duration-500 rounded-2xl">
                <div 
                  className="h-40 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${song.imageUrl})` }}
                >
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase">
                    {song.difficulty}
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-bold text-white truncate mb-1">{song.title}</h3>
                  <p className="text-xs text-gray-500 mb-4">{song.artist}</p>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleStartDuel(song)}
                      className="flex-1 bg-destructive hover:bg-destructive/90 text-white font-bold rounded-xl shadow-lg shadow-destructive/20"
                    >
                      <Sword className="h-4 w-4 mr-2" />
                      VS AI
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 border-white/10 hover:bg-white/5 text-gray-400 rounded-xl"
                      disabled
                    >
                      <Users className="h-4 w-4 mr-2" />
                      PVP
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="fixed bottom-8 left-8 z-50">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="rounded-full bg-background/80 backdrop-blur-md border-white/10 hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
    </div>
  );
};

export default Duel;