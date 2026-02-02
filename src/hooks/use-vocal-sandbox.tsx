import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { useAudioAnalyzer } from './use-audio-analyzer';
import { toast } from 'sonner';

interface ChartDataItem {
  name: string;
  pitch: number;
  breath: number;
}

interface SessionSummary {
  finalScore: number;
  pitchAccuracy: number;
  durationSeconds: number;
}

interface VocalSandboxContextType {
  isOverlayOpen: boolean;
  openOverlay: () => void;
  closeOverlay: () => void;
  isAnalyzing: boolean;
  startAnalysis: () => void;
  stopAnalysis: () => void;
  pitchData: number;
  pitchHistory: ChartDataItem[];
  ghostTrace: ChartDataItem[]; // New: Previous session data for comparison
  currentSongTitle: string;
  currentSongArtist: string;
  currentLyrics: string;
  isPitchStable: boolean;
  isPitchDeviating: boolean;
  recentAchievements: string[];
  sessionSummary: SessionSummary | null; // New: Summary data after session stops
  clearSessionSummary: () => void;
}

const VocalSandboxContext = createContext<VocalSandboxContextType | undefined>(undefined);

const MAX_HISTORY = 50; 
const STABILITY_WINDOW = 10; // Check stability over the last 10 points
const STABILITY_THRESHOLD = 5; // Max variance allowed for "stable"
const DEVIATION_THRESHOLD = 10; // Max deviation allowed for "not deviating"

export const VocalSandboxProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [pitchHistory, setPitchHistory] = useState<ChartDataItem[]>([]);
  const [ghostTrace, setGhostTrace] = useState<ChartDataItem[]>([]);
  const [isPitchStable, setIsPitchStable] = useState(false);
  const [isPitchDeviating, setIsPitchDeviating] = useState(false);
  const [recentAchievements, setRecentAchievements] = useState<string[]>([]);
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null);
  
  const historyCounter = useRef(0);
  const sessionStartTimeRef = useRef<number | null>(null);
  const stabilityToastRef = useRef<string | number | null>(null);
  
  // Placeholder song data (using the first song from the library)
  const currentSongTitle = "Ode to Joy (Instrumental)";
  const currentSongArtist = "Ludwig van Beethoven";
  const currentLyrics = "Freude, schöner Götterfunken, Tochter aus Elysium...";

  const { isAnalyzing, startAnalysis: startAudio, stopAnalysis: stopAudio, pitchData } = useAudioAnalyzer();

  const openOverlay = () => setIsOverlayOpen(true);
  const closeOverlay = () => {
    stopAudio();
    setIsOverlayOpen(false);
  };
  
  const clearSessionSummary = () => setSessionSummary(null);

  const startAnalysis = () => {
    setGhostTrace(pitchHistory); // Save current history as ghost trace
    setPitchHistory([]);
    setRecentAchievements([]);
    setSessionSummary(null);
    historyCounter.current = 0;
    sessionStartTimeRef.current = Date.now();
    startAudio();
  };

  const stopAnalysis = () => {
    stopAudio();
    if (stabilityToastRef.current) {
      toast.dismiss(stabilityToastRef.current);
      stabilityToastRef.current = null;
    }
    
    // Calculate summary upon stopping
    if (pitchHistory.length > 0 && sessionStartTimeRef.current) {
      const durationSeconds = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
      const totalPitch = pitchHistory.reduce((sum, item) => sum + item.pitch, 0);
      const finalScore = totalPitch / pitchHistory.length;
      
      setSessionSummary({
        finalScore: finalScore,
        pitchAccuracy: finalScore, // Using finalScore as pitch accuracy for simplicity
        durationSeconds: durationSeconds,
      });
    }
  };

  // Effect to update pitch history and run diagnostics in real-time
  useEffect(() => {
    if (isAnalyzing && pitchData !== undefined) {
      historyCounter.current += 1;
      const newPoint: ChartDataItem = {
        name: `T${historyCounter.current}`,
        pitch: pitchData,
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
  }, [pitchData, isAnalyzing, recentAchievements]);


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