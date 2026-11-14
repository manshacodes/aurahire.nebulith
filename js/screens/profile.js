import { go } from "../router.js";
import * as S from "../state.js";
import { $, esc, signed, sticker, toast } from "../fx.js";
import { PERSONALITY, STICKERS } from "../data.js";
import { tierFor } from "../aura-engine.js";

const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "?";

export default function profile(root) {
  const s = S.get();
  const colorOf = (label) => (PERSONALITY.find(([l]) => l === label) || [, "lime"])[1];

  root.innerHTML = `
    <section>
      <div class="cover"></div>
      <div class="avatar-lg" id="initials">${initials(s.name)}</div>
      <div>
        <input class="name-input" id="name" value="${esc(s.name)}" aria-label="Your name" maxlength="28" />
        <p class="headline">CSE '29 | ${s.aura >= 3300 ? "certified sigma" : "aspiring sigma"} | ${signed(s.aura)} aura | open to work (desperately)</p>
      </div>
      <span class="pill">${tierFor(s.aura).name}</span>

      <div class="card">
        <p class="label" style="margin-bottom:12px">my 5 stickers</p>
        ${s.stickers.length
          ? `<div class="chips" style="gap:14px 10px">${s.stickers.map((l, i) => sticker(l, colorOf(l), { rot: i % 2 ? 3 : -3, size: "sm" })).join("")}</div>`
          : `<a class="empty" href="#/stickers" style="display:block;text-decoration:none">no stickers yet. pick your 5 →</a>`}
        <p style="margin-top:16px;font-weight:700;color:var(--accent-2-ink)">endorsed for "breathing" by 43 people</p>
      </div>

      <div class="card">
        <p class="label" style="margin-bottom:10px">${esc(s.name)} · 1m · edited</p>
        <p class="post-text">${esc(s.post || "no post yet. win a boss fight to get humbled and honoured.")}</p>
        <div class="reactions" id="reactions">
          ${Object.entries(s.reactions).map(([id, n]) => sticker(`${STICKERS[id].label} ${n}`, STICKERS[id].c, { tag: "button", size: "sm", rot: -2, attrs: `data-id="${id}"` })).join("")}
        </div>
        <p class="fine" style="text-align:left;margin-top:12px">react with stickers. "congratulations!" is banned.</p>
      </div>

      <div class="row">
        <a class="btn btn-ghost" href="#/chat">hr chat (1)</a>
        <a class="btn btn-ghost" href="#/rate">rate companies</a>
      </div>
      <button class="btn btn-cta btn-xl" id="grind">back to the grind</button>
      <button class="link-btn" id="reset">start over (reset aura)</button>
    </section>`;

  $("#name", root).addEventListener("input", (e) => {
    S.set({ name: e.target.value || "anonymous sigma" });
    $("#initials", root).textContent = initials(e.target.value);
  });

  $("#reactions", root).addEventListener("click", (e) => {
    const btn = e.target.closest("[data-id]");
    if (!btn) return;
    const id = btn.dataset.id;
    const reactions = { ...S.get().reactions, [id]: S.get().reactions[id] + 1 };
    S.set({ reactions });
    btn.textContent = `${STICKERS[id].label} ${reactions[id]}`;
    btn.classList.remove("pop");
    void btn.offsetWidth;
    btn.classList.add("pop");
  });

  $("#grind", root).addEventListener("click", () => go("/jobs"));
  $("#reset", root).addEventListener("click", () => {
    S.reset();
    toast("aura reset. a fresh start, twin.");
    go("/");
  });
}
