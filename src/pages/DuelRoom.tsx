import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sword, Trophy, ArrowLeft, Mic, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useVocalSandbox } from '@/hooks/use-vocal-sandbox';
import { useDuel } from '@/hooks/use-duel-engine';
import VocalEvolutionChart from '@/components/VocalEvolutionChart';
import { Progress } from '@/components/ui/progress';

const DuelRoom = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const songId = searchParams.get('id');
  
  const { 
    isAnalyzing, 
    stopAnalysis, 
    pitchHistory, 
    ghostTrace, 
    currentTime, 
    totalDuration,
    pitchData,
    isPitchStable
  } = useVocalSandbox();
  
  const { duelSong, clearDuel } = useDuel();

  // O "Passe VIP": Cria os dados da música se vier do clique no Lobby
  const activeSong = duelSong || (songId ? { 
    title: 'Desafio Global', 
    artist: 'Adversário IA', 
    difficulty: 'Hard', 
    videoId: songId, 
    lyrics: [] 
  } : null);

  // O Novo Leão de Chácara (mais tolerante)
  useEffect(() => {
    if (!activeSong) {
      navigate('/duel');
    }
  }, [activeSong, navigate]);

  const handleExit = () => {
    stopAnalysis();
    clearDuel();
    navigate('/duel');
  };

  if (!activeSong) return null;

  const progressValue = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;
  
  const userScore = Math.floor(pitchHistory.reduce((acc, curr) => acc + curr.pitch, 0) / (pitchHistory.length || 1)) * 10 || 0;
  const aiScore = Math.floor(ghostTrace.slice(0, pitchHistory.length).reduce((acc, curr) => acc + curr.pitch, 0) / (pitchHistory.length || 1)) * 10 || 0;

  return (
    <div className="min-h-screen bg-background flex flex-col p-4 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_70%)] pointer-events-none" />
      
      <div className="flex justify-between items-center mb-8 relative z-10">
        <Button variant="ghost" onClick={handleExit} className="text-muted-foreground hover:text-destructive">
          <ArrowLeft className="mr-2 h-5 w-5" /> Abandonar Batalha
        </Button>
        
        <div className="flex flex-col items-center">
          <div className="px-6 py-2 rounded-full bg-destructive/20 border-2 border-destructive shadow-[0_0_20px_rgba(220,38,38,0.3)] flex items-center gap-3">
            <Sword className="h-5 w-5 text-destructive animate-pulse" />
            <span className="text-lg font-black text-white italic uppercase tracking-tighter">Duel Arena</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2 font-bold uppercase tracking-widest">
            {activeSong.title} — {activeSong.artist}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs font-black text-white uppercase tracking-widest">Live Battle</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow relative z-10">
        
        {/* Painel do Usuário */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="glass-pillar border-primary/50 overflow-hidden rounded-3xl shadow-2xl">
            <CardContent className="p-6 text-center">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Seu Score</p>
              <div className="relative inline-block">
                <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full animate-pulse" />
                <span className="text-6xl font-black text-white relative z-10 tabular-nums">{userScore}</span>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-xs font-bold uppercase text-muted-foreground">
                  <span>Estabilidade</span>
                  <span className={cn(isPitchStable ? "text-green-400" : "text-primary")}>{isPitchStable ? "PERFEITA" : "OSCILANDO"}</span>
                </div>
                <Progress value={pitchData} className="h-1.5 bg-primary/10" indicatorClassName="bg-primary shadow-[0_0_10px_rgba(0,168,225,0.8)]" />
              </div>
            </CardContent>
          </Card>

          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Mic className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase">Input Ativo</p>
              <p className="text-sm font-bold text-white">Microfone Padrão</p>
            </div>
          </div>
        </div>

        {/* Centro: O Player de YouTube! */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="aspect-video rounded-3xl overflow-hidden border-2 border-destructive/30 shadow-2xl bg-black w-full relative z-20">
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${activeSong.videoId}?autoplay=1&modestbranding=1&rel=0&origin=${window.location.origin}`} 
              title="Duel Video" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>

          <div className="flex-grow min-h-[200px]">
            <VocalEvolutionChart 
              title="Sincronia de Batalha (Você vs AI)" 
              data={pitchHistory} 
              opponentTrace={ghostTrace}
            />
          </div>
        </div>

        {/* Painel da IA */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="glass-pillar border-destructive/50 overflow-hidden rounded-3xl shadow-2xl">
            <CardContent className="p-6 text-center">
              <p className="text-[10px] font-black text-destructive uppercase tracking-[0.2em] mb-4">AI Opponent</p>
              <div className="relative inline-block">
                <div className="absolute inset-0 blur-xl bg-destructive/20 rounded-full animate-pulse" />
                <span className="text-6xl font-black text-white relative z-10 tabular-nums">{aiScore}</span>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-xs font-bold uppercase text-muted-foreground">
                  <span>Dificuldade</span>
                  <span className="text-destructive">{activeSong.difficulty}</span>
                </div>
                <div className="flex gap-1 justify-center">
                  {[...Array(3)].map((_, i) => (
                    <Flame key={i} className="h-4 w-4 text-destructive fill-destructive" />
                  ))}
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