import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { 
  Search, Mic2, GraduationCap, Star, Lock, Music, LayoutDashboard, 
  Sparkles, Trophy, Globe, Medal, Heart, MessageCircle, ArrowRight, User as LucideUser
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col pt-16 font-sans text-white overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center p-4">
        <img src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2000" alt="Studio" className="absolute inset-0 w-full h-full object-cover opacity-[0.35]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black z-0" />
        <div className="relative z-10 text-center mt-10 mb-20 animate-in fade-in duration-1000">
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4 uppercase italic">KARAOKE <span className="text-primary drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">PRIME</span></h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium max-w-3xl mx-auto">A plataforma definitiva para evolução vocal e performance global.</p>
        </div>
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 w-full max-w-7xl px-4">
          <Card onClick={() => navigate('/basic')} className="cursor-pointer group p-6 rounded-3xl border border-primary/50 bg-black/60 hover:bg-primary/20 transition-all h-56 shadow-2xl flex flex-col justify-between">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary"><Music size={24} /></div>
            <div><h3 className="font-black text-white text-xl uppercase italic">Basic</h3><p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">Karaoke tradicional e batalhas e duetos online.</p></div>
          </Card>
          <Card onClick={() => navigate('/academy')} className="cursor-pointer group p-6 rounded-3xl border border-primary/50 bg-black/60 hover:bg-primary/20 transition-all h-56 shadow-2xl flex flex-col justify-between">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary"><GraduationCap size={24} /></div>
            <div><h3 className="font-black text-white text-xl uppercase italic">Academy</h3><p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">10 níveis com treinamento profissional.</p></div>
          </Card> 
          <Card onClick={() => navigate('/Next Talent')} className="cursor-pointer group p-6 rounded-3xl border border-primary/50 bg-black/60 hover:bg-primary/20 transition-all h-56 shadow-2xl flex flex-col justify-between">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary"><Music size={24} /></div>
            <div><h3 className="font-black text-white text-xl uppercase italic">Next Talent</h3><p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">Audições gamificadas para amadores.</p></div>
          </Card>
          <Card onClick={() => navigate('/Backstage')} className="cursor-pointer group p-6 rounded-3xl border border-primary/50 bg-black/60 hover:bg-primary/20 transition-all h-56 shadow-2xl flex flex-col justify-between">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary"><GraduationCap size={24} /></div>
            <div><h3 className="font-black text-white text-xl uppercase italic">Backstage</h3><p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">Audições gamificadas para profissionais.</p></div>
          </Card> 
          <Card onClick={() => navigate('/Next Success')} className="cursor-pointer group p-6 rounded-3xl border border-primary/50 bg-black/60 hover:bg-primary/20 transition-all h-56 shadow-2xl flex flex-col justify-between">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary"><Music size={24} /></div>
            <div><h3 className="font-black text-white text-xl uppercase italic">Next Success</h3><p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">Transforme ideias em músicas IA.</p></div>
            <Card key={item} className="opacity-40 p-6 rounded-3xl border border-white/10 bg-black/60 h-56 relative flex flex-col justify-between">
              <Lock className="absolute top-6 right-6 text-gray-500 h-4 w-4" />
              <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-500"><Star size={24} /></div>
              <h3 className="font-black text-gray-400 text-lg uppercase italic">{item}</h3>
            </Card>
          ))}
        </div>
      </section>

      {/* 2. BUSCA AVANÇADA */}
      <section className="relative z-20 max-w-5xl mx-auto w-full px-4 -mt-12 mb-32">
        <div className="flex bg-zinc-900/90 backdrop-blur border border-white/10 rounded-full p-2 items-center shadow-2xl">
          <Search className="h-6 w-6 text-primary ml-6 mr-3" />
          <Input placeholder="Artista, Música ou Gênero..." className="border-0 bg-transparent text-white focus-visible:ring-0 h-16 text-lg w-full font-medium" />
          <div className="hidden md:flex gap-6 text-[10px] text-white font-black uppercase tracking-widest mx-8 whitespace-nowrap">
            <span className="cursor-pointer text-primary">Tudo</span>
            <span className="cursor-pointer text-gray-500 hover:text-white transition-colors">Nacional</span>
            <span className="cursor-pointer text-gray-500 hover:text-white transition-colors">Inter</span>
          </div>
          <Button className="rounded-full bg-primary hover:bg-white text-black font-black uppercase tracking-widest px-12 h-16 transition-colors">Buscar</Button>
        </div>
      </section>

      {/* 3. MURAL DE CONQUISTAS */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32">
        <h2 className="text-5xl font-black text-white text-center mb-16 italic tracking-tighter uppercase">Mural de <span className="text-primary drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">Conquistas</span></h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[ {icon: Star, t: 'Early Bird', c: 'text-primary'}, {icon: Mic2, t: 'Rock Star', c: 'text-white'}, {icon: Trophy, t: 'Duel Master', c: 'text-primary'}, {icon: Medal, t: 'Perfect Pitch', c: 'text-white'}, {icon: Globe, t: 'Polyglot', c: 'text-primary'}].map((b, i) => (
            <Card key={i} className="bg-zinc-950 border-white/10 flex flex-col items-center p-8 text-center rounded-[2rem] hover:border-white/30 transition-all">
              <div className={`h-20 w-20 rounded-full border-2 flex items-center justify-center mb-6 bg-black ${b.c} border-current shadow-[0_0_15px_rgba(34,211,238,0.1)]`}><b.icon className="h-10 w-10" /></div>
              <h4 className="font-black text-white text-sm italic uppercase">{b.t}</h4>
              <p className="text-[8px] text-gray-500 font-bold uppercase mt-2 tracking-widest">Desbloqueado</p>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. MÚSICAS POR PAÍS */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32">
        <h2 className="text-3xl font-black text-white text-center mb-12 uppercase italic tracking-tighter flex items-center justify-center gap-4"><Globe className="text-primary" /> Músicas Mais Cantadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[ {n:'Brasil', s:'BR', f:'br'}, {n:'EUA', s:'US', f:'us'}, {n:'Japão', s:'JP', f:'jp'}, {n:'Reino Unido', s:'GB', f:'gb'}].map((c, i) => (
            <Card key={i} className="bg-zinc-950 border-white/10 p-8 rounded-[2rem] hover:border-primary transition-colors flex flex-col items-center">
              <img src={`https://flagcdn.com/w160/${c.f}.png`} className="w-16 mb-4 rounded shadow-lg border border-white/10" alt={c.n} />
              <h2 className="text-3xl font-black text-white mb-1 italic">{c.s}</h2>
              <p className="text-gray-500 text-[10px] font-black uppercase mb-6 tracking-widest">{c.n}</p>
              <Button variant="outline" className="rounded-full text-[10px] font-black uppercase tracking-widest h-8 border-white/20 hover:bg-white hover:text-black transition-all">Explorar <ArrowRight size={12} className="ml-2" /></Button>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. TREND TOPICS SINGERS */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32">
        <h2 className="text-3xl font-black text-white mb-8 italic uppercase tracking-tighter">Trend Topics <span className="text-primary">🔥</span></h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="relative aspect-[9/16] rounded-3xl overflow-hidden group cursor-pointer border border-white/10 bg-zinc-900 shadow-2xl">
              <img src={`https://picsum.photos/seed/singer_prime_${i}/600/800`} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt="Singer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent p-6 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full border border-primary bg-zinc-800" />
                  <p className="font-black text-white text-xs italic">@VocalStar_{i}</p>
                </div>
                <p className="text-[10px] text-primary font-bold uppercase tracking-widest">🎵 Rolling in the Deep</p>
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
        {/* Recently Added */}
        <div>
          <h2 className="text-3xl font-black text-white mb-8 italic uppercase tracking-tighter">Recently Added</h2>
          <div className="grid grid-cols-2 gap-4">
            {[ {t: 'Evidências', a: 'Chitãozinho'}, {t: 'Tennessee', a: 'Chris Stapleton'}, {t: 'Coração', a: 'Revelação'}, {t: 'Electro', a: 'DJ Zedd'}].map((item, i) => (
              <Card key={i} className="bg-zinc-950 border-white/5 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer">
                <div className="h-16 w-16 bg-zinc-800 rounded-lg shrink-0 overflow-hidden border border-white/10"><img src={`https://picsum.photos/seed/karaoke_${i}/150/150`} alt="Cover" className="w-full h-full object-cover" /></div>
                <div className="truncate"><p className="font-black text-white text-sm truncate uppercase italic">{item.t}</p><p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{item.a}</p></div>
              </Card>
            ))}
          </div>
        </div>
        {/* Trend Tags */}
        <div>
          <h2 className="text-3xl font-black text-white mb-8 italic uppercase tracking-tighter flex gap-3">Trend Tags <span className="bg-primary/20 text-primary px-2 rounded-md">#</span></h2>
          <div className="space-y-3">
             {['Sertanejo2026', 'RockClassics', 'VocalAcademyChallenge', 'AnimeHits'].map((tag, idx) => (
               <div key={tag} className="bg-zinc-950 border border-white/10 rounded-2xl p-5 flex justify-between items-center hover:border-primary cursor-pointer transition-all group">
                 <div className="flex items-center gap-4"><span className="text-primary font-black text-xl italic">#</span><div><p className="font-black text-white text-base italic uppercase">{tag}</p><p className="text-[10px] text-gray-500 font-black uppercase">{10 + idx * 5}k Cantores</p></div></div>
                 <span className="text-green-400 text-xs font-black bg-green-400/10 px-3 py-1 rounded-full">+{(idx+1)*12}% ↗</span>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 8. RANKINGS GLOBAIS */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32">
         <h2 className="text-5xl font-black text-primary text-center mb-16 uppercase italic tracking-tighter drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">Rankings Globais</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Global Top 5', 'Nacional Top 3', 'Local Top 2'].map((title, idx) => (
              <Card key={title} className={`bg-zinc-950 p-8 rounded-[2.5rem] border-2 shadow-2xl ${idx === 0 ? 'border-primary shadow-primary/5' : 'border-white/10'}`}>
                <h3 className={`text-xl font-black text-center mb-8 uppercase italic ${idx === 0 ? 'text-primary' : 'text-white'}`}>{title}</h3>
                <div className="space-y-5">
                  {[1,2,3,4,5].slice(0, idx === 0 ? 5 : idx === 1 ? 3 : 2).map(pos => (
                    <div key={pos} className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0">
                      <div className="flex items-center gap-3"><span className="text-gray-600 font-black text-sm w-4">{pos}</span><div className="h-8 w-8 rounded-full bg-zinc-800 border border-white/10" /><span className="text-white text-[10px] font-bold uppercase truncate max-w-[100px]">User_Prime_{pos}</span></div>
                      <span className="text-primary font-black text-base">{99 - pos}.{pos}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
         </div>
      </section>

      {/* 9. DASHBOARD DINÂMICO */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-black text-primary mb-12 uppercase italic tracking-tighter drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">Evolução Vocal<br/><span className="text-white text-2xl">Dashboard de Performance</span></h2>
          <div className="text-center space-y-6 bg-zinc-950 border border-white/10 p-12 rounded-[2.5rem] shadow-2xl">
            <h3 className="text-3xl font-black text-white italic">{user ? `Bem-vindo de volta, ${user.displayName?.split(' ')[0]}!` : "Pronto para Cantar?"}</h3>
            <p className="text-gray-400 font-medium font-bold uppercase text-[10px] tracking-widest">{user ? "Seus dados estão sendo processados pela IA." : "Cante para gerar os gráficos!"}</p>
            <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] pt-6 flex items-center justify-center gap-2"><Sparkles size={14} /> IA PRONTA PARA ANALISAR</p>
          </div>
        </div>
        <Card className="bg-zinc-950 border-white/10 rounded-[2.5rem] shadow-2xl p-10 overflow-hidden relative">
          <div className="flex items-center gap-6 mb-10 pb-10 border-b border-white/10">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="h-24 w-24 rounded-full border-2 border-primary/50 object-cover shadow-lg" />
            ) : (
              <div className="h-24 w-24 rounded-full border-2 border-primary/50 bg-primary/10 flex items-center justify-center shadow-lg"><LucideUser size={40} className="text-primary" /></div>
            )}
            <div>
              <h3 className="text-2xl font-black text-white mb-1 italic tracking-tighter uppercase">{user ? user.displayName : "Cantor Convidado"}</h3>
              <p className={`text-[10px] font-black tracking-widest uppercase inline-block px-3 py-1 rounded-md ${user ? "text-primary bg-primary/10" : "text-gray-500 bg-gray-500/10"}`}>{user ? "Prime Member" : "Guest Access"}</p>
            </div>
          </div>
          <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-white/5"><span className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2"><Star size={12} className="text-primary" /> Melhor Nota</span><span className="font-black text-white text-lg">{user ? "94.8%" : "0.0%"}</span></div>
              <div className="flex justify-between py-2 border-b border-white/5"><span className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2"><GraduationCap size={12} className="text-primary" /> Nível Academy</span><span className="font-black text-white text-lg">{user ? "Lvl 1" : "0"}</span></div>
              <div className="flex justify-between py-2"><span className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2"><Trophy size={12} className="text-primary" /> Ranking Global</span><span className="font-black text-white text-lg">{user ? "#412" : "9999"}</span></div>
          </div>
        </Card>
      </section>

      {/* RODAPÉ */}
      <div className="text-center pb-24 pt-16 border-t border-white/10 bg-zinc-950">
        <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-4 uppercase italic">CANTE. EVOLUA.<span className="text-primary drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">CONQUISTE.</h2>
        <p className="text-[8px] text-gray-500 font-black tracking-[0.5em] uppercase">© 2026 KARAOKE PRIME - ALL RIGHTS RESERVED</p>
      </div>
    </div>
  );
};

export default Index; 