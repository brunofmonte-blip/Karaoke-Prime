import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { useAudioAnalyzer } from './use-audio-analyzer';

interface ChartDataItem {
  name: string;
  pitch: number;
  breath: number;
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
  currentSongTitle: string;
  currentSongArtist: string;
  currentLyrics: string;
}

const VocalSandboxContext = createContext<VocalSandboxContextType | undefined>(undefined);

const MAX_HISTORY = 50; 

export const VocalSandboxProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [pitchHistory, setPitchHistory] = useState<ChartDataItem[]>([]);
  const historyCounter = useRef(0);
  
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

  const startAnalysis = () => {
    setPitchHistory([]);
    historyCounter.current = 0;
    startAudio();
  };

  const stopAnalysis = () => {
    stopAudio();
    // Note: Supabase persistence logic will be handled in the overlay component
  };

  // Effect to update pitch history in real-time
  useEffect(() => {
    if (isAnalyzing && pitchData !== undefined) {
      setPitchHistory(prevHistory => {
        historyCounter.current += 1;
        const newPoint: ChartDataItem = {
          name: `T${historyCounter.current}`,
          pitch: pitchData,
          breath: 50, // Placeholder for breath data
        };
        
        const newHistory = [...prevHistory, newPoint];
        
        // Keep history size limited
        if (newHistory.length > MAX_HISTORY) {
          newHistory.shift();
        }
        return newHistory;
      });
    }
  }, [pitchData, isAnalyzing]);


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
        currentSongTitle,
        currentSongArtist,
        currentLyrics,
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