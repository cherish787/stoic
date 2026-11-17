/**
 * Synthesised sounds via Web Audio — no audio files, no autoplay.
 * The AudioContext is only created after a user gesture (pressing Start).
 */
let ctx: AudioContext | null = null;

function getCtx(create = false): AudioContext | null {
  try {
    if (!ctx) {
      if (!create) return null; // never create audio without a user gesture
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/** Call from a click handler so later sounds are allowed to play. */
export function unlockAudio() {
  getCtx(true);
}

function tone(freq: number, start: number, dur: number, gain: number, type: OscillatorType = 'sine') {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime + start);
  g.gain.setValueAtTime(0.0001, c.currentTime + start);
  g.gain.exponentialRampToValueAtTime(gain, c.currentTime + start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
  osc.connect(g).connect(c.destination);
  osc.start(c.currentTime + start);
  osc.stop(c.currentTime + start + dur + 0.05);
}

/** Low bronze gong for session completion */
export function playGong() {
  tone(98, 0, 3.2, 0.22);
  tone(196.5, 0, 2.6, 0.1);
  tone(293, 0.01, 2.0, 0.05);
  tone(415, 0.02, 1.4, 0.03, 'triangle');
}

/** Soft strike for starting a session */
export function playStrike() {
  tone(523, 0, 0.35, 0.06, 'triangle');
  tone(784, 0.02, 0.25, 0.03);
}
