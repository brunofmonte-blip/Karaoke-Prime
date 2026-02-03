import React, { createContext, useContext, useState, ReactNode, useEffect, useRef, useCallback } from 'react';
import { useAudioAnalyzer } from './use-audio-analyzer';
import { toast } from 'sonner';
import { publicDomainLibrary, PublicDomainSong, getDifficultyMultiplier } from '@/data/public-domain-library';
import { mockDownloadSong, mockSaveOfflineLog, mockGetUnsyncedLogs, mockMarkLogAsSynced } from '@/utils/offline-storage';
import { runScoringEngine, PerformanceInsight } from '@/utils/scoring-engine';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/integrations/supabase/auth';
import { useQueryClient } from '@tanstack/react-query';
import { useUserProfile } from './use-user-profile';
import { checkAndUnlockBadges } from '@/utils/badge-logic'; // Import badge logic
import { BadgeId } from '@/data/badges'; // Import BadgeId type

export interface ChartDataItem {
  name: string;
  pitch: number; // 0-100 visualization scale
  frequency: number; // New: Raw frequency in Hz
  breath: number;
}

export interface SessionSummary extends PerformanceInsight {
  durationSeconds: number;
  songId: string; 
}

interface VocalSandboxContextType {
  isOverlayOpen: boolean;
  openOverlay: () => void;
  closeOverlay: () => void;
  isAnalyzing: boolean;
  startAnalysis: (song: PublicDomainSong, isDuelMode: boolean, ghostTrace?: ChartDataItem[]) => Promise<void>;
  stopAnalysis: () => { summary: SessionSummary, history: ChartDataItem[] } | null;
  pitchData: number; // 0-100 visualization scale
  pitchHistory: ChartDataItem[];
  ghostTrace: ChartDataItem[];
  currentSongTitle: string;
  currentSongArtist: string;
  currentLyrics: string;
  isPitchStable: boolean;
  isPitchDeviating: boolean;
  recentAchievements: string[];
  sessionSummary: SessionSummary | null;
  clearSessionSummary: () => void;
  loadSong: (songId: string) => void;
  currentSong: PublicDomainSong | null;
  currentTime: number;
  latencyOffsetMs: number; // New: Latency compensation
  calibrateLatency: () => void; // New: Calibration function
  countdown: number | null; // New: 3, 2, 1, or null
  sensitivity: number; // New
  setSensitivity: (value: number) => void; // New
  isOnline: boolean; // New: Mock online status
  syncOfflineLogs: () => Promise<void>; // New: Sync function
  unlockedBadges: BadgeId[]; // New: State for newly unlocked badges
  clearUnlockedBadges: () => void; // New: Clear function for modal
}

const VocalSandboxContext = createContext<VocalSandboxContextType | undefined>(undefined);

const MAX_HISTORY = 50; 
const MIN_SESSION_DURATION_POINTS = 10;
const STABILITY_WINDOW = 10;
const STABILITY_THRESHOLD = 5;
const DEVIATION_THRESHOLD = 10;
const XP_PER_LEVEL_1 = 100; 

const MOCK_LATENCY_MS = 150;

