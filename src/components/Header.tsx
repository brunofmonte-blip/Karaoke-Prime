import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mic2, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <Mic2 className="text-primary h-6 w-6" />
          <span className="text-xl font-black text-white italic tracking-tighter uppercase">KARAOKE <span className="text-primary">PRIME</span></span>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3 bg-zinc-900 border border-white/10 p-1 rounded-full pl-3">
              <span className="text-[10px] font-black text-white uppercase tracking-widest hidden md:block">
                {user.displayName?.split(' ')[0]}
              </span>
              {user.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-primary/50" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"><UserIcon size={14} className="text-primary" /></div>
              )}
              <Button 
                onClick={handleLogout} 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full hover:bg-destructive/20 hover:text-destructive transition-colors"
              >
                <LogOut size={16} />
              </Button>
            </div>
          ) : (
            <Button 
              onClick={() => navigate('/login')} 
              className="bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-black font-black text-[10px] uppercase tracking-widest px-6 h-9 rounded-full transition-all"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 