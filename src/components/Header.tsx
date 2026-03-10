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
          <span className="text-xl font-black text-white italic tracking-tighter">KARAOKE <span className="text-primary">PRIME</span></span>
        </div>

        <nav className="hidden md:flex gap-6">
          {navItems.map(item => (
            <span key={item.name} onClick={() => navigate(item.path)} className={`text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors ${location.pathname === item.path ? 'text-primary' : 'text-gray-400 hover:text-white'}`}>
              {item.name}
            </span>
          ))}
        </nav>

        {!isAuthChecking && (
          user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                {user.photoURL ? <img src={user.photoURL} className="w-6 h-6 rounded-full" /> : <UserIcon size={14} />}
                <span className="text-white text-[10px] font-bold uppercase">{user.displayName?.split(' ')[0]}</span>
              </div>
              <Button onClick={handleLogout} variant="ghost" size="icon" className="text-gray-400 hover:text-white"><LogOut size={16} /></Button>
            </div>
          ) : (
            <Button onClick={() => navigate('/login')} className="bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-black font-bold text-xs uppercase px-6 h-9 rounded-full">Sign In</Button>
          )
        )}
      </div>
    </header>
  );
};

export default Header;