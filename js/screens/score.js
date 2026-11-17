import { go } from "../router.js";
import * as S from "../state.js";
import { $, esc, signed, countUp, confetti, toast, sticker } from "../fx.js";
import { SHARE_TEXT, PERK_MOVES, PERK_TEXT } from "../data.js";
import { shareAura } from "../share-card.js";
import { earn } from "../aura.js";
import { tierFor, analyzeResume, isW, isCrashOut, perksFor } from "../aura-engine.js";
import { breakdownHTML, fillBreakdown, rizzText } from "../breakdown.js";

export default function score(root) {
  const { aura, lines, allLines, challenge, name, avatar, perks: saved } = S.get();
  if (!lines.length) { go("/upload"); return; }

  const tier = tierFor(aura);
  const crashOuts = lines.filter(isCrashOut).length;
  const ws = lines.filter(isW).length;
  const best = [...lines].sort((a, b) => b.points - a.points)[0];
  const worst = [...lines].sort((a, b) => a.points - b.points)[0];

  // AuraGPT breakdown: every factor scored 0-10 from your whole resume (older saves only have the 14 lines)
  const { scores, rizz } = analyzeResume(allLines?.length ? allLines : lines);

  // Opened a friend's "beat my aura" link? Show the head-to-head (ties within 100 aura)
  const H = SHARE_TEXT.h2h;
  const gap = Math.abs(Math.round(aura - (challenge?.aura ?? 0))).toLocaleString("en-US");
  const h2hVerdict = !challenge ? "" : Math.abs(aura - challenge.aura) <= 100 ? H.tie
    : aura > challenge.aura ? H.win(challenge.name, gap) : H.lose(challenge.name, gap);
  const top = Math.max(aura, challenge?.aura ?? 0, 1);
  const bar = (label, value) => `
    <div class="mog-bar"><span>${esc(label)}</span><div class="bar"><span style="width:${Math.max(0, (value / top) * 100)}%"></span></div><b>${signed(value)}</b></div>`;
  const h2hHTML = !challenge ? "" : `
      <div class="card h2h-card">
        <p class="label" style="margin-bottom:12px">${esc(H.title)}</p>
        ${bar(H.you, aura)}
        ${bar(challenge.name.split(" ")[0], challenge.aura)}
        <p class="mog-verdict">${esc(h2hVerdict)}</p>
        <button class="btn btn-cta h2h-back" id="shareBack">${esc(H.back)}</button>
      </div>`;

  // The fight moves your resume unlocked (older saves didn't store them, so work them out)
  const perks = (saved?.length ? saved : perksFor(allLines?.length ? allLines : lines)).filter((id) => PERK_MOVES[id]);
  const perksHTML = `
      <div class="card perks-card">
        <p class="label" style="margin-bottom:12px">${esc(PERK_TEXT.title)}</p>
        ${perks.length ? `<ul class="perk-list">${perks.map((id) => `
          <li class="perk"><b>${esc(PERK_MOVES[id].name)}</b><small>${esc(PERK_MOVES[id].hint)} · ${esc(PERK_TEXT.from(PERK_MOVES[id].from))}</small></li>`).join("")}</ul>`
          : `<p class="sub" style="margin:0">${esc(PERK_TEXT.none)}</p>`}
      </div>`;

  root.innerHTML = `
    <section>
      <p class="label">step 3 of 3 · your aura score is</p>
      <div class="big-num num" id="num" aria-live="polite">+0</div>
      <p class="sub">aura points · ${lines.length} lines judged</p>
      <span class="pill" id="rank" style="visibility:hidden">${tier.name}</span>

      <div class="split"><div class="split-main">
      ${h2hHTML}
      <div class="card" data-tilt>
        <span class="card-stk">${sticker(aura >= 3300 ? "W" : "L", aura >= 3300 ? "lime" : "pink", { rot: 10, size: "lg" })}</span>
        <p class="roast">${tier.roast}</p>
        <div class="stats" style="margin-top:16px">
          <div class="stat"><small>rizz</small><b>${rizzText(rizz)}</b></div>
          <div class="stat"><small>Ws</small><b>${ws}</b></div>
          <div class="stat"><small>crash outs</small><b>${crashOuts}</b></div>
        </div>
        <p class="sub" style="margin-top:14px;font-size:14px">best line: "${esc(best.text)}" (${signed(best.points)})</p>
        <p class="sub" style="font-size:14px">worst line: "${esc(worst.text)}" (${signed(worst.points)})</p>
      </div>

      </div><div class="split-side">
      <div class="card">
        <p class="label" style="margin-bottom:14px">AuraGPT breakdown</p>
        ${breakdownHTML(scores)}
      </div>
      ${perksHTML}

      </div></div>
      <button class="btn share-btn" id="share">${esc(SHARE_TEXT.button)} ↗</button>
      <div class="row">
        <button class="btn btn-ghost" id="flex">copy my flex</button>
        <button class="btn btn-cta" id="next">pick my vibe →</button>
      </div>
    </section>`;

  let alive = true;
  const fillTimer = fillBreakdown(root, 400);   // the meters fill a beat after render
  countUp($("#num", root), aura).then(() => {
    if (!alive) return;
    const rank = $("#rank", root);
    rank.style.visibility = "visible";
    rank.classList.add("stk", "pop");
    if (aura >= 2800) confetti();
  });

  $("#flex", root).addEventListener("click", async () => {
    const text = `My AuraHire score: ${signed(aura)} aura. Rank: ${tier.name}. Stop applying, start aura farming.`;
    try { await navigator.clipboard.writeText(text); toast("flex copied. go post it, twin."); }
    catch { toast(text); }
  });
  $("#next", root).addEventListener("click", () => go("/stickers"));

  // Share my aura: draw the card and open the share sheet (or download it)
  const card = { name, avatar, aura, tier: tier.name, best, worst, scores };
  const share = async (btn) => {
    const label = btn.textContent;
    btn.disabled = true; btn.textContent = SHARE_TEXT.making;
    if (await shareAura(card)) earn("share");
    if (alive) { btn.disabled = false; btn.textContent = label; }
  };
  $("#share", root).addEventListener("click", (e) => share(e.currentTarget));
  $("#shareBack", root)?.addEventListener("click", (e) => share(e.currentTarget));

  return () => {
    alive = false; clearTimeout(fillTimer);
    if (challenge) S.set({ challenge: null });   // the head-to-head shows once, for this result
  };
}
