import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, UserPlus, Swords, Mic2, Send, Loader2, XCircle, PlayCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const Duel = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'config' | 'waiting' | 'rejected' | 'accepted'>('config');
  const [mode, setMode] = useState<'dueto' | 'batalha'>('batalha');
  
  // Simulação de busca de usuário
  const [userQuery, setUserQuery] = useState("");
  const users = ["@VocalQueen", "@RockStar_Leo", "@Anya_Sings", "@JazzMaster_J"];
  const filteredUsers = users.filter(u => u.toLowerCase().includes(userQuery.toLowerCase()) && userQuery.length > 1);

  return (
    <div className="min-h-screen bg-background relative flex flex-col p-4 md:p-8 overflow-hidden">
      {/* 💡 FUNDO DINÂMICO DE PALCO */}
      <img src="https://images.unsplash.com/photo-1516280440502-a2f011ba2dc9?q=80&w=2000" alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-[0.25]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent z-0" />

      <div className="relative z-10 max-w-4xl mx-auto w-full pt-16">
        <button onClick={() => navigate('/basic')} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors font-bold uppercase tracking-widest text-xs">
          <ArrowLeft size={16} /> Voltar para o Lobby
        </button>

        {status === 'config' && (
          <Card className="bg-black/80 border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500 overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-4xl font-black text-white mb-10 text-center tracking-tighter uppercase italic drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                DUETO / BATALHA
              </h2>
              
              <div className="space-y-10">
                {/* 1. Selecionar Música (Simulada para visual) */}
                <div>
                  <label className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4 block">1. Selecione a Música</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500" />
                    <Input placeholder="Qual hit vamos cantar?" className="pl-14 h-16 bg-white/5 border-white/10 text-white rounded-2xl focus:border-primary text-lg font-medium" />
                  </div>
                </div>

                {/* 2. Convidar Oponente (Com simulação de busca) */}
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
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-white/10 rounded-2xl p-2 z-50 shadow-2xl">
                       {filteredUsers.map(u => (
                         <div key={u} onClick={() => {setUserQuery(u); setUserQuery("")}} className="p-4 hover:bg-primary/20 rounded-xl cursor-pointer flex items-center justify-between text-white font-bold transition-colors">
                           {u} <CheckCircle2 size={16} className="text-primary"/>
                         </div>
                       ))}
                    </div>
                  )}
                </div>

                {/* 3. Modo de Jogo */}
                <div>
                  <label className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4 block">3. Estilo da Partida</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div onClick={() => setMode('dueto')} className={`cursor-pointer group p-8 rounded-3xl border-2 flex flex-col items-center justify-center text-center transition-all duration-300 ${mode === 'dueto' ? 'bg-primary/20 border-primary shadow-[0_0_30px_rgba(0,168,225,0.4)] scale-105' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                      <Mic2 className={`h-12 w-12 mb-4 transition-transform group-hover:scale-110 ${mode === 'dueto' ? 'text-primary' : 'text-gray-500'}`} />
                      <h3 className={`font-black text-2xl mb-2 ${mode === 'dueto' ? 'text-white' : 'text-gray-400'}`}>DUETO</h3>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed">Colaborativo. Cantem juntos e unam suas notas para um show incrível.</p>
                    </div>
                    <div onClick={() => setMode('batalha')} className={`cursor-pointer group p-8 rounded-3xl border-2 flex flex-col items-center justify-center text-center transition-all duration-300 ${mode === 'batalha' ? 'bg-destructive/20 border-destructive shadow-[0_0_30px_rgba(239,68,68,0.4)] scale-105' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                      <Swords className={`h-12 w-12 mb-4 transition-transform group-hover:scale-110 ${mode === 'batalha' ? 'text-destructive' : 'text-gray-500'}`} />
                      <h3 className={`font-black text-2xl mb-2 ${mode === 'batalha' ? 'text-white' : 'text-gray-400'}`}>BATALHA</h3>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed">Competitivo. Desafie o oponente e descubra quem domina o palco.</p>
                    </div>
                  </div>
                </div>

                <Button onClick={() => setStatus('waiting')} className="w-full h-20 rounded-2xl font-black text-2xl bg-white text-black hover:bg-primary hover:scale-[1.02] active:scale-95 transition-all mt-6 shadow-2xl">
                  <Send className="mr-3 h-6 w-6" /> ENVIAR CONVITE
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TELA DE AGUARDANDO (Agora com fundo) */}
        {status === 'waiting' && (
          <div className="flex flex-col items-center justify-center text-center pt-20 animate-in fade-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
              <Loader2 className="h-24 w-24 text-primary animate-spin mb-10 relative z-10" />
            </div>
            <h2 className="text-5xl font-black text-white mb-6 italic tracking-tighter uppercase">Aguardando Resposta...</h2>
            <p className="text-gray-300 text-xl mb-20 max-w-lg mx-auto font-medium">O convite foi enviado para o palco do oponente. Prepare o fôlego!</p>
            
            <div className="flex gap-4 p-6 border border-white/10 rounded-3xl bg-black/60 backdrop-blur-md">
               <p className="text-[10px] text-primary font-black uppercase tracking-widest mr-4 flex items-center">Simulador de Aceite:</p>
               <Button onClick={() => setStatus('accepted')} variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500 hover:text-black font-bold px-6">Aceitar</Button>
               <Button onClick={() => setStatus('rejected')} variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive hover:text-white font-bold px-6">Recusar</Button>
            </div>
          </div>
        )}

        {/* TELAS DE RESULTADO (RECURSADO / ACEITO) */}
        {status === 'rejected' && (
          <div className="flex flex-col items-center justify-center text-center pt-20 animate-in zoom-in duration-500">
            <XCircle className="h-32 w-32 text-destructive mb-10 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]" />
            <h2 className="text-6xl font-black text-white mb-6 uppercase italic tracking-tighter">Convite Negado</h2>
            <p className="text-gray-400 text-xl mb-12 font-medium">O cantor está em outra sessão ou não pode atender agora.</p>
            <Button onClick={() => setStatus('config')} className="h-16 px-12 rounded-full font-black text-lg bg-primary text-black hover:bg-primary/80 transition-all shadow-xl hover:scale-105">
              <Search className="mr-2 h-6 w-6" /> Tentar outro Cantor
            </Button>
          </div>
        )}

        {status === 'accepted' && (
          <div className="flex flex-col items-center justify-center text-center pt-20 animate-in zoom-in duration-500">
            <PlayCircle className="h-32 w-32 text-green-400 mb-10 drop-shadow-[0_0_30px_rgba(74,222,128,0.5)] animate-pulse" />
            <h2 className="text-7xl font-black text-white mb-6 italic uppercase tracking-tighter">LET'S ROCK!</h2>
            <p className="text-green-400 text-2xl mb-12 font-black tracking-[0.3em] uppercase">Convite Aceito pelo Oponente</p>
            <div className="flex flex-col gap-4">
               <span className="text-white/40 text-sm font-bold animate-bounce uppercase italic">Carregando Sala de Performance...</span>
               <Button onClick={() => setStatus('config')} variant="outline" className="border-white/10 text-gray-500 hover:text-white">Voltar (Teste)</Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Duel;