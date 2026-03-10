// src/pages/Academy.tsx

import React from 'react';
import { Mic, Headphones, Heart, Star, Trophy, Lock, Mail } from 'lucide-react';

// Sub-component for the glowing ciano border style
const GlowingCard = ({ children, className = '' }) => (
  <div className={`border-2 border-cian-400 rounded-2xl shadow-neon-blue p-6 ${className}`}>
    {children}
  </div>
);

// Lesson buttons inside Level 1 card
const LessonButton = ({ icon: Icon, title, href }) => (
  <a
    href={href}
    className="flex-1 text-center py-4 bg-zinc-900 border border-cian-400/50 rounded-xl flex flex-col items-center gap-2 hover:bg-cian-400 hover:text-black transition-colors"
  >
    <Icon className="w-8 h-8" />
    <span className="text-sm font-medium">{title}</span>
  </a>
);

// Locked Level List Item
const LockedLevelItem = ({ level, title, onActionClick }) => (
  <div className="flex items-center justify-between gap-4 py-4 px-6 border-b border-cian-400/20 group hover:bg-cian-400/5">
    <div className="flex items-center gap-4">
      <Lock className="w-8 h-8 text-gray-500" />
      <div className="flex flex-col">
        <span className="text-lg font-bold text-gray-400 group-hover:text-cian-400">{level}</span>
        <span className="text-sm text-gray-500">{title}</span>
      </div>
    </div>
    <button onClick={onActionClick} className="text-sm text-gray-500 group-hover:text-cian-400 py-1.5 px-4 border border-gray-600 rounded-full group-hover:border-cian-400">
      BLOQUEADO, ASSINE PARA DESBLOQUEAR
    </button>
  </div>
);

