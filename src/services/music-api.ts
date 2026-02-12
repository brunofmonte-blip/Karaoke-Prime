import { PublicDomainSong, publicDomainLibrary } from '@/data/public-domain-library';

export interface SearchFilters {
  query: string;
  origin: 'Nacional' | 'Internacional' | 'All';
  genre?: string;
}

/**
 * Service to fetch and filter songs from the global content infrastructure.
 * In a production environment, this would call external APIs like Freemusicarchive.
 */
export const searchMusicLibrary = async (filters: SearchFilters): Promise<PublicDomainSong[]> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 300));

  let results = [...publicDomainLibrary];

  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(s => 
      s.title.toLowerCase().includes(q) || 
      s.artist.toLowerCase().includes(q)
    );
  }

  if (filters.origin !== 'All') {
    // Mock origin filtering: assuming certain IDs or genres are 'Nacional'
    const nacionalGenres = ['Folk/Traditional']; 
    if (filters.origin === 'Nacional') {
      results = results.filter(s => nacionalGenres.includes(s.genre));
    } else {
      results = results.filter(s => !nacionalGenres.includes(s.genre));
    }
  }

  return results;
};