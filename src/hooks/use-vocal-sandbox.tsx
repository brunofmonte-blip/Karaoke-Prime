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
import { checkAndUnlockBadges } from '@/utils/badge-logic';
import { BadgeId } from '@/data/badges';

export interface ChartDataItem {
  name: string;
  pitch: number; // 0-100 visualization scale
  frequency: number; // Raw frequency in Hz
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
  pitchData: number; 
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
  latencyOffsetMs: number; 
  calibrateLatency: () => void; 
  countdown: number | null; 
  sensitivity: number; 
  setSensitivity: (value: number) => void; 
  isOnline: boolean; 
  syncOfflineLogs: () => Promise<void>; 
  unlockedBadges: BadgeId[]; 
  clearUnlockedBadges: () => void; 
}

const VocalSandboxContext = createContext<VocalSandboxContextType | undefined>(undefined);

const MAX_HISTORY = 50; 
const MIN_SESSION_DURATION_POINTS = 10;
const STABILITY_WINDOW = 10;
const STABILITY_THRESHOLD = 5;
const DEVIATION_THRESHOLD = 10;
const XP_BONUS_THRESHOLD = 80;
const XP_BONUS_VALUE = 50;

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
  const [isCurrentDuelMode, setIsCurrentDuelMode] = useState(false);
  
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

  const loadSong = (songId: string) => {
    const song = publicDomainLibrary.find(s => s.id === songId);
    if (song) {
      setCurrentSong(song);
      setCurrentSongId(songId);
    }
  };

  const calibrateLatency = useCallback(() => {
    toast.loading("Calibrating audio latency...", { id: 'latency-cal' });
    setTimeout(() => {
      const newLatency = Math.floor(Math.random() * 100) + 100;
      setLatencyOffsetMs(newLatency);
      toast.dismiss('latency-cal');
      toast.success(`Latency calibrated to ${newLatency}ms.`);
    }, 1500);
  }, []);
  
  const syncOfflineLogs = useCallback(async () => {
    const unsyncedLogs = mockGetUnsyncedLogs();
    if (unsyncedLogs.length === 0) return;
    
    if (!user || !profile) return;

    toast.loading(`Syncing ${unsyncedLogs.length} offline logs...`, { id: 'log-sync' });

    for (const log of unsyncedLogs) {
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
        toast.dismiss('log-sync');
        return;
      }
      
      if (log.pitchAccuracy > (profile.best_note || 0)) {
         await supabase
          .from('profiles')
          .update({ best_note: log.pitchAccuracy })
          .eq('id', log.userId);
      }
      
      mockMarkLogAsSynced(log.id);
    }

    toast.dismiss('log-sync');
    toast.success("Performance logs synchronized!");
    queryClient.invalidateQueries({ queryKey: ['userProfile'] });
  }, [queryClient, profile, user]);

  const openOverlay = () => setIsOverlayOpen(true);
  
  const closeOverlay = () => {
    stopAnalysis();
    setIsOverlayOpen(false);
    setIsCurrentDuelMode(false);
  };
  
  const clearSessionSummary = () => setSessionSummary(null);
  const clearUnlockedBadges = () => setUnlockedBadges([]); 

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
      return { summary, history: pitchHistory };
    }
    
    return null;
  }, [stopAudio, pitchHistory, effectiveSong]);

  const startAnalysis = useCallback(async (song: PublicDomainSong, isDuelMode: boolean, ghostTrace: ChartDataItem[] = []) => {
    if (isAnalyzing || countdown !== null) return;
    
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

  useEffect(() => {
    if (sessionSummary && user && !isCurrentDuelMode && effectiveSong && profile) {
      if (pitchHistory.length < MIN_SESSION_DURATION_POINTS) {
        toast.error("Session too short for score submission.");
        return;
      }
      
      const handleScorePersistenceAndBadges = async () => {
        const difficultyMultiplier = getDifficultyMultiplier(effectiveSong.difficulty);
        
        // Base XP calculation
        let xpGained = Math.floor(sessionSummary.durationSeconds * (sessionSummary.pitchAccuracy / 100) * 5 * difficultyMultiplier);
        
        // Strategic Bonus: +50 XP for Score > 80%
        if (sessionSummary.pitchAccuracy > XP_BONUS_THRESHOLD) {
          xpGained += XP_BONUS_VALUE;
          toast.success("Strategic Bonus! +50 XP for high accuracy.");
        }

        const newXp = (profile.xp || 0) + xpGained;
        
        // Check for Badges (including Early Bird)
        const newlyEarnedBadges = await checkAndUnlockBadges(
          user.id, 
          profile, 
          effectiveSong, 
          sessionSummary.pitchAccuracy, 
          false 
        );
        
        if (newlyEarnedBadges.length > 0) {
          setUnlockedBadges(newlyEarnedBadges);
        }
        
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            best_note: Math.max(profile.best_note || 0, sessionSummary.pitchAccuracy),
            xp: newXp,
          })
          .eq('id', user.id);

        if (profileError) {
          toast.error("Failed to save profile score/XP.");
        }
        
        await supabase
          .from('performance_logs')
          .insert({
            user_id: user.id,
            song_id: sessionSummary.songId,
            pitch_accuracy: sessionSummary.pitchAccuracy,
            rhythm_precision: sessionSummary.rhythmPrecision,
            vocal_stability: sessionSummary.vocalStability,
            duration_seconds: sessionSummary.durationSeconds,
          });

        // Save locally for the graph
        mockSaveOfflineLog({
          userId: user.id,
          songId: sessionSummary.songId,
          pitchAccuracy: sessionSummary.pitchAccuracy,
          rhythmPrecision: sessionSummary.rhythmPrecision,
          vocalStability: sessionSummary.vocalStability,
          durationSeconds: sessionSummary.durationSeconds,
          timestamp: Date.now(),
        });

        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        queryClient.invalidateQueries({ queryKey: ['globalRankings'] });
      };
      
      handleScorePersistenceAndBadges();
    }
  }, [sessionSummary, user, isCurrentDuelMode, pitchHistory.length, profile, queryClient, effectiveSong]);

  useEffect(() => {
    if (user) syncOfflineLogs();
  }, [user, syncOfflineLogs]);
  
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
        if (newHistory.length > MAX_HISTORY) newHistory.shift();
        
        if (newHistory.length >= STABILITY_WINDOW) {
          const recentPitches = newHistory.slice(-STABILITY_WINDOW).map(p => p.pitch);
          const variance = Math.max(...recentPitches) - Math.min(...recentPitches);
          const stable = variance < STABILITY_THRESHOLD && Math.max(...recentPitches) > 0;
          setIsPitchStable(stable);
          setIsPitchDeviating(variance > DEVIATION_THRESHOLD);

          if (stable && !stabilityToastRef.current) {
            stabilityToastRef.current = toast.success("Great Stability!", { duration: 1000000 });
          } else if (!stable && stabilityToastRef.current) {
            toast.dismiss(stabilityToastRef.current);
            stabilityToastRef.current = null;
          }
        }
        return newHistory;
      });
    }
  }, [pitchDataVisualization, pitchDataHz, isAnalyzing]);

  return (
    <VocalSandboxContext.Provider 
      value={{ 
        isOverlayOpen, 
        openOverlay, 
        closeOverlay, 
        isAnalyzing, 
        startAnalysis, 
        stopAnalysis, 
        pitchData: pitchDataVisualization, 
        pitchHistory,
        ghostTrace,
        currentSongTitle,
        currentSongArtist,
        currentLyrics: effectiveSong?.lyrics.map(l => l.text).join(' ') || "",
        isPitchStable,
        isPitchDeviating,
        recentAchievements,
        sessionSummary,
        clearSessionSummary,
        loadSong,
        currentSong: effectiveSong,
        currentTime,
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