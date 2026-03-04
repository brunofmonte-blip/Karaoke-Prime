import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic2, GraduationCap, Star, Lock, Music } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate(); 

  return (
    <div className="min-h-screen bg-background relative flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000')" }} />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-0" />

      <div className="relative z-10 text-center px-4 mt-20">
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4">
          KARAOKE <span className="text-primary neon-blue-glow">PRIME</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-20 font-medium">A plataforma definitiva para evolução vocal e performance global.</p>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-4 px-4 w-full max-w-7xl pb-10 mt-auto">
         {/* Básico */}
         <div onClick={() => navigate('/basic')} className="cursor-pointer group p-6 rounded-2xl border border-primary/50 bg-black/60 hover:bg-primary/20 transition-all flex flex-col gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><Music /></div>
            <div><h3 className="font-bold text-white text-lg">Básico</h3><p className="text-xs text-gray-400">Karaokê tradicional</p></div>
         </div>
         {/* Academy */}
         <div onClick={() => navigate('/academy')} className="cursor-pointer group p-6 rounded-2xl border border-primary/50 bg-black/60 hover:bg-primary/20 transition-all flex flex-col gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><GraduationCap /></div>
            <div><h3 className="font-bold text-white text-lg">Academy</h3><p className="text-xs text-gray-400">Currículo de 10 níveis</p></div>
         </div>
         {/* Next Talent (Locked) */}
         <div className="opacity-50 p-6 rounded-2xl border border-white/10 bg-black/60 flex flex-col gap-4 relative">
            <Lock className="absolute top-4 right-4 text-gray-500 h-4 w-4" />
            <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400"><Star /></div>
            <div><h3 className="font-bold text-gray-300 text-lg">Next Talent</h3><p className="text-xs text-gray-500">Em breve</p></div>
         </div>
         {/* Backstage (Locked) */}
         <div className="opacity-50 p-6 rounded-2xl border border-white/10 bg-black/60 flex flex-col gap-4 relative">
            <Lock className="absolute top-4 right-4 text-gray-500 h-4 w-4" />
            <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400"><Mic2 /></div>
            <div><h3 className="font-bold text-gray-300 text-lg">Backstage</h3><p className="text-xs text-gray-500">Em breve</p></div>
         </div>
         {/* Next Success (Locked) */}
         <div className="opacity-50 p-6 rounded-2xl border border-white/10 bg-black/60 flex flex-col gap-4 relative">
            <Lock className="absolute top-4 right-4 text-gray-500 h-4 w-4" />
            <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400"><Star /></div>
            <div><h3 className="font-bold text-gray-300 text-lg">Next Success</h3><p className="text-xs text-gray-500">Em breve</p></div>
         </div>
      </div>
    </div>
  );
};
export default Index;