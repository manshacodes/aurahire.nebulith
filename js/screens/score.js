import { go } from "../router.js";
import * as S from "../state.js";
import { $, signed, countUp, confetti, toast, sticker } from "../fx.js";
import { tierFor } from "../aura-engine.js";

export default function score(root) {
  const { aura, lines } = S.get();
  if (!lines.length) { go("/upload"); return; }

  const tier = tierFor(aura);
  const glazing = lines.filter((l) => /glazing/.test(l.roast)).length;
  const crashOuts = lines.filter((l) => l.points < 0).length;
  const best = [...lines].sort((a, b) => b.points - a.points)[0];

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
          <div class="stat"><small>rizz</small><b>6-7/10</b></div>
          <div class="stat"><small>yap level</small><b>${glazing ? "high" : "low"}</b></div>
          <div class="stat"><small>crash outs</small><b>${crashOuts}</b></div>
        </div>
        <p class="sub" style="margin-top:14px;font-size:14px">best line: "${best.text}" (${signed(best.points)})</p>
      </div>

      <div class="row">
        <button class="btn btn-ghost" id="flex">copy my flex</button>
        <button class="btn btn-cta" id="next">pick my vibe →</button>
      </div>
    </section>`;

  let alive = true;
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
