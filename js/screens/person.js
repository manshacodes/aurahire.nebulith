// A mock classmate's profile, built for roasting:
// mog check, cap-or-fax on every resume line, a diss thread (they reply), "larp as them",
// plus sticker reactions, connect and endorse. Disses and votes are saved in state.social.
import { go } from "../router.js";
import * as S from "../state.js";
import { $, esc, pick, rand, signed, sticker, toast, sleep } from "../fx.js";
import { MOCK_PROFILES, STICKERS, MOG_VERDICTS, CONNECT_TOASTS, CAP_FAX, DISSES, DISS_REPLIES, MEMES } from "../data.js";
import { memeImg, isMemePick, memeIdOf } from "../memes.js";
import { tierFor } from "../aura-engine.js";
import { initials, avatarHTML } from "../identity.js";
import { earn } from "../aura.js";

// Same profile + line -> same "% of the batch agreed" every time
const pctFor = (id, i) => 40 + ([...id].reduce((h, c) => h + c.charCodeAt(0), 0) * (i + 3)) % 55;

export default function person(root, { id }) {
  const i = Math.max(0, MOCK_PROFILES.findIndex((x) => x.id === id));
  const p = MOCK_PROFILES[i];
  const next = MOCK_PROFILES[(i + 1) % MOCK_PROFILES.length];
  const me = S.get();
  const first = p.name.split(/[\s|(.]/)[0];
  const reactions = { ...p.reactions };   // reacting here is just for fun, not saved
  let endorsements = parseInt(p.endorsed.match(/by (\d+)/)[1], 10);
  let larpIndex = 0, alive = true;

  // Your saved disses and cap/fax votes for this person
  const social = () => S.get().social[p.id] || { disses: [], votes: {} };
  const saveSocial = (patch) => S.set({ social: { ...S.get().social, [p.id]: { ...social(), ...patch } } });

  // Mog check: bars are scaled to whoever has more aura
  const top = Math.max(me.aura, p.aura, 1);
  const verdict = !me.aura ? MOG_VERDICTS.none
    : Math.abs(me.aura - p.aura) <= 300 ? MOG_VERDICTS.tie
    : me.aura > p.aura ? MOG_VERDICTS.win : MOG_VERDICTS.lose;
  const bar = (label, value) => `
    <div class="mog-bar"><span>${esc(label)}</span><div class="bar"><span style="width:${Math.max(0, (value / top) * 100)}%"></span></div><b>${signed(value)}</b></div>`;

  const theirCircle = `<span class="avatar-sm" style="background:${p.color};color:${p.ink}">${esc(initials(p.name))}</span>`;

  root.innerHTML = `
    <section>
      <a class="back-link" href="#/people">← the batch</a>
      <div class="split"><div class="split-main">
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
        ${bar("you", me.aura)}
        ${bar(first, p.aura)}
        <p class="mog-verdict">${esc(verdict)}</p>
        ${me.aura ? "" : `<a class="btn btn-ghost btn-block" href="#/upload" style="margin-top:10px">scan my resume →</a>`}
      </div>

      <div class="card">
        <p class="label">their resume · cap or fax?</p>
        <p class="fine" style="text-align:left;margin:4px 0 12px">call it. see if the batch agrees.</p>
        <ul class="claims" id="claims">
          ${p.resume.map((line, k) => `
            <li class="claim" data-k="${k}">
              <span class="claim-text">${esc(line)}</span>
              <span class="claim-btns">
                <button class="cf cap" data-vote="cap">cap</button>
                <button class="cf fax" data-vote="fax">fax</button>
              </span>
              <small class="claim-result" aria-live="polite"></small>
            </li>`).join("")}
        </ul>
      </div>

      </div><div class="split-side">
      <div class="card">
        <p class="label" style="margin-bottom:12px">their 5 stickers</p>
        <div class="chips" style="gap:14px 10px;align-items:center">${p.stickers.map(([l, c], k) => (isMemePick(l)
          // picture stickers ("img:<meme id>") look the same as on your own profile
          ? `<span class="meme-chip">${memeImg(memeIdOf(l), "meme-pick", k % 2 ? 4 : -4)}<small>${esc(MEMES[memeIdOf(l)]?.label || "")}</small></span>`
          : sticker(l, c, { rot: k % 2 ? 3 : -3, size: "sm" }))).join("")}</div>
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

        <div class="diss-thread" id="thread"></div>
        <div class="diss-box">
          <textarea id="dissText" rows="2" maxlength="140" aria-label="Write a diss" placeholder="say something. respectfully. (or not)"></textarea>
          <div class="row">
            <button class="btn btn-ghost" id="genDiss">generate a diss 🎲</button>
            <button class="btn btn-cta" id="postDiss">post diss</button>
          </div>
        </div>
      </div>

      <div class="card larp-card">
        <p class="label" style="margin-bottom:10px">larp as ${esc(first)}</p>
        <p class="fine" style="text-align:left;margin-bottom:12px">AuraGPT predicts their next post.</p>
        <div class="larp-out" id="larpOut" hidden>${theirCircle}<p id="larpText"></p></div>
        <button class="btn btn-ghost btn-block" id="larp">larp as them 🎭</button>
      </div>

      <button class="btn btn-ghost btn-block" id="next">next profile: ${esc(next.name)} →</button>
      </div></div>
    </section>`;

  // ---------- connect + endorse ----------
  $("#connect", root).addEventListener("click", (e) => {
    toast(pick(CONNECT_TOASTS));
    earn("connect");
    e.currentTarget.textContent = "pending…";
    e.currentTarget.disabled = true;
  });
  $("#endorse", root).addEventListener("click", () => {
    endorsements += 1;
    earn("endorse");
    $("#endorsed", root).textContent = p.endorsed.replace(/by \d+/, `by ${endorsements}`);
    toast("endorsed. they will not endorse you back.");
  });

  // ---------- cap or fax ----------
  const showVote = (li, vote) => {
    const k = Number(li.dataset.k);
    const pct = vote === "cap" ? pctFor(p.id, k) : 100 - pctFor(p.id, k);
    li.dataset.vote = vote;
    li.querySelectorAll(".cf").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.vote === vote)));
    li.querySelector(".claim-result").textContent = CAP_FAX[vote][k % CAP_FAX[vote].length].replace("{pct}", pct);
  };
  Object.entries(social().votes).forEach(([k, v]) => showVote($(`.claim[data-k="${k}"]`, root), v));
  $("#claims", root).addEventListener("click", (e) => {
    const btn = e.target.closest(".cf");
    if (!btn) return;
    const li = btn.closest(".claim");
    showVote(li, btn.dataset.vote);
    saveSocial({ votes: { ...social().votes, [li.dataset.k]: btn.dataset.vote } });
    earn("cap");
  });

  // ---------- sticker reactions ----------
  $("#reactions", root).addEventListener("click", (e) => {
    const btn = e.target.closest("[data-id]");
    if (!btn) return;
    const sid = btn.dataset.id;
    reactions[sid] += 1;
    earn("react");
    btn.textContent = `${STICKERS[sid].label} ${reactions[sid]}`;
    btn.classList.remove("pop");
    void btn.offsetWidth;
    btn.classList.add("pop");
  });

  // ---------- diss thread: you post, they clap back ----------
  const msgHTML = (m) => (m.from === "me"
    ? `<div class="dmsg me">${avatarHTML(S.get(), "avatar-xs")}<p><b>${esc(S.get().name)}</b>${esc(m.text)}</p></div>`
    : `<div class="dmsg them"><span class="avatar-xs" style="background:${p.color};color:${p.ink}">${esc(initials(p.name))}</span>${m.stk ? sticker(m.stk, m.c, { rot: -4, size: "sm" }) : `<p><b>${esc(first)}</b>${esc(m.text)}</p>`}</div>`);
  const renderThread = () => { $("#thread", root).innerHTML = social().disses.map(msgHTML).join(""); };
  renderThread();

  const fillStat = () => pick(p.stats).join(": ");
  $("#genDiss", root).addEventListener("click", () => {
    $("#dissText", root).value = pick(DISSES).replaceAll("{first}", first).replace("{stat}", fillStat());
  });

  $("#postDiss", root).addEventListener("click", async () => {
    const box = $("#dissText", root);
    const text = box.value.trim();
    if (!text) { toast("an empty diss? that's just a like."); return; }
    box.value = "";
    saveSocial({ disses: [...social().disses, { from: "me", text }] });
    renderThread();
    toast("diss posted. +5 aura for courage.");
    earn("diss");
    await sleep(rand(900, 1500));
    if (!alive) return;
    saveSocial({ disses: [...social().disses, { from: "them", ...pick(DISS_REPLIES) }] });
    renderThread();
  });

  // ---------- larp as them ----------
  $("#larp", root).addEventListener("click", () => {
    $("#larpOut", root).hidden = false;
    $("#larpText", root).textContent = p.larps[larpIndex % p.larps.length];
    larpIndex += 1;
    earn("larp");
    $("#larp", root).textContent = "larp again 🎭";
  });

  $("#next", root).addEventListener("click", () => go(`/u/${next.id}`));

  return () => { alive = false; };
}
