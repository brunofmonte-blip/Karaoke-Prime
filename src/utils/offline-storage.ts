import { PublicDomainSong } from '@/data/public-domain-library';
import { toast } from 'sonner';

// Mock storage key
const OFFLINE_SONGS_KEY = 'karaoke_offline_songs';
const OFFLINE_DUELS_KEY = 'karaoke_offline_duels';

export interface OfflineDuelResult {
  id: string;
  songId: string;
  user1Id: string;
  user1Score: number;
  user1PitchAccuracy: number; // New
  user1RhythmPrecision: number; // New
  user1VocalStability: number; // New
  user2Id: string;
  user2Score: number;
  user2PitchAccuracy: number; // New
  user2RhythmPrecision: number; // New
  user2VocalStability: number; // New
  timestamp: number;
  synced: boolean;
}

// Helper to simulate IndexedDB/LocalForage interaction
const getOfflineSongs = (): PublicDomainSong[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(OFFLINE_SONGS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("[OfflineStorage] Error reading local storage:", e);
    return [];
  }
};

const setOfflineSongs = (songs: PublicDomainSong[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(OFFLINE_SONGS_KEY, JSON.stringify(songs));
  } catch (e) {
    console.error("[OfflineStorage] Error writing to local storage:", e);
  }
};

const getOfflineDuels = (): OfflineDuelResult[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(OFFLINE_DUELS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("[OfflineStorage] Error reading duel storage:", e);
    return [];
  }
};

const setOfflineDuels = (duels: OfflineDuelResult[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(OFFLINE_DUELS_KEY, JSON.stringify(duels));
  } catch (e) {
    console.error("[OfflineStorage] Error writing duel storage:", e);
  }
};

export const mockDownloadSong = async (song: PublicDomainSong): Promise<boolean> => {
  toast.loading(`Downloading ${song.title} for offline use...`, { id: `download-${song.id}` });
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate download time

  const currentSongs = getOfflineSongs();
  if (currentSongs.some(s => s.id === song.id)) {
    toast.dismiss(`download-${song.id}`);
    toast.info(`${song.title} is already downloaded.`);
    return true;
  }

  // Simulate caching audio and lyrics
  const newSongs = [...currentSongs, song];
  setOfflineSongs(newSongs);

  toast.dismiss(`download-${song.id}`);
  toast.success(`${song.title} downloaded successfully!`);
  return true;
};

export const mockRemoveSong = async (songId: string): Promise<boolean> => {
  toast.loading(`Removing song...`, { id: `remove-${songId}` });
  await new Promise(resolve => setTimeout(resolve, 500));

  const currentSongs = getOfflineSongs();
  const newSongs = currentSongs.filter(s => s.id !== songId);
  setOfflineSongs(newSongs);

  toast.dismiss(`remove-${songId}`);
  toast.success("Song removed from offline library.");
  return true;
};

export const mockCheckIsDownloaded = (songId: string): boolean => {
  const currentSongs = getOfflineSongs();
  return currentSongs.some(s => s.id === songId);
};

export const mockGetOfflineLibrary = (): PublicDomainSong[] => {
  return getOfflineSongs();
};

export const mockSaveOfflineDuel = (duel: Omit<OfflineDuelResult, 'id' | 'synced'>): OfflineDuelResult => {
  const newDuel: OfflineDuelResult = {
    ...duel,
    id: `duel-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    synced: false,
  };
  const currentDuels = getOfflineDuels();
  setOfflineDuels([...currentDuels, newDuel]);
  return newDuel;
};

export const mockGetUnsyncedDuels = (): OfflineDuelResult[] => {
  return getOfflineDuels().filter(d => !d.synced);
};

export const mockMarkDuelAsSynced = (duelId: string) => {
  const currentDuels = getOfflineDuels();
  const updatedDuels = currentDuels.map(d => 
    d.id === duelId ? { ...d, synced: true } : d
  );
  setOfflineDuels(updatedDuels);
};