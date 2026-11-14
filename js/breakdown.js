// The AuraGPT breakdown meters (yap, nepo, delulu, grind, touch grass, cap), shared by
// the score screen, the roast-a-friend screen and friend profiles.
import { esc } from "./fx.js";
import { FACTORS } from "./data.js";

const level = (v) => (v <= 3 ? "low" : v <= 6 ? "mid" : "high");

export function breakdownHTML(scores) {
  return `
    <ul class="factors">
      ${FACTORS.map((f) => `
        <li class="factor">
          <div class="factor-top"><b>${esc(f.label)}</b><span>${scores[f.id]}/10</span></div>
          <div class="bar"><span data-w="${scores[f.id] * 10}"></span></div>
          <small>${esc(f[level(scores[f.id])])}</small>
        </li>`).join("")}
    </ul>`;
}

// Fill the meters a beat after they're on screen (the CSS transition animates them)
export function fillBreakdown(root, delay = 300) {
  return setTimeout(() => {
    root.querySelectorAll(".factors .bar > span").forEach((s) => { s.style.width = `${s.dataset.w}%`; });
  }, delay);
}

// "Rizz 6-7/10" only when it actually lands on 6 or 7 (the meme, only when earned)
export const rizzText = (rizz) => (rizz === 6 || rizz === 7 ? "6-7/10" : `${rizz}/10`);
