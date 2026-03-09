import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, PlayCircle, Mic2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Lesson = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o número da lição na URL
  const [step, setStep] = useState<'video' | 'practice'>('video');

  const lessonData = {
    title: "A Base: Respiração Diafragmática",
    level: "Nível 1",
    // 🚨 COLOQUE O ID DO SEU VÍDEO DO YOUTUBE AQUI DENTRO DAS ASPAS:
    youtubeId: "Wl6xUHg9iAQ", 
    description: "A fundação de tudo. Aprenda a parar de respirar pelo peito/ombros e a mandar o ar para o abdômen (diafragma).",
    exercise: "Ciclo 4-4-10-4",
    practiceDesc: "Inspirar (4s), Segurar (4s), Expirar (10s) e Descansar (4s). A IA vai analisar a estabilidade do seu fluxo de ar."
  };

  return (
    <div className="min-h-screen bg-black relative pb-20 pt-28 px-4 font-sans">
      <img src="https://picsum.photos/seed/masterclass/1920/1080" alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-[0.15]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black z-0" />
      
      <div className="max-w-6xl mx-auto relative z-10 animate-in fade-in duration-700">
        <button onClick={() => navigate('/academy')} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors uppercase text-xs font-bold tracking-widest">
          <ArrowLeft size={16} /> Voltar para Academy
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs mb-3 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              <PlayCircle size={14} /> Masterclass • {lessonData.level}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase drop-shadow-lg leading-tight">
              {lessonData.title.split(':')[0]}:<br/><span className="text-primary neon-blue-glow">{lessonData.title.split(':')[1]}</span>
            </h1>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm font-medium max-w-sm">{lessonData.description}</p>
          </div>
        </div>

        {/* MÓDULO 1: O VÍDEO DO YOUTUBE (AULA TEÓRICA) */}
        {step === 'video' && (
          <div className="animate-in slide-in-from-bottom-10 duration-500">
            <div className="w-full aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,168,225,0.15)] bg-zinc-900 mb-8 relative group">
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${lessonData.youtubeId}?rel=0&modestbranding=1`} 
                title="Lesson Video" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setStep('practice')} className="h-16 px-12 rounded-full bg-primary hover:bg-white text-black font-black text-xl italic uppercase tracking-tighter shadow-[0_0_30px_rgba(0,168,225,0.3)] transition-all">
                Ir para a Prática (Gravar) <ArrowLeft size={20} className="ml-3 rotate-180" />
              </Button>
            </div>
          </div>
        )}

        {/* MÓDULO 2: A PRÁTICA (MOTOR IA) */}
        {step === 'practice' && (
          <Card className="bg-zinc-950/80 backdrop-blur-xl border-primary/30 rounded-[3rem] shadow-[0_0_50px_rgba(0,168,225,0.1)] p-8 md:p-12 animate-in zoom-in-95 duration-500">
            <div className="flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full border-4 border-orange-500/30 bg-orange-500/10 flex items-center justify-center mb-6">
                <Mic2 className="h-10 w-10 text-orange-500" />
              </div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Exercício: {lessonData.exercise}</h2>
              <p className="text-gray-400 font-medium max-w-2xl mb-10">{lessonData.practiceDesc}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mb-12">
                <div className="bg-black border border-white/5 rounded-2xl p-6 flex flex-col items-center"><span className="text-3xl font-black text-white italic">4s</span><span className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2">Inspirar</span></div>
                <div className="bg-black border border-white/5 rounded-2xl p-6 flex flex-col items-center"><span className="text-3xl font-black text-white italic">4s</span><span className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2">Segurar</span></div>
                <div className="bg-black border border-primary/30 rounded-2xl p-6 flex flex-col items-center shadow-[0_0_20px_rgba(0,168,225,0.2)]"><span className="text-3xl font-black text-primary italic">10s</span><span className="text-xs text-primary font-bold uppercase tracking-widest mt-2">Expirar</span></div>
                <div className="bg-black border border-white/5 rounded-2xl p-6 flex flex-col items-center"><span className="text-3xl font-black text-white italic">4s</span><span className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2">Descansar</span></div>
              </div>

              <div className="flex gap-4 w-full max-w-md">
                <Button onClick={() => alert("A IA de Avaliação será injetada aqui!")} className="flex-1 h-16 rounded-full bg-orange-500 hover:bg-white text-black font-black text-lg uppercase tracking-widest shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all">
                  INICIAR GRAVAÇÃO
                </Button>
                <Button onClick={() => setStep('video')} variant="outline" className="h-16 px-8 rounded-full border-white/20 text-white font-bold hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-xs">
                  Rever Aula
                </Button>
              </div>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
};

export default Lesson;