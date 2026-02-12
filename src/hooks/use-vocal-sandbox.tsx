import React, { createContext, useContext, useState, ReactNode, useEffect, useRef, useCallback } from 'react';
import { useAudioAnalyzer } from './use-audio-analyzer';
import { toast } from 'sonner';
import { publicDomainLibrary, PublicDomainSong } from '@/data/public-domain-library';
import { mockDownloadSong } from '@/utils/offline-storage';
import { runScoringEngine, PerformanceInsight } from '@/utils/scoring-engine';
import { useAuth } from '@/integrations/supabase/auth';
import { useUserProfile } from './use-user-profile';
import { BadgeId } from '@/data/badges';

export interface ChartDataItem {
  name: string;
  pitch: number;
  frequency: number;
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
  totalDuration: number;
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

const STABILITY_WINDOW = 10;
const STABILITY_THRESHOLD = 5;
const DEVIATION_THRESHOLD = 10;

export const VocalSandboxProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { data: profile } = useUserProfile();
  
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [pitchHistory, setPitchHistory] = useState<ChartDataItem[]>([]);
  const [ghostTrace, setGhostTrace] = useState<ChartDataItem[]>([]);
  const [isPitchStable, setIsPitchStable] = useState(false);
  const [isPitchDeviating, setIsPitchDeviating] = useState(false);
  const [recentAchievements, setRecentAchievements] = useState<string[]>([]);
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null);
  const [currentSong, setCurrentSong] = useState<PublicDomainSong | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(180); // Default 3 minutes
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [unlockedBadges, setUnlockedBadges] = useState<BadgeId[]>([]); 
  
  const historyCounter = useRef(0);
  const sessionStartTimeRef = useRef<number | null>(null);
  const stabilityToastRef = useRef<string | number | null>(null);
  const playbackIntervalRef = useRef<number>();
  const countdownIntervalRef = useRef<number>();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastHistoryUpdateRef = useRef<number>(0);

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
  const currentSongTitle = effectiveSong?.title || "Selecione uma Música";
  const currentSongArtist = effectiveSong?.artist || "Karaoke Prime";

  const stopAnalysis = useCallback(() => {
    stopAudio();
    if (stabilityToastRef.current) {
      toast.dismiss(stabilityToastRef.current);
      stabilityToastRef.current = null;
    }
    
    if (playbackIntervalRef.current) {
      window.clearInterval(playbackIntervalRef.current);
      playbackIntervalRef.current = undefined;
    }
    if (countdownIntervalRef.current) {
      window.clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = undefined;
    }
    setCountdown(null);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
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
    await mockDownloadSong(song); 

    setPitchHistory([]);
    setRecentAchievements([]);
    setSessionSummary(null);
    setUnlockedBadges([]); 
    historyCounter.current = 0;
    sessionStartTimeRef.current = null; 
    setCurrentTime(0);
    setGhostTrace(ghostTrace); 

    // Determine duration based on lyrics or default
    const lastLyricTime = song.lyrics.length > 0 ? song.lyrics[song.lyrics.length - 1].time : 0;
    const duration = Math.max(30, lastLyricTime + 10); // At least 30s, or 10s after last lyric
    setTotalDuration(duration);

    setCountdown(3);
    
    countdownIntervalRef.current = window.setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          window.clearInterval(countdownIntervalRef.current);
          startAudio();
          
          const startTime = Date.now();
          sessionStartTimeRef.current = startTime;
          
          // Audio is now purely optional and non-blocking
          try {
            const audio = new Audio(song.audioUrl);
            audio.volume = 0.5;
            audio.play().catch(() => console.log("[VocalSandbox] Audio playback blocked. Using pure timer."));
            audioRef.current = audio;
          } catch (e) {
            console.log("[VocalSandbox] Audio initialization failed.");
          }

          // Pure Timer-Based Progress
          playbackIntervalRef.current = window.setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000;
            setCurrentTime(elapsed);
            
            if (elapsed >= duration) {
              stopAnalysis();
            }
          }, 100);

          return null;
        }
        return (prev || 0) - 1;
      });
    }, 1000);
  }, [isAnalyzing, countdown, startAudio, stopAnalysis]);

  useEffect(() => {
    if (isAnalyzing && pitchDataVisualization !== undefined) {
      const now = Date.now();
      if (now - lastHistoryUpdateRef.current < 100) return;
      lastHistoryUpdateRef.current = now;

      historyCounter.current += 1;
      const newPoint: ChartDataItem = {
        name: `T${historyCounter.current}`,
        pitch: pitchDataVisualization,
        frequency: pitchDataHz,
        breath: 50,
      };
      
      setPitchHistory(prevHistory => {
        const newHistory = [...prevHistory, newPoint];
        
        if (newHistory.length >= STABILITY_WINDOW) {
          const recentPitches = newHistory.slice(-STABILITY_WINDOW).map(p => p.pitch);
          const variance = Math.max(...recentPitches) - Math.min(...recentPitches);
          const stable = variance < STABILITY_THRESHOLD && Math.max(...recentPitches) > 0;
          setIsPitchStable(stable);
          setIsPitchDeviating(variance > DEVIATION_THRESHOLD);

          if (stable && !stabilityToastRef.current) {
            stabilityToastRef.current = toast.success("Ótima Estabilidade!", { duration: 1000000 });
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
        openOverlay: () => setIsOverlayOpen(true), 
        closeOverlay: () => { stopAnalysis(); setIsOverlayOpen(false); }, 
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
        clearSessionSummary: () => setSessionSummary(null),
        loadSong: (id) => { const s = publicDomainLibrary.find(x => x.id === id); if(s) setCurrentSong(s); },
        currentSong: effectiveSong,
        currentTime,
        totalDuration,
        latencyOffsetMs: 150,
        calibrateLatency: () => {},
        countdown,
        sensitivity,
        setSensitivity,
        isOnline,
        syncOfflineLogs: async () => {},
        unlockedBadges, 
        clearUnlockedBadges: () => setUnlockedBadges([]), 
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