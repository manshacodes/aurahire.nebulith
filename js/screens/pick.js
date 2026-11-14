import { go } from "../router.js";
import * as S from "../state.js";
import { $, $$, toast, shake, esc } from "../fx.js";
import { PERSONALITY } from "../data.js";

const MAX = 5;
const ROTATIONS = [-4, 3, -2, 5, -5, 2, -3, 4, -2, 3, -4, 2, 5, -3, 3, -5];

export default function pick(root) {
  const chosen = new Set(S.get().stickers);

  root.innerHTML = `
    <section>
      <p class="label">like a dating app, but recruiters swipe on you</p>
      <h1 class="h1" data-scramble>pick 5 stickers that describe you.</h1>
      <div class="dots" id="dots" aria-live="polite"></div>
      <div class="pick-grid" id="grid">
        ${PERSONALITY.map(([label, c], i) => `
          <button class="stk ${chosen.has(label) ? "" : "off"}" data-c="${c}" data-label="${esc(label)}"
            style="--rot:${ROTATIONS[i % ROTATIONS.length]}deg" aria-pressed="${chosen.has(label)}">${esc(label)}</button>`).join("")}
      </div>
      <button class="btn btn-cta btn-xl" id="lock">lock in my vibe</button>
    </section>`;

  const dots = $("#dots", root);
  const paintDots = () => {
    dots.innerHTML = Array.from({ length: MAX }, (_, i) => `<i class="${i < chosen.size ? "on" : ""}"></i>`).join("")
      + `<span class="count">${chosen.size}/${MAX} picked</span>`;
  };
  paintDots();

  $("#grid", root).addEventListener("click", (e) => {
    const btn = e.target.closest(".stk");
    if (!btn) return;
    const label = btn.dataset.label;
    if (chosen.has(label)) {
      chosen.delete(label);
      btn.classList.add("off");
      btn.setAttribute("aria-pressed", "false");
    } else {
      if (chosen.size >= MAX) {
        shake(btn);
        toast("5 max. this isn't 6-7, twin.");
        return;
      }
      chosen.add(label);
      btn.classList.remove("off", "pop");
      void btn.offsetWidth;
      btn.classList.add("pop");
      btn.setAttribute("aria-pressed", "true");
    }
    paintDots();
  });

  $("#lock", root).addEventListener("click", () => {
    if (chosen.size < MAX) {
      shake(dots);
      toast(`pick ${MAX - chosen.size} more. the recruiters are waiting.`);
      return;
    }
    S.set({ stickers: [...chosen] });
    toast("vibe locked. recruiters have been notified.");
    go("/jobs");
  });

  // Remember which stickers were tapped even if the user leaves early
  return () => { if (chosen.size) S.set({ stickers: [...chosen] }); };
}
