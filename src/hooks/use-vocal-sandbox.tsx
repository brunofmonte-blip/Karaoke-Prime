import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { useAudioAnalyzer } from './use-audio-analyzer';
import { toast } from 'sonner';
import { publicDomainLibrary, PublicDomainSong } from '@/data/public-domain-library';
import { mockDownloadSong } from '@/utils/offline-storage';

interface ChartDataItem {
  name: string;
  pitch: number; // 0-100 visualization scale
  frequency: number; // New: Raw frequency in Hz
  breath: number;
}

interface SessionSummary {
  finalScore: number;
  pitchAccuracy: number;
  durationSeconds: number;
  songId: string; // Added song ID
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
}

const VocalSandboxContext = createContext<VocalSandboxContextType | undefined>(undefined);

const MAX_HISTORY = 50; 
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
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);
  const [currentSong, setCurrentSong] = useState<PublicDomainSong | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  
  const historyCounter = useRef(0);
  const sessionStartTimeRef = useRef<number | null>(null);
  const stabilityToastRef = useRef<string | number | null>(null);
  const audioTimerRef = useRef<number>();

  const currentSongTitle = currentSong?.title || "Select a Song";
  const currentSongArtist = currentSong?.artist || "Karaoke Prime";
  const currentLyrics = currentSong?.lyrics.map(l => l.text).join(' ') || "Start your vocal journey by selecting a song from the library.";

  const { 
    isAnalyzing, 
    startAnalysis: startAudio, 
    stopAnalysis: stopAudio, 
    pitchDataHz, 
    pitchDataVisualization, 
  } = useAudioAnalyzer();
  
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

  const openOverlay = () => {
    if (!currentSong) {
      // Default to the first song if none is selected
      loadSong(publicDomainLibrary[0].id);
    }
    setIsOverlayOpen(true);
  };
  
  const closeOverlay = () => {
    stopAnalysis();
    setIsOverlayOpen(false);
  };
  
  const clearSessionSummary = () => setSessionSummary(null);

  const startAnalysis = async () => {
    if (!currentSong) {
      toast.error("Please select a song first.");
      return;
    }
    
    // 1. Offline Caching (Simulated)
    await mockDownloadSong(currentSong); 

    // 2. Reset states
    setGhostTrace(pitchHistory); 
    setPitchHistory([]);
    setRecentAchievements([]);
    setSessionSummary(null);
    historyCounter.current = 0;
    sessionStartTimeRef.current = Date.now();
    setCurrentTime(0);

    // 3. Start Audio Analysis
    startAudio();
    
    // 4. Start Audio Playback Simulation
    // Mock duration based on the last lyric timestamp + 5 seconds buffer
    const lastLyricTime = currentSong.lyrics.length > 0 
      ? currentSong.lyrics[currentSong.lyrics.length - 1].time 
      : 10;
    const songDuration = lastLyricTime + 5; 
    
    const tick = () => {
      setCurrentTime(prevTime => {
        const newTime = prevTime + 0.1; // Increment by 100ms
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
    
    // Calculate summary upon stopping
    if (pitchHistory.length > 0 && sessionStartTimeRef.current && currentSong) {
      const durationSeconds = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
      // The final score calculation is now handled by the scoring engine in the modal, 
      // but we need a placeholder score for the summary object.
      const totalPitch = pitchHistory.reduce((sum, item) => sum + item.pitch, 0);
      const finalScore = totalPitch / pitchHistory.length;
      
      setSessionSummary({
        finalScore: finalScore,
        pitchAccuracy: finalScore, 
        durationSeconds: durationSeconds,
        songId: currentSong.id, // Save song ID
      });
    }
  };

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
    // If the overlay opens without a song, load the default one.
    if (isOverlayOpen && !currentSong) {
      loadSong(publicDomainLibrary[0].id);
    }
  }, [isOverlayOpen, currentSong]);


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
        currentSong,
        currentTime,
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