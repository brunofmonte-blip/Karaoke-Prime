/**
 * Detecção de afinação (pitch) pelo algoritmo YIN
 * (de Cheveigné & Kawahara, 2002), sem dependências externas.
 *
 * Por que não o "pico do espectro" (FFT)? A voz humana tem harmônicos
 * fortes; o pico mais alto do espectro muitas vezes é o 2º ou 3º harmônico,
 * o que faz o score errar a nota por uma oitava ou mais. O YIN mede o
 * período fundamental no domínio do tempo e é o padrão em afinadores.
 */

export interface PitchResult {
  /** Frequência fundamental em Hz, ou 0 quando não há voz afinada no quadro */
  frequency: number;
  /** 0–1: quão periódico (afinado/estável) é o som. Abaixo de ~0.8 é ruído/sopro */
  clarity: number;
  /** Volume RMS do quadro (0–1) */
  rms: number;
}

export interface PitchDetectorOptions {
  sampleRate: number;
  /** Limiar do YIN. 0.10–0.15 é o padrão para voz */
  threshold?: number;
  minFrequency?: number;
  maxFrequency?: number;
  /** Volume mínimo (RMS) para considerar que há alguém cantando */
  minRms?: number;
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function createPitchDetector(options: PitchDetectorOptions) {
  const {
    sampleRate,
    threshold = 0.12,
    minFrequency = 70,
    maxFrequency = 1100,
    minRms = 0.01,
  } = options;

  const minTau = Math.max(2, Math.floor(sampleRate / maxFrequency));
  const maxTauLimit = Math.ceil(sampleRate / minFrequency);
  let diff = new Float32Array(0);

  return function detect(buffer: Float32Array): PitchResult {
    let sumSquares = 0;
    for (let i = 0; i < buffer.length; i++) sumSquares += buffer[i] * buffer[i];
    const rms = Math.sqrt(sumSquares / buffer.length);
    if (rms < minRms) return { frequency: 0, clarity: 0, rms };

    const maxTau = Math.min(maxTauLimit, Math.floor(buffer.length / 2));
    if (maxTau <= minTau) return { frequency: 0, clarity: 0, rms };
    const windowSize = buffer.length - maxTau;
    if (diff.length !== maxTau + 1) diff = new Float32Array(maxTau + 1);

    // 1. Função de diferença
    for (let tau = 1; tau <= maxTau; tau++) {
      let sum = 0;
      for (let i = 0; i < windowSize; i++) {
        const d = buffer[i] - buffer[i + tau];
        sum += d * d;
      }
      diff[tau] = sum;
    }

    // 2. Diferença média normalizada cumulativa (CMNDF)
    diff[0] = 1;
    let runningSum = 0;
    for (let tau = 1; tau <= maxTau; tau++) {
      runningSum += diff[tau];
      diff[tau] = runningSum === 0 ? 1 : (diff[tau] * tau) / runningSum;
    }

    // 3. Primeiro mínimo abaixo do limiar (evita erros de oitava)
    let tauEstimate = -1;
    for (let tau = minTau; tau <= maxTau; tau++) {
      if (diff[tau] < threshold) {
        while (tau + 1 <= maxTau && diff[tau + 1] < diff[tau]) tau++;
        tauEstimate = tau;
        break;
      }
    }

    // Sem mínimo claro: usa o menor valor global, mas com clareza baixa
    if (tauEstimate === -1) {
      let best = minTau;
      for (let tau = minTau + 1; tau <= maxTau; tau++) {
        if (diff[tau] < diff[best]) best = tau;
      }
      const clarity = Math.max(0, 1 - diff[best]);
      if (clarity < 0.5) return { frequency: 0, clarity, rms };
      tauEstimate = best;
    }

    // 4. Interpolação parabólica para precisão abaixo de 1 amostra
    let betterTau = tauEstimate;
    if (tauEstimate > 1 && tauEstimate < maxTau) {
      const s0 = diff[tauEstimate - 1];
      const s1 = diff[tauEstimate];
      const s2 = diff[tauEstimate + 1];
      const denom = 2 * (2 * s1 - s2 - s0);
      if (denom !== 0) betterTau = tauEstimate + (s2 - s0) / denom;
    }

    const frequency = sampleRate / betterTau;
    const clarity = Math.max(0, Math.min(1, 1 - diff[tauEstimate]));
    if (frequency < minFrequency || frequency > maxFrequency) {
      return { frequency: 0, clarity, rms };
    }
    return { frequency, clarity, rms };
  };
}

/** Converte Hz em nota (ex.: 440 → { name: 'A4', cents: 0 }) */
export function frequencyToNote(frequency: number): { name: string; midi: number; cents: number } | null {
  if (!frequency || frequency <= 0) return null;
  const midiFloat = 69 + 12 * Math.log2(frequency / 440);
  const midi = Math.round(midiFloat);
  const cents = Math.round((midiFloat - midi) * 100);
  const name = `${NOTE_NAMES[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`;
  return { name, midi, cents };
}

/** Diferença em cents entre a voz e a nota de referência (positivo = acima) */
export function centsOff(sung: number, target: number): number {
  if (sung <= 0 || target <= 0) return 0;
  return 1200 * Math.log2(sung / target);
}
