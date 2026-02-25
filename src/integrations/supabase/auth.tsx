import React, { useState, useEffect, useContext } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { supabase } from './client';
import { auth as firebaseAuth, googleProvider } from '@/lib/firebase';

interface AuthContextType {
  session: Session | null;
  user: (SupabaseUser | FirebaseUser) | null;
  isLoading: boolean;
  authType: 'supabase' | 'firebase' | null;
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
        setSession(null);
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

  const signInWithGoogle = async () => {
    await signInWithPopup(firebaseAuth, googleProvider);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(firebaseAuth, email, pass);
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, pass);
    await updateProfile(userCredential.user, { displayName: name });
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      isLoading, 
      authType,
      signInWithGoogle,
      loginWithEmail,
      registerWithEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
};