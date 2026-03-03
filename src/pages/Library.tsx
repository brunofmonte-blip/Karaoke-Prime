"use client";

import React, { useState, useMemo } from 'react';
import { Library as LibraryIcon, Search, Music, Filter, Disc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { publicDomainLibrary } from '@/data/public-domain-library';
import SongCategoryRow from '@/components/SongCategoryRow';
import SongCard from '@/components/SongCard';
import { cn } from '@/lib/utils';

const Library = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredSongs = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    return publicDomainLibrary.filter(song => 
      song.title.toLowerCase().includes(query) || 
      song.artist.toLowerCase().includes(query) ||
      song.genre.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const genres = ['Rock Classics', 'Pop Anthems', 'Folk/Traditional', 'Vocal Exercises'] as const;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Section */}
      <div className="relative h-[30vh] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center z-0 opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2000')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/80 to-background z-10" />
        <div className="relative z-20 text-center px-4">
          <div className="inline-flex p-4 rounded-2xl bg-accent/20 border-2 border-accent mb-4 shadow-[0_0_30px_rgba(255,153,0,0.3)]">
            <LibraryIcon className="h-10 w-10 text-accent animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic">
            Song <span className="text-accent neon-gold-glow">Library</span>
          </h1>
          <p className="text-gray-400 font-medium tracking-widest uppercase text-xs md:text-sm mt-2">
            Explore milhares de faixas com análise de tom
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 -mt-10 relative z-30">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
          <Input 
            placeholder="Buscar por música, artista ou gênero..." 
            className="pl-12 h-16 text-lg rounded-2xl bg-card/50 border-accent/30 focus:border-accent transition-all text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredSongs ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-2 text-accent mb-6">
              <Filter className="h-5 w-5" />
              <h2 className="text-xl font-bold uppercase tracking-widest">Resultados da Busca</h2>
            </div>
            {filteredSongs.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredSongs.map(song => (
                  <SongCard key={song.id} song={song} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 glass-pillar rounded-3xl border-2 border-white/5">
                <Disc className="h-16 w-16 text-gray-600 mx-auto mb-4 animate-spin-slow" />
                <p className="text-xl text-gray-400">Nenhuma música encontrada para "{searchQuery}"</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {genres.map(genre => (
              <SongCategoryRow 
                key={genre} 
                title={genre} 
                songs={publicDomainLibrary.filter(s => s.genre === genre)} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;