import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Trophy, Star, BookOpen, PlayCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Academy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative pb-20 pt-28 px-4">
      {/* 💡 A BLINDAGEM: Usando tag <img> blindada em vez de background-image no CSS */}
      <img src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=2000" alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-[0.1]" />
      <div className="absolute inset-0 bg-black/90 z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10 animate-in fade-in duration-700">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors"><ArrowLeft size={20} /> Voltar para Home</button>
        
        <div className="text-center mb-16">
          <GraduationCap className="h-14 w-14 text-primary mx-auto mb-6" />
          <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter drop-shadow-lg">VOCAL <span className="text-primary">ACADEMY</span></h1>
          <p className="text-gray-400 mt-6 uppercase tracking-widest text-sm font-bold">Do iniciante ao pro-vocal em 10 estágios</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-black/40 border-primary/20"><CardContent className="p-6 flex items-center gap-4"><Trophy className="text-primary h-8 w-8" /><div><p className="text-xs text-gray-500 uppercase font-bold">Nível Atual</p><p className="text-3xl font-black text-white">0</p></div></CardContent></Card>
          <Card className="bg-black/40 border-orange-500/20"><CardContent className="p-6 flex items-center gap-4"><Star className="text-orange-500 h-8 w-8" /><div><p className="text-xs text-gray-500 uppercase font-bold">XP Acumulado</p><p className="text-3xl font-black text-white">0</p></div></CardContent></Card>
          <Card className="bg-black/40 border-white/10"><CardContent className="p-6 flex items-center gap-4"><BookOpen className="text-gray-400 h-8 w-8" /><div><p className="text-xs text-gray-500 uppercase font-bold">Lições Concluídas</p><p className="text-3xl font-black text-white">0 / 10</p></div></CardContent></Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-black/60 border-primary shadow-[0_0_15px_rgba(0,168,225,0.2)] flex flex-col">
            <CardContent className="p-6 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-primary">Nível 1: Steady Breath</h3>
                <span className="text-[10px] px-2 py-1 rounded-full border border-primary text-primary">Foco Atual</span>
              </div>
              <p className="text-sm text-gray-400 mb-6 flex-grow">Mastering diaphragmatic breathing for sustained notes.</p>
              <Button className="w-full bg-primary text-black font-bold hover:bg-primary/90"><PlayCircle className="mr-2 h-5 w-5" /> Iniciar Lição</Button>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/5 flex flex-col relative opacity-60">
            <CardContent className="p-6 flex-grow flex flex-col">
              <Lock className="absolute top-6 right-6 text-gray-500 h-5 w-5" />
              <h3 className="text-xl font-bold text-white mb-4 pr-8">Nível 2: Pitch Calibration</h3>
              <p className="text-sm text-gray-400 mb-6 flex-grow">Introduction to hitting target notes accurately.</p>
              <div className="w-full py-2 border border-white/10 rounded-md text-center text-xs text-gray-500 font-bold uppercase flex items-center justify-center gap-2"><Lock className="h-3 w-3" /> Trancado</div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/5 flex flex-col relative opacity-60">
            <CardContent className="p-6 flex-grow flex flex-col">
              <Lock className="absolute top-6 right-6 text-gray-500 h-5 w-5" />
              <h3 className="text-xl font-bold text-white mb-4 pr-8">Nível 3: Rhythm Basics</h3>
              <p className="text-sm text-gray-400 mb-6 flex-grow">Keeping time and syncing vocals with tracks.</p>
              <div className="w-full py-2 border border-white/10 rounded-md text-center text-xs text-gray-500 font-bold uppercase flex items-center justify-center gap-2"><Lock className="h-3 w-3" /> Trancado</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default Academy;