export const VocalSandboxProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: profile } = useUserProfile();
  
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [pitchHistory, setPitchHistory] = useState<ChartDataItem[]>([]);
  const [ghostTrace, setGhostTrace] = useState<ChartDataItem[]>([]);
  const [isPitchStable, setIsPitchStable] = useState(false);
  const [isPitchDeviating, setIsPitchDeviating] = useState(false);
  const [recentAchievements, setRecentAchievements] = useState<string[]>([]);
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null);
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);
  const [currentSong, setCurrentSong] = useState<PublicDomainSong | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [latencyOffsetMs, setLatencyOffsetMs] = useState(MOCK_LATENCY_MS);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [unlockedBadges, setUnlockedBadges] = useState<BadgeId[]>([]); 
  const [isCurrentDuelMode, setIsCurrentDuelMode] = useState(false); // Internal state for tracking mode
  
  const historyCounter = useRef(0);
  const sessionStartTimeRef = useRef<number | null>(null);
  const stabilityToastRef = useRef<string | number | null>(null);
  const audioTimerRef = useRef<number>();
  const countdownIntervalRef = useRef<number>();

  const { 
    isAnalyzing, 
    startAnalysis: startAudio, 
    stopAnalysis: stopAudio, 
    pitchDataHz, 
    pitchDataVisualization, 
    sensitivity, 
    setSensitivity, 
  } = useAudioAnalyzer();
  
  const effectiveSong = currentSong;
  const currentSongTitle = effectiveSong?.title || "Select a Song";
  const currentSongArtist = effectiveSong?.artist || "Karaoke Prime";
  const currentLyrics = effectiveSong?.lyrics.map(l => l.text).join(' ') || "Start your vocal journey by selecting a song from the library.";

  const pitchData = pitchDataVisualization;

  const loadSong = (songId: string) => {
    const song = publicDomainLibrary.find(s => s.id === songId);
    if (song) {
      setCurrentSong(song);
      setCurrentSongId(songId);
    } else {
      toast.error("Song not found.");
    }
  };

  const calibrateLatency = useCallback(() => {
    toast.loading("Calibrating audio latency...", { id: 'latency-cal' });
    setTimeout(() => {
      const newLatency = Math.floor(Math.random() * 100) + 100;
      setLatencyOffsetMs(newLatency);
      toast.dismiss('latency-cal');
      toast.success(`Latency calibrated to ${newLatency}ms.`, { duration: 3000 });
    }, 1500);
  }, []);
  
  const syncOfflineLogs = useCallback(async () => {
    const unsyncedLogs = mockGetUnsyncedLogs();
    if (unsyncedLogs.length === 0) return;
    
    if (!user || !profile) {
        console.warn("[VocalSandbox] Cannot sync offline logs: User or profile data missing.");
        return;
    }

    toast.loading(`Syncing ${unsyncedLogs.length} offline performance logs...`, { id: 'log-sync' });

    for (const log of unsyncedLogs) {
      // 1. Insert detailed performance log to Supabase
      const { error: logError } = await supabase
        .from('performance_logs')
        .insert({
          user_id: log.userId,
          song_id: log.songId,
          pitch_accuracy: log.pitchAccuracy,
          rhythm_precision: log.rhythmPrecision,
          vocal_stability: log.vocalStability,
          duration_seconds: log.durationSeconds,
        });

      if (logError) {
        console.error("[VocalSandbox] Error syncing log:", logError);
        toast.dismiss('log-sync');
        toast.error("Failed to sync some logs. Retrying later.");
        return;
      }
      
      // 2. Update best_note (only if the synced score is better than current best_note)
      if (log.pitchAccuracy > (profile.best_note || 0)) {
         await supabase
          .from('profiles')
          .update({ best_note: log.pitchAccuracy })
          .eq('id', log.userId);
      }
      
      mockMarkLogAsSynced(log.id);
    }

    toast.dismiss('log-sync');
    toast.success(`${unsyncedLogs.length} performance logs synchronized successfully!`);
    queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    queryClient.invalidateQueries({ queryKey: ['globalRankings'] });
  }, [queryClient, profile, user]);


  const openOverlay = () => {
    if (!effectiveSong) {
      loadSong(publicDomainLibrary[0].id);
    }
    setIsOverlayOpen(true);
  };
  
  const closeOverlay = () => {
    stopAnalysis();
    setIsOverlayOpen(false);
    setIsCurrentDuelMode(false); // Reset mode on close
  };
  
  const clearSessionSummary = () => setSessionSummary(null);
  const clearUnlockedBadges = () => setUnlockedBadges([]); 

  const startAnalysis = useCallback(async (song: PublicDomainSong, isDuelMode: boolean, ghostTrace: ChartDataItem[] = []) => {
    if (isAnalyzing || countdown !== null) {
      return;
    }
    
    setCurrentSong(song);
    setIsCurrentDuelMode(isDuelMode);
    await mockDownloadSong(song); 

    setPitchHistory([]);
    setRecentAchievements([]);
    setSessionSummary(null);
    setUnlockedBadges([]); 
    historyCounter.current = 0;
    sessionStartTimeRef.current = null; 
    setCurrentTime(0);
    setGhostTrace(ghostTrace); 

    setCountdown(3);
    
    const lastLyricTime = song.lyrics.length > 0 
      ? song.lyrics[song.lyrics.length - 1].time 
      : 10;
    const songDuration = lastLyricTime + 5; 
    
    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(countdownIntervalRef.current);
          
          startAudio();
          sessionStartTimeRef.current = Date.now();
          
          const tick = () => {
            setCurrentTime(prevTime => {
              const offsetSeconds = latencyOffsetMs / 1000;
              const newTime = prevTime + 0.1 + offsetSeconds; 
              
              if (newTime >= songDuration) {
                stopAnalysis();
                return songDuration;
              }
              audioTimerRef.current = setTimeout(tick, 100) as unknown as number;
              return newTime;
            });
          };
          audioTimerRef.current = setTimeout(tick, 100) as unknown as number;
          
          return null;
        }
        return (prev || 0) - 1;
      });
    }, 1000) as unknown as number;
  }, [isAnalyzing, countdown, latencyOffsetMs, startAudio, stopAnalysis]);

  const stopAnalysis = useCallback(() => {
    stopAudio();
    if (stabilityToastRef.current) {
      toast.dismiss(stabilityToastRef.current);
      stabilityToastRef.current = null;
    }
    
    if (audioTimerRef.current) {
      clearTimeout(audioTimerRef.current);
      audioTimerRef.current = undefined;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = undefined;
    }
    setCountdown(null);
    
    if (pitchHistory.length > 0 && sessionStartTimeRef.current && effectiveSong) {
      const durationSeconds = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
      
      const insight = runScoringEngine(pitchHistory, effectiveSong);
      
      const summary: SessionSummary = {
        ...insight,
        durationSeconds: durationSeconds,
        songId: effectiveSong.id, 
      };
      
      setSessionSummary(summary);
      
      // Return summary and history for external handling (e.g., DuelProvider)
      return { summary, history: pitchHistory };
    }
    
    return null;
  }, [stopAudio, pitchHistory, effectiveSong]);

  // Effect to handle score persistence and BADGE CHECKING for single player mode (ONLINE ONLY)
  useEffect(() => {
    if (sessionSummary && user && !isCurrentDuelMode && isOnline && effectiveSong && profile) {
      
      if (pitchHistory.length < MIN_SESSION_DURATION_POINTS) {
        toast.error("Score submission failed: Session too short.", { 
          description: "A minimum duration is required to prevent score manipulation.",
          duration: 5000 
        });
        return;
      }
      
      const handleScorePersistenceAndBadges = async () => {
        const difficultyMultiplier = getDifficultyMultiplier(effectiveSong.difficulty);
        
        // Calculate XP gain
        const xpGained = Math.floor(sessionSummary.durationSeconds * (sessionSummary.pitchAccuracy / 100) * 5 * difficultyMultiplier);
        const newXp = (profile.xp || 0) + xpGained;
        
        // --- 1. Check for Badges ---
        const newlyEarnedBadges = await checkAndUnlockBadges(
          user.id, 
          profile, 
          effectiveSong, 
          sessionSummary.pitchAccuracy, 
          false // Not a duel win
        );
        
        if (newlyEarnedBadges.length > 0) {
          setUnlockedBadges(newlyEarnedBadges);
        }
        // ---------------------------
        
        // 2. Update best_note AND XP
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            best_note: sessionSummary.pitchAccuracy,
            xp: newXp,
          })
          .eq('id', user.id);

        if (profileError) {
          console.error("[VocalSandboxOverlay] Error updating best_note/XP:", profileError);
          toast.error("Failed to save profile score/XP.", { description: profileError.message });
        }
        
        // 3. Insert detailed performance log
        const { error: logError } = await supabase
          .from('performance_logs')
          .insert({
            user_id: user.id,
            song_id: sessionSummary.songId,
            pitch_accuracy: sessionSummary.pitchAccuracy,
            rhythm_precision: sessionSummary.rhythmPrecision,
            vocal_stability: sessionSummary.vocalStability,
            duration_seconds: sessionSummary.durationSeconds,
          });

        if (logError) {
          console.error("[VocalSandboxOverlay] Error inserting performance log:", logError);
          toast.error("Failed to save detailed performance log.", { description: logError.message });
        }
        
        if (profile.academy_level === 0 && newXp >= XP_PER_LEVEL_1) {
             toast.info("You're getting better! Academy Level 1 is waiting for you.", { duration: 5000 });
        }
        
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        queryClient.invalidateQueries({ queryKey: ['globalRankings'] });
      };
      
      handleScorePersistenceAndBadges();
    }
    
    // Handle offline save if not duel mode
    if (sessionSummary && user && !isCurrentDuelMode && !isOnline && effectiveSong) {
        mockSaveOfflineLog({
          userId: user.id,
          songId: sessionSummary.songId,
          pitchAccuracy: sessionSummary.pitchAccuracy,
          rhythmPrecision: sessionSummary.rhythmPrecision,
          vocalStability: sessionSummary.vocalStability,
          durationSeconds: sessionSummary.durationSeconds,
          timestamp: Date.now(),
        });
        toast.warning("Offline score saved! Will sync when connection is restored.", { duration: 5000 });
    }
    
  }, [sessionSummary, user, isCurrentDuelMode, isOnline, pitchHistory.length, profile, queryClient, effectiveSong]);

  // Initial sync attempt on load (or when user logs in)
  useEffect(() => {
    if (user) {
      syncOfflineLogs();
    }
  }, [user, syncOfflineLogs]);
  
  // Mock online/offline status listener (for demonstration)
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.info("Connection restored. Attempting background sync...", { duration: 3000 });
      syncOfflineLogs();
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning("Connection lost. Scores will be saved offline.", { duration: 5000 });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    setIsOnline(true); 

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncOfflineLogs]);


  // Effect to update pitch history and run diagnostics in real-time
  useEffect(() => {
    if (isAnalyzing && pitchDataVisualization !== undefined) {
      historyCounter.current += 1;
      const newPoint: ChartDataItem = {
        name: `T${historyCounter.current}`,
        pitch: pitchDataVisualization,
        frequency: pitchDataHz,
        breath: 50,
      };
      
      setPitchHistory(prevHistory => {
        const newHistory = [...prevHistory, newPoint];
        
        if (newHistory.length > MAX_HISTORY) {
          newHistory.shift();
        }
        
        if (newHistory.length >= STABILITY_WINDOW) {
          const recentPitches = newHistory.slice(-STABILITY_WINDOW).map(p => p.pitch);
          const maxPitch = Math.max(...recentPitches);
          const minPitch = Math.min(...recentPitches);
          const variance = maxPitch - minPitch;
          
          const stable = variance < STABILITY_THRESHOLD && maxPitch > 0;
          const deviating = variance > DEVIATION_THRESHOLD;

          setIsPitchStable(stable);
          setIsPitchDeviating(deviating);

          if (stable && newHistory.length >= 30 && !recentAchievements.includes("Golden Mic")) {
            setRecentAchievements(prev => [...prev, "Golden Mic"]);
            toast.success("Achievement Unlocked: Golden Mic!", { duration: 5000 });
          }

          if (stable && !stabilityToastRef.current) {
            stabilityToastRef.current = toast.success("Great Stability!", { 
              duration: 1000000,
              description: "You are holding your pitch perfectly.",
            });
          } else if (!stable && stabilityToastRef.current) {
            toast.dismiss(stabilityToastRef.current);
            stabilityToastRef.current = null;
          }
        }
        
        return newHistory;
      });
    }
  }, [pitchDataVisualization, pitchDataHz, isAnalyzing, recentAchievements]);


  useEffect(() => {
    if (isOverlayOpen && !effectiveSong) {
      loadSong(publicDomainLibrary[0].id);
    }
  }, [isOverlayOpen, effectiveSong]);


  return (
    <VocalSandboxContext.Provider 
      value={{ 
        isOverlayOpen, 
        openOverlay, 
        closeOverlay, 
        isAnalyzing, 
        startAnalysis, 
        stopAnalysis, 
        pitchData, 
        pitchHistory,
        ghostTrace,
        currentSongTitle,
        currentSongArtist,
        currentLyrics,
        isPitchStable,
        isPitchDeviating,
        recentAchievements,
        sessionSummary,
        clearSessionSummary,
        loadSong,
        currentSong: effectiveSong,
        currentTime,
        isDuelMode: isCurrentDuelMode,
        latencyOffsetMs,
        calibrateLatency,
        countdown,
        sensitivity,
        setSensitivity,
        isOnline,
        syncOfflineLogs,
        unlockedBadges, 
        clearUnlockedBadges, 
      }}
    >
      {children}
    </VocalSandboxContext.Provider>
  );
};

export const useVocalSandbox = () => {
  const context = useContext(VocalSandboxContext);
  if (context === undefined) {
    throw new Error('useVocalSandbox must be used within a VocalSandboxProvider');
  }
  return context;
};