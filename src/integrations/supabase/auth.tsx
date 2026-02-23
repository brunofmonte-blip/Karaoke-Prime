import React, { useState, useEffect, useContext } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { supabase } from './client';
import { auth as firebaseAuth } from '@/lib/firebase';

interface AuthContextType {
  session: Session | null;
  user: (SupabaseUser | FirebaseUser) | null;
  isLoading: boolean;
  authType: 'supabase' | 'firebase' | null;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<(SupabaseUser | FirebaseUser) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authType, setAuthType] = useState<'supabase' | 'firebase' | null>(null);

  useEffect(() => {
    // Supabase Auth Listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setUser(session.user);
        setAuthType('supabase');
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
        setUser(session.user);
        setAuthType('supabase');
      } else if (authType === 'supabase') {
        setSession(null);
        setUser(null);
        setAuthType(null);
      }
      setIsLoading(false);
    });

    // Firebase Auth Listener
    const unsubscribeFirebase = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setAuthType('firebase');
        setSession(null); // Clear supabase session if firebase is active
      } else if (authType === 'firebase') {
        setUser(null);
        setAuthType(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      unsubscribeFirebase();
    };
  }, [authType]);

  return (
    <AuthContext.Provider value={{ session, user, isLoading, authType }}>
      {children}
    </AuthContext.Provider>
  );
};