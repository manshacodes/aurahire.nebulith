import { go } from "../router.js";
import * as S from "../state.js";
import { $, esc, signed, countUp, confetti, toast, sticker } from "../fx.js";
import { tierFor, analyzeResume } from "../aura-engine.js";
import { breakdownHTML, fillBreakdown, rizzText } from "../breakdown.js";

export default function score(root) {
  const { aura, lines } = S.get();
  if (!lines.length) { go("/upload"); return; }

  const tier = tierFor(aura);
  const crashOuts = lines.filter((l) => l.points < 0).length;
  const ws = lines.filter((l) => l.points >= 100).length;
  const best = [...lines].sort((a, b) => b.points - a.points)[0];
  const worst = [...lines].sort((a, b) => a.points - b.points)[0];

  // AuraGPT breakdown: every factor scored 0-10 from what's actually in your resume
  const { scores, rizz } = analyzeResume(lines);

  root.innerHTML = `
    <section>
      <p class="label">step 3 of 3 · your aura score is</p>
      <div class="big-num num" id="num" aria-live="polite">+0</div>
      <p class="sub">aura points · ${lines.length} lines judged</p>
      <span class="pill" id="rank" style="visibility:hidden">${tier.name}</span>

      <div class="split"><div class="split-main">
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

      </div></div>
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

  return () => { alive = false; clearTimeout(fillTimer); };
}
