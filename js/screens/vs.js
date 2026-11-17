// "Beat my aura": the screen a friend sees when they open your challenge link (#/vs/<code>).
// It shows your score, then sends them to scan their own resume; the score page shows the head-to-head.
import { go } from "../router.js";
import * as S from "../state.js";
import { $, esc, signed, toast } from "../fx.js";
import { SHARE_TEXT } from "../data.js";
import { decodeChallenge } from "../share-card.js";
import { initials } from "../identity.js";

const T = SHARE_TEXT.vs;

export default function vs(root, { code }) {
  const c = decodeChallenge(code);
  if (!c) { toast(T.broken); go("/"); return; }
  const hasScan = S.get().lines.length > 0;

  root.innerHTML = `
    <section class="vs-screen">
      <p class="label">${esc(T.kicker)}</p>
      <div class="card vs-card" data-tilt>
        <span class="av av-lg" data-c="${esc(c.color || "lilac")}" aria-hidden="true">${esc(initials(c.name))}</span>
        <h1 class="h1 vs-headline" data-scramble>${esc(T.headline(c.name))}</h1>
        <div class="big-num num">${signed(c.aura)}</div>
        <span class="pill">${esc(c.tier)}</span>
        ${c.edited ? `<p class="vs-cap">${esc(T.cap)}</p>` : ""}
        <p class="sub">${esc(T.sub)}</p>
      </div>
      <div class="row">
        ${hasScan ? `<button class="btn btn-ghost" id="last">${esc(T.useLast)}</button>` : ""}
        <button class="btn btn-cta" id="scan">${esc(T.scan)}</button>
      </div>
      <a class="link-btn vs-scared" href="#/">${esc(T.scared)}</a>
    </section>`;

  // Remember who challenged you; the score page shows the head-to-head
  const accept = (path) => { S.set({ challenge: { name: c.name, aura: c.aura, tier: c.tier, color: c.color } }); go(path); };
  $("#scan", root).addEventListener("click", () => accept("/upload"));
  if (hasScan) $("#last", root).addEventListener("click", () => accept("/score"));
}
