import React, { createContext, useContext, useState, ReactNode } from 'react';
import { processSecurePayment } from '@/utils/payment';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/integrations/supabase/auth';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface PrimeSubscriptionContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  handleUpgrade: (tier: 'Silver' | 'Gold' | 'Platinum') => Promise<void>;
  isProcessing: boolean;
}

const PrimeSubscriptionContext = createContext<PrimeSubscriptionContextType | undefined>(undefined);

export const PrimeSubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleUpgrade = async (tier: 'Silver' | 'Gold' | 'Platinum') => {
    if (!user) {
      toast.error("Please sign in to manage your subscription.");
      return;
    }

    setIsProcessing(true);
    
    try {
      // 1. Simulate Secure Payment
      const paymentResult = await processSecurePayment(tier);

      if (paymentResult.success) {
        // 2. Update Supabase Profile Status
        const { error } = await supabase
          .from('profiles')
          .update({ is_prime: true })
          .eq('id', user.id);

        if (error) {
          toast.error("Subscription activated, but failed to update profile status.", { description: error.message });
        } else {
          toast.success(`Welcome to Prime! You are now a ${tier} member.`);
          // Invalidate profile query to reflect new status immediately
          queryClient.invalidateQueries({ queryKey: ['userProfile', user.id] });
          closeModal();
        }
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      toast.error("An unexpected error occurred during upgrade.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PrimeSubscriptionContext.Provider value={{ isModalOpen, openModal, closeModal, handleUpgrade, isProcessing }}>
      {children}
    </PrimeSubscriptionContext.Provider>
  );
};

export const usePrimeSubscription = () => {
  const context = useContext(PrimeSubscriptionContext);
  if (context === undefined) {
    throw new Error('usePrimeSubscription must be used within a PrimeSubscriptionProvider');
  }
  return context;
};