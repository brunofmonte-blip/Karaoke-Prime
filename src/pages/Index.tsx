import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic2, GraduationCap, Search, Music2, Gauge, TrendingUp,
  PlayCircle, ArrowRight, Sparkles, Star, Lock,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { auth, onAuthStateChanged, User as AppUser } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useI18n } from '@/i18n';

/**
 * Home do Karaoke Prime.
 * Regra: nada de números, usuários ou rankings inventados. Tudo o que aparece
 * aqui é real (dados do próprio usuário) ou é convite para agir.
 */

type Region = 'US' | 'BR';

// Sugestões para começar: só título e artista, sem contagens de plays.
const STARTER_SONGS: Record<Region, { title: string; artist: string }[]> = {
  US: [
    { title: 'Shallow', artist: 'Lady Gaga' },
    { title: 'Bohemian Rhapsody', artist: 'Queen' },
    { title: 'Someone Like You', artist: 'Adele' },
    { title: 'Perfect', artist: 'Ed Sheeran' },
    { title: 'Flowers', artist: 'Miley Cyrus' },
    { title: 'I Will Always Love You', artist: 'Whitney Houston' },
  ],
  BR: [
    { title: 'Evidências', artist: 'Chitãozinho & Xororó' },
    { title: 'Na Sua Estante', artist: 'Pitty' },
    { title: 'Como Nossos Pais', artist: 'Elis Regina' },
    { title: 'Ainda Bem', artist: 'Marisa Monte' },
    { title: 'Amor Maior', artist: 'Jota Quest' },
    { title: 'Velha Infância', artist: 'Tribalistas' },
  ],
};

interface MyProfile {
  academy_level: number | null;
  xp: number | null;
  best_note: number | null;
  is_prime: boolean | null;
}

