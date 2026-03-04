"use client";

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sword, Search, UserPlus, Music, ArrowLeft, Loader2, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { searchYouTube } from '@/services/youtubeService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Duel = () => {
  const navigate = useNavigate();
  const [songQuery, setSongQuery] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [songResults, setSongResults] = useState<any[]>([]);
  const [loadingSongs, setLoadingSongs] = useState(false);
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleSongSearch = useCallback(async () => {
    if (!songQuery.trim()) return;
    setLoadingSongs(true);
    try {
      const items = await searchYouTube(songQuery + ' karaoke');
      setSongResults(items || []);
    } catch (error) {
      toast.error("Erro na busca do YouTube.");
    } finally {
      setLoadingSongs(false);
    }
  }, [songQuery]);

  const handleStartDuel = () => {
    if (!selectedSong) {
      toast.error("Selecione uma música primeiro!");
      return;
    }
    const videoId = selectedSong.id?.videoId;
    navigate(`/duel-room?id=${videoId}${selectedUser ? `&opponent=${selectedUser}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative h-[30vh] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center z-0 opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2000')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/80 to-background z-10" />
        <div className="relative z-20 text-center px-4">
          <div className="inline-flex p-4 rounded-2xl bg-destructive/20 border-2 border-destructive mb-4 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
            <Sword className="h-10 w-10 text-destructive animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic">
            Configurações <span className="text-destructive neon-red-glow">da Batalha</span>
          </h1>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 -mt-10 relative z-30 space-y-8">
        <Button variant="ghost" onClick={() => navigate('/basic')} className="text-muted-foreground hover:text-white">
          <ArrowLeft className="mr-2 h-5 w-5" /> Voltar ao Lobby
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Song Selection */}
          <Card className="glass-pillar border-2 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Music className="h-5 w-5 text-primary" />
                1. Escolha a Música
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Buscar música..." 
                  className="pl-10 h-12 rounded-xl bg-black/50 border-white/10 focus:border-primary"
                  value={songQuery}
                  onChange={(e) => setSongQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSongSearch()}
                />
                {loadingSongs && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-primary" />}
              </div>

              <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {songResults.map((song) => (
                  <div 
                    key={song.id?.videoId}
                    onClick={() => setSelectedSong(song)}
                    className={cn(
                      "p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4",
                      selectedSong?.id?.videoId === song.id?.videoId 
                        ? "border-primary bg-primary/10" 
                        : "border-white/5 bg-white/5 hover:bg-white/10"
                    )}
                  >
                    <img src={song.snippet?.thumbnails?.default?.url} className="h-12 w-12 rounded-lg object-cover" alt="" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate" dangerouslySetInnerHTML={{ __html: song.snippet?.title }} />
                      <p className="text-xs text-gray-500 truncate">{song.snippet?.channelTitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Opponent Selection */}
          <div className="space-y-8">
            <Card className="glass-pillar border-2 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-accent" />
                  2. Convide um Oponente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar usuário por ID ou Nome..." 
                    className="pl-10 h-12 rounded-xl bg-black/50 border-white/10 focus:border-accent"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                  />
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <p className="text-xs text-gray-500 italic">Ou desafie o AI Opponent por padrão</p>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleStartDuel}
              disabled={!selectedSong}
              className="w-full py-12 rounded-3xl bg-destructive hover:bg-destructive/90 text-white font-black text-2xl shadow-2xl shadow-destructive/30 transition-all hover:scale-[1.02]"
            >
              <Sword className="mr-4 h-8 w-8" />
              INICIAR DUELO
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Duel;