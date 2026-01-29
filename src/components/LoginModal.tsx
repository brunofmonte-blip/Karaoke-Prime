import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
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
        <div className="p-4">
          <Auth
            supabaseClient={supabase}
            providers={['google', 'amazon']}
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
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email Address',
                  password_label: 'Password',
                  email_input_placeholder: 'Your email address',
                  password_input_placeholder: 'Your password',
                  button_label: 'Sign In',
                  social_provider_text: 'Continue with {{provider}}',
                  link_text: 'Already have an account? Sign In',
                },
                sign_up: {
                  email_label: 'Email Address',
                  password_label: 'Create a Password',
                  email_input_placeholder: 'Your email address',
                  password_input_placeholder: 'Create a password',
                  button_label: 'Sign Up',
                  social_provider_text: 'Continue with {{provider}}',
                  link_text: 'Don\'t have an account? Sign Up',
                },
              },
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;