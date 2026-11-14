// The AuraGPT scan: a thinking orb, a live terminal log, a highlighter sweeping each line,
// verdict stamps slamming down, points flying into a live counter, and a running aura graph.

import { go } from "../router.js";
import * as S from "../state.js";
import { $, $$, esc, signed, sleep, confetti, shake, reducedMotion } from "../fx.js";
import { scoreResume, BASE_AURA } from "../aura-engine.js";
import { gsap } from "../motion.js";
import { sfx } from "../sound.js";

const STEP_MS = 850;

// Pick a stamp for a judged line
function stampFor({ points, roast }) {
  if (/nepotism/.test(roast)) return ["NEPO", "red"];
  if (/glazing/.test(roast)) return ["GLAZE", "pink"];
  if (/impossible/.test(roast)) return ["CAP", "red"];
  if (/larping/.test(roast)) return ["LARP", "orange"];
  if (/tourist/.test(roast)) return ["TOURIST", "sky"];
  if (points >= 300) return ["W", "lime"];
  if (points >= 100) return ["BASED", "lime"];
  if (points <= -100) return ["L", "red"];
  return ["MID", "grey"];
}

// What AuraGPT "thinks" while judging a line
function thoughts(line) {
  const short = line.text.length > 34 ? line.text.slice(0, 34) + "…" : line.text;
  const check = line.points >= 0
    ? ["cross-referencing with seniors… verified", "checking linkedin… surprisingly real", "vibe check… passed"]
    : ["cross-referencing with reality… cap detected", "asking HR unc… he laughed", "vibe check… failed"];
  return [`> reading "${short}"`, `> ${check[line.text.length % check.length]}`];
}

export default function scan(root) {
  const { resume } = S.get();
  if (!resume) { go("/upload"); return; }
  const result = scoreResume(resume);
  let cancelled = false;

  root.innerHTML = `
    <section class="scan">
      <div class="scan-top">
      <div class="scan-hud card">
        <div class="orb" id="orb" aria-hidden="true"><span class="orb-eye"></span></div>
        <div class="hud-main">
          <p class="label">auragpt is judging you</p>
          <div class="hud-num num" id="hudNum">${signed(BASE_AURA)}</div>
          <svg class="spark" id="spark" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><polyline points="0,15" /></svg>
        </div>
        <button class="link-btn skip" id="skip">skip</button>
      </div>
      <pre class="term" id="term" aria-live="polite">> booting AuraGPT v6.7…</pre>
      </div>
      <div class="card paper" id="paper">
        <div class="beam" aria-hidden="true"></div>
        <ul class="lines">
          ${result.lines.map((l) => {
            const [stamp, c] = stampFor(l);
            return `
              <li class="line ${l.points >= 0 ? "good" : "bad"}">
                <span class="line-text"><mark>${esc(l.text)}</mark></span>
                <span class="tag ${l.points >= 0 ? "plus" : "minus"}">${signed(l.points)} aura <em>${esc(l.roast)}</em></span>
                <span class="stamp-wrap"><span class="stk lg stamp-stk" data-c="${c}" style="--rot:${l.text.length % 2 ? -12 : 10}deg">${stamp}</span></span>
              </li>`;
          }).join("")}
        </ul>
        <div class="complete" id="complete" aria-hidden="true"><span class="stk lg" data-c="black" style="--rot:-8deg">SCAN COMPLETE</span></div>
      </div>
    </section>`;

  const orb = $("#orb", root), hudNum = $("#hudNum", root), term = $("#term", root);
  const spark = $("#spark polyline", root), items = $$(".line", root);
  const fast = reducedMotion();

  // Terminal: keep the last 3 lines
  const log = (text) => {
    const lines = (term.textContent + "\n" + text).split("\n").slice(-3);
    term.textContent = lines.join("\n");
  };

  // Running aura graph
  const totals = [BASE_AURA];
  const drawSpark = () => {
    const min = Math.min(...totals) - 100, max = Math.max(...totals) + 100;
    const pts = totals.map((t, i) => `${(i / Math.max(1, result.lines.length)) * 100},${30 - ((t - min) / (max - min)) * 30}`);
    spark.setAttribute("points", pts.join(" "));
  };

  // A "+500" that flies from the line up into the counter
  function flyPoints(fromEl, points) {
    if (!gsap || fast) return;
    const a = fromEl.getBoundingClientRect(), b = hudNum.getBoundingClientRect();
    const fly = document.createElement("span");
    fly.className = `fly-pts ${points >= 0 ? "good" : "bad"}`;
    fly.textContent = signed(points);
    fly.style.left = `${a.left + 20}px`;
    fly.style.top = `${a.top}px`;
    document.body.appendChild(fly);
    gsap.to(fly, {
      x: b.left - a.left, y: b.top - a.top, scale: 0.6, duration: 0.6, ease: "power2.in",
      onComplete: () => fly.remove(),
    });
  }

  async function judge(i) {
    const line = result.lines[i], el = items[i];
    el.classList.add("show");
    el.scrollIntoView({ behavior: fast ? "auto" : "smooth", block: "center" });
    orb.className = "orb thinking";
    const [t1, t2] = thoughts(line);
    log(t1);
    await sleep(fast ? 0 : STEP_MS * 0.35);
    if (cancelled) return;

    el.classList.add("marked");                 // highlighter sweep
    log(t2);
    await sleep(fast ? 0 : STEP_MS * 0.3);
    if (cancelled) return;

    el.classList.add("tagged", "stamped");      // tag pops + stamp slams
    if (!fast) {
      sfx.thunk();
      if (line.points >= 100) setTimeout(sfx.ding, 120);
      else if (line.points <= -100) setTimeout(sfx.womp, 150);
    }
    orb.className = `orb ${line.points >= 0 ? "happy" : "angry"}`;
    flyPoints(el, line.points);
    totals.push(totals[totals.length - 1] + line.points);
    drawSpark();
    S.addAura(line.points);
    hudNum.textContent = signed(totals[totals.length - 1]);
    hudNum.classList.remove("tick"); void hudNum.offsetWidth; hudNum.classList.add("tick");
    if (line.points <= -100) shake($("#paper", root));
    if (line.points >= 300 && !fast) confetti(30);
    await sleep(fast ? 0 : STEP_MS * 0.35);
  }

  async function finish() {
    if (cancelled) return;
    cancelled = true;
    S.set({ aura: result.total, lines: result.lines, tierName: result.tier.name });
    $("#complete", root).classList.add("show");
    orb.className = "orb done";
    log(`> verdict: ${result.tier.name}. ${signed(result.total)} aura.`);
    await sleep(fast ? 300 : 1300);
    go("/score");
  }

  (async () => {
    S.set({ aura: BASE_AURA });
    drawSpark();
    await sleep(fast ? 0 : 700);
    for (let i = 0; i < items.length && !cancelled; i++) await judge(i);
    finish();
  })();

  $("#skip", root).addEventListener("click", () => {
    items.forEach((el) => el.classList.add("show", "marked", "tagged", "stamped"));
    finish();
  });

  return () => { cancelled = true; };
}
