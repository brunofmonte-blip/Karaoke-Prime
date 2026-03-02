"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Sword, Search, User, Loader2, Check, Music, Play, Users, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const mockUsers = [
  { id: '1', name: 'VocalMaster_99', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'SingingStar_BR', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'KaraokeKing', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'Diva_Pop_2024', avatar: 'https://i.pravatar.cc/150?u=4' },
];

const DuelInviteLobby = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('v');

  const [searchQuery, setSearchQuery] = useState("");
  const [userResults, setUserResults] = useState<typeof mockUsers>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [invitedUser, setInvitedUser] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'pending'>('idle');

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    // Simulating API delay
    setTimeout(() => {
      const filtered = mockUsers.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setUserResults(filtered);
      setIsSearching(false);
    }, 800);
  };

  const handleInvite = (userName: string) => {
    setInvitedUser(userName);
    setStatus('pending');
    toast.success(`Convite enviado para ${userName}!`);
  };

  const handleStartSolo = () => {
    if (videoId) {
      navigate(`/duel-room?id=${videoId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-4 md:p-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-destructive/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Header */}
      <div className="w-full max-w-6xl mx-auto flex justify-between items-center mb-12 relative z-10">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/duel')}
          className="text-muted-foreground hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar
        </Button>
        
        <div className="flex flex-col items-center">
          <div className="px-4 py-1.5 rounded-full bg-destructive/10 border border-destructive/30 flex items-center gap-2 mb-2">
            <Sword className="h-4 w-4 text-destructive" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Duel Arena</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic">
            CONVIDAR <span className="text-destructive neon-red-glow">ADVERSÁRIO</span>
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-bold uppercase tracking-widest">
          <ShieldCheck className="h-3 w-3" />
          Lobby Seguro
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl mx-auto flex-grow relative z-10">
        
        {/* Left Card: Selected Music */}
        <Card className="glass-pillar border-2 border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Music className="h-4 w-4" />
              Música Selecionada
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 mb-6 group">
              <img 
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
                alt="Thumbnail" 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/0.jpg`;
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-4 rounded-full bg-destructive/20 backdrop-blur-md border border-destructive/50">
                  <Play className="h-8 w-8 text-white fill-current" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white leading-tight">
                Carregando detalhes da faixa...
              </h2>
              <p className="text-destructive font-bold uppercase tracking-widest text-xs">
                ID: {videoId}
              </p>
            </div>

            <div className="mt-auto pt-8">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-destructive/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Modo de Jogo</p>
                  <p className="text-sm font-bold text-white">Batalha 1v1 (Real-time)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Card: Search Opponent */}
        <Card className="glass-pillar border-2 border-destructive/30 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
          <CardHeader className="pt-8 pb-6">
            <CardTitle className="text-sm font-black text-destructive uppercase tracking-[0.2em] flex items-center gap-2">
              <Search className="h-4 w-4" />
              Buscar Adversário
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col space-y-6">
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input 
                  placeholder="Buscar usuário por nome..." 
                  className="h-14 pl-12 rounded-2xl bg-white/5 border-white/10 focus:border-destructive text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button 
                onClick={handleSearch}
                disabled={isSearching}
                className="h-14 px-6 bg-destructive hover:bg-destructive/90 text-white font-bold rounded-2xl"
              >
                {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : "Buscar"}
              </Button>
            </div>

            <div className="flex-grow overflow-y-auto max-h-[300px] pr-2 space-y-3 custom-scrollbar">
              {status === 'pending' ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-500">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 rounded-full bg-destructive/20 animate-ping" />
                    <div className="relative h-16 w-16 rounded-full bg-destructive/20 border-2 border-destructive flex items-center justify-center">
                      <Loader2 className="h-8 w-8 text-destructive animate-spin" />
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-white uppercase italic">Aguardando Aceite...</h3>
                  <p className="text-sm text-gray-400 mt-2">
                    Enviamos o convite para <span className="text-destructive font-bold">{invitedUser}</span>. 
                    Aguarde a confirmação para iniciar.
                  </p>
                  <Button 
                    variant="ghost" 
                    onClick={() => setStatus('idle')}
                    className="mt-6 text-xs text-gray-500 hover:text-white uppercase font-bold tracking-widest"
                  >
                    Cancelar Convite
                  </Button>
                </div>
              ) : userResults.length > 0 ? (
                userResults.map((user) => (
                  <div 
                    key={user.id}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group hover:border-destructive/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-white/10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                      </Avatar>
                      <span className="font-bold text-white">{user.name}</span>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => handleInvite(user.name)}
                      className="bg-white/10 hover:bg-destructive text-white font-bold rounded-xl px-4 h-9 transition-all"
                    >
                      CONVIDAR
                    </Button>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-12">
                  <Users className="h-12 w-12 mb-4" />
                  <p className="text-sm font-medium">Nenhum usuário encontrado.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Final CTA */}
      <div className="w-full max-w-6xl mx-auto mt-12 pb-8 relative z-10">
        <Button 
          onClick={handleStartSolo}
          disabled={status === 'pending'}
          className={cn(
            "w-full h-20 rounded-[2rem] font-black text-xl uppercase italic tracking-tighter transition-all duration-500 shadow-2xl",
            status === 'pending' 
              ? "bg-white/5 text-gray-600 cursor-not-allowed" 
              : "bg-destructive hover:bg-destructive/90 text-white shadow-destructive/30 hover:scale-[1.01]"
          )}
        >
          <Sword className="h-6 w-6 mr-3" />
          COMEÇAR BATALHA AGORA (CONTRA IA)
        </Button>
        <p className="text-center text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em] mt-4">
          O motor neural da IA está pronto para o desafio
        </p>
      </div>
    </div>
  );
};

export default DuelInviteLobby;