import { go } from "../router.js";
import * as S from "../state.js";
import { $, $$, toast, shake, esc } from "../fx.js";
import { PERSONALITY, MEMES } from "../data.js";
import { memeImg, mixGroups } from "../memes.js";
import { earn } from "../aura.js";

const MAX = 5;
const ROTATIONS = [-4, 3, -2, 5, -5, 2, -3, 4, -2, 3, -4, 2, 5, -3, 3, -5];

export default function pick(root) {
  const chosen = new Set(S.get().stickers);

  root.innerHTML = `
    <section>
      <p class="label">like a dating app, but recruiters swipe on you</p>
      <h1 class="h1" data-scramble>pick 5 stickers that describe you.</h1>
      <div class="dots" id="dots" aria-live="polite"></div>
      <p class="fine pick-sub" style="text-align:left">text stickers and memes, all mixed up. pick any 5.</p>
      <!-- one sticker wall: meme cards with text stickers spread between them -->
      <div class="pick-grid pick-mixed" id="grid">
        ${mixGroups(
          Object.entries(MEMES).map(([id, m], i) => {
            const key = `img:${id}`;
            return `
            <button class="meme-opt" data-label="${key}" aria-pressed="${chosen.has(key)}" aria-label="${esc(m.label)}">
              ${memeImg(id, "meme-pick", ROTATIONS[i % ROTATIONS.length])}
              <small>${esc(m.label)}</small>
            </button>`;
          }),
          PERSONALITY.map(([label, c], i) => `
            <button class="stk ${chosen.has(label) ? "" : "off"}" data-c="${c}" data-label="${esc(label)}"
              style="--rot:${ROTATIONS[(i + 3) % ROTATIONS.length]}deg" aria-pressed="${chosen.has(label)}">${esc(label)}</button>`),
          3, `<span class="row-break" aria-hidden="true"></span>`,
        ).join("")}
      </div>
      <button class="btn btn-cta btn-xl" id="lock">lock in my vibe</button>
    </section>`;

  const dots = $("#dots", root);
  const paintDots = () => {
    dots.innerHTML = Array.from({ length: MAX }, (_, i) => `<i class="${i < chosen.size ? "on" : ""}"></i>`).join("")
      + `<span class="count">${chosen.size}/${MAX} picked</span>`;
  };
  paintDots();

  // One toggle for both text stickers and meme stickers (memes are saved as "img:<id>")
  const toggle = (btn) => {
    const label = btn.dataset.label;
    const isText = btn.classList.contains("stk");
    if (chosen.has(label)) {
      chosen.delete(label);
      if (isText) btn.classList.add("off");
      btn.setAttribute("aria-pressed", "false");
    } else {
      if (chosen.size >= MAX) {
        shake(btn);
        toast("5 max. this isn't 6-7, twin.");
        return;
      }
      chosen.add(label);
      if (isText) {
        btn.classList.remove("off", "pop");
        void btn.offsetWidth;
        btn.classList.add("pop");
      }
      btn.setAttribute("aria-pressed", "true");
    }
    paintDots();
  };
  $("#grid", root).addEventListener("click", (e) => { const b = e.target.closest(".stk, .meme-opt"); if (b) toggle(b); });

  $("#lock", root).addEventListener("click", () => {
    if (chosen.size < MAX) {
      shake(dots);
      toast(`pick ${MAX - chosen.size} more. the recruiters are waiting.`);
      return;
    }
    S.set({ stickers: [...chosen] });
    earn("lockIn");
    toast("vibe locked. recruiters have been notified.");
    go("/jobs");
  });

  // Remember which stickers were tapped even if the user leaves early
  return () => { if (chosen.size) S.set({ stickers: [...chosen] }); };
}