const Academy: React.FC = () => {
  const [isLocked, setIsLocked] = React.useState(true); // Control visibility of the central lock overlay

  const handleLoginClick = () => {
    // Alerta para o usuário verificar a configuração do Firebase (Item 4)
    alert("Iniciando fluxo de login. Verifique se as chaves do Firebase estão configuradas no Firebase Console > Authentication > Sign-in method, incluindo e-mail, Facebook e Google.");
  };

  const handleBlockClick = () => {
    // This function will be called when clicking on blocked content or actions
    // You should add logic here to open the Premium Modal or redirect to registration
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative font-sans">
      
      {/* 🖼️ CAMADA DE FUNDO AJUSTADA (ITEM 1): Opacidade aumentada e gradiente suavizado */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter grayscale opacity-40" // Opacity increased to 40%
        style={{ backgroundImage: "url('src/assets/microphone_stage.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black z-0" /> // Smoother gradient for better visibility
      
      {/* PiP Chat Window completely removed */}

      <div className="relative z-10 p-12 space-y-16">
        
        {/* Header and Title Section */}
        <header className="flex justify-between items-center py-6 border-b border-cian-400/30">
          <div className="text-2xl font-black text-cian-400 glowing-text">KARAOKE Prime</div>
          <nav className="flex-1 flex justify-center items-center gap-8 text-sm font-medium">
            {['Basic', 'Academy', 'Next Talent', 'Ferramentas', 'Generos', 'Memom-livro', 'Blogs'].map(item => (
              <a href="#" className={`text-gray-300 hover:text-cian-400 ${item === 'Academy' ? 'text-cian-400Glowing' : ''}`}>{item}</a>
            ))}
          </nav>
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-400">Security Verified</span>
            <button onClick={handleLoginClick} className="text-sm py-2 px-6 bg-zinc-900 border border-cian-400/50 rounded-full hover:bg-cian-400 hover:text-black">Sign In</button>
          </div>
        </header>

        {/* Global CTA Banner */}
        <div className="w-full text-center py-3 bg-zinc-900/80 border-b border-cian-400/30">
          <p className="text-sm">DESBLOQUEIE TODO O POTENCIAL! ASSINE O PACOTE MENSAL OU ANUAL AGORA.</p>
        </div>

        {/* Academy Section Title & Progress */}
        <div className="flex justify-between items-center gap-12">
          <div className="space-y-3">
            <h1 className="text-4xl font-black glowing-text">
              CENTRO DE TREINAMENTO: <span className="text-cian-400">ACADEMY PRIME</span>
            </h1>
            <p className="max-w-xl text-gray-400">
              Seu espaço para dominar técnicas, treinar respiração e aprimorar a afinação antes de brilhar nos palcos.
            </p>
          </div>
          <div className="flex-1 flex justify-end items-center gap-12 border-cian-400/30">
            <div className="space-y-2 text-right">
              <span className="text-lg font-bold">Nível 1</span>
              <div className="relative w-48 h-2.5 bg-zinc-900 border border-cian-400/20 rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-12 bg-cian-400" />
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold">XP Acumulado</span>
              <div className="text-sm">0</div>
            </div>
          </div>
        </div>

        {/* REORGANIZED CENTRAL SECTION (ITEM 2): Central Locked Modal */}
        {isLocked && (
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 p-12 bg-zinc-950/90 border-2 border-cian-400 rounded-[3rem] shadow-neon-blue w-full max-w-7xl mx-auto">
            
            {/* Left side: Módulo 1 Title & Description */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <h2 className="text-3xl font-black glowing-text">MÓDULO 1: RESPIRAÇÃO E APOIO.</h2>
              <p className="max-w-xl text-gray-400">CONTROLE DE DIAFRAGMA E FLUXO DE AR.</p>
              <LessonButton icon={Mic} title="Lição 1.1: Respiração Diafragmática" href="#" />
              <button onClick={handleBlockClick} className="mt-2 text-sm text-gray-500 py-1.5 px-6 border border-gray-600 rounded-full">ASSINAR PARA DESBLOQUEAR NÍVEL 1 COMPLETO</button>
            </div>

            {/* Central Part: The Locked Modal itself */}
            <GlowingCard className="w-full max-w-lg flex flex-col items-center p-12 text-center bg-zinc-950/90 relative">
                
                {/* O Cadeado Neon */}
                <div className="w-24 h-24 rounded-full border-[3px] border-cian-400/50 flex items-center justify-center mb-6 shadow-neon-blue bg-zinc-900">
                  <Lock className="w-10 h-10 text-gray-500" />
                </div>
                
                <h2 className="text-3xl font-black glowing-text mb-2">
                  ACADEMY <span className="text-cian-400 text-cian-400Glowing">LOCKED</span>
                </h2>
                
                <p className="text-gray-400 mb-10 font-medium">
                  O currículo de 10 níveis é exclusivo para membros.
                </p>
                
                {/* 多元化的登录按钮 Stack (Item 3) */}
                <div className="w-full space-y-4">
                  <button 
                    onClick={handleLoginClick}
                    className="w-full h-14 rounded-full bg-zinc-900 border border-cian-400/50 hover:bg-cian-400 hover:text-black font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-neon-blue"
                  >
                    <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-5 h-5" />
                    ENTRAR COM O GOOGLE
                  </button>
                  <button 
                    onClick={handleLoginClick}
                    className="w-full h-14 rounded-full bg-zinc-900 border border-cian-400/50 hover:bg-cian-400 hover:text-black font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-neon-blue"
                  >
                    <img src="https://authjs.dev/img/providers/facebook.svg" alt="Facebook" className="w-5 h-5" />
                    ENTRAR COM O FACEBOOK
                  </button>
                  <button 
                    onClick={handleLoginClick}
                    className="w-full h-14 rounded-full bg-zinc-900 border border-cian-400/50 hover:bg-cian-400 hover:text-black font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-neon-blue"
                  >
                    <Mail className="w-5 h-5 text-gray-500" />
                    ENTRAR COM E-MAIL
                  </button>
                </div>
            </GlowingCard>

             {/* Right side: Módulo 1 featured information */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <h2 className="text-2xl font-black glowing-text">Nível 1: Fundamentos Vocais (Aberto)</h2>
              <p className="max-w-xl text-gray-400">Aqui, você estabelece as bases essenciais para uma performance vocal consistente e saudável. Conheça sua voz!</p>
              <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="flex-1 text-center py-4 bg-zinc-900 border border-cian-400/50 rounded-xl">Lvl 1</div>
                  <div className="flex-1 text-center py-4 bg-zinc-900 border border-cian-400/50 rounded-xl">10 min</div>
              </div>
              <LessonButton icon={Headphones} title="Lição 1.2: Aquecimento Vocal Básico" href="#" />
              <button onClick={handleBlockClick} className="mt-2 text-sm text-gray-500 py-1.5 px-6 border border-gray-600 rounded-full">ASSINAR PARA DESBLOQUEAR NÍVEL 1 COMPLETO</button>
            </div>
          </div>
        )}

        {/* List of Locked Levels */}
        <div className="w-full space-y-6 pt-12">
          <h3 className="text-xl font-bold">Trilha de Conhecimento</h3>
          <div className="border border-cian-400/30 rounded-2xl">
            <LockedLevelItem level="Nível 2" title="Respiração Avançada" onActionClick={handleBlockClick} />
            <LockedLevelItem level="Nível 3" title="Afinação e Percepção" onActionClick={handleBlockClick} />
            <LockedLevelItem level="Nível 4" title="Ressonância Vocal" onActionClick={handleBlockClick} />
            <LockedLevelItem level="Nível 5" title="Articulação e Dicção" onActionClick={handleBlockClick} />
            <LockedLevelItem level="Nível 6" title="Interpretação Emocional" onActionClick={handleBlockClick} />
            <LockedLevelItem level="Nível 7" title="Vibrato e Falsete" onActionClick={handleBlockClick} />
            <LockedLevelItem level="Nível 8" title="Potência e Projeção" onActionClick={handleBlockClick} />
            <LockedLevelItem level="Nível 9" title="Técnicas de Microfone" onActionClick={handleBlockClick} />
            <LockedLevelItem level="Nível 10" title="Performance de Palco Completa" onActionClick={handleBlockClick} />
          </div>
        </div>

        {/* Bottom Navigation Button */}
        <footer className="flex justify-center pt-16 border-t border-cian-400/30">
          <button className="py-3 px-10 bg-zinc-900 border border-gray-600 rounded-full hover:border-cian-400 hover:text-cian-400">VOLTAR PARA O PALCO</button>
        </footer>

      </div>
        <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Sans+Serif+Collection&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap');
      
      .Sans-Serif-Collection { font-family: 'Sans Serif Collection', sans-serif; }
      
      .font-sans { font-family: 'Sans Serif Collection', sans-serif; }
      
      .glowing-text {
        text-shadow: 0 0 8px #0ef;
      }
      
      .text-cian-400Glowing {
        color: #0ef;
        text-shadow: 0 0 10px #0ef;
      }
      
      .shadow-neon-blue {
        box-shadow: 0 0 15px rgba(0, 238, 255, 0.4);
      }
    `}</style>
    </div>
  );
};

export default Academy;