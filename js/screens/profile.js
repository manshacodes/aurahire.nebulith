import { go } from "../router.js";
import * as S from "../state.js";
import { $, esc, signed, sticker, toast } from "../fx.js";
import { PERSONALITY, STICKERS, AVATAR_COLORS, AVATAR_EMOJI, MEMES } from "../data.js";
import { memeImg, isMemePick, memeIdOf } from "../memes.js";
import { tierFor } from "../aura-engine.js";
import { avatarHTML } from "../identity.js";

export default function profile(root) {
  const s = S.get();
  const colorOf = (label) => (PERSONALITY.find(([l]) => l === label) || [, "lime"])[1];

  root.innerHTML = `
    <section>
      <div class="cover"></div>
      <div class="avatar-lg-wrap" id="bigAv">${avatarHTML(s, "av-lg")}</div>
      <div>
        <input class="name-input" id="name" value="${esc(s.name)}" aria-label="Your name" maxlength="28" />
        <p class="headline">CSE '29 | ${s.aura >= 3300 ? "certified sigma" : "aspiring sigma"} | ${signed(s.aura)} aura | open to work (desperately)</p>
      </div>
      <span class="pill">${tierFor(s.aura).name}</span>

      <div class="card">
        <p class="label" style="margin-bottom:12px">your profile circle</p>
        <div class="swatches-row" id="avColors" role="group" aria-label="Circle colour">
          ${AVATAR_COLORS.map((c) => `<button class="swatch av" data-c="${c}" data-color="${c}" aria-label="${c}" aria-pressed="${s.avatar.color === c}"></button>`).join("")}
        </div>
        <div class="emoji-row" id="avEmoji" role="group" aria-label="Circle face">
          ${AVATAR_EMOJI.map((e) => `<button class="emoji-opt" data-emoji="${e}" aria-label="${e || "initials"}" aria-pressed="${s.avatar.emoji === e}">${e || "Aa"}</button>`).join("")}
        </div>
      </div>

      <div class="card">
        <p class="label" style="margin-bottom:12px">my 5 stickers</p>
        ${s.stickers.length
          ? `<div class="chips" style="gap:14px 10px;align-items:center">${s.stickers.map((l, i) => (isMemePick(l)
              ? `<span class="meme-chip">${memeImg(memeIdOf(l), "meme-pick", i % 2 ? 4 : -4)}<small>${esc(MEMES[memeIdOf(l)]?.label || "")}</small></span>`
              : sticker(l, colorOf(l), { rot: i % 2 ? 3 : -3, size: "sm" }))).join("")}</div>`
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

      <a class="btn btn-ghost btn-block" href="#/rate">rate companies with stickers →</a>
      <button class="btn btn-cta btn-xl" id="grind">back to the grind</button>
      <button class="link-btn" id="reset">start over (reset aura)</button>
    </section>`;

  // Redraw the big circle (the top-left one updates itself from state)
  const paintAvatar = () => { $("#bigAv", root).innerHTML = avatarHTML(S.get(), "av-lg"); };

  $("#name", root).addEventListener("input", (e) => {
    S.set({ name: e.target.value || "anonymous sigma" });
    paintAvatar();
  });

  // Pick a colour or an emoji face for your profile circle
  const pickAvatar = (groupSel, attr, key) => {
    $(groupSel, root).addEventListener("click", (e) => {
      const btn = e.target.closest(`[data-${attr}]`);
      if (!btn) return;
      S.set({ avatar: { ...S.get().avatar, [key]: btn.dataset[attr] } });
      $(groupSel, root).querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      paintAvatar();
    });
  };
  pickAvatar("#avColors", "color", "color");
  pickAvatar("#avEmoji", "emoji", "emoji");

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
