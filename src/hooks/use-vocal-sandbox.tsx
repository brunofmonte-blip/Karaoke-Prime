import React, { createContext, useContext, useState, ReactNode, useEffect, useRef, useCallback } from 'react';
import { useAudioAnalyzer } from './use-audio-analyzer';
import { toast } from 'sonner';
import { publicDomainLibrary, PublicDomainSong } from '@/data/public-domain-library';
import { mockDownloadSong, mockSaveOfflineLog, mockGetUnsyncedLogs, mockMarkLogAsSynced } from '@/utils/offline-storage';
import { useDuel } from './use-duel-engine';
import { runScoringEngine } from '@/utils/scoring-engine';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/integrations/supabase/auth';
import { useQueryClient } from '@tanstack/react-query';
import { useUserProfile } from './use-user-profile'; // <-- CRITICAL FIX: Import useUserProfile

export interface ChartDataItem {
  name: string;
  pitch: number; // 0-100 visualization scale
  frequency: number; // New: Raw frequency in Hz
  breath: number;
}

interface SessionSummary {
  pitchAccuracy: number;
  rhythmPrecision: number;
  vocalStability: number;
  durationSeconds: number;
  songId: string; 
  improvementTips: string[];
}

interface VocalSandboxContextType {
  isOverlayOpen: boolean;
  openOverlay: () => void;
  closeOverlay: () => void;
  isAnalyzing: boolean;
  startAnalysis: () => void;
  stopAnalysis: () => void;
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
  isDuelMode: boolean;
  latencyOffsetMs: number; // New: Latency compensation
  calibrateLatency: () => void; // New: Calibration function
  countdown: number | null; // New: 3, 2, 1, or null
  sensitivity: number; // New
  setSensitivity: (value: number) => void; // New
  isOnline: boolean; // New: Mock online status
  syncOfflineLogs: () => Promise<void>; // New: Sync function
}

const VocalSandboxContext = createContext<VocalSandboxContextType | undefined>(undefined);

const MAX_HISTORY = 50; 
const MIN_SESSION_DURATION_POINTS = 10;
const STABILITY_WINDOW = 10;
const STABILITY_THRESHOLD = 5;
const DEVIATION_THRESHOLD = 10;

// Mock Latency Calibration (Simulate finding a 150ms offset)
const MOCK_LATENCY_MS = 150;

