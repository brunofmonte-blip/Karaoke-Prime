"use client";

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mic2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/integrations/supabase/auth';

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-primary/20 border border-primary/30">
              <Mic2 className="h-6 w-6 text-primary neon-blue-glow" />
            </div>
            <span className="hidden font-black text-xl tracking-tighter uppercase italic md:inline-block">
              KARAOKE <span className="text-primary neon-blue-glow">PRIME</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold uppercase tracking-widest">
            <Link to="/basic" className="text-muted-foreground hover:text-primary transition-colors">Lobby</Link>
            <Link to="/academy" className="text-muted-foreground hover:text-primary transition-colors">Academy</Link>
            <Link to="/library" className="text-muted-foreground hover:text-primary transition-colors">Library</Link>
            <Link to="/duel" className="text-muted-foreground hover:text-destructive transition-colors">Duel</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <Button 
              variant="ghost" 
              onClick={() => navigate('/backstage')}
              className="flex items-center gap-2 rounded-xl hover:bg-primary/10"
            >
              <User className="h-5 w-5 text-primary" />
              <span className="hidden sm:inline font-bold">Backstage</span>
            </Button>
          ) : (
            <Button 
              onClick={() => navigate('/login')}
              className="bg-primary hover:bg-primary/90 text-black font-black rounded-xl px-6"
            >
              ENTRAR
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;