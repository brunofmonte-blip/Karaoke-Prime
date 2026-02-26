"use client";

import React, { useState, useEffect } from 'react';
import { Search, Globe, Download, Users, PlayCircle, Loader2, Music } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { searchYoutubeVideos } from '@/services/youtubeService';

const PRIORITY_CHANNELS = ["@ViguibaKaraoke", "@ClubinhodoKaraoke", "@singerkaraoke", "@singkingkaraoke"];

const Library: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'offline' | 'duel'>('all');
  const navigate = useNavigate();

  const searchSongs = async (searchQuery: string = "") => {
    setIsLoading(true);
    try {
      const enhancedQuery = `${searchQuery} karaoke ${PRIORITY_CHANNELS.join(" ")}`;
      const data = await searchYoutubeVideos(enhancedQuery, 12);
      
      if (data.items && data.items.length > 0) {
        setResults(data.items);
      } else {
        toast.error("Nenhum resultado encontrado.");
      }
    } catch (error) {
      console.error("Library search failed:", error);
      toast.error("Erro ao carregar biblioteca.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    searchSongs("popular");
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchSongs(query);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-[80vh]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary neon-blue-glow mb-4">
          Busca em Tempo Real
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore milhões de faixas de karaoke via YouTube Engine.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Button 
          onClick={() => setActiveFilter('all')}
          variant="outline"
          className={cn(
            "h-32 rounded-2xl border-2 flex flex-col gap-2 transition-all duration-300",
            activeFilter === 'all' ? "border-primary bg-primary/10 shadow-lg shadow-primary/20" : "border-border/50 hover:border-primary/50"
          )}
        >
          <Globe className="h-8 w-8 text-primary" />
          <div className="text-center">
            <p className="font-bold text-lg">Cantar Online</p>
            <p className="text-xs text-muted-foreground">YouTube Search Engine</p>
          </div>
        </Button>

        <Button 
          onClick={() => setActiveFilter('offline')}
          variant="outline"
          className={cn(
            "h-32 rounded-2xl border-2 flex flex-col gap-2 transition-all duration-300",
            activeFilter === 'offline' ? "border-accent bg-accent/10 shadow-lg shadow-accent/20" : "border-border/50 hover:border-accent/50"
          )}
        >
          <Download className="h-8 w-8 text-accent" />
          <div className="text-center">
            <p className="font-bold text-lg">Cantar Offline</p>
            <p className="text-xs text-muted-foreground">Músicas baixadas</p>
          </div>
        </Button>

        <Button 
          onClick={() => navigate('/duel')}
          variant="outline"
          className={cn(
            "h-32 rounded-2xl border-2 flex flex-col gap-2 transition-all duration-300",
            activeFilter === 'duel' ? "border-destructive bg-destructive/10 shadow-lg shadow-destructive/20" : "border-border/50 hover:border-destructive/50"
          )}
        >
          <Users className="h-8 w-8 text-destructive" />
          <div className="text-center">
            <p className="font-bold text-lg">Duelo</p>
            <p className="text-xs text-muted-foreground">Desafie amigos ou a AI</p>
          </div>
        </Button>
      </div>

      <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto mb-10 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="O que você quer cantar hoje?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={cn(
            "w-full pl-10 pr-4 py-3 rounded-xl border-2 border-border/50 bg-card/50 backdrop-blur-md",
            "focus:border-primary transition-all duration-300"
          )}
        />
        <Button 
          type="submit" 
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 bg-primary text-primary-foreground rounded-lg"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buscar"}
        </Button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map((item) => (
          <Card key={item.id.videoId} className={cn(
            "rounded-xl overflow-hidden border-2 border-border/50 transition-all duration-300 flex flex-col h-full",
            "bg-card/50 backdrop-blur-md hover:border-primary hover:shadow-primary/50 shadow-lg"
          )}>
            <div 
              className="h-40 bg-cover bg-center relative group cursor-pointer"
              style={{ backgroundImage: `url(${item.snippet.thumbnails.high.url})` }}
              onClick={() => navigate(`/song/${item.id.videoId}`)}
            >
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <PlayCircle className="h-12 w-12 text-primary icon-neon-glow" />
              </div>
            </div>
            <CardContent className="p-4 flex flex-col flex-grow justify-between">
              <div>
                <h3 className="text-sm font-bold text-primary line-clamp-2 mb-1">{item.snippet.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">{item.snippet.channelTitle}</p>
              </div>
              <Button 
                onClick={() => navigate(`/song/${item.id.videoId}`)}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg shadow-md shadow-accent/30 h-9"
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Cantar Agora
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {results.length === 0 && !isLoading && (
        <div className="text-center p-10 text-muted-foreground flex flex-col items-center gap-4">
          <Music className="h-12 w-12 opacity-20" />
          <p>Nenhuma música encontrada. Tente buscar por um artista ou título.</p>
        </div>
      )}
    </div>
  );
};

export default Library;