import { allBadges, Badge, BadgeId } from '@/data/badges';
import { PublicDomainSong, publicDomainLibrary } from '@/data/public-domain-library';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/hooks/use-user-profile';
import { toast } from 'sonner';

// --- Client-side Tracking Keys ---
const COMPLETED_SONGS_KEY = 'karaoke_completed_songs';
const DUEL_WINS_KEY = 'karaoke_duel_wins';

// Helper to get/set client-side tracking data
const getClientTracking = (key: string): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error(`[BadgeLogic] Error reading ${key}:`, e);
    return [];
  }
};

const setClientTracking = (key: string, data: string[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`[BadgeLogic] Error writing ${key}:`, e);
  }
};

// --- Core Logic ---

/**
 * Checks for and unlocks badges based on a single performance session.
 * @returns Array of newly unlocked BadgeIds.
 */
export const checkAndUnlockBadges = async (
  userId: string,
  profile: UserProfile,
  song: PublicDomainSong,
  pitchAccuracy: number,
  isDuelWin: boolean = false
): Promise<BadgeId[]> => {
  
  const newlyUnlocked: BadgeId[] = [];
  const currentBadges = new Set(profile.badges || []);
  
  // 1. Update client-side tracking for song completion
  const completedSongs = getClientTracking(COMPLETED_SONGS_KEY);
  if (!completedSongs.includes(song.id)) {
    setClientTracking(COMPLETED_SONGS_KEY, [...completedSongs, song.id]);
  }
  
  // 2. Update client-side tracking for duel wins
  if (isDuelWin) {
    const duelWins = getClientTracking(DUEL_WINS_KEY);
    setClientTracking(DUEL_WINS_KEY, [...duelWins, `win-${Date.now()}`]); // Add a unique win marker
  }

  // 3. Check all badges
  for (const badge of allBadges) {
    if (currentBadges.has(badge.id)) continue; // Skip already earned badges

    let criteriaMet = false;

    switch (badge.criteria.type) {
      case 'first_session':
        // Check if this is the first session (or if the user has no XP yet)
        if (profile.xp === 0 && pitchAccuracy > 0) {
            criteriaMet = true;
        }
        break;
        
      case 'perfect_score':
        if (pitchAccuracy >= badge.criteria.value) {
          criteriaMet = true;
        }
        break;
        
      case 'song_count':
        if (badge.criteria.genre === song.genre) {
          // Count how many songs of this genre the user has completed
          const genreSongs = publicDomainLibrary.filter(s => s.genre === badge.criteria.genre);
          const completedGenreSongs = completedSongs.filter(id => genreSongs.some(s => s.id === id));
          
          if (completedGenreSongs.length >= badge.criteria.value) {
            criteriaMet = true;
          }
        }
        break;
        
      case 'duel_wins':
        const totalWins = getClientTracking(DUEL_WINS_KEY).length;
        if (totalWins >= badge.criteria.value) {
          criteriaMet = true;
        }
        break;
        
      case 'language_count':
        // Mock language tracking based on song IDs (e.g., pd-15 is German, pd-19 is Italian, pd-20 is Portuguese)
        const languageSongs = publicDomainLibrary.filter(s => 
            s.id === 'pd-15' || s.id === 'pd-19' || s.id === 'pd-20' || s.id === 'pd-17'
        );
        const completedLanguageSongs = completedSongs.filter(id => languageSongs.some(s => s.id === id));
        
        // Use a Set to count unique languages (mocked by song ID groups)
        const uniqueLanguages = new Set<string>();
        if (completedLanguageSongs.includes('pd-15')) uniqueLanguages.add('German');
        if (completedLanguageSongs.includes('pd-19')) uniqueLanguages.add('Italian');
        if (completedLanguageSongs.includes('pd-20')) uniqueLanguages.add('Portuguese');
        if (completedLanguageSongs.includes('pd-17')) uniqueLanguages.add('English');

        if (uniqueLanguages.size >= badge.criteria.value) {
          criteriaMet = true;
        }
        break;
    }

    if (criteriaMet) {
      newlyUnlocked.push(badge.id);
    }
  }
  
  // 4. Persist newly unlocked badges to Supabase
  if (newlyUnlocked.length > 0) {
    const updatedBadges = [...profile.badges, ...newlyUnlocked];
    
    const { error } = await supabase
      .from('profiles')
      .update({ badges: updatedBadges })
      .eq('id', userId);

    if (error) {
      toast.error("Failed to save new badges.", { description: error.message });
      return [];
    }
  }

  return newlyUnlocked;
};