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
  const [userQuery, setUserQuery] = useState("");

  const users = ["@VocalQueen", "@RockStar_Leo", "@Anya_Sings", "@JazzMaster_J"];
  const filteredUsers = users.filter(u => u.toLowerCase().includes(userQuery.toLowerCase()) && userQuery.length > 1);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* BACKGROUND RESTAURADO */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1516280440502-a2f011ba2dc9?q=80&w=2000" 
          className="w-full h-full object-cover opacity-20"
          alt="Duelo Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto w-full pt-16 p-4 md:p-8">
        <button onClick={() => navigate('/basic')} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 font-bold uppercase tracking-widest text-xs">
          <ArrowLeft size={16} /> Voltar para o Lobby
        </button>

        {status === 'config' && (
          <Card className="bg-black/80 border-white/10 rounded-[2rem] shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500 overflow-hidden">
            <CardContent className="p-8 md:p-12">
              {/* FRASE CORRIGIDA */}
              <h2 className="text-4xl font-black text-white mb-10 text-center tracking-tighter uppercase italic drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                Configurações do Dueto / Batalha
              </h2>
              
              <div className="space-y-10">
                <div>
                  <label className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4 block">1. Selecione a Música</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500" />
                    <Input placeholder="Qual hit vamos cantar?" className="pl-14 h-16 bg-white/5 border-white/10 text-white rounded-2xl focus:border-primary text-lg font-medium" />
                  </div>
                </div>

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
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-white/10 rounded-2xl p-2 z-50">
                       {filteredUsers.map(u => (
                         <div key={u} onClick={() => setUserQuery(u)} className="p-4 hover:bg-primary/20 rounded-xl cursor-pointer flex items-center justify-between text-white font-bold transition-colors">
                           {u} <CheckCircle2 size={16} className="text-primary"/>
                         </div>
                       ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4 block">3. Estilo da Partida</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div onClick={() => setMode('dueto')} className={`cursor-pointer group p-8 rounded-3xl border-2 flex flex-col items-center justify-center text-center transition-all duration-300 ${mode === 'dueto' ? 'bg-primary/20 border-primary shadow-[0_0_30px_rgba(0,168,225,0.4)] scale-105' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                      <Mic2 className={`h-12 w-12 mb-4 ${mode === 'dueto' ? 'text-primary' : 'text-gray-500'}`} />
                      <h3 className={`font-black text-2xl mb-2 ${mode === 'dueto' ? 'text-white' : 'text-gray-400'}`}>DUETO</h3>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed">Colaborativo. Cantem juntos e unam suas notas para um show incrível.</p>
                    </div>
                    <div onClick={() => setMode('batalha')} className={`cursor-pointer group p-8 rounded-3xl border-2 flex flex-col items-center justify-center text-center transition-all duration-300 ${mode === 'batalha' ? 'bg-destructive/20 border-destructive shadow-[0_0_30px_rgba(239,68,68,0.4)] scale-105' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                      <Swords className={`h-12 w-12 mb-4 ${mode === 'batalha' ? 'text-destructive' : 'text-gray-500'}`} />
                      <h3 className={`font-black text-2xl mb-2 ${mode === 'batalha' ? 'text-white' : 'text-gray-400'}`}>BATALHA</h3>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed">Competitivo. Desafie o oponente e descubra quem domina o palco.</p>
                    </div>
                  </div>
                </div>

                <Button onClick={() => setStatus('waiting')} className="w-full h-20 rounded-2xl font-black text-2xl bg-white text-black hover:bg-primary hover:scale-[1.02] transition-all mt-6 shadow-2xl">
                  <Send className="mr-3 h-6 w-6" /> ENVIAR CONVITE
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {status === 'waiting' && (
          <div className="flex flex-col items-center justify-center text-center pt-20 animate-in fade-in duration-500">
            <Loader2 className="h-24 w-24 text-primary animate-spin mb-10" />
            <h2 className="text-5xl font-black text-white mb-6 italic tracking-tighter uppercase">Aguardando Resposta...</h2>
            <div className="flex gap-4 p-6 border border-white/10 rounded-3xl bg-black/60">
               <Button onClick={() => setStatus('accepted')} variant="outline" className="border-green-500 text-green-400 font-bold px-6">Aceitar</Button>
               <Button onClick={() => setStatus('rejected')} variant="outline" className="border-destructive text-destructive font-bold px-6">Recusar</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Duel;