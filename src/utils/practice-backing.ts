/**
 * Trilha de fundo dos exercícios do Academy, gerada no próprio navegador.
 *
 * Não usa arquivo de áudio de terceiros: são acordes suaves sintetizados
 * (Dó – Lá menor – Fá – Sol, 2 s cada), então não há licença a pagar nem
 * dependência de site externo. Mesma interface mínima de um <audio>:
 * volume, play(), pause() e currentTime.
 */

// Frequências (Hz) das notas de cada acorde, região confortável e discreta
const PROGRESSION: number[][] = [
  [130.81, 164.81, 196.0, 261.63], // C
  [110.0, 164.81, 220.0, 261.63], // Am
  [87.31, 174.61, 220.0, 261.63], // F
  [98.0, 146.83, 196.0, 246.94], // G
];
const CHORD_SECONDS = 2;

export class PracticeBacking {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private nextTime = 0;
  private step = 0;
  private _volume = 0.2;

  get volume() {
    return this._volume;
  }

  set volume(value: number) {
    this._volume = Math.max(0, Math.min(1, value));
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(this._volume * 0.25, this.ctx.currentTime, 0.1);
  }

  /** Recomeça a progressão do início na próxima vez que tocar */
  set currentTime(_value: number) {
    this.step = 0;
  }

  async play(): Promise<void> {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.master = this.ctx.createGain();
      this.master.gain.value = this._volume * 0.25;
      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 1200;
      this.master.connect(lowpass);
      lowpass.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') await this.ctx.resume();
    if (this.timer) return;
    this.nextTime = this.ctx.currentTime + 0.05;
    this.schedule();
    this.timer = setInterval(() => this.schedule(), 250);
  }

  pause() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    if (this.ctx && this.ctx.state === 'running') this.ctx.suspend().catch(() => undefined);
  }

  /** Libera o áudio de vez (ao sair da página) */
  close() {
    this.pause();
    this.ctx?.close().catch(() => undefined);
    this.ctx = null;
    this.master = null;
  }

  private schedule() {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    // agenda acordes até 1 s à frente
    while (this.nextTime < ctx.currentTime + 1) {
      const chord = PROGRESSION[this.step % PROGRESSION.length];
      chord.forEach((freq) => this.playNote(ctx, master, freq, this.nextTime));
      this.nextTime += CHORD_SECONDS;
      this.step += 1;
    }
  }

  private playNote(ctx: AudioContext, out: AudioNode, freq: number, start: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    const end = start + CHORD_SECONDS;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.25, start + 0.3); // entrada suave
    gain.gain.setValueAtTime(0.25, end - 0.4);
    gain.gain.linearRampToValueAtTime(0, end); // saída suave
    osc.connect(gain);
    gain.connect(out);
    osc.start(start);
    osc.stop(end + 0.05);
  }
}