export const VocalSandboxProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: profile } = useUserProfile(); // <-- CRITICAL FIX: Fetch profile data
  
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
  const [latencyOffsetMs, setLatencyOffsetMs] = useState(MOCK_LATENCY_MS); // Default mock offset
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isOnline, setIsOnline] = useState(true); // Mock online status
  
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
  
  // Duel integration
  const { 
    isDuelActive, 
    currentTurn, 
    duelSong, 
    user1History, 
    recordTurn,
    clearDuel,
  } = useDuel();
  
  // Determine if we are in duel mode
  const isDuelMode = isDuelActive;
  
  // Determine the current song based on duel mode or single mode
  const effectiveSong = isDuelMode ? duelSong : currentSong;
  const currentSongTitle = effectiveSong?.title || "Select a Song";
  const currentSongArtist = effectiveSong?.artist || "Karaoke Prime";
  const currentLyrics = effectiveSong?.lyrics.map(l => l.text).join(' ') || "Start your vocal journey by selecting a song from the library.";

  // Expose the visualization pitch data
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
    // Mock calibration process
    setTimeout(() => {
      const newLatency = Math.floor(Math.random() * 100) + 100; // 100ms to 200ms
      setLatencyOffsetMs(newLatency);
      toast.dismiss('latency-cal');
      toast.success(`Latency calibrated to ${newLatency}ms.`, { duration: 3000 });
    }, 1500);
  }, []);
  
  const syncOfflineLogs = useCallback(async () => {
    const unsyncedLogs = mockGetUnsyncedLogs();
    if (unsyncedLogs.length === 0) return;
    
    // CRITICAL FIX: Safety check for user/profile before attempting DB operations
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
  }, [queryClient, profile, user]); // CRITICAL FIX: Added profile and user to dependencies


  const openOverlay = () => {
    if (!effectiveSong) {
      // Default to the first song if none is selected
      loadSong(publicDomainLibrary[0].id);
    }
    setIsOverlayOpen(true);
  };
  
  const closeOverlay = () => {
    stopAnalysis();
    clearDuel(); // Clear duel state if closing overlay
    setIsOverlayOpen(false);
  };
  
  const clearSessionSummary = () => setSessionSummary(null);

  const startAnalysis = async () => {
    if (!effectiveSong || isAnalyzing || countdown !== null) {
      return;
    }
    
    // 1. Offline Caching (Simulated)
    await mockDownloadSong(effectiveSong); 

    // 2. Reset states
    setPitchHistory([]);
    setRecentAchievements([]);
    setSessionSummary(null);
    historyCounter.current = 0;
    sessionStartTimeRef.current = null; 
    setCurrentTime(0);
    
    if (!isDuelMode) {
      setGhostTrace(pitchHistory); 
    } else if (currentTurn === 2) {
      setGhostTrace(user1History);
    } else {
      setGhostTrace([]); 
    }

    // 3. Start Countdown
    setCountdown(3);
    
    const lastLyricTime = effectiveSong.lyrics.length > 0 
      ? effectiveSong.lyrics[effectiveSong.lyrics.length - 1].time 
      : 10;
    const songDuration = lastLyricTime + 5; 
    
    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(countdownIntervalRef.current);
          
          // 4. Start Audio Analysis and Playback after countdown
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
          
          return null; // End countdown
        }
        return (prev || 0) - 1;
      });
    }, 1000) as unknown as number;
  };

  const stopAnalysis = () => {
    stopAudio();
    if (stabilityToastRef.current) {
      toast.dismiss(stabilityToastRef.current);
      stabilityToastRef.current = null;
    }
    
    // Stop audio simulation and countdown
    if (audioTimerRef.current) {
      clearTimeout(audioTimerRef.current);
      audioTimerRef.current = undefined;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = undefined;
    }
    setCountdown(null);
    
    // --- Duel Mode Handling ---
    if (isDuelMode) {
      recordTurn(pitchHistory);
      return;
    }
    
    // --- Single Player Mode Handling ---
    if (pitchHistory.length > 0 && sessionStartTimeRef.current && effectiveSong) {
      const durationSeconds = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
      
      const insight = runScoringEngine(pitchHistory, effectiveSong);
      
      const summary: SessionSummary = {
        pitchAccuracy: insight.pitchAccuracy,
        rhythmPrecision: insight.rhythmPrecision,
        vocalStability: insight.vocalStability,
        durationSeconds: durationSeconds,
        songId: effectiveSong.id, 
        improvementTips: insight.improvementTips,
      };
      
      setSessionSummary(summary);
      
      if (!isOnline && user) {
        // Offline: Save to local storage
        mockSaveOfflineLog({
          userId: user.id,
          songId: summary.songId,
          pitchAccuracy: summary.pitchAccuracy,
          rhythmPrecision: summary.rhythmPrecision,
          vocalStability: summary.vocalStability,
          durationSeconds: summary.durationSeconds,
          timestamp: Date.now(),
        });
        toast.warning("Offline score saved! Will sync when connection is restored.", { duration: 5000 });
      }
    }
  };

  // Effect to handle score persistence for single player mode (ONLINE ONLY)
  useEffect(() => {
    if (sessionSummary && user && !isDuelMode && isOnline) {
      // --- Anti-Cheat/Validation Layer Mock ---
      if (pitchHistory.length < MIN_SESSION_DURATION_POINTS) {
        toast.error("Score submission failed: Session too short.", { 
          description: "A minimum duration is required to prevent score manipulation.",
          duration: 5000 
        });
        return;
      }
      // ----------------------------------------
      
      const handleScorePersistence = async () => {
        // 1. Update best_note (using pitch accuracy as the primary score)
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ best_note: sessionSummary.pitchAccuracy })
          .eq('id', user.id);

        if (profileError) {
          console.error("[VocalSandboxOverlay] Error updating best_note:", profileError);
          toast.error("Failed to save profile score.", { description: profileError.message });
        }
        
        // 2. Insert detailed performance log
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
      };
      
      handleScorePersistence();
    }
  }, [sessionSummary, user, isDuelMode, isOnline, pitchHistory.length]);

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
    
    // Initial check (mocking a stable connection)
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
        pitch: pitchDataVisualization, // Use visualization for chart
        frequency: pitchDataHz, // Store raw frequency for scoring
        breath: 50, // Placeholder for breath data
      };
      
      setPitchHistory(prevHistory => {
        const newHistory = [...prevHistory, newPoint];
        
        // Keep history size limited
        if (newHistory.length > MAX_HISTORY) {
          newHistory.shift();
        }
        
        // --- Real-time Diagnostic Logic (Client-side) ---
        if (newHistory.length >= STABILITY_WINDOW) {
          const recentPitches = newHistory.slice(-STABILITY_WINDOW).map(p => p.pitch);
          const maxPitch = Math.max(...recentPitches);
          const minPitch = Math.min(...recentPitches);
          const variance = maxPitch - minPitch;
          
          const stable = variance < STABILITY_THRESHOLD && maxPitch > 0;
          const deviating = variance > DEVIATION_THRESHOLD;

          setIsPitchStable(stable);
          setIsPitchDeviating(deviating);

          // Achievement check: Golden Mic (Mock: 30 consecutive stable points)
          if (stable && newHistory.length >= 30 && !recentAchievements.includes("Golden Mic")) {
            setRecentAchievements(prev => [...prev, "Golden Mic"]);
            toast.success("Achievement Unlocked: Golden Mic!", { duration: 5000 });
          }

          // Stability Toast Feedback
          if (stable && !stabilityToastRef.current) {
            stabilityToastRef.current = toast.success("Great Stability!", { 
              duration: 1000000, // Keep open until stopped
              description: "You are holding your pitch perfectly.",
            });
          } else if (!stable && stabilityToastRef.current) {
            toast.dismiss(stabilityToastRef.current);
            stabilityToastRef.current = null;
          }
        }
        // -------------------------------------------------
        
        return newHistory;
      });
    }
  }, [pitchDataVisualization, pitchDataHz, isAnalyzing, recentAchievements]);


  useEffect(() => {
    // If the overlay opens without a song, load the default one, unless a duel is active.
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
        currentSong: effectiveSong, // Use effective song
        currentTime,
        isDuelMode,
        latencyOffsetMs,
        calibrateLatency,
        countdown,
        sensitivity,
        setSensitivity,
        isOnline,
        syncOfflineLogs,
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