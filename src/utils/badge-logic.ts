import { allBadges, Badge, BadgeId } from '@/data/badges';
import { PublicDomainSong, publicDomainLibrary } from '@/data/public-domain-library';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/hooks/use-user-profile';
import { toast } from 'sonner';

const COMPLETED_SONGS_KEY = 'karaoke_completed_songs';
const DUEL_WINS_KEY = 'karaoke_duel_wins';

const getClientTracking = (key: string): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

const setClientTracking = (key: string, data: string[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {}
};

export const checkAndUnlockBadges = async (
  userId: string,
  profile: UserProfile,
  song: PublicDomainSong,
  pitchAccuracy: number,
  isDuelWin: boolean = false
): Promise<BadgeId[]> => {
  
  const newlyUnlocked: BadgeId[] = [];
  const currentBadges = new Set(profile.badges || []);
  
  const completedSongs = getClientTracking(COMPLETED_SONGS_KEY);
  if (!completedSongs.includes(song.id)) {
    setClientTracking(COMPLETED_SONGS_KEY, [...completedSongs, song.id]);
  }
  
  if (isDuelWin) {
    const duelWins = getClientTracking(DUEL_WINS_KEY);
    setClientTracking(DUEL_WINS_KEY, [...duelWins, `win-${Date.now()}`]);
  }

  for (const badge of allBadges) {
    if (currentBadges.has(badge.id)) continue;

    let criteriaMet = false;

    switch (badge.criteria.type) {
      case 'first_session':
        // Early Bird: Triggered on first session or first high score milestone
        if ((profile.xp === 0 && pitchAccuracy > 0) || pitchAccuracy > 80) {
            criteriaMet = true;
        }
        break;
        
      case 'perfect_score':
        if (pitchAccuracy >= badge.criteria.value) criteriaMet = true;
        break;
        
      case 'song_count':
        if (badge.criteria.genre === song.genre) {
          const genreSongs = publicDomainLibrary.filter(s => s.genre === badge.criteria.genre);
          const completedGenreSongs = completedSongs.filter(id => genreSongs.some(s => s.id === id));
          if (completedGenreSongs.length >= badge.criteria.value) criteriaMet = true;
        }
        break;
        
      case 'duel_wins':
        if (getClientTracking(DUEL_WINS_KEY).length >= badge.criteria.value) criteriaMet = true;
        break;
        
      case 'language_count':
        const languageSongs = publicDomainLibrary.filter(s => ['pd-15', 'pd-19', 'pd-20', 'pd-17'].includes(s.id));
        const completedLanguageSongs = completedSongs.filter(id => languageSongs.some(s => s.id === id));
        const uniqueLanguages = new Set<string>();
        if (completedLanguageSongs.includes('pd-15')) uniqueLanguages.add('German');
        if (completedLanguageSongs.includes('pd-19')) uniqueLanguages.add('Italian');
        if (completedLanguageSongs.includes('pd-20')) uniqueLanguages.add('Portuguese');
        if (completedLanguageSongs.includes('pd-17')) uniqueLanguages.add('English');
        if (uniqueLanguages.size >= badge.criteria.value) criteriaMet = true;
        break;
    }

    if (criteriaMet) newlyUnlocked.push(badge.id);
  }
  
  if (newlyUnlocked.length > 0) {
    const updatedBadges = [...(profile.badges || []), ...newlyUnlocked];
    await supabase.from('profiles').update({ badges: updatedBadges }).eq('id', userId);
  }

  return newlyUnlocked;
};