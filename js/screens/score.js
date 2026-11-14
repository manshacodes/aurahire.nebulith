import { go } from "../router.js";
import * as S from "../state.js";
import { $, esc, signed, countUp, confetti, toast, sticker } from "../fx.js";
import { tierFor, analyzeResume } from "../aura-engine.js";
import { FACTORS } from "../data.js";

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
  const level = (v) => (v <= 3 ? "low" : v <= 6 ? "mid" : "high");
  const rizzText = rizz === 6 || rizz === 7 ? "6-7/10" : `${rizz}/10`;   // the meme, only when earned

  root.innerHTML = `
    <section>
      <p class="label">step 3 of 3 · your aura score is</p>
      <div class="big-num num" id="num" aria-live="polite">+0</div>
      <p class="sub">aura points · ${lines.length} lines judged</p>
      <span class="pill" id="rank" style="visibility:hidden">${tier.name}</span>

      <div class="card" data-tilt>
        <span class="card-stk">${sticker(aura >= 3300 ? "W" : "L", aura >= 3300 ? "lime" : "pink", { rot: 10, size: "lg" })}</span>
        <p class="roast">${tier.roast}</p>
        <div class="stats" style="margin-top:16px">
          <div class="stat"><small>rizz</small><b>${rizzText}</b></div>
          <div class="stat"><small>Ws</small><b>${ws}</b></div>
          <div class="stat"><small>crash outs</small><b>${crashOuts}</b></div>
        </div>
        <p class="sub" style="margin-top:14px;font-size:14px">best line: "${esc(best.text)}" (${signed(best.points)})</p>
        <p class="sub" style="font-size:14px">worst line: "${esc(worst.text)}" (${signed(worst.points)})</p>
      </div>

      <div class="card">
        <p class="label" style="margin-bottom:14px">AuraGPT breakdown</p>
        <ul class="factors" id="factors">
          ${FACTORS.map((f) => `
            <li class="factor">
              <div class="factor-top"><b>${f.label}</b><span>${scores[f.id]}/10</span></div>
              <div class="bar"><span data-w="${scores[f.id] * 10}"></span></div>
              <small>${f[level(scores[f.id])]}</small>
            </li>`).join("")}
        </ul>
      </div>

      <div class="row">
        <button class="btn btn-ghost" id="flex">copy my flex</button>
        <button class="btn btn-cta" id="next">pick my vibe →</button>
      </div>
    </section>`;

  let alive = true;
  // Fill the breakdown meters a beat after render (the CSS transition animates them)
  setTimeout(() => {
    if (alive) root.querySelectorAll("#factors .bar > span").forEach((s) => { s.style.width = `${s.dataset.w}%`; });
  }, 400);
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

  return () => { alive = false; };
}
