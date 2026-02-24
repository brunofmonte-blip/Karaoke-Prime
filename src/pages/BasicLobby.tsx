"use client";

import React, { useState } from 'react';
import { Search, Globe, Download, Users, Lock, PlayCircle, Music, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useNavigate, Link } from 'react-router-dom';

const BasicLobby = () => {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<'online' | 'offline' | 'duel'>('online');

  const mockSongs = [
    { id: '1', title: "Bohemian Rhapsody", artist: "Queen", provider: "KaraFun" },
    { id: '2', title: "Shallow", artist: "Lady Gaga", provider: "Stingray" },
    { id: '3', title: "Evidências", artist: "Chitãozinho & Xororó", provider: "Original" },
  ];

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-[80vh]">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="rounded-full">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-4xl font-bold text-primary neon-blue-glow">Lobby de Karaokê</h1>
      </div>

      {/* Mode Selection */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-widest">Escolha o Modo de Jogo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            className={cn(
              "cursor-pointer transition-all duration-300 border-2 bg-card/40 backdrop-blur-md",
              activeMode === 'online' ? "border-primary shadow-lg shadow-primary/20 scale-[1.02]" : "border-border/50 hover:border-primary/50"
            )}
            onClick={() => setActiveMode('online')}
          >
            <CardContent className="p-6 flex flex-col items-center text-center gap-4">
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Solo Online</h3>
                <p className="text-sm text-muted-foreground">Cante com o catálogo completo do YouTube.</p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={cn(
              "cursor-not-allowed transition-all duration-300 border-2 bg-card/20 backdrop-blur-md opacity-60",
              "border-border/50"
            )}
          >
            <CardContent className="p-6 flex flex-col items-center text-center gap-4 relative">
              <Lock className="absolute top-4 right-4 h-5 w-5 text-accent" />
              <div className="p-4 rounded-2xl bg-accent/10 border border-accent/30">
                <Download className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Solo Offline</h3>
                <p className="text-sm text-muted-foreground">Músicas baixadas (Premium).</p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={cn(
              "cursor-pointer transition-all duration-300 border-2 bg-card/40 backdrop-blur-md",
              activeMode === 'duel' ? "border-primary shadow-lg shadow-primary/20 scale-[1.02]" : "border-border/50 hover:border-primary/50"
            )}
            onClick={() => setActiveMode('duel')}
          >
            <CardContent className="p-6 flex flex-col items-center text-center gap-4">
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Dueto / Batalha</h3>
                <p className="text-sm text-muted-foreground">Cante com um amigo ou desafie o mundo.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Search Section */}
      <section className="max-w-3xl mx-auto">
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
          <Input 
            placeholder="Qual música vamos cantar hoje?" 
            className="pl-12 h-16 text-lg rounded-2xl bg-card/50 border-primary/30 focus:border-primary transition-all"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Resultados Sugeridos</h3>
          {mockSongs.map((song) => (
            <Link key={song.id} to="/room" className="block group">
              <Card className="border-border/50 bg-card/30 hover:bg-card/50 hover:border-primary/50 transition-all duration-300 rounded-2xl overflow-hidden">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Music className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-primary transition-colors">{song.title}</h4>
                      <p className="text-sm text-muted-foreground">{song.artist} • <span className="text-xs opacity-70">{song.provider}</span></p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full group-hover:text-primary">
                    <PlayCircle className="h-8 w-8" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BasicLobby;