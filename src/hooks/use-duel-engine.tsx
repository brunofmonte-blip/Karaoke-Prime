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

// Mock User 2 ID for local duels
const MOCK_USER_2_ID = "local-opponent-ai"; 

interface DuelContextType {
  isDuelActive: boolean;
  currentTurn: 1 | 2 | null;
  duelSong: PublicDomainSong | null;
  user1History: ChartDataItem[];
  user2History: ChartDataItem[];
  duelSummary: OfflineDuelResult | null;
  startLocalDuel: (song: PublicDomainSong) => void;
  recordTurn: (history: ChartDataItem[]) => void;
  syncOfflineDuels: () => Promise<void>;
  clearDuel: () => void;
  getDuelFeedback: (userId: string) => { winner: boolean, feedback: string, userMetrics: PerformanceInsight, opponentMetrics: PerformanceInsight };
}

const DuelContext = createContext<DuelContextType | undefined>(undefined);

export const DuelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: profile } = useUserProfile();
  const { setUnlockedBadges } = useVocalSandbox();
  
  const [isDuelActive, setIsDuelActive] = useState(false);
  const [currentTurn, setCurrentTurn] = useState<1 | 2 | null>(null);
  const [duelSong, setDuelSong] = useState<PublicDomainSong | null>(null);
  const [user1History, setUser1History] = useState<ChartDataItem[]>([]);
  const [user2History, setUser2History] = useState<ChartDataItem[]>([]);
  const [duelSummary, setDuelSummary] = useState<OfflineDuelResult | null>(null);

  const clearDuel = useCallback(() => {
    setIsDuelActive(false);
    setCurrentTurn(null);
    setDuelSong(null);
    setUser1History([]);
    setUser2History([]);
    setDuelSummary(null);
  }, []);

  const startLocalDuel = useCallback((song: PublicDomainSong) => {
    if (!user) {
      toast.error("Please sign in to start a duel.");
      return;
    }
    clearDuel();
    setDuelSong(song);
    setIsDuelActive(true);
    setCurrentTurn(1);
    toast.info(`Duel started! Player 1 (${user.email?.split('@')[0] || 'You'}) sings first.`, { duration: 4000 });
  }, [user, clearDuel]);

  const syncOfflineDuels = useCallback(async () => {
    const unsyncedDuels = mockGetUnsyncedDuels();
    if (unsyncedDuels.length === 0) return;

    if (!user || !profile) {
        console.warn("[DuelEngine] Cannot sync offline duels: User or profile data missing.");
        return;
    }

    toast.loading(`Syncing ${unsyncedDuels.length} offline duel results...`, { id: 'duel-sync' });

    await new Promise(resolve => setTimeout(resolve, 1500)); 

    for (const duel of unsyncedDuels) {
      const song = publicDomainLibrary.find(s => s.id === duel.songId);
      if (!song) continue;

      const isUser1 = duel.user1Id === user.id;
      const userScore = isUser1 ? duel.user1Score : duel.user2Score;
      const opponentScore = isUser1 ? duel.user2Score : duel.user1Score;
      const isWinner = userScore >= opponentScore;
      
      const difficultyMultiplier = getDifficultyMultiplier(song.difficulty);
      const XP_BONUS = 50;
      const baseXP = Math.floor(userScore / 100 * 10 * difficultyMultiplier); 
      const xpGained = baseXP + (isWinner ? XP_BONUS : 0);
      const newXp = (profile.xp || 0) + xpGained;

      // 2. Update Profile (Best Note and XP)
      const updates: Partial<UserProfile> = { xp: newXp };
      if (userScore > (profile.best_note || 0)) {
          updates.best_note = userScore;
      }
      
      const { error: profileError } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id);
          
      if (profileError) {
          console.error("[DuelEngine] Error updating profile during sync:", profileError);
      }

      // 3. Mark duel as synced
      mockMarkDuelAsSynced(duel.id);
    }

    toast.dismiss('duel-sync');
    toast.success(`${unsyncedDuels.length} duels synchronized successfully!`);
    queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    queryClient.invalidateQueries({ queryKey: ['globalRankings'] });
  }, [user, profile, queryClient]);

  const recordTurn = useCallback((history: ChartDataItem[]) => {
    if (!isDuelActive || !duelSong || !user || !profile) return;

    if (currentTurn === 1) {
      setUser1History(history);
      setCurrentTurn(2);
      toast.info(`Player 1 score recorded. Player 2 (Local Opponent) turn!`, { duration: 4000 });
    } else if (currentTurn === 2) {
      setUser2History(history);
      
      const user1Insight = runScoringEngine(user1History, duelSong);
      const user2Insight = runScoringEngine(history, duelSong);
      
      const user1Score = user1Insight.pitchAccuracy;
      const user2Score = user2Insight.pitchAccuracy;
      
      const isUser1Winner = user1Score >= user2Score;
      
      const duelResult: Omit<OfflineDuelResult, 'id' | 'synced'> = {
        songId: duelSong.id,
        user1Id: user.id,
        user1Score: user1Score,
        user1PitchAccuracy: user1Insight.pitchAccuracy,
        user1RhythmPrecision: user1Insight.rhythmPrecision,
        user1VocalStability: user1Insight.vocalStability,
        user2Id: MOCK_USER_2_ID,
        user2Score: user2Score,
        user2PitchAccuracy: user2Insight.pitchAccuracy,
        user2RhythmPrecision: user2Insight.rhythmPrecision,
        user2VocalStability: user2Insight.vocalStability,
        timestamp: Date.now(),
      };
      
      const savedDuel = mockSaveOfflineDuel(duelResult);
      setDuelSummary(savedDuel);
      setIsDuelActive(false);
      setCurrentTurn(null);
      
      // --- Badge Check for Duel Win ---
      const handleBadgeCheck = async () => {
        if (isUser1Winner) {
          // Check badges, passing true for isDuelWin
          const newlyEarnedBadges = await checkAndUnlockBadges(
            user.id, 
            profile, 
            duelSong, 
            user1Score, 
            true // This is a duel win
          );
          if (newlyEarnedBadges.length > 0) {
            setUnlockedBadges(newlyEarnedBadges);
          }
        }
        // Attempt immediate sync (handles XP/Best Note update)
        syncOfflineDuels();
      };
      
      handleBadgeCheck();
      
      toast.success("Duel finished! Results saved locally. Syncing soon.", { duration: 5000 });
    }
  }, [isDuelActive, currentTurn, duelSong, user, user1History, profile, setUnlockedBadges, syncOfflineDuels]);
  
  const getDuelFeedback = useCallback((userId: string) => {
    if (!duelSummary || !duelSong) {
      const emptyInsight: PerformanceInsight = { pitchAccuracy: 0, rhythmPrecision: 0, vocalStability: 0, improvementTips: [] };
      return { winner: false, feedback: "No duel data available.", userMetrics: emptyInsight, opponentMetrics: emptyInsight };
    }

    const isUser1 = userId === duelSummary.user1Id;
    const userScore = isUser1 ? duelSummary.user1Score : duelSummary.user2Score;
    const opponentScore = isUser1 ? duelSummary.user2Score : duelSummary.user1Score;
    
    const winner = userScore >= opponentScore;
    
    const userHistory = isUser1 ? user1History : user2History;
    const opponentHistory = isUser1 ? user2History : user1History;
    
    const userInsight = runScoringEngine(userHistory, duelSong);
    const opponentInsight: PerformanceInsight = {
        pitchAccuracy: isUser1 ? duelSummary.user2PitchAccuracy : duelSummary.user1PitchAccuracy,
        rhythmPrecision: isUser1 ? duelSummary.user2RhythmPrecision : duelSummary.user1RhythmPrecision,
        vocalStability: isUser1 ? duelSummary.user2VocalStability : duelSummary.user1VocalStability,
        improvementTips: [],
    };
    
    let feedback: string;
    
    if (winner) {
      feedback = `Congratulations! You won by ${Math.abs(userScore - opponentScore).toFixed(1)} points.`;
    } else {
      const tip = userInsight.improvementTips.find(t => t.startsWith("Primary Focus:")) || userInsight.improvementTips[0];
      feedback = `You lost by ${Math.abs(userScore - opponentScore).toFixed(1)} points. Improvement Observation: "${tip}"`;
    }
    
    return { 
      winner, 
      feedback, 
      userMetrics: userInsight, 
      opponentMetrics: opponentInsight 
    };
  }, [duelSummary, duelSong, user1History, user2History]);


  return (
    <DuelContext.Provider value={{ 
      isDuelActive, 
      currentTurn, 
      duelSong, 
      user1History, 
      user2History, 
      duelSummary,
      startLocalDuel, 
      recordTurn, 
      syncOfflineDuels,
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