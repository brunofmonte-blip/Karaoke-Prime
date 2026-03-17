import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic2, GraduationCap, Globe, LayoutDashboard, Sparkles, Search, Trophy, Flame, Music2, PlayCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden pb-20 pt-24">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-b from-cyan-900/10 via-black to-black z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header/Hero Title */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 mb-6 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
            <Mic2 size={40} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-4">
            KARAOKE <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">PRIME</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm max-w-2xl mx-auto">
            A maior arena vocal do mundo. Cante, evolua e conquiste o seu espaço.
          </p>
        </div>

        {/* Main Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          
          {/* 1. Basic */}
          <Card onClick={() => navigate('/basic')} className="group cursor-pointer bg-zinc-950/80 border-white/10 hover:border-cyan-400/50 p-8 rounded-[2rem] transition-all hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] h-[280px] flex flex-col justify-between overflow-hidden relative">
            <div className="absolute -right-10 -top-10 text-white/5 group-hover:text-cyan-400/5 transition-colors duration-500">
              <Music2 size={160} />
            </div>
            <div className="relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mic2 className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">BASIC</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Catálogo Livre & Cante Agora</p>
            </div>
            <div className="flex items-center text-cyan-400 text-[10px] font-black uppercase tracking-widest gap-2 opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
              Entrar no Palco <PlayCircle size={14} />
            </div>
          </Card>

          {/* 2. Academy */}
          <Card onClick={() => navigate('/academy')} className="group cursor-pointer bg-zinc-950/80 border-cyan-400/30 hover:border-cyan-400 p-8 rounded-[2rem] transition-all hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] h-[280px] flex flex-col justify-between overflow-hidden relative">
             <div className="absolute -right-10 -top-10 text-cyan-400/5 group-hover:text-cyan-400/10 transition-colors duration-500">
              <GraduationCap size={160} />
            </div>
            <div className="relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-cyan-400/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                <GraduationCap className="text-cyan-400" size={28} />
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2 text-cyan-400">ACADEMY</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Treinamento Vocal Gamificado</p>
            </div>
            <div className="flex items-center text-cyan-400 text-[10px] font-black uppercase tracking-widest gap-2 opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
              Acessar Aulas <PlayCircle size={14} />
            </div>
          </Card>

          {/* 3. Next Talent */}
          <Card onClick={() => navigate('/talent')} className="group cursor-pointer bg-zinc-950/80 border-white/10 hover:border-white/30 p-8 rounded-[2rem] transition-all h-[280px] flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">NEXT TALENT</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-relaxed">Audições & Competições Globais</p>
            </div>
          </Card>

          {/* 4. Backstage */}
          <Card onClick={() => navigate('/backstage')} className="group cursor-pointer bg-zinc-950/80 border-white/10 hover:border-white/30 p-8 rounded-[2rem] transition-all h-[280px] flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <LayoutDashboard className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">BACKSTAGE</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-relaxed">Mural de Conquistas & Status</p>
            </div>
          </Card>

          {/* 5. Next Success */}
          <Card onClick={() => navigate('/success')} className="group cursor-pointer bg-zinc-950/80 border-white/10 hover:border-white/30 p-8 rounded-[2rem] transition-all h-[280px] flex flex-col justify-between overflow-hidden relative lg:col-span-2">
            <div className="absolute right-0 bottom-0 text-white/5">
              <Sparkles size={200} className="translate-x-1/4 translate-y-1/4" />
            </div>
            <div className="relative z-10 w-full md:w-2/3">
              <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="text-white" size={28} />
              </div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-2">NEXT SUCCESS</h3>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                Sua gravadora IA particular. Transforme suas performances em faixas originais prontas para o streaming.
              </p>
            </div>
          </Card>
        </div>

        {/* Busca Avançada Section */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Search className="text-cyan-400" size={24} />
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">O Que Você Quer Cantar Hoje?</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 max-w-3xl">
            <Input 
              placeholder="Busque por artista, música, gênero ou tom..." 
              className="h-16 bg-zinc-950/80 border-white/10 text-white rounded-2xl px-6 focus-visible:ring-cyan-400 w-full"
            />
            <Button className="h-16 px-10 bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase tracking-widest rounded-2xl w-full sm:w-auto">
              Buscar
            </Button>
          </div>
        </div>

        {/* Mural de Conquistas / Trending */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          
          {/* Músicas em Alta */}
          <div className="bg-zinc-950/50 border border-white/10 rounded-[2rem] p-8">
            <div className="flex items-center gap-3 mb-6">
              <Flame className="text-orange-500" size={24} />
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">Músicas em Alta</h2>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-black/50 rounded-xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500 font-black italic">{i}</span>
                    <div>
                      <h4 className="font-bold text-sm uppercase group-hover:text-cyan-400 transition-colors">Evidências</h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Chitãozinho & Xororó</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-cyan-400 hover:bg-cyan-400/10 rounded-full">
                    <PlayCircle size={20} />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Ranking Global */}
          <div className="bg-zinc-950/50 border border-white/10 rounded-[2rem] p-8">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="text-yellow-500" size={24} />
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">Ranking Global</h2>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-black/50 rounded-xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center font-black text-xs ${i === 1 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-white/5 text-gray-400'}`}>
                      #{i}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm uppercase">Cantor {i}</h4>
                      <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Lenda do Estádio</p>
                    </div>
                  </div>
                  <span className="font-black italic text-sm">{99 - i}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pb-8 border-t border-white/10 pt-12">
          <h2 className="text-2xl font-black italic uppercase tracking-[0.3em] text-white/20 mb-4">
            CANTE. EVOLUA. CONQUISTE.
          </h2>
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
            © 2024 Karaoke Prime. Todos os direitos reservados.
          </p>
        </div>

      </div>
    </div>
  );
}