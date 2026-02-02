import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './use-user-profile';

// Define a simplified ranking item type for display
export interface RankingItem extends Omit<UserProfile, 'id' | 'ranking_position'> {
  userId: string;
  userName: string;
  score: number;
  // We'll use a placeholder for the song since the profile table doesn't store the last song
  song: string; 
}

const fetchGlobalRankings = async (): Promise<RankingItem[]> => {
  // Fetch all profiles, ordered by best_note descending
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, best_note')
    .order('best_note', { ascending: false })
    .limit(50); // Fetch a reasonable limit

  if (error) {
    throw new Error(error.message);
  }

  // Map the raw profile data to the RankingItem structure
  return data.map(profile => ({
    userId: profile.id,
    userName: profile.username || 'Anonymous Singer',
    avatar_url: profile.avatar_url,
    score: profile.best_note || 0,
    song: "Karaoke Anthem", // Placeholder song name
  }));
};

export const useGlobalRankings = () => {
  return useQuery<RankingItem[], Error>({
    queryKey: ['globalRankings'],
    queryFn: fetchGlobalRankings,
    initialData: [],
    refetchInterval: 60000, // Refetch every minute for live updates
  });
};