import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Mic, Play, Pause, RotateCcw, Flag, Video, VideoOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAudioAnalyzer } from '@/hooks/use-audio-analyzer';
import { useI18n } from '@/i18n';

/**
 * Tela de cantar.
 *
 * Pontuação honesta: o vídeo do YouTube não traz a melodia, então medimos a
 * AFINAÇÃO — o quanto cada nota cantada fica centrada (em cents) na nota mais
 * próxima — e o tempo que a pessoa realmente cantou. Volume não dá ponto.
 *
 * Regras do YouTube respeitadas: o player fica livre para cliques (anúncios,
 * "Pular", controles), nada é desenhado por cima dele e a câmera é opcional,
 * fora da área do vídeo.
 */

const SAMPLE_MS = 100; // 10 amostras por segundo
const IN_TUNE_CENTS = 20; // até 20 cents de desvio = afinado

interface Tally {
  voiced: number; // amostras com voz detectada
  inTune: number; // amostras afinadas
  points: number;
}

export default function SongPlayer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { tr } = useI18n();
  const songTitle: string = location.state?.title || '';
  const songArtist: string = location.state?.artist || '';

  const { isAnalyzing, startAnalysis, stopAnalysis, pitchNote, pitchCents, pitchDataHz } = useAudioAnalyzer();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [points, setPoints] = useState(0);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const tallyRef = useRef<Tally>({ voiced: 0, inTune: 0, points: 0 });
  const liveRef = useRef({ hz: 0, cents: 0 });

  liveRef.current = { hz: pitchDataHz, cents: pitchCents };

  const sendToPlayer = (func: string, args: unknown[] = []) => {
    try {
      iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args }), '*');
    } catch {
      // player ainda carregando
    }
  };

  // Amostragem da afinação enquanto canta
  useEffect(() => {
    if (!isPlaying || isPaused) return;
    const timer = setInterval(() => {
      const { hz, cents } = liveRef.current;
      if (hz <= 0) return;
      const t = tallyRef.current;
      t.voiced += 1;
      const off = Math.min(50, Math.abs(cents));
      if (off <= IN_TUNE_CENTS) t.inTune += 1;
      t.points += Math.round((50 - off) / 5); // 0–10 por amostra, mais perto do centro = mais pontos
      setPoints(t.points);
    }, SAMPLE_MS);
    return () => clearInterval(timer);
  }, [isPlaying, isPaused]);

  // Câmera opcional (só imagem; o áudio vem do analisador)
  useEffect(() => {
    if (!isPlaying || !cameraOn) return;
    let cancelled = false;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        cameraStreamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => {
        toast.error(tr('Não foi possível abrir a câmera.', "Couldn't open the camera."));
        setCameraOn(false);
      });
    return () => {
      cancelled = true;
      cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    };
  }, [isPlaying, cameraOn]);

  // Desliga o microfone ao sair da página
  useEffect(() => () => stopAnalysis(), []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStart = async () => {
    await startAnalysis();
    setIsPlaying(true);
    sendToPlayer('playVideo');
  };

  const handlePause = () => {
    setIsPaused(true);
    sendToPlayer('pauseVideo');
  };

  const handleResume = () => {
    setIsPaused(false);
    sendToPlayer('playVideo');
  };

  const handleRestart = () => {
    tallyRef.current = { voiced: 0, inTune: 0, points: 0 };
    setPoints(0);
    setIsPaused(false);
    sendToPlayer('seekTo', [0, true]);
    sendToPlayer('playVideo');
  };

  const handleFinish = () => {
    sendToPlayer('pauseVideo');
    stopAnalysis();
    const t = tallyRef.current;
    const accuracy = t.voiced > 0 ? Math.round((t.inTune / t.voiced) * 100) : 0;
    navigate('/score', {
      replace: true,
      state: {
        videoId: id,
        title: songTitle,
        artist: songArtist,
        score: t.points,
        accuracy,
        secondsSung: Math.round((t.voiced * SAMPLE_MS) / 1000),
      },
    });
  };

  // Medidor de afinação: -50 (baixo) … +50 (alto)
  const hasVoice = isAnalyzing && pitchDataHz > 0;
  const off = Math.abs(pitchCents);
  const tuneLabel = !hasVoice
    ? tr('Cante!', 'Sing!')
    : off <= IN_TUNE_CENTS
      ? tr('Afinado', 'In tune')
      : pitchCents < 0
        ? tr('Um pouco baixo', 'A bit flat')
        : tr('Um pouco alto', 'A bit sharp');
  const tuneColor = !hasVoice ? 'text-gray-400' : off <= IN_TUNE_CENTS ? 'text-emerald-400' : 'text-amber-400';
  const needle = hasVoice ? 50 + Math.max(-50, Math.min(50, pitchCents)) : 50;

  const origin = encodeURIComponent(window.location.origin);
  const playerSrc = `https://www.youtube.com/embed/${id}?enablejsapi=1&controls=1&rel=0&playsinline=1&origin=${origin}`;

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col pt-16">
      {/* Barra superior */}
      <div className="flex items-center justify-between gap-3 px-4 md:px-8 py-3 border-b border-white/10">
        <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 px-2" onClick={() => navigate('/basic')}>
          <ArrowLeft className="mr-1 h-5 w-5" /> {tr('Músicas', 'Songs')}
        </Button>
        <div className="min-w-0 text-center flex-1">
          {songTitle && <p className="text-sm font-bold truncate">{songTitle}</p>}
          {songArtist && <p className="text-[11px] text-gray-500 truncate">{songArtist}</p>}
        </div>
        <div className="font-mono font-black text-cyan-400 text-lg tabular-nums min-w-[80px] text-right">
          {isPlaying ? `${points.toLocaleString()} pts` : ''}
        </div>
      </div>

      {/* Player do YouTube — livre, sem nada por cima */}
      <div className="w-full max-w-5xl mx-auto px-0 md:px-8 pt-0 md:pt-6">
        <div className="relative w-full aspect-video bg-zinc-950 md:rounded-2xl overflow-hidden">
          <iframe
            ref={iframeRef}
            src={playerSrc}
            title={songTitle || 'YouTube video player'}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      {/* Painel de canto, abaixo do vídeo */}
      <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-6 flex-1">
        {!isPlaying ? (
          <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 md:p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center">
              <Mic className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter mb-2">
              {tr('Pronto para cantar?', 'Ready to sing?')}
            </h1>
            <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
              {tr(
                'Vamos pedir acesso ao seu microfone para medir sua afinação. Use fone de ouvido para o som da música não confundir a medição.',
                "We'll ask for your microphone to measure your pitch. Use headphones so the music doesn't confuse the measurement.",
              )}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                onClick={handleStart}
                className="text-lg px-10 h-14 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase rounded-full shadow-[0_0_30px_rgba(6,182,212,0.4)]"
              >
                <Play className="mr-2 fill-black w-5 h-5" /> {tr('Começar', 'Start')}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setCameraOn((v) => !v)}
                className={`rounded-full h-12 px-5 border ${cameraOn ? 'border-cyan-500/50 text-cyan-400' : 'border-white/10 text-gray-400'}`}
              >
                {cameraOn ? <Video className="w-4 h-4 mr-2" /> : <VideoOff className="w-4 h-4 mr-2" />}
                {cameraOn ? tr('Câmera ligada', 'Camera on') : tr('Câmera desligada', 'Camera off')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-950 border border-white/10 rounded-3xl p-5 md:p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {cameraOn && (
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-cyan-400 overflow-hidden shrink-0 bg-zinc-900">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover -scale-x-100" />
                </div>
              )}

              {/* Nota + medidor */}
              <div className="flex-1 w-full">
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{tr('Sua nota', 'Your note')}</p>
                    <p className="text-4xl font-black italic text-white min-h-[44px]">{hasVoice ? pitchNote : '—'}</p>
                  </div>
                  <p className={`text-sm font-black uppercase tracking-widest ${tuneColor}`} aria-live="polite">{tuneLabel}</p>
                </div>
                <div className="relative h-3 rounded-full bg-gradient-to-r from-amber-500/30 via-emerald-500/40 to-amber-500/30">
                  <div className="absolute top-1/2 -translate-y-1/2 left-1/2 w-px h-5 bg-white/40" />
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-black transition-[left] duration-100 ${hasVoice ? 'bg-white' : 'bg-gray-600'}`}
                    style={{ left: `calc(${needle}% - 8px)` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                  <span>{tr('baixo', 'flat')}</span>
                  <span>{tr('alto', 'sharp')}</span>
                </div>
              </div>
            </div>

            <p className="text-center text-[11px] text-gray-500 mt-4">
              {tr('Se o vídeo não começar sozinho, toque no play dentro dele.', "If the video doesn't start on its own, tap play inside it.")}
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {isPaused ? (
                <>
                  <Button onClick={handleResume} className="bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase rounded-full h-12 px-6">
                    <Play className="w-4 h-4 mr-2 fill-black" /> {tr('Continuar', 'Resume')}
                  </Button>
                  <Button onClick={handleRestart} variant="ghost" className="border border-white/10 text-gray-300 rounded-full h-12 px-6">
                    <RotateCcw className="w-4 h-4 mr-2" /> {tr('Recomeçar', 'Restart')}
                  </Button>
                </>
              ) : (
                <Button onClick={handlePause} variant="ghost" className="border border-white/10 text-gray-300 rounded-full h-12 px-6">
                  <Pause className="w-4 h-4 mr-2" /> {tr('Pausar', 'Pause')}
                </Button>
              )}
              <Button onClick={handleFinish} className="bg-white hover:bg-cyan-400 text-black font-black uppercase rounded-full h-12 px-6">
                <Flag className="w-4 h-4 mr-2" /> {tr('Terminar e ver resultado', 'Finish & see results')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
