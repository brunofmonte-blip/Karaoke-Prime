// src/pages/Academy.tsx

import React from 'react';
import { Mic, Headphones, Heart, Star, Trophy, Lock } from 'lucide-react';

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
const LockedLevelItem = ({ level, title }) => (
  <div className="flex items-center justify-between gap-4 py-4 px-6 border-b border-cian-400/20 group hover:bg-cian-400/5">
    <div className="flex items-center gap-4">
      <Lock className="w-8 h-8 text-gray-500" />
      <div className="flex flex-col">
        <span className="text-lg font-bold text-gray-400 group-hover:text-cian-400">{level}</span>
        <span className="text-sm text-gray-500">{title}</span>
      </div>
    </div>
    <button className="text-sm text-gray-500 group-hover:text-cian-400 py-1.5 px-4 border border-gray-600 rounded-full group-hover:border-cian-400">
      BLOQUEADO, ASSINE PARA DESBLOQUEAR
    </button>
  </div>
);

const Academy: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white relative font-sans">
      
      {/* Background Image Layer with Gradient Overlay and Effects */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter grayscale opacity-30"
        style={{ backgroundImage: "url('https://example.com/microphone_stage_image.jpg')" }} // Using example URL; replace with actual image URL if needed
      />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-cian via-black/90 to-black z-0" />
      
      {/* Global PiP Chat Window */}
      <div className="absolute bottom-6 right-6 w-56 aspect-square bg-zinc-900 border-cian-400/50 rounded-full flex items-center justify-center p-4 z-50 shadow-neon-blue">
        <img src="https://example.com/person_face_pi_window.jpg" alt="Persona" className="w-24 h-24 rounded-full border-2 border-cian-400" />
      </div>

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
            <button className="text-sm py-2 px-6 bg-zinc-900 border border-cian-400/50 rounded-full hover:bg-cian-400 hover:text-black">Sign In</button>
          </div>
        </header>

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

        {/* Level 1 Card: Featured Lessons */}
        <GlowingCard className="w-full">
          <div className="flex items-start justify-between gap-12 mb-10">
            <div className="space-y-4">
              <h2 className="text-2xl font-black glowing-text">Nível 1: Fundamentos Vocais (Aberto)</h2>
              <p className="max-w-xl text-gray-400">Aqui, você estabelece as bases essenciais para uma performance vocal consistente e saudável. Conheça sua voz!</p>
            </div>
            <button className="mt-2 text-sm text-gray-500 py-1.5 px-6 border border-gray-600 rounded-full">ASSINAR PARA DESBLOQUEAR NÍVEL 1 COMPLETO</button>
          </div>
          <div className="flex gap-10">
            <LessonButton icon={Mic} title="Lição 1.1: Respiração Diafragmática" href="#" />
            <LessonButton icon={Headphones} title="Lição 1.2: Aquecimento Vocal Básico" href="#" />
            <LessonButton icon={Mic} title="Lição 1.3: Percepção Rítmica" href="#" />
          </div>
          <div className="flex justify-center mt-12">
            <button className="w-full max-w-lg py-4 bg-cian-400 text-black font-black text-lg rounded-2xl hover:bg-cian-300">ASSINAR PARA DESBLOQUEAR NÍVEL 1 COMPLETO</button>
          </div>
        </GlowingCard>

        {/* List of Locked Levels */}
        <div className="w-full space-y-6">
          <h3 className="text-xl font-bold">Trilha de Conhecimento</h3>
          <div className="border border-cian-400/30 rounded-2xl">
            <LockedLevelItem level="Nível 2" title="Respiração Avançada" />
            <LockedLevelItem level="Nível 3" title="Afinação e Percepção" />
            <LockedLevelItem level="Nível 4" title="Ressonância Vocal" />
            <LockedLevelItem level="Nível 5" title="Articulação e Dicção" />
            <LockedLevelItem level="Nível 6" title="Interpretação Emocional" />
            <LockedLevelItem level="Nível 7" title="Vibrato e Falsete" />
            <LockedLevelItem level="Nível 8" title="Potência e Projeção" />
            <LockedLevelItem level="Nível 9" title="Técnicas de Microfone" />
            <LockedLevelItem level="Nível 10" title="Performance de Palco Completa" />
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