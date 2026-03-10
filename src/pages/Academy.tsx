// 🚨 ATENÇÃO: ESTE CÓDIGO DEVE FICAR EXCLUSIVAMENTE NO ARQUIVO src/pages/Academy.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Mic2, Users, CheckCircle, GraduationCap, 
  Star, Airplay, Lock, Activity, Zap, Speaker, Award, Target, Flame,
  X, Mail, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// IMPORTAÇÃO DO FIREBASE DIRETAMENTE PARA A ACADEMY
import { auth, db, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const Academy = () => {
  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const trainingModules = [
    { id: 1, title: "Respiração e Apoio", description: "Exercícios de diafragma, controle de fluxo de ar.", icon: Airplay, level: 1, duration: "10 min", locked: false },
    { id: 2, title: "Afinação Precisa", description: "Treinamento de ouvido e intervalos.", icon: Mic2, level: 2, duration: "12 min", locked: true },
    { id: 3, title: "Ressonância", description: "Melhora da qualidade tonal e clareza.", icon: BookOpen, level: 3, duration: "15 min", locked: true },
    { id: 4, title: "Interpretação Vocal", description: "Expressão e emoção ao cantar.", icon: Users, level: 4, duration: "20 min", locked: true },
    { id: 5, title: "Falsetes e Melismas", description: "Técnicas avançadas de R&B e Pop.", icon: Flame, level: 5, duration: "25 min", locked: true },
    { id: 6, title: "Vibrato Master", description: "Oscilação perfeita e controle.", icon: Activity, level: 6, duration: "20 min", locked: true },
    { id: 7, title: "Drives e Rasps", description: "Distorção vocal com segurança.", icon: Zap, level: 7, duration: "25 min", locked: true },
    { id: 8, title: "Agudos (Belting)", description: "Potência sem machucar a garganta.", icon: Speaker, level: 8, duration: "30 min", locked: true },
    { id: 9, title: "Dinâmica e Microfone", description: "Uso correto do equipamento de palco.", icon: Target, level: 9, duration: "20 min", locked: true },
    { id: 10, title: "Show Completo", description: "A prova final. Rotina de 40 minutos.", icon: Award, level: 10, duration: "40 min", locked: true },
  ];

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL,
          level: 1,
          status: 'Online',
          createdAt: new Date()
        });
      } else {
        await setDoc(userRef, { status: 'Online' }, { merge: true });
      }

      setIsModalOpen(false); 
      alert("Cadastro realizado com sucesso! Bem-vindo(a) à Academy Prime.");
      
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Houve um erro ao tentar fazer login com o Google. Verifique a configuração dos Domínios Autorizados no Firebase.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative pb-20 pt-28 px-4 font-sans overflow-hidden">
      
      <img 
        src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=2000" 
        alt="Music Classroom Background" 
        className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale-[30%] z-0" 
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-black z-10" />
      
      <div className="max-w-7xl mx-auto relative z-20 animate-in fade-in duration-700">
        <button onClick={() => navigate('/basic')} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors uppercase text-xs font-bold tracking-widest relative z-30">
          <ArrowLeft size={16} /> Voltar para o Palco
        </button>

        <div className="mb-12 text-center md:text-left relative z-30">
          <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs mb-3 bg-primary/10 px-3 py-1 rounded-full border border-primary/20 backdrop-blur-md shadow-lg">
            <GraduationCap size={14} /> Centro de Treinamento
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] leading-tight mb-4">
            Academy <span className="text-primary neon-blue-glow">Prime</span>
          </h1>
          <p className="text-gray-300 text-lg font-medium max-w-2xl mx-auto md:mx-0 drop-shadow-md">
            Aprenda as técnicas dos maiores vocalistas do mundo. Evolua seu nível e libere novos desafios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in slide-in-from-bottom-5">
          {trainingModules.map((module) => {
            const Icon = module.icon;
            return (
              <Card key={module.id} className={`bg-zinc-950/70 backdrop-blur-xl border-white/10 transition-all duration-300 rounded-[2rem] p-6 flex flex-col items-center text-center relative shadow-2xl ${module.locked ? 'opacity-70 grayscale-[30%]' : 'hover:border-primary/50 group'}`}>
                
                {module.locked && (
                  <div className="absolute top-4 right-4 bg-black/80 p-2 rounded-full border border-white/10 z-10">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                )}

                <div className={`h-16 w-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mb-4 transition-transform shadow-lg ${!module.locked && 'group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(0,168,225,0.3)] shrink-0'}`}>
                  <Icon className={`h-6 w-6 ${module.locked ? 'text-gray-500' : 'text-white group-hover:text-primary'} transition-colors`} />
                </div>
                
                <h3 className="text-lg font-black text-white italic tracking-tighter uppercase mb-1 line-clamp-2 min-h-[56px] flex items-center justify-center">{module.title}</h3>
                <p className="text-gray-300 font-bold uppercase tracking-widest text-[10px] mb-6 line-clamp-2 min-h-[30px]">{module.description}</p>
                
                <div className="w-full grid grid-cols-2 gap-2 mb-6">
                  <div className="bg-black/50 rounded-2xl p-3 border border-white/5">
                    <Star className={`w-4 h-4 mb-1 mx-auto ${module.locked ? 'text-gray-600' : 'text-yellow-500'}`} />
                    <p className="text-xl font-black text-white">Lvl {module.level}</p>
                    <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">Dificuldade</p>
                  </div>
                  <div className="bg-black/50 rounded-2xl p-3 border border-white/5">
                    <GraduationCap className={`w-4 h-4 mb-1 mx-auto ${module.locked ? 'text-gray-600' : 'text-primary'}`} />
                    <p className="text-xl font-black text-white">{module.duration}</p>
                    <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">Duração</p>
                  </div>
                </div>
                
                <Button 
                  disabled={module.locked} 
                  onClick={() => { if (!module.locked) setIsModalOpen(true); }}
                  className={`w-full h-12 rounded-full font-black uppercase tracking-widest text-[10px] transition-all mt-auto shadow-lg ${module.locked ? 'bg-zinc-800 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-primary text-black'}`}
                >
                  {module.locked ? 'ASSINAR PARA DESBLOQUEAR' : (
                    <>INICIAR EXERCÍCIO <CheckCircle className="ml-2 h-4 w-4" /></>
                  )}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* MODAL "ACADEMY LOCKED" (APENAS GOOGLE E EMAIL) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-zinc-950 border-[2px] border-primary rounded-[3rem] p-10 flex flex-col items-center text-center max-w-sm w-full shadow-[0_0_60px_rgba(0,168,225,0.3)] relative">
            
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>

            <div className="w-24 h-24 rounded-full border-[3px] border-primary flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,168,225,0.2)] bg-primary/5 relative">
              <Lock className="w-10 h-10 text-primary" />
            </div>

            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2 leading-none">
              ACADEMY <span className="text-primary drop-shadow-[0_0_10px_rgba(0,168,225,0.8)]">LOCKED</span>
            </h2>

            <p className="text-gray-300 mb-10 font-medium text-sm">
              O currículo de 10 níveis é exclusivo para membros.
            </p>

            <div className="w-full flex flex-col gap-3">
              <Button 
                onClick={handleGoogleLogin} 
                disabled={isLoading}
                className="w-full h-12 rounded-full bg-zinc-900 border border-white/10 hover:border-primary text-white font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-neon-blue"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-4 h-4" />} 
                {isLoading ? "CONECTANDO..." : "ENTRAR COM O GOOGLE"}
              </Button>
              
              <Button onClick={() => alert("Login por E-mail em desenvolvimento")} className="w-full h-12 rounded-full bg-zinc-900 border border-white/10 hover:border-primary text-white font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-neon-blue">
                <Mail className="w-4 h-4 text-gray-400" /> ENTRAR COM E-MAIL
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Academy;