import { PublicDomainSong } from '@/data/public-domain-library';
import { toast } from 'sonner';

// Mock storage key
const OFFLINE_SONGS_KEY = 'karaoke_offline_songs';

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