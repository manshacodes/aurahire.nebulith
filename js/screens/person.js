// A mock classmate's profile: stickers, stats, their cringe post, and a "mog check" against your aura.
import { go } from "../router.js";
import * as S from "../state.js";
import { $, esc, pick, signed, sticker, toast } from "../fx.js";
import { MOCK_PROFILES, STICKERS, MOG_VERDICTS, CONNECT_TOASTS } from "../data.js";
import { tierFor } from "../aura-engine.js";
import { initials } from "./people.js";

export default function person(root, { id }) {
  const i = Math.max(0, MOCK_PROFILES.findIndex((x) => x.id === id));
  const p = MOCK_PROFILES[i];
  const next = MOCK_PROFILES[(i + 1) % MOCK_PROFILES.length];
  const mine = S.get().aura;
  const reactions = { ...p.reactions };   // reacting here is just for fun, not saved
  let endorsements = parseInt(p.endorsed.match(/by (\d+)/)[1], 10);

  // Mog check: bars are scaled to whoever has more aura
  const top = Math.max(mine, p.aura, 1);
  const verdict = !mine ? MOG_VERDICTS.none
    : Math.abs(mine - p.aura) <= 300 ? MOG_VERDICTS.tie
    : mine > p.aura ? MOG_VERDICTS.win : MOG_VERDICTS.lose;
  const bar = (label, value) => `
    <div class="mog-bar"><span>${esc(label)}</span><div class="bar"><span style="width:${Math.max(0, (value / top) * 100)}%"></span></div><b>${signed(value)}</b></div>`;

  root.innerHTML = `
    <section>
      <a class="back-link" href="#/people">← leaderboard</a>
      <div class="cover"></div>
      <div class="avatar-lg" style="background:${p.color};color:${p.ink}">${esc(initials(p.name))}</div>
      <div>
        <h1 class="person-name">${esc(p.name)}</h1>
        <p class="headline">${esc(p.headline)}</p>
      </div>
      <div class="chips"><span class="pill">${esc(tierFor(p.aura).name)}</span><span class="pill alt">${signed(p.aura)} aura</span></div>

      <div class="row">
        <button class="btn btn-cta" id="connect">connect</button>
        <button class="btn btn-ghost" id="endorse">endorse</button>
      </div>

      <div class="card">
        <p class="label" style="margin-bottom:12px">mog check</p>
        ${bar("you", mine)}
        ${bar(p.name.split(/[\s|(]/)[0], p.aura)}
        <p class="mog-verdict">${esc(verdict)}</p>
        ${mine ? "" : `<a class="btn btn-ghost btn-block" href="#/upload" style="margin-top:10px">scan my resume →</a>`}
      </div>

      <div class="card">
        <p class="label" style="margin-bottom:12px">their 5 stickers</p>
        <div class="chips" style="gap:14px 10px">${p.stickers.map(([l, c], k) => sticker(l, c, { rot: k % 2 ? 3 : -3, size: "sm" })).join("")}</div>
        <div class="stats" style="margin-top:16px">
          ${p.stats.map(([label, value]) => `<div class="stat"><small>${esc(label)}</small><b>${esc(value)}</b></div>`).join("")}
        </div>
        <p style="margin-top:14px;font-weight:700;color:var(--accent-2-ink)" id="endorsed">${esc(p.endorsed)}</p>
      </div>

      <div class="card">
        <p class="label" style="margin-bottom:10px">${esc(p.name)} · 2d · edited 6 times</p>
        <p class="post-text">${esc(p.post)}</p>
        <div class="reactions" id="reactions">
          ${Object.entries(reactions).map(([sid, n]) => sticker(`${STICKERS[sid].label} ${n}`, STICKERS[sid].c, { tag: "button", size: "sm", rot: -2, attrs: `data-id="${sid}"` })).join("")}
        </div>
      </div>

      <button class="btn btn-ghost btn-block" id="next">next profile: ${esc(next.name)} →</button>
    </section>`;

  $("#connect", root).addEventListener("click", (e) => {
    toast(pick(CONNECT_TOASTS));
    e.currentTarget.textContent = "pending…";
    e.currentTarget.disabled = true;
  });

  $("#endorse", root).addEventListener("click", () => {
    endorsements += 1;
    $("#endorsed", root).textContent = p.endorsed.replace(/by \d+/, `by ${endorsements}`);
    toast("endorsed. they will not endorse you back.");
  });

  $("#reactions", root).addEventListener("click", (e) => {
    const btn = e.target.closest("[data-id]");
    if (!btn) return;
    const sid = btn.dataset.id;
    reactions[sid] += 1;
    btn.textContent = `${STICKERS[sid].label} ${reactions[sid]}`;
    btn.classList.remove("pop");
    void btn.offsetWidth;
    btn.classList.add("pop");
  });

  $("#next", root).addEventListener("click", () => go(`/u/${next.id}`));
}
