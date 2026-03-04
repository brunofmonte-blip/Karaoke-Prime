import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mic2, ShieldCheck, LayoutDashboard, GraduationCap, Star, Sparkles, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: 'Basic', path: '/basic', icon: Music },
    { name: 'Academy', path: '/academy', icon: GraduationCap },
    { name: 'Next Talent', path: '/talent', icon: Star },
    { name: 'Backstage', path: '/backstage', icon: LayoutDashboard },
    { name: 'Next Success', path: '/next-success', icon: Sparkles },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex flex-col cursor-pointer group">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tighter">
              Karaoke <span className="text-primary neon-blue-glow">Prime</span>
            </h1>
          </div>
          <Mic2 className="h-3 w-3 text-gray-500 group-hover:text-primary transition-colors ml-1 -mt-1" />
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.path}
                to={link.path} 
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                  isActive 
                    ? "text-primary bg-primary/10 shadow-[inset_0_0_10px_rgba(0,168,225,0.1)]" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <link.icon size={14} className={cn(isActive && "neon-blue-glow")} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Secure</span>
          </div>
          <Button 
            variant="outline" 
            className="rounded-xl border-primary/50 text-primary hover:bg-primary hover:text-black transition-all font-bold h-10"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
        </div>

      </div>
    </header>
  );
};

export default Header;