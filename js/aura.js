// Aura farming: every action calls earn("id"), which adds aura (amounts in AURA_EARN in data.js),
// shows a "+12 aura · reason" pop under the aura pill, and checks the batch leaderboard:
// if you pass (or drop below) a classmate, you get told your new rank.
import * as S from "./state.js";
import { toast } from "./fx.js";
import { AURA_EARN, AURA_RANK, MOCK_PROFILES } from "./data.js";

// Your rank among you + the mock classmates (1 = top)
export const rankOf = (aura) => 1 + MOCK_PROFILES.filter((p) => p.aura > aura).length;

// The classmate just above you (who to beat next), or null if you're #1
export const nextTarget = (aura) => MOCK_PROFILES.filter((p) => p.aura > aura).sort((a, b) => a.aura - b.aura)[0] || null;

const fill = (text, vars) => text.replace(/\{(\w+)\}/g, (_, k) => vars[k]);

export function earn(id) {
  const [amount, reason] = AURA_EARN[id] || [0, ""];
  if (!amount) return;
  const before = S.get().aura;
  S.addAura(amount);
  const after = S.get().aura;
  pop(amount, reason);

  // Leaderboard moves: passing someone (or getting passed)
  const passed = MOCK_PROFILES.filter((p) => before <= p.aura && after > p.aura).sort((a, b) => b.aura - a.aura);
  const lost = MOCK_PROFILES.filter((p) => before > p.aura && after <= p.aura).sort((a, b) => a.aura - b.aura);
  const rank = rankOf(after);
  if (passed.length) setTimeout(() => toast(rank === 1 ? AURA_RANK.top : fill(AURA_RANK.passed, { name: passed[0].name, rank })), 500);
  else if (lost.length) setTimeout(() => toast(fill(AURA_RANK.lost, { name: lost[0].name, rank })), 500);
}

// The little "+12 aura · reason" that floats out from under the aura pill
let active = 0;
function pop(amount, reason) {
  const pill = document.querySelector("#auraPill");
  if (!pill) return;
  const r = pill.getBoundingClientRect();
  const el = document.createElement("div");
  el.className = `aura-pop ${amount < 0 ? "neg" : ""}`;
  el.textContent = `${amount > 0 ? "+" : "−"}${Math.abs(amount).toLocaleString("en-US")} aura · ${reason}`;
  el.style.top = `${r.bottom + 6 + active * 30}px`;
  el.style.right = `${Math.max(8, innerWidth - r.right)}px`;
  document.body.appendChild(el);
  active += 1;
  setTimeout(() => { el.remove(); active = Math.max(0, active - 1); }, 1600);
}
