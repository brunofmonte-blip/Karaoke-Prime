import React, { useState, useMemo } from 'react';
import { publicDomainLibrary, PublicDomainSong } from '@/data/public-domain-library';
import SongCard from '@/components/SongCard';
import { Input } from '@/components/ui/input';
import { Search, Globe, Download, Users, PlayCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import SongCategoryRow from '@/components/SongCategoryRow';
import { Button } from '@/components/ui/button';

const GENRE_ORDER: PublicDomainSong['genre'][] = [
  'Pop Anthems',
  'Rock Classics',
  'Folk/Traditional',
  'Vocal Exercises',
];

const Library: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'offline' | 'duel'>('all');

  const filteredSongs = useMemo(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    
    let results = publicDomainLibrary.filter(song => 
      song.title.toLowerCase().includes(lowerCaseSearch) ||
      song.artist.toLowerCase().includes(lowerCaseSearch) ||
      song.genre.toLowerCase().includes(lowerCaseSearch)
    );

    if (activeFilter === 'offline') {
      // Mock offline filter: in a real app, this would check local storage
      results = results.slice(0, 3); 
    }

    const groupedSongs = results.reduce((acc, song) => {
      const genre = song.genre;
      if (!acc[genre]) {
        acc[genre] = [];
      }
      acc[genre].push(song);
      return acc;
    }, {} as Record<PublicDomainSong['genre'], PublicDomainSong[]>);

    return groupedSongs;
  }, [searchTerm, activeFilter]);

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-[80vh]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary neon-blue-glow mb-4">
          Modo Básico
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Escolha como você quer brilhar hoje. Do streaming online ao desafio de duelos.
        </p>
      </div>

      {/* Mode Selection Menu */}
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
            <p className="text-xs text-muted-foreground">Acesso total à biblioteca</p>
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
          onClick={() => setActiveFilter('duel')}
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

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-10 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por título, artista ou gênero..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={cn(
            "w-full pl-10 pr-4 py-3 rounded-xl border-2 border-border/50 bg-card/50 backdrop-blur-md",
            "focus:border-primary transition-all duration-300"
          )}
        />
      </div>

      {/* Song Categories */}
      <div className="space-y-8">
        {GENRE_ORDER.map(genre => {
          const songs = filteredSongs[genre] || [];
          return (
            <SongCategoryRow 
              key={genre} 
              title={genre} 
              songs={songs} 
            />
          );
        })}
      </div>

      {Object.keys(filteredSongs).length === 0 && (
        <div className="text-center p-10 text-muted-foreground">
          Nenhuma música encontrada para "{searchTerm}".
        </div>
      )}
    </div>
  );
};

export default Library;