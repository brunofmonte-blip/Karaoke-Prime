import React from 'react';
import { PublicDomainSong } from '@/data/public-domain-library';
import SongCard from './SongCard';
import { cn } from '@/lib/utils';

interface SongCategoryRowProps {
  title: string;
  songs: PublicDomainSong[];
}

const SongCategoryRow: React.FC<SongCategoryRowProps> = ({ title, songs }) => {
  if (songs.length === 0) return null;

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold text-left mb-4 text-foreground neon-blue-glow">
        {title}
      </h2>
      <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0">
        {songs.map(song => (
          <div key={song.id} className="flex-shrink-0 w-[200px]">
            <SongCard song={song} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongCategoryRow;