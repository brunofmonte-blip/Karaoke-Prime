import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mic2, Activity, ArrowLeft, Share2, AlertTriangle, RotateCcw, Clock, User as UserIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { auth, onAuthStateChanged, User as AppUser } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useI18n } from '@/i18n';

const MIN_SECONDS = 10; // abaixo disso não dá para avaliar

export default function ScoreResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tr } = useI18n();
  const [user, setUser] = useState<AppUser | null>(null);
  const [newBest, setNewBest] = useState(false);
  const savedRef = useRef(false);

  const videoId: string = location.state?.videoId || '';
  const songTitle: string = location.state?.title || '';
  const songArtist: string = location.state?.artist || '';
  const accuracy: number = location.state?.accuracy || 0;
  const score: number = location.state?.score || 0;
  const secondsSung: number = location.state?.secondsSung || 0;
  const enough = secondsSung >= MIN_SECONDS;

  const rank = !enough ? '—' : accuracy >= 85 ? 'S' : accuracy >= 70 ? 'A' : accuracy >= 50 ? 'B' : accuracy >= 30 ? 'C' : 'D';

  const message = !enough
    ? tr(
        'Não captamos voz suficiente. Verifique se o microfone está liberado e cante pelo menos 10 segundos.',
        "We didn't hear enough singing. Check that your mic is allowed and sing for at least 10 seconds.",
      )
    : accuracy >= 85
      ? tr('Afinação de palco! Que tal um desafio mais difícil?', 'Stage-ready pitch! Ready for a harder song?')
      : accuracy >= 50
        ? tr('Boa! O Academy ajuda a deixar as notas mais firmes.', 'Nice! The Academy helps make your notes steadier.')
        : tr('Todo cantor começa assim. Os exercícios do Academy fazem diferença rápido.', 'Every singer starts here. Academy exercises make a quick difference.');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  // Salva melhor nota e XP no perfil (só com dados reais e uma vez por resultado)
  useEffect(() => {
    if (!user?.id || !enough || savedRef.current) return;
    savedRef.current = true;
    (async () => {
      const { data } = await supabase.from('profiles').select('best_note, xp').eq('id', user.id).maybeSingle();
      const previousBest = Number(data?.best_note ?? 0);
      const xp = Number(data?.xp ?? 0) + Math.max(1, Math.round(secondsSung / 10));
      const update: Record<string, number | string> = { xp, updated_at: new Date().toISOString() };
      if (accuracy > previousBest) {
        update.best_note = accuracy;
        setNewBest(true);
      }
      await supabase.from('profiles').update(update).eq('id', user.id);
    })().catch(() => {
      // falha ao salvar não atrapalha o resultado
    });
  }, [user?.id, enough, accuracy, secondsSung]);

  const handleShare = async () => {
    const url = window.location.origin;
    const text = enough
      ? tr(
          `Cantei ${songTitle || 'no Karaoke Prime'} com ${accuracy}% de afinação. Topa o desafio?`,
          `I sang ${songTitle || 'on Karaoke Prime'} with ${accuracy}% pitch accuracy. Can you beat it?`,
        )
      : tr('Vem cantar comigo no Karaoke Prime!', 'Come sing with me on Karaoke Prime!');
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Karaoke Prime', text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${url}`);
      toast.success(tr('Copiado! É só colar onde quiser.', 'Copied! Paste it anywhere.'));
    } catch {
      // usuário cancelou o compartilhamento
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-white flex flex-col items-center justify-center pt-24 pb-12 px-4">
      <Card className="w-full max-w-[400px] bg-gradient-to-b from-[#111] to-black border border-white/10 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="text-center mb-6 relative z-10">
          <p className="text-lg font-black italic tracking-tighter uppercase mb-5">
            KARAOKE <span className="text-cyan-400">PRIME</span>
          </p>
          <div className="mx-auto h-16 w-16 rounded-full border-2 border-cyan-400 overflow-hidden mb-3 bg-zinc-900 flex items-center justify-center">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="h-7 w-7 text-cyan-400" />
            )}
          </div>
          <h1 className="text-lg font-black italic uppercase text-white leading-tight">
            {user?.displayName || tr('Seu resultado', 'Your result')}
          </h1>
        </div>

        {songTitle && (
          <div className="text-center mb-5 relative z-10">
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
              <Mic2 size={12} /> {tr('Música', 'Song')}
            </p>
            <h2 className="text-base font-black italic uppercase text-white px-2 line-clamp-2">{songTitle}</h2>
          </div>
        )}

        <div className="bg-black/50 border border-white/5 rounded-3xl p-5 relative z-10">
          <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-3">
            <div>
              <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{tr('Pontos', 'Points')}</p>
              <p className="text-3xl font-black text-white">{score.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Rank</p>
              <p className="text-3xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">{rank}</p>
            </div>
          </div>
          <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-2 flex items-center gap-1">
            <Activity size={12} className="text-cyan-400" /> {tr('Afinação', 'Pitch accuracy')}
          </p>
          <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden">
            <div className="bg-cyan-400 h-2 rounded-full transition-all" style={{ width: `${enough ? accuracy : 0}%` }} />
          </div>
          <div className="flex justify-between text-[11px] mt-2">
            <span className="text-gray-500 flex items-center gap-1">
              <Clock size={11} /> {secondsSung}s {tr('cantando', 'singing')}
            </span>
            <span className="font-bold text-cyan-400">{enough ? `${accuracy}%` : '—'}</span>
          </div>
          {newBest && (
            <p className="text-center text-xs font-black uppercase tracking-widest text-emerald-400 mt-3">
              {tr('Nova melhor nota!', 'New personal best!')}
            </p>
          )}
        </div>

        <div className="mt-5 relative z-10">
          {!enough ? (
            <div className="flex items-start gap-2 bg-amber-950/40 border border-amber-500/40 p-3 rounded-2xl text-left">
              <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-300 leading-snug">{message}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-300 text-center leading-relaxed">{message}</p>
          )}
          {!user && enough && (
            <p className="text-[11px] text-gray-500 text-center mt-3">
              {tr('Entre na sua conta para salvar sua melhor nota.', 'Sign in to save your best score.')}
            </p>
          )}
        </div>

        <div className="mt-6 space-y-3 relative z-10">
          <Button
            onClick={() => (videoId ? navigate(`/play/${videoId}`, { state: { title: songTitle, artist: songArtist } }) : navigate('/basic'))}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-xs rounded-full h-12"
          >
            <RotateCcw size={16} className="mr-2" /> {tr('Cantar de novo', 'Sing again')}
          </Button>
          <Button
            onClick={handleShare}
            variant="ghost"
            className="w-full border border-white/10 text-gray-200 hover:text-cyan-400 font-black uppercase tracking-widest text-xs rounded-full h-12"
          >
            <Share2 size={16} className="mr-2" /> {tr('Compartilhar', 'Share')}
          </Button>
        </div>
      </Card>

      <div className="flex gap-6 mt-8">
        <Button variant="ghost" onClick={() => navigate('/basic')} className="text-gray-500 hover:text-white font-black uppercase tracking-widest text-[10px]">
          <ArrowLeft size={14} className="mr-1" /> {tr('Outras músicas', 'More songs')}
        </Button>
        <Button variant="ghost" onClick={() => navigate('/academy')} className="text-gray-500 hover:text-cyan-400 font-black uppercase tracking-widest text-[10px]">
          {tr('Treinar no Academy', 'Train in the Academy')}
        </Button>
      </div>
    </div>
  );
}
