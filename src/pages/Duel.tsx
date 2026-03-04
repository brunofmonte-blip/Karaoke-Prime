import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, UserPlus, Swords, Mic2, Send, Loader2, XCircle, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const Duel = () => {
  const navigate = useNavigate();
  // Status da tela: 'config' (configurando), 'waiting' (aguardando), 'rejected' (recusado), 'accepted' (aceito)
  const [status, setStatus] = useState<'config' | 'waiting' | 'rejected' | 'accepted'>('config');
  const [mode, setMode] = useState<'dueto' | 'batalha'>('batalha');

  const handleSendInvite = () => {
    setStatus('waiting');
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col p-4 md:p-8">
      <img src="https://images.unsplash.com/photo-1516280440502-a2f011ba2dc9?q=80&w=2000" alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-[0.15]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-background to-background z-0" />

      <div className="relative z-10 max-w-4xl mx-auto w-full pt-16">
        <button onClick={() => navigate('/basic')} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors">
          <ArrowLeft size={20} /> Voltar para o Lobby
        </button>

        {/* TELA 1: CONFIGURAÇÕES DA PARTIDA */}
        {status === 'config' && (
          <Card className="bg-black/60 border-white/10 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-500">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-black text-white mb-8 text-center tracking-tighter uppercase italic">Configurações da Partida</h2>
              
              <div className="space-y-8">
                {/* Selecionar Música */}
                <div>
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 block">1. Selecione a Música</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <Input placeholder="Buscar artista ou música..." className="pl-12 h-14 bg-black/40 border-white/20 text-white rounded-xl focus:border-primary text-lg" />
                  </div>
                </div>

                {/* Convidar Oponente */}
                <div>
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 block">2. Convide um Oponente ou Amigo</label>
                  <div className="relative">
                    <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <Input placeholder="Buscar por @username..." className="pl-12 h-14 bg-black/40 border-white/20 text-white rounded-xl focus:border-primary text-lg" />
                  </div>
                </div>

                {/* Modo de Jogo */}
                <div>
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 block">3. Modo de Jogo</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div onClick={() => setMode('dueto')} className={`cursor-pointer p-6 rounded-xl border-2 flex flex-col items-center justify-center text-center transition-all ${mode === 'dueto' ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(0,168,225,0.3)]' : 'bg-black/40 border-white/10 hover:bg-white/5'}`}>
                      <Mic2 className={`h-10 w-10 mb-3 ${mode === 'dueto' ? 'text-primary' : 'text-gray-400'}`} />
                      <h3 className={`font-black text-lg mb-1 ${mode === 'dueto' ? 'text-white' : 'text-gray-300'}`}>DUETO</h3>
                      <p className="text-xs text-gray-500">Colaborativo. Cantem juntos em harmonia.</p>
                    </div>
                    <div onClick={() => setMode('batalha')} className={`cursor-pointer p-6 rounded-xl border-2 flex flex-col items-center justify-center text-center transition-all ${mode === 'batalha' ? 'bg-destructive/20 border-destructive shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-black/40 border-white/10 hover:bg-white/5'}`}>
                      <Swords className={`h-10 w-10 mb-3 ${mode === 'batalha' ? 'text-destructive' : 'text-gray-400'}`} />
                      <h3 className={`font-black text-lg mb-1 ${mode === 'batalha' ? 'text-white' : 'text-gray-300'}`}>BATALHA</h3>
                      <p className="text-xs text-gray-500">Competitivo. Quem atinge a maior nota?</p>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSendInvite} className="w-full h-16 rounded-xl font-black text-lg bg-white text-black hover:bg-primary transition-colors mt-4">
                  <Send className="mr-2 h-5 w-5" /> ENVIAR CONVITE
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TELA 2: AGUARDANDO OPONENTE */}
        {status === 'waiting' && (
          <div className="flex flex-col items-center justify-center text-center pt-20 animate-in fade-in duration-500">
            <Loader2 className="h-20 w-20 text-primary animate-spin mb-8" />
            <h2 className="text-4xl font-black text-white mb-4">Aguardando Resposta...</h2>
            <p className="text-gray-400 text-lg mb-16">O convite foi enviado para o usuário. Assim que ele aceitar, a música vai começar!</p>
            
            {/* Botões Escondidos (Apenas para você testar a interface visualmente) */}
            <div className="flex gap-4 p-4 border border-white/10 rounded-xl bg-white/5">
               <p className="text-xs text-gray-500 font-bold uppercase mr-4 flex items-center">Painel de Teste Visual:</p>
               <Button onClick={() => setStatus('accepted')} variant="outline" className="border-green-500 text-green-400 hover:bg-green-500 hover:text-black">Simular: Aceitou</Button>
               <Button onClick={() => setStatus('rejected')} variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-white">Simular: Recusou</Button>
            </div>
          </div>
        )}

        {/* TELA 3: CONVITE RECUSADO */}
        {status === 'rejected' && (
          <div className="flex flex-col items-center justify-center text-center pt-20 animate-in zoom-in duration-500">
            <XCircle className="h-24 w-24 text-destructive mb-8 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
            <h2 className="text-5xl font-black text-white mb-4">Convite Recusado</h2>
            <p className="text-gray-400 text-lg mb-10">O usuário está ocupado ou não pôde aceitar no momento.</p>
            <Button onClick={() => setStatus('config')} className="h-14 px-8 rounded-full font-bold text-black bg-primary hover:bg-primary/80">
              <Search className="mr-2 h-5 w-5" /> Convidar outro Cantor
            </Button>
          </div>
        )}

        {/* TELA 4: CONVITE ACEITO (Música Iniciando) */}
        {status === 'accepted' && (
          <div className="flex flex-col items-center justify-center text-center pt-20 animate-in zoom-in duration-500">
            <PlayCircle className="h-24 w-24 text-green-400 mb-8 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]" />
            <h2 className="text-5xl font-black text-white mb-4 italic uppercase">Desafio Aceito!</h2>
            <p className="text-green-400 text-lg mb-10 font-bold tracking-widest uppercase">Iniciando a sala de duelo...</p>
            <Button onClick={() => setStatus('config')} variant="outline" className="border-white/20 text-gray-300 hover:text-white">
              Voltar (Modo Teste)
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Duel;