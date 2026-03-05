import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 💡 CORREÇÃO: Ícone Mic2 adicionado aqui no topo para não quebrar a tela!
import { GraduationCap, Lock, Trophy, Star, BookOpen, PlayCircle, ArrowLeft, ShieldCheck, Sparkles, Mic2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const Academy = () => {
  const navigate = useNavigate();
  
  // 💡 GESTÃO DE ESTADO DO FUNIL DE VENDAS
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Array contendo os 10 níveis da Academy Prime
  const levels = [
    { id: 1, title: 'Steady Breath', desc: 'Dominando a respiração diafragmática para notas longas.', locked: false },
    { id: 2, title: 'Pitch Calibration', desc: 'Introdução para atingir as notas alvo com precisão.', locked: true },
    { id: 3, title: 'Rhythm Basics', desc: 'Mantendo o tempo e sincronizando os vocais.', locked: true },
    { id: 4, title: 'Vocal Resonance', desc: 'Explorando a ressonância de peito e cabeça.', locked: true },
    { id: 5, title: 'Agility & Riffs', desc: 'Melismas básicos e agilidade vocal.', locked: true },
    { id: 6, title: 'Vibrato Control', desc: 'Desenvolvendo um vibrato natural e controlado.', locked: true },
    { id: 7, title: 'Mixed Voice', desc: 'Conectando os registros sem quebras na voz.', locked: true },
    { id: 8, title: 'Dynamic Belting', desc: 'Potência vocal segura para os grandes refrões.', locked: true },
    { id: 9, title: 'Emotional Delivery', desc: 'Expressão e interpretação avançada.', locked: true },
    { id: 10, title: 'Pro Vocalist', desc: 'O teste final de maestria Prime.', locked: true },
  ];

  // ==========================================
  // TELA 1: ACADEMY BLOQUEADA (FUNIL DE ENTRADA)
  // ==========================================
  if (!isLoggedIn && !showLogin) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center relative p-4 font-sans">
        <button onClick={() => navigate('/')} className="absolute top-8 left-8 text-gray-400 hover:text-white flex items-center gap-2 font-bold uppercase tracking-widest text-xs z-50 transition-colors">
          <ArrowLeft size={16} /> Voltar para Home
        </button>

        <div className="relative z-10 flex flex-col items-center animate-in zoom-in duration-700 max-w-2xl text-center">
          <div className="h-32 w-32 rounded-full border-4 border-primary/30 bg-primary/5 flex items-center justify-center mb-8 shadow-[0_0_80px_rgba(0,168,225,0.2)]">
            <Lock className="h-12 w-12 text-primary drop-shadow-[0_0_15px_rgba(0,168,225,0.8)]" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter mb-4 uppercase drop-shadow-lg">
            ACADEMY <span className="text-primary neon-blue-glow">LOCKED</span>
          </h1>
          <p className="text-gray-400 font-medium text-lg mb-12">O currículo de 10 níveis é exclusivo para membros.</p>
          <Button onClick={() => setShowLogin(true)} className="h-16 px-12 rounded-full bg-primary hover:bg-white text-black font-black text-lg uppercase tracking-widest shadow-[0_0_40px_rgba(0,168,225,0.5)] transition-all hover:scale-105">
            Entrar para Treinar
          </Button>
        </div>
      </div>
    );
  }

  // ==========================================
  // TELA 2: PÁGINA DE LOGIN / CADASTRO
  // ==========================================
  if (!isLoggedIn && showLogin) {
    return (
      <div className="min-h-screen bg-black relative flex items-center justify-center p-4 font-sans overflow-hidden">
        <img src="https://picsum.photos/seed/loginbg/1920/1080" alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-[0.15]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/80 z-0" />
        
        <button onClick={() => setShowLogin(false)} className="absolute top-8 left-8 text-gray-400 hover:text-white flex items-center gap-2 font-bold uppercase tracking-widest text-xs z-50 transition-colors">
          <ArrowLeft size={16} /> Voltar
        </button>

        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
          
          {/* Lado Esquerdo - Copywriting */}
          <div className="space-y-8 hidden md:block">
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-white mb-4">
              <Mic2 size={16} className="text-primary" /> <span className="font-black italic tracking-tighter">KARAOKE <span className="text-primary">PRIME</span></span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[1.1]">
              Sua jornada para o <span className="text-orange-500 neon-gold-glow italic">Estrelato Global</span> começa aqui.
            </h1>
            <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-md">
              Acesse o Academy, participe de audições mundiais e transforme sua voz com nossa IA proprietária.
            </p>
            <div className="flex gap-6 pt-6">
              <div className="bg-zinc-900 border border-white/10 p-4 rounded-2xl flex-1">
                <Sparkles className="text-primary h-8 w-8 mb-2" />
                <h4 className="font-black text-white text-sm">Vocal AI</h4>
                <p className="text-[10px] text-gray-500 uppercase font-bold mt-1">Diagnóstico em tempo real.</p>
              </div>
              <div className="bg-zinc-900 border border-white/10 p-4 rounded-2xl flex-1">
                <ShieldCheck className="text-green-500 h-8 w-8 mb-2" />
                <h4 className="font-black text-white text-sm">Segurança</h4>
                <p className="text-[10px] text-gray-500 uppercase font-bold mt-1">Dados 100% criptografados.</p>
              </div>
            </div>
          </div>

          {/* Lado Direito - Formulário */}
          <Card className="bg-zinc-950/80 backdrop-blur-xl border-white/10 rounded-[3rem] shadow-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-orange-500 to-primary"></div>
            
            <div className="text-center mb-10">
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">Entrar na Conta</h2>
              <p className="text-gray-500 text-sm font-medium">Bem-vindo de volta, artista!</p>
            </div>

            <Button variant="outline" className="w-full h-14 rounded-2xl border-white/20 bg-white text-black hover:bg-gray-200 font-black mb-8 transition-colors flex items-center justify-center gap-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="h-5 w-5" /> Continuar com Google
            </Button>

            <div className="flex items-center gap-4 mb-8 opacity-50">
              <div className="flex-1 h-px bg-white/20"></div>
              <span className="text-[10px] uppercase font-black tracking-widest text-white">ou use seu e-mail</span>
              <div className="flex-1 h-px bg-white/20"></div>
            </div>

            <div className="space-y-6 mb-10">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">E-mail</label>
                <Input placeholder="seu@email.com" className="h-14 bg-black/50 border-white/10 text-white rounded-xl focus:border-primary px-4" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Senha</label>
                <Input type="password" placeholder="••••••••" className="h-14 bg-black/50 border-white/10 text-white rounded-xl focus:border-primary px-4" />
              </div>
            </div>

            {/* O BOTÃO MÁGICO QUE LOGA O USUÁRIO */}
            <Button onClick={() => setIsLoggedIn(true)} className="w-full h-16 rounded-2xl bg-primary hover:bg-white text-black font-black text-lg uppercase tracking-widest shadow-[0_0_30px_rgba(0,168,225,0.3)] transition-all mb-6">
              ENTRAR AGORA
            </Button>

            <p className="text-center text-xs text-gray-500 font-medium">
              Não tem uma conta? <span className="text-white font-bold cursor-pointer hover:text-primary transition-colors">Registre-se</span>
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // ==========================================
  // TELA 3: O CURRÍCULO ACADEMY (LIBERADO)
  // ==========================================
  return (
    <div className="min-h-screen bg-black relative pb-20 pt-28 px-4 font-sans">
      <img src="https://picsum.photos/seed/academy/1920/1080" alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-[0.15]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10 animate-in fade-in duration-700">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors uppercase text-xs font-bold tracking-widest">
          <ArrowLeft size={16} /> Voltar para Home
        </button>
        
        <div className="text-center mb-16">
          <GraduationCap className="h-16 w-16 text-primary mx-auto mb-6 drop-shadow-[0_0_15px_rgba(0,168,225,0.5)]" />
          <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter drop-shadow-lg uppercase">
            VOCAL <span className="text-primary neon-blue-glow">ACADEMY</span>
          </h1>
          <p className="text-gray-400 mt-6 uppercase tracking-widest text-sm font-bold">Do iniciante ao pro-vocal em 10 estágios</p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-black/60 border-primary/30 shadow-[0_0_20px_rgba(0,168,225,0.1)] rounded-3xl"><CardContent className="p-8 flex items-center gap-6"><Trophy className="text-primary h-10 w-10" /><div><p className="text-xs text-primary uppercase font-black tracking-widest mb-1">Nível Atual</p><p className="text-4xl font-black text-white italic">1</p></div></CardContent></Card>
          <Card className="bg-black/60 border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.1)] rounded-3xl"><CardContent className="p-8 flex items-center gap-6"><Star className="text-orange-500 h-10 w-10" /><div><p className="text-xs text-orange-500 uppercase font-black tracking-widest mb-1">XP Acumulado</p><p className="text-4xl font-black text-white italic">0</p></div></CardContent></Card>
          <Card className="bg-black/60 border-white/10 rounded-3xl"><CardContent className="p-8 flex items-center gap-6"><BookOpen className="text-gray-400 h-10 w-10" /><div><p className="text-xs text-gray-500 uppercase font-black tracking-widest mb-1">Lições Concluídas</p><p className="text-4xl font-black text-white italic">0 / 10</p></div></CardContent></Card>
        </div>

        {/* Grid dos 10 Níveis */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((lvl) => (
            <Card key={lvl.id} className={`flex flex-col rounded-3xl transition-all duration-300 ${!lvl.locked ? 'bg-black/80 border-primary shadow-[0_0_20px_rgba(0,168,225,0.2)] hover:scale-[1.02]' : 'bg-black/40 border-white/5 opacity-60 hover:opacity-100 relative'}`}>
              <CardContent className="p-8 flex-grow flex flex-col">
                {lvl.locked && <Lock className="absolute top-8 right-8 text-gray-500 h-5 w-5" />}
                
                <div className="flex justify-between items-start mb-4">
                  <h3 className={`text-2xl font-black italic tracking-tighter ${!lvl.locked ? 'text-primary' : 'text-white pr-8'}`}>
                    Nível {lvl.id}:<br/>{lvl.title}
                  </h3>
                  {!lvl.locked && <span className="text-[10px] px-3 py-1 rounded-full border border-primary text-primary font-bold uppercase tracking-widest bg-primary/10">Foco Atual</span>}
                </div>
                
                <p className="text-sm text-gray-400 mb-8 flex-grow font-medium leading-relaxed">{lvl.desc}</p>
                
                {!lvl.locked ? (
                  <Button onClick={() => alert('Próximo passo: Tela de Lição com seu Vídeo!')} className="w-full h-14 rounded-2xl bg-primary text-black font-black uppercase tracking-widest hover:bg-white shadow-xl">
                    <PlayCircle className="mr-2 h-5 w-5" /> Iniciar Lição
                  </Button>
                ) : (
                  <div className="w-full py-4 border border-white/10 rounded-2xl text-center text-xs text-gray-500 font-black uppercase tracking-widest flex items-center justify-center gap-2 bg-black/40">
                    <Lock className="h-4 w-4" /> Trancado
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Academy;