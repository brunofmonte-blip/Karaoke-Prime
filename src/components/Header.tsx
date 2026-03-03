import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mic2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO - Agora aponta corretamente para a Home (/) */}
        <Link to="/" className="flex flex-col cursor-pointer group">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tighter">
              Karaoke <span className="text-primary neon-blue-glow">Prime</span>
            </h1>
          </div>
          <Mic2 className="h-3 w-3 text-gray-500 group-hover:text-primary transition-colors ml-1 -mt-1" />
        </Link>

        {/* MENU DE NAVEGAÇÃO - Links corrigidos */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/basic" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Basic</Link>
          <Link to="/academy" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Academy</Link>
          <Link to="/talent" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Next Talent</Link>
          <Link to="/backstage" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Backstage</Link>
          <Link to="/next-success" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Next Success</Link>
        </nav>

        {/* BOTÕES LATERAIS */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-medium">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Security Verified</span>
          </div>
          <Button 
            variant="outline" 
            className="rounded-full border-primary/50 text-primary hover:bg-primary hover:text-black transition-all"
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