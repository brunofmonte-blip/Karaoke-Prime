import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mic2, ShieldCheck, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

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
          <span className="text-xl font-black text-white italic tracking-tighter uppercase">Karaoke <span className="text-primary">Prime</span></span>
        </div>

        <nav className="hidden md:flex gap-6">
          {navItems.map(item => (
            <span key={item.name} onClick={() => navigate(item.path)} className={`text-[10px] font-black uppercase tracking-widest cursor-pointer transition-colors ${location.pathname === item.path ? 'text-primary' : 'text-gray-400 hover:text-white'}`}>
              {item.name}
            </span>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {!isAuthChecking && (
            user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full shadow-neon-blue">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-6 h-6 rounded-full border border-primary/50 object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
                      <UserIcon size={12} className="text-primary" />
                    </div>
                  )}
                  <span className="text-white text-[10px] font-black tracking-widest uppercase hidden sm:block">
                    {user.displayName ? user.displayName.split(' ')[0] : 'Artista'}
                  </span>
                </div>
                <Button onClick={handleLogout} variant="ghost" size="icon" className="text-gray-500 hover:text-white hover:bg-destructive/20 rounded-full h-8 w-8 transition-colors">
                  <LogOut size={14} />
                </Button>
              </div>
            ) : (
              <Button onClick={() => navigate('/login')} className="bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-black font-black text-[10px] uppercase tracking-widest h-9 px-6 rounded-full transition-all">
                Sign In
              </Button>
            )
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;