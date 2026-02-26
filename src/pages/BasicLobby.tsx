"use client";

import React, { useState } from 'react';
import { Search, Globe, Download, Users, Lock, PlayCircle, Music, ArrowLeft, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const YOUTUBE_API_KEY = "AIzaSyBcRjgGXm-M6Q05F4dw3bEJmkpXMIV9Qvs";

const mockResults = [
  { id: 'tStNgmErrDA', title: 'Shallow (Karaoke)', artist: 'Lady Gaga', channel: 'Mock Studio' },
  { id: 'MvWE4YV7KtQ', title: 'Evidências (Karaoke)', artist: 'Chitãozinho & Xororó', channel: 'Mock Studio' },
  { id: 'HO8AZPOrJqQ', title: 'Asa Branca (Karaoke)', artist: 'Luiz Gonzaga', channel: 'Mock Studio' },
  { id: 'oVbXpK_BRbw', title: 'Bohemian Rhapsody (Karaoke)', artist: 'Queen', channel: 'Mock Studio' }
];

export default function BasicLobby() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(mockResults.slice(0, 2));
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'online' | 'offline' | 'duel'>('online');

  const handleSearch = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim() !== '') {
      setLoading(true);
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=8&q=${encodeURIComponent(query + ' karaoke')}&type=video&videoEmbeddable=true&key=${YOUTUBE_API_KEY}`
        );
        
        if (!response.ok) throw new Error("API Limit or Error");
        
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          const formattedResults = data.items.map((item: any) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            artist: item.snippet.channelTitle,
            channel: "YouTube Live"
          }));
          setResults(formattedResults);
          toast.success(`Encontramos ${formattedResults.length} resultados!`);
        } else {
          throw new Error("No results");
        }
      } catch (error) {
        console.warn("YouTube API failed, using mock fallback:", error);
        // Fallback to mock data filtered by query
        const filteredMock = mockResults.filter(m => 
          m.title.toLowerCase().includes(query.toLowerCase()) || 
          m.artist.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filteredMock.length > 0 ? filteredMock : mockResults);
        toast.info("Modo de Demonstração: Exibindo resultados sugeridos.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80')" }}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-0" />

      <div className="container mx-auto p-4 md:p-8 min-h-screen relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="rounded-full text-white hover:bg-white/10">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-4xl font-bold text-primary neon-blue-glow">Lobby de Karaokê</h1>
        </div>

        {/* Mode Selection */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-widest">Escolha o Modo de Jogo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card 
              className={cn(
                "cursor-pointer transition-all duration-300 border-2 bg-card/40 backdrop-blur-md",
                activeMode === 'online' ? "border-primary shadow-lg shadow-primary/20 scale-[1.02]" : "border-border/50 hover:border-primary/50"
              )}
              onClick={() => setActiveMode('online')}
            >
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Solo Online</h3>
                  <p className="text-sm text-muted-foreground">Cante com o catálogo completo do YouTube.</p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className={cn(
                "cursor-not-allowed transition-all duration-300 border-2 bg-card/20 backdrop-blur-md opacity-60",
                "border-border/50"
              )}
            >
              <CardContent className="p-6 flex flex-col items-center text-center gap-4 relative">
                <Lock className="absolute top-4 right-4 h-5 w-5 text-accent" />
                <div className="p-4 rounded-2xl bg-accent/10 border border-accent/30">
                  <Download className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Solo Offline</h3>
                  <p className="text-sm text-muted-foreground">Músicas baixadas (Premium).</p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className={cn(
                "cursor-pointer transition-all duration-300 border-2 bg-card/40 backdrop-blur-md",
                activeMode === 'duel' ? "border-primary shadow-lg shadow-primary/20 scale-[1.02]" : "border-border/50 hover:border-primary/50"
              )}
              onClick={() => setActiveMode('duel')}
            >
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Dueto / Batalha</h3>
                  <p className="text-sm text-muted-foreground">Cante com um amigo ou desafie o mundo.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Search Section */}
        <section className="max-w-3xl mx-auto">
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
            <Input 
              placeholder="Qual música vamos cantar hoje? (Pressione Enter)" 
              className="pl-12 h-16 text-lg rounded-2xl bg-card/50 border-primary/30 focus:border-primary transition-all text-white"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
            {loading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">
              {query ? 'Resultados da Busca' : 'Resultados Sugeridos'}
            </h3>
            {results.map((song) => (
              <div 
                key={song.id} 
                onClick={() => navigate(`/room?v=${song.id}`)} 
                className="block group cursor-pointer"
              >
                <Card className="border-border/50 bg-card/30 hover:bg-card/50 hover:border-primary/50 transition-all duration-300 rounded-2xl overflow-hidden">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Music className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white group-hover:text-primary transition-colors truncate" dangerouslySetInnerHTML={{ __html: song.title }} />
                        <p className="text-sm text-muted-foreground truncate">{song.artist} • <span className="text-xs opacity-70">{song.channel}</span></p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full group-hover:text-primary text-white flex-shrink-0">
                      <PlayCircle className="h-8 w-8" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}