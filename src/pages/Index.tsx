import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Mic2, GraduationCap, Star, Lock, Music, LayoutDashboard, 
  Sparkles, Trophy, Globe, Medal, Heart, MessageCircle, ArrowRight, User as LucideUser, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

// 🚨 IMPORTAMOS O NOSSO GRÁFICO OFICIAL
import VocalEvolutionChart from '@/components/VocalEvolutionChart';

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUser | null>(null);

  // 🚨 ESTADOS DO BANCO DE DADOS LOCAL (MVP)
  const [bestScore, setBestScore] = useState<number>(0);
  const [academyLevel, setAcademyLevel] = useState<number>(1);
  const [lastPerformanceData, setLastPerformanceData] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // 🚨 CARREGANDO DADOS DO LOCALSTORAGE ASSIM QUE A TELA ABRE
    const savedScore = localStorage.getItem('karaoke_best_score');
    const savedLevel = localStorage.getItem('karaoke_level');
    const savedHistory = localStorage.getItem('karaoke_last_history');

    if (savedScore) setBestScore(parseFloat(savedScore));
    if (savedLevel) setAcademyLevel(parseInt(savedLevel));
    if (savedHistory) {
      try {
        setLastPerformanceData(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Erro ao ler histórico", e);
      }
    }

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col pt-16 font-sans text-white overflow-x-hidden">
      
      {/* 1. HERO SECTION & ACESSO RÁPIDO */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center p-4">
        <img src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2000" alt="Studio" className="absolute inset-0 w-full h-full object-cover opacity-[0.35]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black z-0" />
        
        <div className="relative z-10 text-center mt-10 mb-20 animate-in fade-in duration-1000">
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4 uppercase italic">
            KARAOKE <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">PRIME</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium max-w-3xl mx-auto">
            A plataforma definitiva para evolução vocal e performance global.
          </p>
        </div>
        
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 w-full max-w-7xl px-4">
          <Card onClick={() => navigate('/basic')} className="cursor-pointer group p-6 rounded-3xl border border-cyan-400/50 bg-black/60 hover:bg-cyan-400/10 transition-all h-56 shadow-2xl flex flex-col justify-between">
            <div className="h-12 w-12 rounded-xl bg-cyan-400/20 flex items-center justify-center text-cyan-400"><Music size={24} /></div>
            <div>
              <h3 className="font-black text-white text-xl uppercase italic group-hover:text-cyan-400 transition-colors">Basic</h3>
              <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">Karaoke tradicional, batalhas e duetos.</p>
            </div>
          </Card>
          
          <Card onClick={() => navigate('/academy')} className="cursor-pointer group p-6 rounded-3xl border border-cyan-400/50 bg-black/60 hover:bg-cyan-400/10 transition-all h-56 shadow-2xl flex flex-col justify-between">
            <div className="h-12 w-12 rounded-xl bg-cyan-400/20 flex items-center justify-center text-cyan-400"><GraduationCap size={24} /></div>
            <div>
              <h3 className="font-black text-white text-xl uppercase italic group-hover:text-cyan-400 transition-colors">Academy</h3>
              <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">Treinamento profissional completo.</p>
            </div>
          </Card>
          
          {[
            { n: 'Next Talent', path: '/talent', i: Globe, d: 'Audições Globais' },
            { n: 'Backstage', path: '/backstage', i: LayoutDashboard, d: 'Dashboard Pro' },
            { n: 'Next Success', path: '/next-success', i: Sparkles, d: 'Músicas IA' }
          ].map((item) => (
            <Card key={item.n} onClick={() => navigate(item.path)} className="cursor-pointer group opacity-50 hover:opacity-100 hover:border-cyan-400/30 transition-all p-6 rounded-3xl border border-white/10 bg-black/60 h-56 relative flex flex-col justify-between">
              <Lock className="absolute top-6 right-6 text-gray-500 h-4 w-4 group-hover:text-cyan-400 transition-colors" />
              <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-cyan-400 transition-colors"><item.i size={24} /></div>
              <div>
                <h3 className="font-black text-gray-400 text-lg uppercase italic group-hover:text-white transition-colors">{item.n}</h3>
                <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-widest">{item.d}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 2. BUSCA AVANÇADA */}
      <section className="relative z-20 max-w-5xl mx-auto w-full px-4 -mt-12 mb-32">
        <div className="flex bg-zinc-900/90 backdrop-blur border border-white/10 rounded-full p-2 items-center shadow-2xl">
          <Search className="h-6 w-6 text-cyan-400 ml-6 mr-3" />
          <Input placeholder="Artista, Música ou Gênero..." className="border-0 bg-transparent text-white focus-visible:ring-0 h-16 text-sm md:text-lg w-full font-medium placeholder:text-gray-500" />
          <div className="hidden md:flex gap-6 text-[10px] text-white font-black uppercase tracking-widest mx-8 whitespace-nowrap">
            <span className="cursor-pointer text-cyan-400">Tudo</span>
            <span className="cursor-pointer text-gray-500 hover:text-white transition-colors">Nacional</span>
            <span className="cursor-pointer text-gray-500 hover:text-white transition-colors">Inter</span>
          </div>
          <Button className="rounded-full bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase tracking-widest px-8 md:px-12 h-14 md:h-16 transition-colors">Buscar</Button>
        </div>
      </section>

      {/* 3. MURAL DE CONQUISTAS */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32">
        <h2 className="text-4xl md:text-5xl font-black text-white text-center mb-16 italic tracking-tighter uppercase">
          Mural de <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">Conquistas</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[ 
            {icon: Star, t: 'Early Bird', c: 'text-cyan-400'}, 
            {icon: Mic2, t: 'Rock Star', c: 'text-white'}, 
            {icon: Trophy, t: 'Duel Master', c: 'text-cyan-400'}, 
            {icon: Medal, t: 'Perfect Pitch', c: 'text-white'}, 
            {icon: Globe, t: 'Polyglot', c: 'text-cyan-400'}
          ].map((b, i) => (
            <Card key={i} className="bg-zinc-950 border-white/10 flex flex-col items-center p-8 text-center rounded-[2rem] hover:border-cyan-400/50 transition-all group">
              <div className={`h-20 w-20 rounded-full border-2 flex items-center justify-center mb-6 bg-black ${b.c} border-current shadow-[0_0_15px_rgba(34,211,238,0.1)] group-hover:scale-110 transition-transform`}>
                <b.icon className="h-10 w-10" />
              </div>
              <h4 className="font-black text-white text-sm italic uppercase">{b.t}</h4>
              <p className="text-[8px] text-gray-500 font-bold uppercase mt-2 tracking-widest">Desbloqueado</p>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. MÚSICAS POR PAÍS */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32">
        <h2 className="text-3xl font-black text-white text-center mb-12 uppercase italic tracking-tighter flex items-center justify-center gap-4">
          <Globe className="text-cyan-400" /> Músicas Mais Cantadas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[ 
            {n:'Brasil', s:'BR', f:'br'}, 
            {n:'EUA', s:'US', f:'us'}, 
            {n:'Japão', s:'JP', f:'jp'}, 
            {n:'Reino Unido', s:'GB', f:'gb'}
          ].map((c, i) => (
            <Card key={i} className="bg-zinc-950 border-white/10 p-8 rounded-[2rem] hover:border-cyan-400/50 transition-colors flex flex-col items-center">
              <img src={`https://flagcdn.com/w160/${c.f}.png`} className="w-16 mb-4 rounded shadow-lg border border-white/10" alt={c.n} />
              <h2 className="text-3xl font-black text-white mb-1 italic">{c.s}</h2>
              <p className="text-gray-500 text-[10px] font-black uppercase mb-6 tracking-widest text-center">{c.n}</p>
              <Button variant="outline" className="rounded-full text-[10px] font-black uppercase tracking-widest h-8 border-white/20 hover:bg-white hover:text-black transition-all">
                Explorar <ArrowRight size={12} className="ml-2" />
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. TREND TOPICS SINGERS */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32">
        <h2 className="text-3xl font-black text-white mb-8 italic uppercase tracking-tighter">
          Trend Topics <span className="text-orange-500">🔥</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="relative aspect-[9/16] rounded-3xl overflow-hidden group cursor-pointer border border-white/10 bg-zinc-900 shadow-2xl">
              <img src={`https://picsum.photos/seed/singer_prime_${i}/600/800`} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt="Singer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent p-6 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full border border-cyan-400 bg-zinc-800" />
                  <p className="font-black text-white text-xs italic truncate">@VocalStar_{i}</p>
                </div>
                <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest truncate">🎵 Rolling in the Deep</p>
                <div className="flex gap-4 mt-4 opacity-70">
                  <div className="flex items-center gap-1"><Heart size={14} className="text-white" /><span className="text-[8px] font-black">12k</span></div>
                  <div className="flex items-center gap-1"><MessageCircle size={14} className="text-white" /><span className="text-[8px] font-black">842</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. RECENTLY ADDED & 7. TREND TAGS */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-3xl font-black text-white mb-8 italic uppercase tracking-tighter">Recently Added</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[ 
              {t: 'Evidências', a: 'Chitãozinho & Xororó'}, 
              {t: 'Tennessee Whiskey', a: 'Chris Stapleton'}, 
              {t: 'Tá Escrito', a: 'Revelação'}, 
              {t: 'Clarity', a: 'Zedd'}
            ].map((item, i) => (
              <Card key={i} className="bg-zinc-950 border-white/5 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
                <div className="h-16 w-16 bg-zinc-800 rounded-lg shrink-0 overflow-hidden border border-white/10">
                  <img src={`https://picsum.photos/seed/karaoke_${i}/150/150`} alt="Cover" className="w-full h-full object-cover" />
                </div>
                <div className="truncate">
                  <p className="font-black text-white text-sm truncate uppercase italic">{item.t}</p>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest truncate">{item.a}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-3xl font-black text-white mb-8 italic uppercase tracking-tighter flex items-center gap-3">
            Trend Tags <span className="bg-cyan-400/20 text-cyan-400 px-2 py-1 text-sm rounded-md">#</span>
          </h2>
          <div className="space-y-3">
             {['Sertanejo2026', 'RockClassics', 'VocalAcademy', 'AnimeHits'].map((tag, idx) => (
               <div key={tag} className="bg-zinc-950 border border-white/10 rounded-2xl p-5 flex justify-between items-center hover:border-cyan-400/50 cursor-pointer transition-all group">
                 <div className="flex items-center gap-4">
                   <span className="text-cyan-400 font-black text-xl italic group-hover:scale-125 transition-transform">#</span>
                   <div>
                     <p className="font-black text-white text-base md:text-lg italic uppercase">{tag}</p>
                     <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{10 + idx * 5}k Cantores</p>
                   </div>
                 </div>
                 <span className="text-green-400 text-xs font-black bg-green-400/10 px-3 py-1 rounded-full">+{(idx+1)*12}% ↗</span>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 8. RANKINGS GLOBAIS */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32">
         <h2 className="text-4xl md:text-5xl font-black text-cyan-400 text-center mb-16 uppercase italic tracking-tighter drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
           Rankings Globais
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Global Top 5', 'Nacional Top 3', 'Local Top 2'].map((title, idx) => (
              <Card key={title} className={`bg-zinc-950 p-8 rounded-[2.5rem] border-2 shadow-2xl ${idx === 0 ? 'border-cyan-400/50 shadow-[0_0_30px_rgba(34,211,238,0.1)]' : 'border-white/10'}`}>
                <h3 className={`text-xl font-black text-center mb-8 uppercase italic ${idx === 0 ? 'text-cyan-400' : 'text-white'}`}>{title}</h3>
                <div className="space-y-5">
                  {[1,2,3,4,5].slice(0, idx === 0 ? 5 : idx === 1 ? 3 : 2).map(pos => (
                    <div key={pos} className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600 font-black text-sm w-4">{pos}</span>
                        <div className="h-8 w-8 rounded-full bg-zinc-800 border border-white/10" />
                        <span className="text-white text-[10px] font-bold uppercase truncate max-w-[100px]">User_Prime_{pos}</span>
                      </div>
                      <span className="text-cyan-400 font-black text-base italic">{99 - pos}.{pos}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
         </div>
      </section>

      {/* 9. DASHBOARD DINÂMICO DA HOME */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-cyan-400 mb-12 uppercase italic tracking-tighter drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
            Evolução Vocal<br/><span className="text-white text-2xl md:text-3xl">Meu Dashboard</span>
          </h2>
          <div className="text-center space-y-6 bg-zinc-950 border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <h3 className="text-3xl font-black text-white italic">
              {user ? `De volta ao palco, ${user.displayName?.split(' ')[0]}!` : "Pronto para Cantar?"}
            </h3>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest leading-relaxed">
              {user ? "A inteligência artificial já processou sua última performance. Confira seus números." : "Cante no Basic Lobby para liberar a análise avançada de voz."}
            </p>
            
            {/* 🚨 AQUI ENTRA O GRÁFICO REAL COM OS DADOS DO LOCALSTORAGE */}
            <div className="mt-8 w-full h-48 md:h-56 bg-black/50 rounded-[2rem] border border-white/5 shadow-inner">
              {lastPerformanceData.length > 0 ? (
                <VocalEvolutionChart 
                  title="Última Performance" 
                  data={lastPerformanceData} 
                  height="100%" 
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                  <Activity className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Nenhum histórico recente.</p>
                  <Button onClick={() => navigate('/basic')} variant="link" className="text-cyan-400 text-xs mt-2">Cantar Agora</Button>
                </div>
              )}
            </div>

            <p className="text-cyan-400 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] pt-6 flex items-center justify-center gap-2">
              <Sparkles size={14} /> IA ATIVA NO MODO PRIME
            </p>
          </div>
        </div>
        
        <Card className="bg-zinc-950 border-white/10 rounded-[3rem] shadow-2xl p-10 relative overflow-hidden">
          <div className="flex items-center gap-6 mb-10 pb-10 border-b border-white/10">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="h-20 w-20 md:h-24 md:w-24 rounded-full border-2 border-cyan-400 object-cover shadow-[0_0_20px_rgba(34,211,238,0.2)]" />
            ) : (
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-full border-2 border-cyan-400/50 bg-cyan-400/10 flex items-center justify-center shadow-lg"><LucideUser size={40} className="text-cyan-400" /></div>
            )}
            <div>
              <h3 className="text-xl md:text-2xl font-black text-white mb-1 italic tracking-tighter uppercase truncate">{user ? user.displayName : "Cantor Convidado"}</h3>
              <p className={`text-[10px] font-black tracking-widest uppercase inline-block px-3 py-1 rounded-md ${user ? "text-black bg-cyan-400" : "text-gray-500 bg-gray-500/20"}`}>
                {user ? "Prime Member" : "Guest Access"}
              </p>
            </div>
          </div>
          <div className="space-y-6">
              {/* 🚨 DADOS REAIS SENDO EXIBIDOS AQUI */}
              <div className="flex justify-between items-center"><span className="text-[10px] md:text-xs font-black uppercase text-gray-500 tracking-widest flex items-center gap-2"><Star size={14} className="text-cyan-400" /> Score Máximo</span><span className="font-black text-white text-xl md:text-2xl italic">{bestScore > 0 ? `${bestScore.toFixed(1)}%` : "--%"}</span></div>
              <div className="flex justify-between items-center"><span className="text-[10px] md:text-xs font-black uppercase text-gray-500 tracking-widest flex items-center gap-2"><GraduationCap size={14} className="text-cyan-400" /> Nível Academy</span><span className="font-black text-white text-xl md:text-2xl italic">Nível {academyLevel}</span></div>
              <div className="flex justify-between items-center"><span className="text-[10px] md:text-xs font-black uppercase text-gray-500 tracking-widest flex items-center gap-2"><Trophy size={14} className="text-cyan-400" /> Rank Global</span><span className="font-black text-white text-xl md:text-2xl italic">#412</span></div>
          </div>
        </Card>
      </section>

      {/* RODAPÉ E CTA FINAL */}
      <footer className="text-center pb-24 pt-20 border-t border-white/10 bg-zinc-950 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-400/5 to-transparent pointer-events-none" />
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter italic uppercase mb-12 opacity-30 hover:opacity-100 hover:text-cyan-400 transition-all duration-700 cursor-default">
          CANTE. EVOLUA. CONQUISTE.
        </h2>
        
        <div className="flex justify-center gap-8 mb-12 text-gray-600 relative z-10">
          <Heart size={24} className="hover:text-cyan-400 cursor-pointer transition-colors" />
          <MessageCircle size={24} className="hover:text-cyan-400 cursor-pointer transition-colors" />
          <Globe size={24} className="hover:text-cyan-400 cursor-pointer transition-colors" />
        </div>
        
        <p className="text-[10px] text-gray-600 font-black tracking-[0.5em] md:tracking-[0.8em] uppercase relative z-10">
          © 2026 KARAOKE PRIME - ALL RIGHTS RESERVED
        </p>
      </footer>
      
    </div>
  );
};

export default Index;