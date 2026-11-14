// Sound effects, synthesized live with the Web Audio API: no audio files to download.
// Each effect is a few oscillators or a burst of noise shaped by a volume envelope.
// Browsers only allow sound after the user has tapped, so the AudioContext starts lazily.
// Muting is saved in state (the 🔊 button in the topbar).
import * as S from "./state.js";

let ctx = null, master = null, musicBus = null, noiseBuf = null;
export const musicOut = () => musicBus;

// The shared AudioContext (also used by music.js). Returns null while muted or before the first tap.
export function audio() {
  if (S.get().muted || !navigator.userActivation?.hasBeenActive) return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.5;   // overall volume
    master.connect(ctx.destination);
    musicBus = ctx.createGain();   // music plays quieter than the effects
    musicBus.gain.value = 0.32;
    musicBus.connect(master);
    // one second of white noise, reused for whooshes, slaps and the shatter
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

// A note: oscillator `type` sliding from freq to `to`, with a quick attack and an exponential fade.
// `at` = seconds from now, or `when` = an exact AudioContext time (music schedules ahead). `out` = where it plays.
export function tone({ freq, to = freq, type = "sine", dur = 0.2, vol = 0.5, at = 0, when, out }) {
  const c = audio();
  if (!c) return;
  const t = when ?? c.currentTime + at;
  const osc = c.createOscillator(), gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), t + dur);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(out || master);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

// A burst of filtered noise: low filter = thud/rumble, high filter = hiss/crack
export function noise({ dur = 0.2, vol = 0.4, filter = "lowpass", freq = 1200, to = freq, q = 1, at = 0, when, out }) {
  const c = audio();
  if (!c) return;
  const t = when ?? c.currentTime + at;
  const src = c.createBufferSource(), f = c.createBiquadFilter(), gain = c.createGain();
  src.buffer = noiseBuf;
  f.type = filter;
  f.Q.value = q;
  f.frequency.setValueAtTime(freq, t);
  f.frequency.exponentialRampToValueAtTime(Math.max(to, 1), t + dur);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(gain).connect(out || master);
  src.start(t);
  src.stop(t + dur + 0.02);
}

// ---------- the effects ----------
export const sfx = {
  // AuraGPT stamp hitting the paper
  thunk() {
    tone({ freq: 160, to: 45, type: "sine", dur: 0.22, vol: 0.9 });
    noise({ dur: 0.08, vol: 0.35, freq: 900, to: 200 });
  },
  // a W: bright two-note chime
  ding() {
    tone({ freq: 1320, type: "triangle", dur: 0.35, vol: 0.35 });
    tone({ freq: 1980, type: "sine", dur: 0.45, vol: 0.25, at: 0.08 });
  },
  // an L: the sad trombone "womp womp"
  womp() {
    tone({ freq: 233, to: 220, type: "sawtooth", dur: 0.28, vol: 0.18 });
    tone({ freq: 196, to: 150, type: "sawtooth", dur: 0.55, vol: 0.18, at: 0.3 });
  },
  // swipe: noise sweeping up (right) or down (left)
  whoosh(dir = "right") {
    const [from, to] = dir === "right" ? [500, 3000] : [3000, 500];
    noise({ dur: 0.3, vol: 0.35, filter: "bandpass", freq: from, to, q: 1.4 });
  },
  // a normal hit in the boss fight
  hit() {
    tone({ freq: 220, to: 70, type: "square", dur: 0.12, vol: 0.22 });
    noise({ dur: 0.1, vol: 0.4, freq: 2500, to: 400 });
  },
  // a crit: crunchier and louder
  crit() {
    tone({ freq: 110, to: 40, type: "sawtooth", dur: 0.3, vol: 0.35 });
    noise({ dur: 0.25, vol: 0.6, filter: "highpass", freq: 1500, to: 400 });
    tone({ freq: 880, to: 1760, type: "square", dur: 0.12, vol: 0.12, at: 0.05 });
  },
  // rage mode: a low rumble that swells
  rumble() {
    noise({ dur: 1.2, vol: 0.5, freq: 120, to: 60, q: 0.7 });
    tone({ freq: 55, to: 41, type: "sawtooth", dur: 1.1, vol: 0.2 });
  },
  // victory fanfare: a quick rising arpeggio and a held chord
  fanfare() {
    [523, 659, 784].forEach((f, i) => tone({ freq: f, type: "triangle", dur: 0.18, vol: 0.3, at: i * 0.11 }));
    [523, 659, 784, 1047].forEach((f) => tone({ freq: f, type: "triangle", dur: 0.9, vol: 0.18, at: 0.36 }));
  },
  // one meme slapping onto the screen (fast slaps turn into a drumroll)
  slap() {
    noise({ dur: 0.07, vol: 0.55, filter: "highpass", freq: 1800, to: 900 });
    tone({ freq: 140, to: 60, type: "sine", dur: 0.09, vol: 0.5 });
  },
  // "HR said:" cracking: glassy noise plus a few high tinkles
  shatter() {
    noise({ dur: 0.5, vol: 0.6, filter: "highpass", freq: 3000, to: 1200 });
    tone({ freq: 90, to: 40, type: "sine", dur: 0.3, vol: 0.5 });
    [2637, 3520, 2960, 4186].forEach((f, i) => tone({ freq: f, type: "triangle", dur: 0.25, vol: 0.12, at: 0.05 + i * 0.07 }));
  },
};

export const isMuted = () => Boolean(S.get().muted);
export function setMuted(muted) {
  S.set({ muted });
  if (!muted) { audio(); sfx.ding(); }   // a little "sound on" chime
}
