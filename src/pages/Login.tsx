import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mic2, ShieldCheck, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    // 🔍 LOG DE TESTE
    console.log("Header: Iniciando verificação de autenticação...");

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // 🔍 LOG DE RESULTADO
      console.log("Header: Resposta do Firebase ->", currentUser ? currentUser.displayName : "Ninguém logado");
      
      setUser(currentUser);
      setIsAuthChecking(false);
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
          <span className="text-xl font-black text-white italic tracking-tighter">
            KARAOKE <span className="text-primary">PRIME</span>
          </span>
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
          
          {!isAuthChecking && (
            user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full shadow-inner cursor-default">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-6 h-6 rounded-full border border-primary/50 object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
                      <User size={12} className="text-primary" />
                    </div>
                  )}
                  <span className="text-white text-xs font-bold tracking-wider hidden sm:block uppercase">
                    {user.displayName ? user.displayName.split(' ')[0] : 'Artista'}
                  </span>
                </div>
                
                <Button 
                  onClick={handleLogout} 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-400 hover:text-white hover:bg-destructive/20 hover:border-destructive/50 border border-transparent rounded-full h-9 w-9 transition-colors"
                >
                  <LogOut size={16} />
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => navigate('/login')} 
                className="bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-black font-bold text-xs uppercase tracking-widest h-9 px-6 rounded-full transition-all"
              >
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