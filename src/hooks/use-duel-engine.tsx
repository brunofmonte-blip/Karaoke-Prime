import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useAuth } from '@/integrations/supabase/auth';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { OfflineDuelResult, mockSaveOfflineDuel, mockGetUnsyncedDuels, mockMarkDuelAsSynced } from '@/utils/offline-storage';
import { runScoringEngine, PerformanceInsight } from '@/utils/scoring-engine';
import { PublicDomainSong, publicDomainLibrary, getDifficultyMultiplier } from '@/data/public-domain-library';
import { ChartDataItem, useVocalSandbox } from './use-vocal-sandbox';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile, UserProfile } from './use-user-profile';
import { checkAndUnlockBadges } from '@/utils/badge-logic';
import { BadgeId } from '@/data/badges';

const MOCK_USER_2_ID = "ai-opponent-pro"; 

interface DuelContextType {
  isDuelActive: boolean;
  duelSong: PublicDomainSong | null;
  duelSummary: OfflineDuelResult | null;
  startLocalDuel: (song: PublicDomainSong) => void;
  clearDuel: () => void;
  getDuelFeedback: (userId: string) => { winner: boolean, feedback: string, userMetrics: PerformanceInsight, opponentMetrics: PerformanceInsight };
}

const DuelContext = createContext<DuelContextType | undefined>(undefined);

export const DuelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: profile } = useUserProfile();
  const { startAnalysis, stopAnalysis, openOverlay, closeOverlay, setUnlockedBadges, clearUnlockedBadges } = useVocalSandbox();
  
  const [isDuelActive, setIsDuelActive] = useState(false);
  const [duelSong, setDuelSong] = useState<PublicDomainSong | null>(null);
  const [duelSummary, setDuelSummary] = useState<OfflineDuelResult | null>(null);
  const [aiHistory, setAiHistory] = useState<ChartDataItem[]>([]);

  const clearDuel = useCallback(() => {
    setIsDuelActive(false);
    setDuelSong(null);
    setDuelSummary(null);
    setAiHistory([]);
    clearUnlockedBadges();
    closeOverlay();
  }, [closeOverlay, clearUnlockedBadges]);

  const generateAiTrace = (song: PublicDomainSong): ChartDataItem[] => {
    // Generate a trace with ~85% accuracy
    return song.referenceMelody.map((ref, i) => ({
      name: `T${i}`,
      pitch: 85 + (Math.random() * 10 - 5), // AI stays around 85%
      frequency: ref.frequency,
      breath: 80
    }));
  };

  const startLocalDuel = useCallback(async (song: PublicDomainSong) => {
    if (!user) {
      toast.error("Please sign in to start a duel.");
      return;
    }
    
    const ghostTrace = generateAiTrace(song);
    setAiHistory(ghostTrace);
    setDuelSong(song);
    setIsDuelActive(true);
    
    await startAnalysis(song, true, ghostTrace); 
    openOverlay();
    
    toast.info(`AI Duel Started! Beat the AI's 85% target.`, { duration: 4000 });
  }, [user, startAnalysis, openOverlay]);

  // Handle duel completion when sandbox stops
  React.useEffect(() => {
    if (isDuelActive && !isDuelActive) { // This is a placeholder for when analysis ends
        // Logic handled in sandbox completion
    }
  }, [isDuelActive]);

  const getDuelFeedback = useCallback((userId: string) => {
    if (!duelSummary || !duelSong) {
      const emptyInsight: PerformanceInsight = { pitchAccuracy: 0, rhythmPrecision: 0, vocalStability: 0, improvementTips: [] };
      return { winner: false, feedback: "No duel data available.", userMetrics: emptyInsight, opponentMetrics: emptyInsight };
    }

    const isUser1 = userId === duelSummary.user1Id;
    const userScore = isUser1 ? duelSummary.user1Score : duelSummary.user2Score;
    const opponentScore = isUser1 ? duelSummary.user2Score : duelSummary.user1Score;
    const winner = userScore >= opponentScore;
    
    const userMetrics: PerformanceInsight = {
        pitchAccuracy: isUser1 ? duelSummary.user1PitchAccuracy : duelSummary.user2PitchAccuracy,
        rhythmPrecision: isUser1 ? duelSummary.user1RhythmPrecision : duelSummary.user2RhythmPrecision,
        vocalStability: isUser1 ? duelSummary.user1VocalStability : duelSummary.user2VocalStability,
        improvementTips: [],
    };

    const opponentMetrics: PerformanceInsight = {
        pitchAccuracy: isUser1 ? duelSummary.user2PitchAccuracy : duelSummary.user1PitchAccuracy,
        rhythmPrecision: isUser1 ? duelSummary.user2RhythmPrecision : duelSummary.user1RhythmPrecision,
        vocalStability: isUser1 ? duelSummary.user2VocalStability : duelSummary.user1VocalStability,
        improvementTips: [],
    };
    
    return { 
      winner, 
      feedback: winner ? "You defeated the AI!" : "The AI out-sang you this time.", 
      userMetrics, 
      opponentMetrics 
    };
  }, [duelSummary, duelSong]);

  return (
    <DuelContext.Provider value={{ 
      isDuelActive, 
      duelSong, 
      duelSummary,
      startLocalDuel, 
      clearDuel,
      getDuelFeedback,
    }}>
      {children}
    </DuelContext.Provider>
  );
};

export const useDuel = () => {
  const context = useContext(DuelContext);
  if (context === undefined) {
    throw new Error('useDuel must be used within a DuelProvider');
  }
  return context;
};