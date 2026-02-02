import { useState, useCallback, useEffect } from 'react';
import { PublicDomainSong } from '@/data/public-domain-library';
import { mockDownloadSong, mockRemoveSong, mockCheckIsDownloaded, mockGetOfflineLibrary } from '@/utils/offline-storage';

export const useOfflineDownload = (song: PublicDomainSong) => {
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const checkStatus = useCallback(() => {
    setIsDownloaded(mockCheckIsDownloaded(song.id));
  }, [song.id]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const toggleDownload = useCallback(async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      if (isDownloaded) {
        await mockRemoveSong(song.id);
        setIsDownloaded(false);
      } else {
        await mockDownloadSong(song);
        setIsDownloaded(true);
      }
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setIsDownloading(false);
    }
  }, [isDownloaded, isDownloading, song]);

  return {
    isDownloaded,
    isDownloading,
    toggleDownload,
  };
};

export const useOfflineLibrary = () => {
  const [offlineSongs, setOfflineSongs] = useState<PublicDomainSong[]>([]);

  const refreshLibrary = useCallback(() => {
    setOfflineSongs(mockGetOfflineLibrary());
  }, []);

  useEffect(() => {
    refreshLibrary();
  }, [refreshLibrary]);

  return {
    offlineSongs,
    refreshLibrary,
  };
};