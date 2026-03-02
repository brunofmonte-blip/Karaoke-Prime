"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Users, Trophy, Sword, ArrowLeft, Search, Flame, Star, Zap, PlayCircle, Loader2, Mic, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useUserProfile } from '@/hooks/use-user-profile';
import { searchYouTube } from '@/services/youtubeService';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

const Duel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('v');
  const { data: profile } = useUserProfile();
  
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // --- LÓGICA DO LOBBY (BUSCA) ---
  const performSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      const items = await searchYouTube(searchTerm + ' karaoke');
      setResults(items || []);
    } catch (error) {
      toast.error("Erro na busca do YouTube.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!videoId) {
      performSearch("popular");
    }
  }, [videoId, performSearch]);

  const handleSelectDuel = (vId: string) => {
    navigate('/duel?v=' + vId);
  };

  // --- RENDERIZAÇÃO DA ARENA DE DUELO ---
  if (videoId) {
    return (
      <div className="min-h-screen bg-background flex flex-col p-4 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_70%)] pointer-events-none" />
        
        <div className="flex justify-between items-center mb-8 relative z-10">
          <Button variant="ghost" onClick={() => navigate('/duel')} className="text-muted-foreground hover:text-destructive">
            <ArrowLeft className="mr-2 h-5 w-5" /> Sair do Duelo
          </Button>
          
          <div className="px-6 py-2 rounded-full bg-destructive/20 border-2 border-destructive shadow-[0_0_20px_rgba(220,38,38,0.3)] flex items-center gap-3">
            <Sword className="h-5 w-5 text-destructive animate-pulse" />
            <span className="text-lg font-black text-white italic uppercase tracking-tighter">Duel Arena</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs font-black text-white uppercase tracking-widest">Live Battle</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow relative z-10">
          {/* Player Central */}
          <div className="lg:col-span-9 aspect-video rounded-3xl overflow-hidden border-2 border-destructive/30 shadow-2xl bg-black">
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&enablejsapi=1&origin=${window.location.origin}`} 
              title="Duel Video" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>

          {/* Stats Lateral */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="glass-pillar border-primary/50 p-6 text-center">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Seu Score</p>
              <span className="text-5xl font-black text-white tabular-nums">0</span>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                  <span>Estabilidade</span>
                  <span className="text-green-400">ANALISANDO...</span>
                </div>
                <Progress value={40} className="h-1 bg-primary/10" indicatorClassName="bg-primary" />
              </div>
            </Card>

            <Card className="glass-pillar border-destructive/50 p-6 text-center">
              <p className="text-[10px] font-black text-destructive uppercase tracking-widest mb-2">AI Opponent</p>
              <span className="text-5xl font-black text-white tabular-nums">0</span>
              <div className="mt-4 flex justify-center gap-1">
                <Flame className="h-4 w-4 text-destructive fill-destructive" />
                <Flame className="h-4 w-4 text-destructive fill-destructive" />
                <Flame className="h-4 w-4 text-destructive fill-destructive" />
              </div>
            </Card>

            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center gap-3">
              <Mic className="h-5 w-5 text-primary" />
              <span className="text-xs font-bold text-white uppercase">Vocal Engine Ativo</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDERIZAÇÃO DO LOBBY ---
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative h-[35vh] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center z-0 opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2000')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/80 to-background z-10" />
        <div className="relative z-20 text-center px-4">
          <div className="inline-flex p-4 rounded-2xl bg-destructive/20 border-2 border-destructive mb-4 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
            <Sword className="h-10 w-10 text-destructive animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic">
            Duel <span className="text-destructive neon-red-glow">Arena</span>
          </h1>
          <p className="text-gray-400 font-medium tracking-widest uppercase text-xs md:text-sm mt-2">Busque uma música e desafie a IA</p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 -mt-10 relative z-30">
        <div className="max-w-2xl mx-auto mb-12 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
          <Input 
            placeholder="Buscar música para o duelo..." 
            className="pl-12 h-16 text-lg rounded-2xl bg-card/50 border-destructive/30 focus:border-destructive transition-all text-white"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && performSearch(query)}
          />
          {loading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-destructive animate-spin" />}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((song) => (
            <Card key={song.id.videoId} className="group overflow-hidden border-2 border-white/5 bg-card/30 hover:border-destructive/50 transition-all duration-500 rounded-2xl flex flex-col">
              <div 
                className="h-40 bg-cover bg-center relative cursor-pointer"
                style={{ backgroundImage: `url(${song.snippet.thumbnails.high.url})` }}
                onClick={() => handleSelectDuel(song.id.videoId)}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <PlayCircle className="h-12 w-12 text-destructive" />
                </div>
              </div>
              <CardContent className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white line-clamp-2 mb-1" dangerouslySetInnerHTML={{ __html: song.snippet.title }} />
                  <p className="text-xs text-gray-500 mb-4">{song.snippet.channelTitle}</p>
                </div>
                <Button 
                  onClick={() => handleSelectDuel(song.id.videoId)}
                  className="w-full bg-destructive hover:bg-destructive/90 text-white font-bold rounded-xl shadow-lg shadow-destructive/20"
                >
                  <Sword className="h-4 w-4 mr-2" />
                  DUELAR AGORA
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Duel;