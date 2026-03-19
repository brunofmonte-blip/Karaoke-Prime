"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
// 🚨 CORREÇÃO DO ITEM 4: Adicionei o ícone 'Mic' que estava faltando nas importações e quebrou a tela
import { ArrowLeft, Search, UserPlus, Sword, User, Trophy, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export default function DuelInviteLobby() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('id');
  
  const [searchQuery, setSearchQuery] = useState('');
  
  // Lista Fictícia de Usuários (Mantida)
  const mockUsers = [
    { id: 1, name: 'MARIA CLARA', handle: '@mariaclara_oficial', level: 12, status: 'Online', wins: 45, battles: 52, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
    { id: 2, name: 'JOÃO PEDRO', handle: '@jpcantor', level: 8, status: 'Ocupado', wins: 12, battles: 30, image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150' },
    { id: 3, name: 'VOCAL KING 99', handle: '@vocalking_99', level: 25, status: 'Online', wins: 120, battles: 135, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' }
  ];

  const [selectedOpponent, setSelectedOpponent] = useState(mockUsers[0]);
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    if (!videoId) {
      navigate('/basic');
    }
  }, [videoId, navigate]);

  if (!videoId) return null;

  const handleInvite = () => {
    setIsInviting(true);
    toast.success(`Desafio enviado para ${selectedOpponent.name}!`);
    
    setTimeout(() => {
      toast.success(`${selectedOpponent.name} aceitou! Entrando na Arena...`);
      navigate(`/duel-room/${videoId}`);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-8 relative overflow-hidden flex flex-col">
      
      {/* Header Fixo */}
      <div className="flex justify-between items-center mb-10 relative z-10 shrink-0">
        <Button variant="ghost" onClick={() => navigate('/basic')} className="text-gray-400 hover:text-orange-500 font-black uppercase text-[10px] tracking-widest border border-white/5 hover:border-orange-500 rounded-full px-4 py-2">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Palco Principal
        </Button>
        <div className="px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center gap-2">
          <Sword className="h-3 w-3 text-orange-500" />
          <span className="text-[9px] font-black text-white uppercase tracking-widest">Arena de Duelo Online</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full flex-1 flex flex-col">
        <div className="mb-10 shrink-0">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-tight">
            BATALHAS & <span className="text-orange-500">DUETOS</span>
          </h1>
          <p className="text-gray-400 mt-2 font-medium text-sm md:text-base max-w-2xl leading-relaxed">
            Busque por amigos no acervo global ou desafie os melhores cantores online. Quem tem a melhor afinação leva o troféu da rodada para casa.
          </p>
        </div>

        {/* LAYOUT DE 3 COLUNAS UNIFICADO (Como no Rascunho) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full flex-1">
          
          {/* COLUNA 1: MÚSICA SELECIONADA */}
          <Card className="lg:col-span-4 border-white/10 rounded-3xl bg-zinc-950 overflow-hidden h-fit flex flex-col">
            <div className="p-2 bg-red-900/30 text-center border-b border-red-500/20">
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Música do Desafio</span>
            </div>
            <CardContent className="p-6">
              <div className="aspect-video rounded-xl overflow-hidden mb-4 border border-white/10 relative shadow-2xl">
                 <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt="Thumbnail" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.5)] border-2 border-white/5">
                        <Mic className="h-6 w-6 text-white" />
                    </div>
                 </div>
              </div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest text-center leading-relaxed px-4">A arena Julliard será baseada nesta faixa do Youtube.</p>
            </CardContent>
          </Card>

          {/* COLUNA 2: BUSCA E LISTA DE OPONENTES */}
          <div className="lg:col-span-5 flex flex-col gap-5 h-fit">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600" />
              <Input 
                placeholder="Busque por cantor, @handle ou amigo..." 
                className="pl-14 h-16 rounded-full bg-zinc-900 border-white/10 focus:border-orange-500/50 text-white font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-xs font-black italic uppercase text-white mb-4">
                <User className="text-orange-500 h-4 w-4" /> Cantores Prime Online
              </h3>
              <div className="space-y-3">
                {mockUsers.map((u) => (
                  <div 
                    key={u.id} 
                    onClick={() => setSelectedOpponent(u)}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${selectedOpponent.id === u.id ? 'bg-orange-500/10 border-orange-500/50 scale-[1.03] shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'bg-zinc-950 border-white/5 hover:border-white/20'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-full overflow-hidden border border-white/10">
                          <img src={u.image} alt={u.name} className="w-full h-full object-cover" />
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-black ${u.status === 'Online' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                      </div>
                      <div>
                        <p className="text-sm font-black italic text-white uppercase tracking-tight">{u.name}</p>
                        <p className="text-[10px] text-gray-500 font-bold tracking-tight">{u.handle}</p>
                      </div>
                    </div>
                    {u.status === 'Online' ? (
                      <span className="text-orange-500 text-[9px] font-black uppercase tracking-widest bg-orange-500/10 px-3 py-1.5 rounded-full">Selecionado</span>
                    ) : (
                      <span className="text-gray-600 text-[9px] font-black uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full border border-white/5">Ocupado</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUNA 3: PERFIL DETALHADO DO OPONENTE */}
          <Card className="lg:col-span-3 border-orange-500/30 rounded-3xl bg-gradient-to-b from-[#1a0f0a] to-black overflow-hidden h-fit shadow-[0_0_40px_rgba(249,115,22,0.1)] sticky top-6">
             <CardContent className="p-6 flex flex-col items-center pt-8">
                <div className="h-28 w-28 rounded-full border-4 border-orange-500 overflow-hidden mb-4 shadow-[0_0_25px_rgba(249,115,22,0.5)] border-2 border-white/5">
                   <img src={selectedOpponent.image} alt={selectedOpponent.name} className="w-full h-full object-cover" />
                </div>
                
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Análise de Oponente</p>
                <h2 className="text-2xl font-black italic text-white uppercase mb-1 text-center leading-tight tracking-tight">{selectedOpponent.name}</h2>
                <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest mb-6">Nível Julliard {selectedOpponent.level}</p>

                <div className="grid grid-cols-2 gap-3 w-full mb-6">
                   <div className="bg-black/50 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center">
                     <Trophy className="text-orange-500 h-5 w-5 mb-2" />
                     <p className="text-xl font-black text-white">{selectedOpponent.wins}</p>
                     <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Vitórias</p>
                   </div>
                   <div className="bg-black/50 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center">
                     <Sword className="text-orange-500 h-5 w-5 mb-2" />
                     <p className="text-xl font-black text-white">{selectedOpponent.battles}</p>
                     <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Batalhas</p>
                   </div>
                </div>

                <Button 
                  onClick={handleInvite}
                  disabled={selectedOpponent.status !== 'Online' || isInviting}
                  className="w-full h-16 bg-orange-500 hover:bg-orange-400 disabled:bg-zinc-800 disabled:text-gray-600 text-black font-black uppercase tracking-widest text-sm rounded-full shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all hover:scale-105"
                >
                  {isInviting ? "Aguardando Oponente..." : "CONFIRMAR DESAFIO AGORA"}
                </Button>
             </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}