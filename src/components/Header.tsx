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

// Definição das Rotas do Menu
const navLinks = [
{ name: 'Basic', path: '/basic' },
{ name: 'Academy', path: '/academy' },
{ name: 'Next Talent', path: '/talent' },
{ name: 'Backstage', path: '/backstage' },
{ name: 'Next Success', path: '/next-success' },
{ name: 'Planos', path: '/premium' } // Mapeado para a tela de Planos/Premium
];

return (
<header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
<div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

    {/* LOGO */}
    <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => navigate('/')}>
      <Mic2 className="text-cyan-400 h-6 w-6" />
      <span className="text-xl font-black text-white italic tracking-tighter uppercase hidden sm:block">
        KARAOKE <span className="text-cyan-400">PRIME</span>
      </span>
    </div>

    {/* MENU CENTRAL (Visível em Desktop) */}
    <nav className="hidden lg:flex items-center gap-6">
      {navLinks.map((link) => {
        const isActive = location.pathname === link.path;
        return (
          <button
            key={link.name}
            onClick={() => navigate(link.path)}
            className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
              isActive 
                ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' 
                : 'text-gray-400 hover:text-white'
            } ${link.name === 'Planos' ? 'border border-cyan-400/30 px-3 py-1.5 rounded-full hover:bg-cyan-400/10' : ''}`}
          >
            {link.name}
          </button>
        );
      })}
    </nav>

    {/* ÁREA DO USUÁRIO / LOGIN */}
    <div className="flex items-center gap-4 shrink-0">
      {user ? (
        <div className="flex items-center gap-3 bg-zinc-900 border border-white/10 p-1 rounded-full pl-4 pr-1">
          <span className="text-xs font-black text-white uppercase tracking-widest hidden md:block">
            {user.displayName?.split(' ')[0]}
          </span>
          
          {user.photoURL ? (
            <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-cyan-400/50 object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-cyan-400/20 flex items-center justify-center">
              <UserIcon size={14} className="text-cyan-400" />
            </div>
          )}
          
          <Button 
            onClick={handleLogout} 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 transition-colors ml-2"
            title="Sair da conta"
          >
            <LogOut size={14} />
          </Button>
        </div>
      ) : (
        <Button 
          onClick={() => navigate('/login')} 
          className="bg-cyan-400/10 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-black text-[10px] uppercase tracking-widest px-6 h-9 rounded-full transition-all"
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