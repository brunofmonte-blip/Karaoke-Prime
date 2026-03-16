import React from 'react';
import { Mic, MicOff, Activity } from 'lucide-react';

// Utilitários de Teoria Musical (Mantidos, mas apenas o display)
const NOTE_STRINGS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function getNoteFromPitch(frequency: number): string {
  if (frequency <= 0) return '--';
  const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  const midiNote = Math.round(noteNum) + 69;
  const octave = Math.floor(midiNote / 12) - 1;
  const noteName = NOTE_STRINGS[midiNote % 12];
  return `${noteName}${octave}`;
}

// --- Componente Principal ---
// Pure Pure data consumer.
export default function VocalAnalyzer({
  isAnalyzing,
  pitch,
  note,
  error,
  startAnalysis,
  stopAnalysis,
}: {
  isAnalyzing: boolean;
  pitch: number;
  note: string;
  error: string | null;
  startAnalysis: () => void;
  stopAnalysis: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full p-4 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800">
      
      {/* Header / Controles */}
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center space-x-2 text-cyan-400">
          <Activity size={20} className={isAnalyzing ? "animate-pulse" : ""} />
          <h2 className="text-xl font-bold tracking-wider">VocalAnalyzer</h2>
        </div>
        
        <button
          onClick={isAnalyzing ? stopAnalysis : startAnalysis}
          className={`flex items-center px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
            isAnalyzing 
              ? "bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.3)]" 
              : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          }`}
        >
          {isAnalyzing ? (
            <>
              <MicOff size={16} className="mr-1.5" /> Enerrar
            </>
          ) : (
            <>
              <Mic size={16} className="mr-1.5" /> Iniciar
            </>
          )}
        </button>
      </div>

      {/* Indicação de Atividade */}
      {isAnalyzing && (
        <div className="w-full flex justify-center py-4 mb-4 bg-slate-800/20 rounded-xl border border-slate-700/20 shadow-inner">
          <Activity size={32} className="text-cyan-300 animate-pulse" />
        </div>
      )}

      {/* Painel de Leitura (Telemetria) - Layout Compacto */}
      <div className="grid w-full grid-cols-2 gap-4">
        <div className="flex flex-col items-center justify-center p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <span className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-1">Pitch (Hz)</span>
          <span className="text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            {pitch > 0 ? pitch : '---'}
          </span>
        </div>
        
        <div className="flex flex-col items-center justify-center p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <span className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-1">Nota Musical</span>
          <span className="text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            {note}
          </span>
        </div>
      </div>

      {/* Exibição de Erro */}
      {error && (
        <div className="w-full p-2 mt-4 text-xs text-center text-red-400 bg-red-500/10 rounded-lg border border-red-500/20">
          {error}
        </div>
      )}

    </div>
  );
}