"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sword, Trophy, ArrowLeft, Mic, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

const DuelRoom = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const songId = searchParams.get('id');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasMediaAccess, setHasMediaAccess] = useState(false);

  // Redireciona de volta se tentar entrar sem escolher música
  useEffect(() => {
    if (!songId) {
      navigate('/duel');
    }
  }, [songId, navigate]);

  // Ativando Câmera e Microfone
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const enableMedia = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setHasMediaAccess(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Usuário negou ou falhou acesso à câmera/mic:", err);
      }
    };
    
    enableMedia();
    
    // Desliga a câmera ao sair da página
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  if (!songId) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col p-4 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_70%)] pointer-events-none" />
      
      <div className="flex justify-between items-center mb-8 relative z-10">
        <Button variant="ghost" onClick={() => navigate('/duel')} className="text-muted-foreground hover:text-destructive">
          <ArrowLeft className="mr-2 h-5 w-5" /> Abandonar Batalha
        </Button>
        
        <div className="flex flex-col items-center">
          <div className="px-6 py-2 rounded-full bg-destructive/20 border-2 border-destructive shadow-[0_0_20px_rgba(220,38,38,0.3)] flex items-center gap-3">
            <Sword className="h-5 w-5 text-destructive animate-pulse" />
            <span className="text-lg font-black text-white italic uppercase tracking-tighter">Duel Arena</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs font-black text-white uppercase tracking-widest">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow relative z-10">
        
        {/* Painel do Usuário (Esquerda) */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="glass-pillar border-primary/50 overflow-hidden rounded-3xl shadow-2xl">
            <CardContent className="p-6 text-center">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Seu Score</p>
              <div className="relative inline-block">
                <span className="text-6xl font-black text-white relative z-10 tabular-nums">0</span>
              </div>
              
              {/* Onde a Câmera do Usuário vai aparecer */}
              <div className="mt-6 w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary bg-black shadow-[0_0_20px_rgba(0,168,225,0.4)]">
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                {!hasMediaAccess && <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">Sem Câmera</div>}
              </div>
              
            </CardContent>
          </Card>

          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Mic className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase">Input Ativo</p>
              <p className="text-sm font-bold text-white">{hasMediaAccess ? "Microfone Liberado" : "Aguardando Permissão"}</p>
            </div>
          </div>
        </div>

        {/* Centro: O Player de YouTube */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="aspect-video rounded-3xl overflow-hidden border-2 border-destructive/30 shadow-2xl bg-black w-full relative z-20">
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${songId}?autoplay=1&modestbranding=1&rel=0`} 
              title="YouTube Player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Painel da IA (Direita) */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="glass-pillar border-destructive/50 overflow-hidden rounded-3xl shadow-2xl">
            <CardContent className="p-6 text-center">
              <p className="text-[10px] font-black text-destructive uppercase tracking-[0.2em] mb-4">AI Opponent</p>
              <div className="relative inline-block">
                <span className="text-6xl font-black text-white relative z-10 tabular-nums">0</span>
              </div>
              
              <div className="mt-6 w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-destructive bg-black flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                <div className="text-destructive flex gap-1">
                  <Flame className="animate-pulse w-8 h-8 fill-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-destructive/10 border border-destructive/30 text-center">
            <Trophy className="h-8 w-8 text-destructive mx-auto mb-2" />
            <h4 className="text-sm font-black text-white uppercase italic">Prêmio da Vitória</h4>
            <p className="text-xs text-gray-400 mt-1">+50 XP & Badge Duelist</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DuelRoom;