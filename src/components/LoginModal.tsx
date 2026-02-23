import React, { useState, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { auth as firebaseAuth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2, Lock, Chrome } from 'lucide-react';
import { toast } from 'sonner';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isSecurityCheck, setIsSecurityCheck] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsSecurityCheck(true);
      const timer = setTimeout(() => {
        setIsSecurityCheck(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await signInWithPopup(firebaseAuth, googleProvider);
      toast.success("Successfully signed in with Google!");
      onClose();
    } catch (error: any) {
      console.error("Firebase Login Error:", error);
      toast.error("Failed to sign in with Google.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "sm:max-w-[425px] rounded-2xl border-2 border-primary/70 shadow-xl",
        "glass-pillar bg-card/80 backdrop-blur-xl"
      )}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary neon-blue-glow text-center">
            Welcome to Karaoke Prime
          </DialogTitle>
        </DialogHeader>
        
        {isSecurityCheck ? (
          <div className="p-8 flex flex-col items-center justify-center h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-accent neon-gold-glow mb-4" />
            <p className="text-lg font-semibold text-foreground">
              Secure Encryption Active
            </p>
            <p className="text-sm text-muted-foreground mt-1 flex items-center">
              <Lock className="h-3 w-3 mr-1" />
              Verifying connection integrity...
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <Button 
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="w-full bg-white text-black hover:bg-gray-100 rounded-xl py-6 font-bold flex items-center justify-center gap-3"
            >
              {isLoggingIn ? <Loader2 className="h-5 w-5 animate-spin" /> : <Chrome className="h-5 w-5" />}
              Entrar com o Google
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/50"></span></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Ou use e-mail</span></div>
            </div>

            <Auth
              supabaseClient={supabase}
              providers={['amazon']}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: 'hsl(var(--primary))',
                      brandAccent: 'hsl(var(--accent))',
                      inputBackground: 'hsl(var(--input))',
                      inputBorder: 'hsl(var(--border))',
                      defaultButtonBackground: 'hsl(var(--secondary))',
                      defaultButtonText: 'hsl(var(--secondary-foreground))',
                    },
                    radii: {
                      borderRadiusButton: '0.75rem',
                      inputBorderRadius: '0.75rem',
                    }
                  },
                },
              }}
              theme="dark"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;