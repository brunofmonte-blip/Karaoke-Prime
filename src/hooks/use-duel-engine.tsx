import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useAuth } from '@/integrations/supabase/auth';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { OfflineDuelResult, mockSaveOfflineDuel, mockGetUnsyncedDuels, mockMarkDuelAsSynced } from '@/utils/offline-storage';
import { runScoringEngine } from '@/utils/scoring-engine';
import { PublicDomainSong } from '@/data/public-domain-library';
import { ChartDataItem } from './use-vocal-sandbox';

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
  getDuelFeedback: (userId: string) => { winner: boolean, feedback: string };
}

const DuelContext = createContext<DuelContextType | undefined>(undefined);

export const DuelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
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
    setCurrentTurn(1); // Start with User 1
    toast.info(`Duel started! Player 1 (${user.email?.split('@')[0] || 'You'}) sings first.`, { duration: 4000 });
  }, [user, clearDuel]);

  const syncOfflineDuels = useCallback(async () => {
    const unsyncedDuels = mockGetUnsyncedDuels();
    if (unsyncedDuels.length === 0) return;

    toast.loading(`Syncing ${unsyncedDuels.length} offline duel results...`, { id: 'duel-sync' });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    for (const duel of unsyncedDuels) {
      // Mock successful insertion
      // In a real scenario, we would insert into Supabase here.
      mockMarkDuelAsSynced(duel.id);
    }

    toast.dismiss('duel-sync');
    toast.success(`${unsyncedDuels.length} duels synchronized successfully!`);
    queryClient.invalidateQueries({ queryKey: ['globalRankings'] }); // Ranks might change
  }, [queryClient]);

  const recordTurn = useCallback((history: ChartDataItem[]) => {
    if (!isDuelActive || !duelSong || !user) return;

    if (currentTurn === 1) {
      setUser1History(history);
      setCurrentTurn(2);
      toast.info(`Player 1 score recorded. Player 2 (Local Opponent) turn!`, { duration: 4000 });
    } else if (currentTurn === 2) {
      setUser2History(history);
      
      // --- Duel Scoring and Persistence ---
      const user1Insight = runScoringEngine(user1History, duelSong);
      const user2Insight = runScoringEngine(history, duelSong); // Use current history for User 2
      
      const duelResult: Omit<OfflineDuelResult, 'id' | 'synced'> = {
        songId: duelSong.id,
        user1Id: user.id,
        user1Score: user1Insight.accuracyScore,
        user2Id: MOCK_USER_2_ID, // Mock opponent
        user2Score: user2Insight.accuracyScore,
        timestamp: Date.now(),
      };
      
      const savedDuel = mockSaveOfflineDuel(duelResult);
      setDuelSummary(savedDuel);
      setIsDuelActive(false);
      setCurrentTurn(null);
      
      toast.success("Duel finished! Results saved locally. Syncing soon.", { duration: 5000 });
      
      // Attempt immediate sync
      syncOfflineDuels();
    }
  }, [isDuelActive, currentTurn, duelSong, user, user1History, syncOfflineDuels]);
  
  const getDuelFeedback = useCallback((userId: string) => {
    if (!duelSummary || !duelSong) return { winner: false, feedback: "No duel data available." };

    const isUser1 = userId === duelSummary.user1Id;
    const userScore = isUser1 ? duelSummary.user1Score : duelSummary.user2Score;
    const opponentScore = isUser1 ? duelSummary.user2Score : duelSummary.user1Score;
    
    const winner = userScore >= opponentScore;
    
    if (winner) {
      return { winner: true, feedback: `Congratulations! You won by ${Math.abs(userScore - opponentScore).toFixed(1)} points.` };
    } else {
      // Determine which history belongs to the opponent
      const opponentHistory = isUser1 ? user2History : user1History;
      
      // Re-run scoring engine on opponent's history to get detailed tips
      const opponentInsight = runScoringEngine(opponentHistory, duelSong);
      
      // Pick a random improvement tip from the opponent's insight
      const tip = opponentInsight.improvementTips[Math.floor(Math.random() * opponentInsight.improvementTips.length)];
      
      return { winner: false, feedback: `You lost by ${Math.abs(userScore - opponentScore).toFixed(1)} points. Opponent's tip: "${tip}"` };
    }
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