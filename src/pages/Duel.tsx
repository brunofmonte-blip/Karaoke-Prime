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
      
      {/* Header */}
      <div className="flex justify-between items-center mb-12 relative z-10">
        <Button variant="ghost" onClick={() => navigate('/duel')} className="text-muted-foreground hover:text-destructive">
          <ArrowLeft className="mr-2 h-5 w-5" /> Voltar para Músicas
        </Button>
        <div className="px-6 py-2 rounded-full bg-destructive/10 border border-destructive shadow-[0_0_15px_rgba(220,38,38,0.2)] flex items-center gap-3">
          <Sword className="h-4 w-4 text-destructive" />
          <span className="text-sm font-black text-white italic uppercase tracking-widest">Lobby de Duelo</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
            CONVIDAR <span className="text-destructive">ADVERSÁRIO</span>
          </h1>
          <p className="text-gray-400 mt-2 font-medium tracking-widest uppercase text-xs">Encontre um oponente digno para esta música</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card da Música */}
          <Card className="glass-pillar border-white/10 rounded-3xl overflow-hidden h-fit bg-black/40">
            <div className="p-1 bg-destructive/20 text-center">
              <span className="text-[10px] font-black text-destructive uppercase tracking-widest">Música Selecionada</span>
            </div>
            <CardContent className="p-6">
              <div className="aspect-video rounded-xl overflow-hidden mb-4 border border-white/10 relative">
                 <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt="Thumbnail" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-destructive/80 flex items-center justify-center backdrop-blur-sm">
                        <Sword className="h-6 w-6 text-white" />
                    </div>
                 </div>
              </div>
              <p className="text-sm text-gray-400 text-center">Você está prestes a duelar usando esta faixa.</p>
            </CardContent>
          </Card>

          {/* Card de Busca de Usuário */}
          <Card className="glass-pillar border-primary/30 rounded-3xl overflow-hidden bg-black/40">
             <div className="p-1 bg-primary/20 text-center">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Buscar Desafiante</span>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Nome do usuário..." 
                  className="pl-10 h-12 rounded-xl bg-black/50 border-white/10 focus:border-primary text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  disabled={invitedUser !== null}
                />
              </div>
              
              <Button 
                onClick={handleSearch} 
                disabled={!searchQuery.trim() || isSearching || invitedUser !== null}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold"
              >
                {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : 'PESQUISAR GLOBALMENTE'}
              </Button>

              {/* Resultados da Busca */}
              <div className="space-y-3 mt-4">
                {mockUsers.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-black/30">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{u.name}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Lvl {u.level} • <span className={u.status === 'Online' ? 'text-green-400' : 'text-orange-400'}>{u.status}</span></p>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm"
                      variant={invitedUser === u.name ? "outline" : "default"}
                      className={invitedUser === u.name ? "border-green-500 text-green-500 bg-transparent" : "bg-destructive hover:bg-destructive/90"}
                      disabled={invitedUser !== null || u.status !== 'Online'}
                      onClick={() => handleInvite(u.name)}
                    >
                      {invitedUser === u.name ? 'AGUARDANDO...' : <UserPlus className="h-4 w-4" />}
                    </Button>
                  </div>
                ))}
              </div>

            </CardContent>
          </Card>

        </div>

        {/* Botão de IA */}
        <div className="mt-12 text-center">
           <Button 
              onClick={() => navigate(`/duel-room?id=${videoId}`)}
              variant="outline"
              className="border-white/20 text-gray-400 hover:text-white hover:bg-white/5 h-14 px-8 rounded-full font-bold tracking-widest uppercase text-xs"
              disabled={invitedUser !== null}
           >
              Treinar Contra a IA (Pular Convite)
           </Button>
        </div>

      </div>
    </div>
  );
};

export default DuelInviteLobby;