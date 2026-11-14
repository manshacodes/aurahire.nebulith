import { go } from "../router.js";
import { $, esc, rand } from "../fx.js";
import { mountHold } from "../hold.js";
import { JOBS } from "../data.js";

// The Apply button runs from your cursor (or your taps), then gives up
// and turns into a "hold to apply" ring, because commitment is hard.
const TAUNTS = ["nope", "too slow", "missed me", "lol", "be serious", "ok ok wait"];
const MAX_DODGES_MOUSE = 6;
const MAX_DODGES_TOUCH = 3;
const FLEE_RADIUS = 120;   // px: how close the cursor can get before it runs

export default function job(root, { id }) {
  const j = JOBS.find((x) => x.id === id) || JOBS[0];

  root.innerHTML = `
    <section>
      <a href="#/jobs" class="back">← back to the grind</a>
      <div class="banner" style="background:${j.color}">${esc(j.company)}<small>${j.posted} · ${j.applicants} applicants · remote (office 6 days a week)</small></div>
      <h1 class="h1" data-scramble>${esc(j.title)}</h1>
      <div class="card">
        <p class="label" style="margin-bottom:12px">requirements</p>
        <ul class="req">${j.reqs.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
      </div>
      <div class="card">
        <p class="label">stipend</p>
        <p style="font-weight:800;font-size:18px;margin-top:4px">${esc(j.stipend)}</p>
        <p class="label" style="margin-top:16px">vibe check · ${j.vibe}% match</p>
        <div class="bar" style="margin-top:8px"><span id="vibe"></span></div>
      </div>
      <div class="dodge-zone" id="zone">
        <button class="btn btn-cta dodge-btn" id="apply">apply</button>
      </div>
      <p class="fine" id="hint">(good luck clicking it)</p>
    </section>`;

  requestAnimationFrame(() => { $("#vibe", root).style.width = `${j.vibe}%`; });

  const zone = $("#zone", root);
  let btn = $("#apply", root);
  let dodges = 0;
  let stopHold = null;
  let lastFlee = 0;          // cooldown so each escape is visible

  // Jump to a random spot in the zone, as far from (x, y) as we can manage.
  function flee(x, y) {
    const z = zone.getBoundingClientRect();
    const b = btn.getBoundingClientRect();
    let best = null;
    for (let i = 0; i < 8; i++) {
      const left = rand(0, Math.max(0, z.width - b.width));
      const top = rand(0, Math.max(0, z.height - b.height));
      const d = Math.hypot(z.left + left + b.width / 2 - x, z.top + top + b.height / 2 - y);
      if (!best || d > best.d) best = { left, top, d };
    }
    btn.classList.add("moved");
    btn.style.left = `${best.left}px`;
    btn.style.top = `${best.top}px`;
    btn.textContent = TAUNTS[dodges % TAUNTS.length];
    dodges++;
  }

  function giveUp() {
    // Swap the runaway button for a hold-to-apply ring
    $("#hint", root).textContent = "(press and hold. commitment is hard.)";
    stopHold = mountHold(zone, {
      title: "ok fine.", sub: "hold to apply", doneText: "applied. fight HR →",
      onDone: () => go(`/boss/${j.id}`),
    });
  }

  // Mouse: it runs whenever the cursor gets close.
  zone.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse" || !zone.contains(btn)) return;
    const b = btn.getBoundingClientRect();
    const d = Math.hypot(b.left + b.width / 2 - e.clientX, b.top + b.height / 2 - e.clientY);
    if (d < FLEE_RADIUS && performance.now() - lastFlee > 280) {
      lastFlee = performance.now();
      if (dodges >= MAX_DODGES_MOUSE) giveUp();
      else flee(e.clientX, e.clientY);
    }
  });

  // Touch (or a lucky click): each tap makes it run, until it gives up.
  btn.addEventListener("click", (e) => {
    if (dodges >= MAX_DODGES_TOUCH) { giveUp(); return; }
    flee(e.clientX, e.clientY);
  });

  return () => { if (stopHold) stopHold(); };
}
