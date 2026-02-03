import React, { useState, useMemo } from 'react';
import { publicDomainLibrary, PublicDomainSong } from '@/data/public-domain-library';
import SongCard from '@/components/SongCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import SongCategoryRow from '@/components/SongCategoryRow';

// Define the order of genres
const GENRE_ORDER: PublicDomainSong['genre'][] = [
  'Pop Anthems',
  'Rock Classics',
  'Folk/Traditional',
  'Vocal Exercises',
];

const Library: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSongs = useMemo(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    
    // 1. Filter by search term (title, artist, or genre)
    const filteredBySearch = publicDomainLibrary.filter(song => 
      song.title.toLowerCase().includes(lowerCaseSearch) ||
      song.artist.toLowerCase().includes(lowerCaseSearch) ||
      song.genre.toLowerCase().includes(lowerCaseSearch)
    );

    // 2. Group filtered songs by genre
    const groupedSongs = filteredBySearch.reduce((acc, song) => {
      const genre = song.genre;
      if (!acc[genre]) {
        acc[genre] = [];
      }
      acc[genre].push(song);
      return acc;
    }, {} as Record<PublicDomainSong['genre'], PublicDomainSong[]>);

    return groupedSongs;
  }, [searchTerm]);

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-[80vh]">
      <h1 className="text-4xl font-bold text-primary neon-blue-glow mb-6 text-center">
        Basic Karaoke Library
      </h1>
      <p className="text-lg text-muted-foreground mb-8 text-center">
        Explore public domain anthems and download your favorites for offline practice.
      </p>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-10 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by title, artist, or genre..."
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
          No songs found matching "{searchTerm}".
        </div>
      )}
    </div>
  );
};

export default Library;