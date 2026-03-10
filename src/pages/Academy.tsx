// 🚨 ATENÇÃO: ESTE CÓDIGO DEVE FICAR EXCLUSIVAMENTE NO ARQUIVO src/pages/Academy.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Mic2, Users, CheckCircle, GraduationCap, Star, Airplay } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 🖼️ IMPORTANDO A IMAGEM DE FUNDO DA SALA DE AULA (Ajuste o caminho se necessário)
import classroomBackground from '../assets/classroom_background.png'; 

const Academy = () => {
  const navigate = useNavigate();
  
  // Exemplo de módulos de treinamento para o MVP
  const trainingModules = [
    { id: 1, title: "Módulo 1: Respiração e Apoio.", description: "Exercícios de diafragma, controle de fluxo de ar.", icon: Airplay, level: 1, duration: "10 min" },
    { id: 2, title: "Módulo 2: Afinação e Percepção.", description: "Exercícios para treinar o ouvido e o tempo.", icon: Mic2, level: 2, duration: "12 min" },
    { id: 3, title: "Módulo 3: Ressonância e Dicção.", description: "Melhora da qualidade tonal e clareza.", icon: BookOpen, level: 3, duration: "15 min" },
    { id: 4, title: "Módulo 4: Interpretação Vocal.", description: "Expressão e emoção ao cantar.", icon: Users, level: 4, duration: "20 min" },
  ];

  return (
    <div className="min-h-screen relative pb-20 pt-28 px-4 font-sans overflow-hidden">
      
      {/* 🖼️ A IMAGEM DE FUNDO DA SALA DE AULA (Z-Index 0) */}
      <img 
        src={classroomBackground} 
        alt="Classroom Background" 
        className="absolute inset-0 w-full h-full object-cover opacity-30 z-0" 
      />
      
      {/* Gradiente de sobreposição para manter o tema escuro e a leitura (Z-Index 1) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black z-10" />
      
      {/* ========================================================= */}
      
      {/* O CONTEÚDO PRINCIPAL (Z-Index 20) */}
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
            Seu espaço para dominar técnicas, treinar respiração e aprimorar a afinação antes de brilhar nos palcos.
          </p>
        </div>

        {/* MÓDULOS DE TREINAMENTO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom-5">
          {trainingModules.map((module) => {
            const Icon = module.icon;
            return (
              <Card key={module.id} className="bg-zinc-950/70 backdrop-blur-xl border-white/10 hover:border-primary/50 transition-all duration-300 rounded-[2rem] p-6 flex flex-col items-center text-center group shadow-2xl">
                <div className="h-16 w-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-[0_0_30px_rgba(0,168,225,0.3)] shrink-0">
                  <Icon className="h-6 w-6 text-white group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-lg font-black text-white italic tracking-tighter uppercase mb-1 line-clamp-2 min-h-[56px] flex items-center justify-center">{module.title}</h3>
                <p className="text-gray-300 font-bold uppercase tracking-widest text-[10px] mb-6 line-clamp-1">{module.description}</p>
                
                <div className="w-full grid grid-cols-2 gap-2 mb-6">
                  <div className="bg-black/50 rounded-2xl p-3 border border-white/5">
                    <Star className="w-4 h-4 text-yellow-500 mb-1 mx-auto" />
                    <p className="text-xl font-black text-white">Lvl {module.level}</p>
                    <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">Dificuldade</p>
                  </div>
                  <div className="bg-black/50 rounded-2xl p-3 border border-white/5">
                    <GraduationCap className="w-4 h-4 text-primary mb-1 mx-auto" />
                    <p className="text-xl font-black text-white">{module.duration}</p>
                    <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">Duração</p>
                  </div>
                </div>
                
                <Button className="w-full h-12 rounded-full bg-white hover:bg-primary text-black font-black uppercase tracking-widest text-xs transition-all mt-auto shadow-lg">
                  INICIAR EXERCÍCIO <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Academy;