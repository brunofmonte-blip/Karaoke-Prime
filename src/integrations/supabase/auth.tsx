import React, { useState, useEffect, useContext } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from './client';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from '@/lib/auth';

interface AuthContextType {
  session: Session | null;
  user: SupabaseUser | null;
  isLoading: boolean;
  authType: 'supabase' | null;
  signInWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setIsLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const value: AuthContextType = {
    session,
    user: session?.user ?? null,
    isLoading,
    authType: session ? 'supabase' : null,
    signInWithGoogle: () => signInWithPopup(),
    loginWithEmail: async (email, pass) => {
      await signInWithEmailAndPassword(null, email, pass);
    },
    registerWithEmail: async (email, pass, name) => {
      await createUserWithEmailAndPassword(null, email, pass, name);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
