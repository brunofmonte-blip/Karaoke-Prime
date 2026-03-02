"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ChevronRight, Loader2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/integrations/supabase/auth';
import { useUserProfile } from '@/hooks/use-user-profile';

export default function Academy() {
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { isLoading: isProfileLoading } = useUserProfile();

  // 1. Loading State
  if (isAuthLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Loader2 className="h-12 w-12 text-cyan-500 animate-spin mb-4" />
        <p className="text-cyan-500 font-bold uppercase tracking-widest text-xs">
          Sincronizando Academy...
        </p>
      </div>
    );
  }

  // 2. AUTHENTICATION GATE
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="p-8 rounded-full bg-cyan-500/10 border-2 border-cyan-500/30 inline-block mx-auto shadow-[0_0_50px_rgba(6,182,212,0.2)]">
            <Lock className="h-16 w-16 text-cyan-500" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              ACADEMY <span className="text-cyan-500">LOCKED</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              O currículo de 10 níveis é exclusivo para membros.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/login')}
            className="w-full py-8 bg-cyan-500 hover:bg-cyan-600 text-black font-black rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.4)] text-xl transition-all hover:scale-105"
          >
            <LogIn className="mr-3 h-6 w-6" />
            ENTRAR PARA TREINAR
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4">
      
      {/* Header Section - Fixed Overlapping */}
      <div className="flex flex-col items-center justify-center space-y-4 py-8 mt-10">
         <div className="w-24 h-24 rounded-full border-4 border-cyan-500 overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.5)]">
             <img src={(user as any)?.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200&h=200&fit=crop"} alt="User" className="w-full h-full object-cover" />
         </div>
         <div className="text-center z-10 relative">
             <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-widest uppercase">VOCAL <span className="text-cyan-500">ACADEMY</span></h2>
             <p className="text-gray-400 tracking-widest text-sm mt-2">THE SCIENTIFIC PATH TO VOCAL MASTERY</p>
         </div>
      </div>

      {/* Curriculum Section - Fixed Levels and Locks */}
      <div className="space-y-6 mt-12 w-full max-w-4xl mx-auto pb-20">
      {Array.from({ length: 10 }).map((_, index) => {
        const levelNum = index + 1;
        const isLevelUnlocked = levelNum === 1; // Only Level 1 is unlocked
        
        return (
          <div key={levelNum} className={`border rounded-2xl p-6 ${isLevelUnlocked ? 'border-cyan-500/50 bg-gray-900/80 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'border-gray-800 bg-gray-900/30 opacity-70'}`}>
             <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                <h3 className="text-2xl font-black text-white italic tracking-wider">NÍVEL {levelNum} {levelNum === 1 ? '- FOUNDATION' : ''}</h3>
                {!isLevelUnlocked && <Lock className="text-gray-500 w-6 h-6" />}
             </div>
             
             {isLevelUnlocked ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Module A - Unlocked */}
                  <button className="flex items-center justify-between p-4 border border-cyan-500/50 rounded-xl bg-cyan-900/20 hover:bg-cyan-500/20 transition-all cursor-pointer group">
                     <span className="text-white font-bold tracking-wide group-hover:text-cyan-400">MÓDULO A: BREATHING GYM</span>
                     <ChevronRight className="text-cyan-500 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  {/* Module B - Unlocked */}
                  <button className="flex items-center justify-between p-4 border border-cyan-500/50 rounded-xl bg-cyan-900/20 hover:bg-cyan-500/20 transition-all cursor-pointer group">
                     <span className="text-white font-bold tracking-wide group-hover:text-cyan-400">MÓDULO B: SOVT & RESISTÊNCIA</span>
                     <ChevronRight className="text-cyan-500 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  {/* Module C - Locked */}
                  <button disabled className="flex items-center justify-between p-4 border border-gray-800 rounded-xl bg-black/50 opacity-50 cursor-not-allowed">
                     <span className="text-gray-500 font-bold tracking-wide">MÓDULO C: APPOGGIO CLÁSSICO</span>
                     <Lock className="text-gray-600 w-4 h-4" />
                  </button>
                  {/* Module D - Locked */}
                  <button disabled className="flex items-center justify-between p-4 border border-gray-800 rounded-xl bg-black/50 opacity-50 cursor-not-allowed">
                     <span className="text-gray-500 font-bold tracking-wide">MÓDULO D: TÉCNICA DE ALEXANDER</span>
                     <Lock className="text-gray-600 w-4 h-4" />
                  </button>
               </div>
             ) : (
               <div className="flex items-center justify-center p-8">
                  <p className="text-gray-500 font-medium tracking-widest uppercase text-sm flex items-center gap-2"><Lock className="w-4 h-4"/> Complete o Nível {levelNum - 1} para desbloquear</p>
               </div>
             )}
          </div>
        );
      })}
      </div>
    </div>
  );
}