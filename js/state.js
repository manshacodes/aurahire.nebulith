// App state, saved to localStorage so your aura survives a refresh.

const KEY = "aurahire:v1";

const defaults = {
  theme: "clean",
  name: "Aarav Grindwala",
  muted: false,          // sound effects on/off (the 🔊 button)
  nameSet: false,        // true once you type your own first name
  surnameRoll: 0,        // how many times you rerolled your AuraGPT-assigned surname
  avatar: { color: "lilac", emoji: "" },   // your profile circle
  friends: [],           // resumes you judged with "roast a friend": { id, name, aura, lines, scores, rizz, color }
  social: {},            // per mock profile: { disses: [...], votes: { lineIndex: "cap"|"fax" } }
  resume: "",
  aura: 0,
  lines: [],             // the 14 lines the scan showed
  allLines: [],          // every judged line of your resume (the breakdown meters read these)
  challenge: null,       // a friend's "beat my aura" link you opened: { name, aura, tier, color }
  tierName: "",
  stickers: [],          // the 5 personality stickers you picked
  currentJob: null,      // id of the job you're fighting for
  post: "",              // your "humbled and honoured" post
  ratings: { RED_FLAG: 1912, COOKED: 1080, MID: 680, W: 328 },
  reactions: { W: 412, COOKED: 88, NPC: 54, DELULU: 19 },
};

const fresh = () => JSON.parse(JSON.stringify(defaults));

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    return saved ? { ...fresh(), ...saved } : fresh();
  } catch {
    return fresh();
  }
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* private mode: ignore */ }
}

let state = load();
const listeners = new Set();

export const get = () => state;

export function set(patch) {
  state = { ...state, ...patch };
  save();
  listeners.forEach((fn) => fn(state));
}

export const addAura = (n) => set({ aura: state.aura + n });

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function reset() {
  const theme = state.theme;
  state = { ...fresh(), theme };
  save();
  listeners.forEach((fn) => fn(state));
}
