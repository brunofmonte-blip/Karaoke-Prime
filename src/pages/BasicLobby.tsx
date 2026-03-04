import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Download, Users, ArrowLeft, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const BasicLobby = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 relative">
      {/* 💡 A BLINDAGEM: Usando tag <img> blindada em vez de background-image no CSS */}
      <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000" alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-[0.2]" />
      <div className="absolute inset-0 bg-black/80 z-0" />

      <div className="relative z-10 max-w-6xl mx-auto pt-20 animate-in fade-in duration-700">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 transition-colors"><ArrowLeft size={20} /> Voltar para Home</button>
        <h1 className="text-4xl md:text-5xl font-black text-primary neon-blue-glow mb-2 tracking-tighter">Lobby de Karaokê</h1>
        <p className="text-white font-bold uppercase tracking-widest mb-10 text-sm">Escolha o modo de jogo</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div onClick={() => navigate('/library')} className="group cursor-pointer p-8 rounded-2xl border border-primary/50 bg-black/40 hover:bg-primary/10 transition-all flex flex-col items-center text-center shadow-[0_0_15px_rgba(0,168,225,0.2)]">
            <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Globe className="h-8 w-8 text-primary" /></div>
            <h3 className="text-xl font-bold text-white mb-2">Solo Online</h3><p className="text-gray-400 text-xs">Cante com o catálogo completo do YouTube.</p>
          </div>
          <div className="group p-8 rounded-2xl border border-white/10 bg-black/40 flex flex-col items-center text-center relative opacity-70">
            <div className="absolute top-4 right-4 text-orange-500">🔒</div>
            <div className="h-16 w-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-4"><Download className="h-8 w-8 text-orange-500" /></div>
            <h3 className="text-xl font-bold text-gray-300 mb-2">Solo Offline</h3><p className="text-gray-500 text-xs">Músicas baixadas (Premium).</p>
          </div>
          <div onClick={() => navigate('/duel')} className="group cursor-pointer p-8 rounded-2xl border border-white/10 bg-black/40 hover:border-destructive/50 hover:bg-destructive/10 transition-all flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-destructive/20"><Users className="h-8 w-8 text-white group-hover:text-destructive" /></div>
            <h3 className="text-xl font-bold text-white mb-2">Dueto / Batalha</h3><p className="text-gray-400 text-xs">Cante com um amigo ou desafie o mundo.</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Qual música vamos cantar hoje? (Pressione Enter)" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && query.trim() && navigate('/library')} className="pl-12 h-14 bg-black/50 border-white/10 text-white rounded-xl focus:border-primary transition-colors" />
        </div>
      </div>
    </div>
  );
};
export default BasicLobby;