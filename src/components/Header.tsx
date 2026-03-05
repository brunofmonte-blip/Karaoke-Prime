import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mic2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Basic', path: '/basic' },
    { name: 'Academy', path: '/academy' },
    { name: 'Next Talent', path: '/talent' },
    { name: 'Backstage', path: '/backstage' },
    { name: 'Next Success', path: '/next-success' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <Mic2 className="text-primary h-6 w-6" />
          <span className="text-xl font-black text-white italic tracking-tighter">KARAOKE <span className="text-primary">PRIME</span></span>
        </div>

        <nav className="hidden md:flex gap-6">
          {navItems.map(item => (
            <span
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors ${location.pathname === item.path ? 'text-primary drop-shadow-[0_0_10px_rgba(0,168,225,0.8)]' : 'text-gray-400 hover:text-white'}`}
            >
              {item.name}
            </span>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-[10px] text-green-500 font-bold uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
            <ShieldCheck size={14} /> Security Verified
          </div>
          <Button onClick={() => navigate('/login')} className="bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-black font-bold text-xs uppercase tracking-widest h-9 px-6 rounded-full transition-all">
            Login / Cadastro
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;