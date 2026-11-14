// Boss fight music: a looping 8-bit battle track, synthesized live (no audio file).
// A tiny step sequencer: every 16th note it schedules bass, arpeggio and drums slightly
// ahead of time, so the beat stays tight even if the page is busy.
// Rage mode speeds it up and adds a high lead line, like a fighting game's final round.
import { audio, tone, noise, musicOut } from "./sound.js";

const BPM = 150, RAGE_BPM = 176;
const LOOKAHEAD = 0.12;   // schedule notes this many seconds ahead
const TICK_MS = 25;       // how often the scheduler wakes up

// Am - F - G - E, one bar each (the classic arcade minor progression)
const BARS = [
  { bass: 110.0, arp: [440.0, 523.25, 659.25] },   // A minor
  { bass: 87.31, arp: [349.23, 440.0, 523.25] },   // F major
  { bass: 98.0, arp: [392.0, 493.88, 587.33] },    // G major
  { bass: 82.41, arp: [329.63, 415.3, 493.88] },   // E major (the tense one)
];
const ARP_ORDER = [0, 1, 2, 1, 0, 1, 2, 1, 0, 1, 2, 1, 2, 1, 0, 1];   // which chord note on each 16th
// Rage-mode lead: a little hook, in chord-note indexes an octave up (null = rest)
const LEAD = [2, null, 1, 2, null, 0, 1, null, 2, null, 1, 0, 1, null, 2, null];

let timer = null, step = 0, nextTime = 0, rage = false;

function scheduleStep(t, s) {
  const out = musicOut();
  const bar = BARS[Math.floor(s / 16) % BARS.length];
  const i = s % 16;
  const sixteenth = 60 / (rage ? RAGE_BPM : BPM) / 4;

  // bass: 8th notes, root and octave bouncing
  if (i % 2 === 0) tone({ freq: i % 4 === 0 ? bar.bass : bar.bass * 2, type: "square", dur: sixteenth * 1.8, vol: 0.32, when: t, out });
  // arpeggio: every 16th, the chord's notes in a rolling pattern
  tone({ freq: bar.arp[ARP_ORDER[i]], type: "square", dur: sixteenth * 0.9, vol: 0.13, when: t, out });
  // drums: kick on 1 and 3, snare on 2 and 4, hi-hat on every 8th
  if (i === 0 || i === 8 || (rage && i === 10)) tone({ freq: 150, to: 40, type: "sine", dur: 0.14, vol: 0.9, when: t, out });
  if (i === 4 || i === 12) noise({ dur: 0.12, vol: 0.45, filter: "bandpass", freq: 1800, q: 0.8, when: t, out });
  if (i % 2 === 0) noise({ dur: 0.03, vol: 0.18, filter: "highpass", freq: 7000, when: t, out });
  // rage: a high lead on top
  if (rage && LEAD[i] !== null) tone({ freq: bar.arp[LEAD[i]] * 2, type: "triangle", dur: sixteenth * 1.6, vol: 0.2, when: t, out });
}

function tick() {
  const c = audio();          // null while muted: the loop keeps time but stays silent
  if (!c) return;
  if (nextTime < c.currentTime) nextTime = c.currentTime + 0.05;   // (re)start in sync after a pause or unmute
  while (nextTime < c.currentTime + LOOKAHEAD) {
    scheduleStep(nextTime, step);
    nextTime += 60 / (rage ? RAGE_BPM : BPM) / 4;
    step += 1;
  }
}

export function startMusic() {
  if (timer) return;
  step = 0; nextTime = 0; rage = false;
  timer = setInterval(tick, TICK_MS);
  tick();
}

export function setRage(on) { rage = on; }

// Victory jingle: a happy C-major chiptune run with bass and drums (~3.5s), played with the
// confetti when you beat HR. Scheduled all at once, since it's short.
const WIN_MELODY = [   // [note frequency, length in 16ths]
  [523.25, 1], [659.25, 1], [783.99, 1], [1046.5, 3],   // C E G C (up!)
  [783.99, 1], [1046.5, 4],                             // G C (hold)
  [880, 1], [987.77, 1], [1046.5, 2], [1174.66, 2],     // A B C D
  [1318.51, 6],                                         // E (big finish)
  [1046.5, 2], [1318.51, 2], [1567.98, 8],              // C E G (sparkle, ring out)
];
const WIN_BASS = [130.81, 130.81, 174.61, 196.0, 130.81, 196.0, 261.63, 261.63];   // C C F G C G C C (8ths, x2)

export function playVictory() {
  const c = audio();
  if (!c) return;
  const out = musicOut();
  const sixteenth = 60 / 160 / 4;
  const start = c.currentTime + 0.05;
  let t = start;
  for (const [freq, len] of WIN_MELODY) {
    tone({ freq, type: "square", dur: sixteenth * len * 0.95, vol: 0.24, when: t, out });
    tone({ freq: freq * 2, type: "triangle", dur: sixteenth * len * 0.6, vol: 0.08, when: t, out });   // sparkle octave
    t += sixteenth * len;
  }
  const total = t - start;
  for (let i = 0; i * sixteenth * 2 < total; i++) {
    const bt = start + i * sixteenth * 2;
    tone({ freq: WIN_BASS[i % WIN_BASS.length], type: "square", dur: sixteenth * 1.8, vol: 0.28, when: bt, out });
    if (i % 2 === 0) tone({ freq: 150, to: 40, type: "sine", dur: 0.12, vol: 0.8, when: bt, out });           // kick
    else noise({ dur: 0.1, vol: 0.35, filter: "bandpass", freq: 1800, q: 0.8, when: bt, out });              // snare
    noise({ dur: 0.03, vol: 0.15, filter: "highpass", freq: 7000, when: bt + sixteenth, out });             // hat
  }
  // final cymbal-ish crash
  noise({ dur: 1.2, vol: 0.3, filter: "highpass", freq: 5000, to: 3000, when: start + total - sixteenth * 8, out });
}

export function stopMusic() {
  clearInterval(timer);
  timer = null;
  rage = false;
}
