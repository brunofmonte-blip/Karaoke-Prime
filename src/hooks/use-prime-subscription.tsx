import React, { createContext, useContext, useState, ReactNode } from 'react';

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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // O pagamento real acontece na página /premium (Stripe Checkout + webhook).
  // O app NUNCA marca o usuário como Premium pelo navegador.
  const handleUpgrade = async (_tier: 'Silver' | 'Gold' | 'Platinum') => {
    setIsProcessing(true);
    closeModal();
    window.location.href = '/premium';
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