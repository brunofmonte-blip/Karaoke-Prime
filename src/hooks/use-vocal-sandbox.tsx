import React, { createContext, useContext, useState, ReactNode, useEffect, useRef, useCallback } from 'react';
import { useAudioAnalyzer } from './use-audio-analyzer';
import { toast } from 'sonner';
import { publicDomainLibrary, PublicDomainSong } from '@/data/public-domain-library';
import { mockDownloadSong } from '@/utils/offline-storage';
import { useDuel } from './use-duel-engine';
import { runScoringEngine } from '@/utils/scoring-engine';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/integrations/supabase/auth';

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
}

const VocalSandboxContext = createContext<VocalSandboxContextType | undefined>(undefined);

const MAX_HISTORY = 50; 
const STABILITY_WINDOW = 10;
const STABILITY_THRESHOLD = 5;
const DEVIATION_THRESHOLD = 10;

// Mock Latency Calibration (Simulate finding a 150ms offset)
const MOCK_LATENCY_MS = 150;

export const VocalSandboxProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
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
  
  const historyCounter = useRef(0);
  const sessionStartTimeRef = useRef<number | null>(null);
  const stabilityToastRef = useRef<string | number | null>(null);
  const audioTimerRef = useRef<number>();

  const { 
    isAnalyzing, 
    startAnalysis: startAudio, 
    stopAnalysis: stopAudio, 
    pitchDataHz, 
    pitchDataVisualization, 
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
    if (!effectiveSong) {
      toast.error("Please select a song first.");
      return;
    }
    
    // 1. Offline Caching (Simulated)
    await mockDownloadSong(effectiveSong); 

    // 2. Reset states
    if (!isDuelMode) {
      setGhostTrace(pitchHistory); 
    } else if (currentTurn === 2) {
      // If it's turn 2, User 1's history is the ghost trace/opponent trace
      setGhostTrace(user1History);
    } else {
      setGhostTrace([]); // Clear ghost trace for User 1's turn
    }
    
    setPitchHistory([]);
    setRecentAchievements([]);
    setSessionSummary(null);
    historyCounter.current = 0;
    sessionStartTimeRef.current = Date.now();
    setCurrentTime(0);

    // 3. Start Audio Analysis
    startAudio();
    
    // 4. Start Audio Playback Simulation
    const lastLyricTime = effectiveSong.lyrics.length > 0 
      ? effectiveSong.lyrics[effectiveSong.lyrics.length - 1].time 
      : 10;
    const songDuration = lastLyricTime + 5; 
    
    const tick = () => {
      setCurrentTime(prevTime => {
        // Apply latency offset (convert ms to seconds)
        const offsetSeconds = latencyOffsetMs / 1000;
        const newTime = prevTime + 0.1 + offsetSeconds; // Increment by 100ms + offset
        
        if (newTime >= songDuration) {
          stopAnalysis();
          return songDuration;
        }
        audioTimerRef.current = setTimeout(tick, 100) as unknown as number;
        return newTime;
      });
    };
    audioTimerRef.current = setTimeout(tick, 100) as unknown as number;
  };

  const stopAnalysis = () => {
    stopAudio();
    if (stabilityToastRef.current) {
      toast.dismiss(stabilityToastRef.current);
      stabilityToastRef.current = null;
    }
    
    // Stop audio simulation
    if (audioTimerRef.current) {
      clearTimeout(audioTimerRef.current);
      audioTimerRef.current = undefined;
    }
    
    // --- Duel Mode Handling ---
    if (isDuelMode) {
      recordTurn(pitchHistory);
      return;
    }
    
    // --- Single Player Mode Handling ---
    if (pitchHistory.length > 0 && sessionStartTimeRef.current && effectiveSong) {
      const durationSeconds = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
      
      // Calculate score using the scoring engine for single player summary
      const insight = runScoringEngine(pitchHistory, effectiveSong);
      
      setSessionSummary({
        pitchAccuracy: insight.pitchAccuracy,
        rhythmPrecision: insight.rhythmPrecision,
        vocalStability: insight.vocalStability,
        durationSeconds: durationSeconds,
        songId: effectiveSong.id, 
        improvementTips: insight.improvementTips,
      });
    }
  };

  // Effect to handle score persistence for single player mode
  useEffect(() => {
    if (sessionSummary && user && !isDuelMode) {
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
  }, [sessionSummary, user, isDuelMode, pitchHistory.length]);


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