import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Activity } from 'lucide-react';

// --- Utilitários de Teoria Musical ---
const NOTE_STRINGS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function getNoteFromPitch(frequency: number): string {
  if (frequency <= 0) return '--';
  const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  const midiNote = Math.round(noteNum) + 69;
  const octave = Math.floor(midiNote / 12) - 1;
  const noteName = NOTE_STRINGS[midiNote % 12];
  return `${noteName}${octave}`;
}

// --- Algoritmo de Autocorrelação para Detecção de Pitch ---
function autoCorrelate(buf: Float32Array, sampleRate: number): number {
  let SIZE = buf.length;
  let rms = 0;

  for (let i = 0; i < SIZE; i++) {
    const val = buf[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);
  
  if (rms < 0.01) return -1; // Volume muito baixo

  let r1 = 0, r2 = SIZE - 1, thres = 0.2;
  for (let i = 0; i < SIZE / 2; i++)
    if (Math.abs(buf[i]) < thres) { r1 = i; break; }
  for (let i = 1; i < SIZE / 2; i++)
    if (Math.abs(buf[SIZE - i]) < thres) { r2 = SIZE - i; break; }

  buf = buf.slice(r1, r2);
  SIZE = buf.length;

  const c = new Array(SIZE).fill(0);
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE - i; j++) {
      c[i] = c[i] + buf[j] * buf[j + i];
    }
  }

  let d = 0; while (c[d] > c[d + 1]) d++;
  let maxval = -1, maxpos = -1;
  for (let i = d; i < SIZE; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }
  let T0 = maxpos;

  const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);

  return sampleRate / T0;
}

// --- Componente Principal ---
export default function VocalAnalyzer() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [pitch, setPitch] = useState<number>(0);
  const [note, setNote] = useState<string>('--');
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startAnalysis = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsRecording(true);
      processAudio();

    } catch (err: any) {
      console.error("Erro ao acessar o microfone:", err);
      setError("Permissão de microfone negada ou dispositivo não encontrado.");
      setIsRecording(false);
    }
  };

  const stopAnalysis = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    
    setIsRecording(false);
    setPitch(0);
    setNote('--');
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const processAudio = () => {
    if (!analyserRef.current || !audioContextRef.current) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.fftSize;
    const buffer = new Float32Array(bufferLength);
    const dataArray = new Uint8Array(bufferLength);

    analyser.getFloatTimeDomainData(buffer);
    analyser.getByteTimeDomainData(dataArray);

    const ac = autoCorrelate(buffer, audioContextRef.current.sampleRate);
    
    if (ac !== -1 && ac > 50 && ac < 2000) {
      setPitch(Math.round(ac));
      setNote(getNoteFromPitch(ac));
    } else {
      setPitch(0);
      setNote('--');
    }

    drawWaveform(dataArray, bufferLength);
    animationFrameRef.current = requestAnimationFrame(processAudio);
  };

  const drawWaveform = (dataArray: Uint8Array, bufferLength: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#06b6d4'; 
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#06b6d4';

    ctx.beginPath();
    const sliceWidth = width * 1.0 / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = v * height / 2;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);

      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    return () => stopAnalysis();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl p-6 mx-auto bg-slate-900 rounded-2xl shadow-2xl border border-slate-800">
      <div className="flex items-center justify-between w-full mb-8">
        <div className="flex items-center space-x-3 text-cyan-400">
          <Activity size={28} className={isRecording ? "animate-pulse" : ""} />
          <h2 className="text-2xl font-bold tracking-wider">VocalAnalyzer Core</h2>
        </div>
        <button
          onClick={isRecording ? stopAnalysis : startAnalysis}
          className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
            isRecording 
              ? "bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.3)]" 
              : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          }`}
        >
          {isRecording ? <><MicOff size={20} className="mr-2" /> Encerrar Captação</> : <><Mic size={20} className="mr-2" /> Iniciar Motor</>}
        </button>
      </div>

      {error && (
        <div className="w-full p-4 mb-6 text-red-400 bg-red-500/10 rounded-lg border border-red-500/20">
          {error}
        </div>
      )}

      <div className="relative w-full h-64 mb-8 overflow-hidden bg-slate-950 rounded-xl border border-slate-800 shadow-inner">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        {!isRecording && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-medium">
            Aguardando sinal de áudio...
          </div>
        )}
      </div>

      <div className="grid w-full grid-cols-2 gap-6">
        <div className="flex flex-col items-center justify-center p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <span className="text-sm font-medium tracking-widest text-slate-400 uppercase mb-2">Pitch (Hz)</span>
          <span className="text-5xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            {pitch > 0 ? pitch : '---'}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <span className="text-sm font-medium tracking-widest text-slate-400 uppercase mb-2">Nota Musical</span>
          <span className="text-5xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            {note}
          </span>
        </div>
      </div>
    </div>
  );
}