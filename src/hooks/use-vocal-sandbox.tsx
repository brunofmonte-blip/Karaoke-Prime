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

export type BreathingPhase = 'inhale' | 'suspend' | 'exhale' | 'rest';
export type ConservatoryModule = 'farinelli' | 'sovt' | 'panting' | 'alexander' | 'pitch-calibration' | 'none';
export type CalibrationSubModule = 'laser-attack' | 'drone-sustain' | 'blind-tuning' | 'none';

interface VocalSandboxContextType {
  isOverlayOpen: boolean;
  openOverlay: () => void;
  closeOverlay: () => void;
  isAnalyzing: boolean;
  startAnalysis: (song: PublicDomainSong, isDuelMode: boolean, module?: ConservatoryModule, subModule?: CalibrationSubModule) => Promise<void>;
  stopAnalysis: () => { summary: SessionSummary, history: ChartDataItem[] } | null;
  pitchData: number; 
  pitchDataHz: number;
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
  countdown: number | null; 
  sensitivity: number; 
  setSensitivity: (value: number) => void; 
  unlockedBadges: BadgeId[]; 
  clearUnlockedBadges: () => void; 
  breathingPhase: BreathingPhase;
  breathingProgress: number; 
  isAirflowLow: boolean;
  stabilityScore: number; 
  activeModule: ConservatoryModule;
  activeSubModule: CalibrationSubModule;
}

const VocalSandboxContext = createContext<VocalSandboxContextType | undefined>(undefined);

const STABILITY_WINDOW = 10;
const STABILITY_THRESHOLD = 5;
const DEVIATION_THRESHOLD = 10;

export const VocalSandboxProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [pitchHistory, setPitchHistory] = useState<ChartDataItem[]>([]);
  const [ghostTrace, setGhostTrace] = useState<ChartDataItem[]>([]);
  const [isPitchStable, setIsPitchStable] = useState(false);
  const [isPitchDeviating, setIsPitchDeviating] = useState(false);
  const [recentAchievements, setRecentAchievements] = useState<string[]>([]);
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null);
  const [currentSong, setCurrentSong] = useState<PublicDomainSong | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(180); 
  const [countdown, setCountdown] = useState<number | null>(null);
  const [unlockedBadges, setUnlockedBadges] = useState<BadgeId[]>([]); 
  const [activeModule, setActiveModule] = useState<ConservatoryModule>('none');
  const [activeSubModule, setActiveSubModule] = useState<CalibrationSubModule>('none');
  
  const [breathingPhase, setBreathingPhase] = useState<BreathingPhase>('none');
  const [breathingProgress, setBreathingProgress] = useState(0);
  const [isAirflowLow, setIsAirflowLow] = useState(false);
  const [stabilityScore, setStabilityScore] = useState(100);
  
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
  
  const stopAnalysis = useCallback(() => {
    stopAudio();
    setBreathingPhase('none');
    setBreathingProgress(0);
    setIsAirflowLow(false);
    setStabilityScore(100);
    setActiveModule('none');
    setActiveSubModule('none');

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
    
    if (pitchHistory.length > 0 && sessionStartTimeRef.current && currentSong) {
      const durationSeconds = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
      const insight = runScoringEngine(pitchHistory, currentSong);
      
      const summary: SessionSummary = {
        ...insight,
        durationSeconds: durationSeconds,
        songId: currentSong.id, 
      };
      
      setSessionSummary(summary);
      return { summary, history: pitchHistory };
    }
    
    return null;
  }, [stopAudio, pitchHistory, currentSong]);

  const startAnalysis = useCallback(async (song: PublicDomainSong, isDuelMode: boolean, module: ConservatoryModule = 'none', subModule: CalibrationSubModule = 'none') => {
    if (isAnalyzing || countdown !== null) return;
    
    setCurrentSong(song);
    setActiveModule(module);
    setActiveSubModule(subModule);
    await mockDownloadSong(song); 

    setPitchHistory([]);
    setRecentAchievements([]);
    setSessionSummary(null);
    setUnlockedBadges([]); 
    historyCounter.current = 0;
    sessionStartTimeRef.current = null; 
    setCurrentTime(0);
    setStabilityScore(100);

    const duration = module === 'pitch-calibration' ? 60 : 60; 
    setTotalDuration(duration);

    setCountdown(3);
    
    countdownIntervalRef.current = window.setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          window.clearInterval(countdownIntervalRef.current);
          startAudio();
          
          const startTime = Date.now();
          sessionStartTimeRef.current = startTime;
          
          playbackIntervalRef.current = window.setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000;
            setCurrentTime(elapsed);
            
            if (elapsed >= duration) {
              stopAnalysis();
            }
          }, 50);

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
        pitchDataHz,
        pitchHistory,
        ghostTrace,
        currentSongTitle: currentSong?.title || "Selecione uma Música",
        currentSongArtist: currentSong?.artist || "Karaoke Prime",
        currentLyrics: currentSong?.lyrics.map(l => l.text).join(' ') || "",
        isPitchStable,
        isPitchDeviating,
        recentAchievements,
        sessionSummary,
        clearSessionSummary: () => setSessionSummary(null),
        loadSong: (id) => { const s = publicDomainLibrary.find(x => x.id === id); if(s) setCurrentSong(s); },
        currentSong,
        currentTime,
        totalDuration,
        countdown,
        sensitivity,
        setSensitivity,
        unlockedBadges, 
        clearUnlockedBadges: () => setUnlockedBadges([]), 
        breathingPhase,
        breathingProgress,
        isAirflowLow,
        stabilityScore,
        activeModule,
        activeSubModule,
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