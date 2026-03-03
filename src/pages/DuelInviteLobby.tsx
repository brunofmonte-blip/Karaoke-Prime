"use client";

import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, UserPlus, Sword, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const DuelInviteLobby = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('id');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [mockUsers, setMockUsers] = useState<any[]>([]);
  const [invitedUser, setInvitedUser] = useState<string | null>(null);

  if (!videoId) {
    navigate('/duel');
    return null;
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    
    // Simula a busca de usuários
    setTimeout(() => {
      setMockUsers([
        { id: 1, name: 'VocalKing_99', level: 12, status: 'Online' },
        { id: 2, name: 'MariaCantora', level: 8, status: 'Em partida' },
        { id: 3, name: 'João_Rock', level: 15, status: 'Online' }
      ]);
      setIsSearching(false);
    }, 1000);
  };

  const handleInvite = (userName: string) => {
    setInvitedUser(userName);
    toast.success(`Convite enviado para ${userName}!`);
    
    // Simula o aceite após 3 segundos e joga para a Arena
    setTimeout(() => {
      toast.success(`${userName} aceitou o desafio! Preparando arena...`);
      navigate(`/duel-room?id=${videoId}`);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.05),transparent_70%)] pointer-events-none" />
      
      <div className="flex justify-between items-center mb-12 relative z-10">
        <Button variant="ghost" onClick={() => navigate('/duel')} className="text-muted-foreground hover:text-destructive">
          <ArrowLeft className="mr-2 h-5 w-5" /> Voltar para Músicas
        </Button>
        <div className="px-6 py-2 rounded-full bg-destructive/10 border border-destructive flex items-center gap-3">
          <Sword className="h-4 w-4 text-destructive" />
          <span className="text-sm font-black text-white italic uppercase">Lobby de Duelo</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
            CONVIDAR <span className="text-destructive">ADVERSÁRIO</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card da Música */}
          <Card className="glass-pillar border-white/10 rounded-3xl overflow-hidden h-fit bg-black/40">
            <CardContent className="p-6">
              <div className="aspect-video rounded-xl overflow-hidden mb-4 relative">
                 <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt="Thumbnail" className="w-full h-full object-cover" />
              </div>
              <p className="text-sm text-gray-400 text-center">Você vai duelar usando esta faixa.</p>
            </CardContent>
          </Card>

          {/* Card de Busca */}
          <Card className="glass-pillar border-primary/30 rounded-3xl overflow-hidden bg-black/40">
            <CardContent className="p-6 space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Buscar usuário..." 
                  className="pl-10 h-12 bg-black/50 border-white/10 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  disabled={invitedUser !== null}
                />
              </div>
              
              <Button onClick={handleSearch} disabled={!searchQuery.trim() || isSearching || invitedUser !== null} className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold">
                {isSearching ? <Loader2 className="animate-spin" /> : 'PESQUISAR'}
              </Button>

              <div className="space-y-3 mt-4">
                {mockUsers.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-black/30">
                    <div>
                      <p className="text-sm font-bold text-white">{u.name}</p>
                      <p className="text-[10px] text-gray-400">Lvl {u.level} • {u.status}</p>
                    </div>
                    <Button size="sm" onClick={() => handleInvite(u.name)} disabled={invitedUser !== null || u.status !== 'Online'} className="bg-destructive hover:bg-destructive/90">
                      {invitedUser === u.name ? 'AGUARDANDO...' : <UserPlus className="h-4 w-4" />}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
           <Button onClick={() => navigate(`/duel-room?id=${videoId}`)} variant="outline" className="border-white/20 text-gray-400 hover:text-white" disabled={invitedUser !== null}>
              Treinar Contra a IA (Pular Convite)
           </Button>
        </div>
      </div>
    </div>
  );
};

export default DuelInviteLobby;