export default function Index() {
  const { tr, lang } = useI18n();
  const navigate = useNavigate();
  const [user, setUser] = useState<AppUser | null>(null);
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [region, setRegion] = useState<Region>(lang === 'pt' ? 'BR' : 'US');

  useEffect(() => {
    setRegion(lang === 'pt' ? 'BR' : 'US');
  }, [lang]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user?.id) {
      setProfile(null);
      return;
    }
    supabase
      .from('profiles')
      .select('academy_level, xp, best_note, is_prime')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => setProfile((data as MyProfile) ?? null));
  }, [user?.id]);

  const sing = (q: string) => {
    const query = q.trim();
    navigate('/basic', query ? { state: { q: query } } : undefined);
  };

  const firstName = user?.displayName?.split(' ')[0];

  const steps = [
    {
      icon: Music2,
      title: tr('Escolha a música', 'Pick a song'),
      text: tr('Busque qualquer artista ou música e comece na hora, de graça.', 'Search any artist or song and start right away, for free.'),
    },
    {
      icon: Mic2,
      title: tr('Cante no microfone', 'Sing into your mic'),
      text: tr('Funciona no navegador do computador ou do celular. Sem instalar nada.', 'Works in your computer or phone browser. Nothing to install.'),
    },
    {
      icon: Gauge,
      title: tr('Veja sua afinação', 'See your pitch'),
      text: tr('Nosso detector mostra a nota que você canta e o quanto está afinado, em tempo real.', 'Our pitch detector shows the note you sing and how in tune you are, in real time.'),
    },
  ];

  return (
    <div className="min-h-screen bg-black font-sans text-white pb-24 overflow-x-hidden">
      {/* 1. HERO: uma ação principal — cantar */}
      <section className="relative pt-32 pb-24 px-4 flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-[center_40%] opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-black" />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-5">
            KARAOKE <span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]">PRIME</span>
          </h1>
          <p className="text-gray-300 text-base md:text-xl font-medium mb-10 max-w-2xl mx-auto">
            {tr('Cante suas músicas favoritas e veja sua afinação em tempo real.', 'Sing your favorite songs and see your pitch in real time.')}
          </p>

          <div className="bg-zinc-900/90 backdrop-blur border border-white/10 rounded-full flex items-center w-full max-w-2xl mx-auto p-1.5 pr-2 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
            <Search className="text-gray-500 h-5 w-5 ml-4 mr-2 shrink-0" />
            <input
              type="text"
              aria-label={tr('Buscar música', 'Search for a song')}
              placeholder={tr('Qual música você quer cantar?', 'What do you want to sing?')}
              className="bg-transparent border-none text-white focus:outline-none w-full text-base placeholder:text-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sing(searchQuery);
              }}
            />
            <Button
              onClick={() => sing(searchQuery)}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase text-xs rounded-full px-6 md:px-8 h-11 ml-2 shrink-0"
            >
              <Mic2 className="h-4 w-4 mr-1" /> {tr('Cantar', 'Sing')}
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            {tr('Grátis. Sem cartão. Só precisa de um microfone.', 'Free. No credit card. All you need is a mic.')}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 space-y-24 relative z-10">
        {/* 2. SUGESTÕES PARA COMEÇAR */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">
                {tr('Comece por', 'Start with')} <span className="text-cyan-400">{tr('uma destas', 'one of these')}</span>
              </h2>
              <p className="text-sm text-gray-500 mt-1">{tr('Toque em uma música para cantar.', 'Tap a song to sing it.')}</p>
            </div>
            <div className="flex gap-2" role="tablist" aria-label={tr('Região', 'Region')}>
              {(['US', 'BR'] as Region[]).map((r) => (
                <button
                  key={r}
                  role="tab"
                  aria-selected={region === r}
                  onClick={() => setRegion(r)}
                  className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border transition-colors ${
                    region === r ? 'bg-cyan-500 text-black border-cyan-500' : 'border-white/15 text-gray-400 hover:text-white'
                  }`}
                >
                  {r === 'US' ? tr('Internacionais', 'US & Global') : tr('Brasileiras', 'Brazilian')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STARTER_SONGS[region].map((song) => (
              <button
                key={song.title}
                onClick={() => sing(`${song.title} ${song.artist}`)}
                className="flex items-center gap-4 bg-zinc-900/60 p-4 rounded-2xl border border-white/5 text-left hover:bg-zinc-800 hover:border-cyan-500/40 transition-all group"
              >
                <div className="h-11 w-11 rounded-xl bg-black flex items-center justify-center shrink-0">
                  <PlayCircle className="h-6 w-6 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-sm text-white leading-tight truncate">{song.title}</h3>
                  <p className="text-xs text-gray-500 truncate">{song.artist}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-cyan-400 transition-colors" />
              </button>
            ))}
          </div>
        </section>

        {/* 3. COMO FUNCIONA */}
        <section>
          <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-center mb-10">
            {tr('Como', 'How it')} <span className="text-cyan-400">{tr('funciona', 'works')}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, idx) => (
              <Card key={step.title} className="bg-zinc-950 border border-white/10 rounded-[2rem] p-8">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-cyan-400 font-black italic text-2xl">{idx + 1}</span>
                  <div className="h-10 w-10 rounded-xl border border-cyan-500/30 flex items-center justify-center">
                    <step.icon className="text-cyan-400 h-5 w-5" />
                  </div>
                </div>
                <h3 className="font-black italic uppercase text-lg text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.text}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* 4. DOIS CAMINHOS: cantar livre ou treinar */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            onClick={() => navigate('/basic')}
            className="bg-gradient-to-br from-zinc-900 to-black border border-cyan-500/30 rounded-[2rem] p-8 cursor-pointer hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all group"
          >
            <Mic2 className="text-cyan-400 h-8 w-8 mb-6" />
            <h3 className="font-black italic text-2xl uppercase text-white mb-2">Basic</h3>
            <p className="text-sm text-gray-400 mb-6">
              {tr('Karaokê livre: cante sozinho ou em dueto com um amigo.', 'Free karaoke: sing solo or duet with a friend.')}
            </p>
            <span className="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
              {tr('Sempre grátis', 'Always free')} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Card>

          <Card
            onClick={() => navigate('/academy')}
            className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-[2rem] p-8 cursor-pointer hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all group"
          >
            <GraduationCap className="text-cyan-400 h-8 w-8 mb-6" />
            <h3 className="font-black italic text-2xl uppercase text-white mb-2">Academy</h3>
            <p className="text-sm text-gray-400 mb-6">
              {tr('Treino vocal em 10 níveis, com exercícios que medem sua afinação.', 'Vocal training in 10 levels, with exercises that measure your pitch.')}
            </p>
            <span className="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
              {tr('Nível 1 grátis', 'Level 1 free')} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Card>
        </section>

        {/* 5. PAINEL PESSOAL — só dados reais */}
        <section>
          {user ? (
            <Card className="bg-zinc-950 border border-white/10 rounded-[2rem] p-8 md:p-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white">
                    {tr('Bem-vindo de volta', 'Welcome back')}{firstName ? `, ${firstName}` : ''}!
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">{tr('Sua evolução até agora.', 'Your progress so far.')}</p>
                </div>
                {profile?.is_prime && (
                  <span className="self-start bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    Prime
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Stat icon={GraduationCap} label={tr('Nível Academy', 'Academy level')} value={String(profile?.academy_level ?? 1)} />
                <Stat icon={TrendingUp} label="XP" value={String(profile?.xp ?? 0)} />
                <Stat
                  icon={Star}
                  label={tr('Melhor nota', 'Best score')}
                  value={profile?.best_note ? `${Math.round(profile.best_note)}` : '—'}
                />
              </div>

              <div className="flex flex-wrap gap-3 mt-8">
                <Button onClick={() => navigate('/academy')} className="bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase text-xs rounded-full px-6 h-11">
                  {tr('Continuar treino', 'Keep training')}
                </Button>
                {!profile?.is_prime && (
                  <Button onClick={() => navigate('/premium')} variant="ghost" className="text-gray-300 hover:text-cyan-400 font-black uppercase text-xs rounded-full px-6 h-11 border border-white/10">
                    <Lock className="h-3 w-3 mr-1" /> {tr('Liberar os 10 níveis', 'Unlock all 10 levels')}
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <Card className="bg-gradient-to-br from-cyan-500/10 to-black border border-cyan-500/30 rounded-[2rem] p-8 md:p-12 text-center">
              <Sparkles className="text-cyan-400 h-8 w-8 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white mb-3">
                {tr('Acompanhe sua evolução', 'Track your progress')}
              </h2>
              <p className="text-sm text-gray-400 max-w-md mx-auto mb-8">
                {tr('Crie sua conta grátis para salvar seu nível, sua melhor nota e seu progresso no Academy.', 'Create a free account to save your level, your best score and your Academy progress.')}
              </p>
              <Button onClick={() => navigate('/login')} className="bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase text-xs rounded-full px-8 h-11">
                {tr('Criar conta grátis', 'Create free account')}
              </Button>
            </Card>
          )}
        </section>

        <p className="text-center text-[11px] text-gray-600 max-w-xl mx-auto">
          {tr(
            'Os vídeos das músicas são exibidos pelo YouTube. Em breve: Next Talent, Backstage e Next Success.',
            'Song videos are played through YouTube. Coming soon: Next Talent, Backstage and Next Success.',
          )}
        </p>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="bg-black border border-white/5 rounded-2xl p-5">
      <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">
        <Icon size={14} className="text-cyan-400" /> {label}
      </div>
      <div className="text-3xl font-black italic text-white">{value}</div>
    </div>
  );
}
