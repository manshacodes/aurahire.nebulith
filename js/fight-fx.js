// Fighting-game moments for the boss fight: the VS intro, HR's speech bubble,
// the block timing minigame, the ultimate flash and the K.O. splash.
// Each returns a Promise, so boss.js can simply `await` them in order.
import { gsap } from "./motion.js";
import { esc, sleep, rand, reducedMotion } from "./fx.js";
import { FIGHT_TEXT as T } from "./data.js";
import { sfx } from "./sound.js";

const animate = () => gsap && !reducedMotion();

// ---------- VS intro: you vs HR, then ROUND 1 → FIGHT! (tap to skip) ----------
export function vsIntro({ youHTML, youName, bossName }) {
  if (!animate()) return Promise.resolve();
  document.body.insertAdjacentHTML("beforeend", `
    <div class="vs-intro" role="dialog" aria-label="${esc(youName)} versus ${esc(bossName)}">
      <div class="vs-side vs-left">${youHTML}<b>${esc(youName)}</b></div>
      <div class="vs-mid">${T.vs}</div>
      <div class="vs-side vs-right"><span class="avatar boss-av vs-boss" aria-hidden="true"><span class="visor"></span><span class="mouth"></span></span><b>${esc(bossName)}</b></div>
      <p class="vs-call" aria-live="assertive"></p>
      <small class="vs-skip">${T.skipIntro}</small>
    </div>`);
  const el = document.querySelector(".vs-intro");
  const call = el.querySelector(".vs-call");

  return new Promise((resolve) => {
    const tl = gsap.timeline({ onComplete: done });
    const safety = setTimeout(done, 4500);   // never let the intro block the fight
    function done() { clearTimeout(safety); tl.kill(); el.remove(); resolve(); }
    el.addEventListener("click", done, { once: true });

    tl.from(el.querySelector(".vs-left"), { xPercent: -140, duration: 0.45, ease: "power4.out" })
      .from(el.querySelector(".vs-right"), { xPercent: 140, duration: 0.45, ease: "power4.out" }, "<")
      .from(el.querySelector(".vs-mid"), { scale: 5, opacity: 0, duration: 0.3, ease: "power4.in", onComplete: () => sfx.thunk() }, "-=0.1")
      .to({}, { duration: 0.5 })
      .call(() => { call.textContent = T.round; sfx.thunk(); })
      .fromTo(call, { scale: 2.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: "power4.in" })
      .to({}, { duration: 0.55 })
      .call(() => { call.textContent = T.fight; call.classList.add("fight"); sfx.crit(); })
      .fromTo(call, { scale: 3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: "power4.in" })
      .to(el, { opacity: 0, duration: 0.3, delay: 0.5 });
  });
}

// ---------- HR's speech bubble over the boss ----------
export async function taunt(fighterEl, text) {
  const bubble = document.createElement("div");
  bubble.className = "taunt";
  bubble.textContent = text;
  fighterEl.appendChild(bubble);
  await sleep(1300);
  bubble.remove();
}

// ---------- Block minigame ----------
// A marker sweeps across a bar. Tap (or press space/enter) while it's in the zone.
// Resolves "perfect" (dead centre), "good" (in the zone) or "miss" (outside / too late).
export function blockQTE(container, { sweepMs = 950 } = {}) {
  const zoneW = 26, perfectW = 8;                 // widths in % of the bar
  const zoneAt = rand(30, 100 - zoneW - 4);        // where the zone sits this time
  container.insertAdjacentHTML("beforeend", `
    <div class="qte" role="group" aria-label="Block the attack">
      <p class="qte-hint">${T.blockHint}</p>
      <div class="qte-bar">
        <span class="qte-zone" style="left:${zoneAt}%;width:${zoneW}%"><i style="left:${(zoneW - perfectW) / 2}%;width:${perfectW}%"></i></span>
        <span class="qte-marker"></span>
      </div>
      <button class="btn btn-cta qte-btn">${T.blockPrompt}</button>
    </div>`);
  const el = container.querySelector(".qte");
  const marker = el.querySelector(".qte-marker");
  const btn = el.querySelector(".qte-btn");
  btn.focus({ preventScroll: true });

  return new Promise((resolve) => {
    const start = performance.now();
    let raf = 0, finished = false;

    const end = (result) => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
      removeEventListener("keydown", onKey);
      el.classList.add(`done-${result}`);
      setTimeout(() => el.remove(), 450);
      resolve(result);
    };
    const judge = () => {
      const p = ((performance.now() - start) / sweepMs) * 100;
      const centre = zoneAt + zoneW / 2;
      if (Math.abs(p - centre) <= perfectW / 2) return end("perfect");
      if (p >= zoneAt && p <= zoneAt + zoneW) return end("good");
      return end("miss");
    };
    const onKey = (e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); judge(); } };
    const tick = (now) => {
      const p = Math.min(1, (now - start) / sweepMs);
      marker.style.left = `${p * 100}%`;
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    btn.addEventListener("click", judge);
    addEventListener("keydown", onKey);
    raf = requestAnimationFrame(tick);
    const timeout = setTimeout(() => end("miss"), sweepMs + 60);   // too slow = no block
  });
}

// ---------- Ultimate: white flash + shake + big title ----------
export async function ultFlash(name) {
  document.body.insertAdjacentHTML("beforeend", `<div class="ult-flash" aria-hidden="true"><p>${esc(name)}</p></div>`);
  const el = document.querySelector(".ult-flash");
  sfx.rumble();
  setTimeout(() => sfx.crit(), 350);
  if (animate()) {
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.12 });
    gsap.fromTo(el.querySelector("p"), { scale: 3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "power4.in", delay: 0.1 });
  }
  await sleep(1100);
  if (animate()) await gsap.to(el, { opacity: 0, duration: 0.25 });
  el.remove();
}

// ---------- K.O. splash ----------
export async function koSplash(won) {
  document.body.insertAdjacentHTML("beforeend", `<div class="ko ${won ? "win" : "lose"}" role="status"><p>${T.ko}</p></div>`);
  const el = document.querySelector(".ko");
  sfx.crit();
  setTimeout(() => sfx.thunk(), 120);
  if (animate()) {
    gsap.fromTo(el.querySelector("p"), { scale: 6, rotation: -12, opacity: 0 }, { scale: 1, rotation: -6, opacity: 1, duration: 0.35, ease: "power4.in" });
    gsap.fromTo(el, { x: -14 }, { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)", delay: 0.33 });
  }
  await sleep(1200);
  if (animate()) await gsap.to(el, { opacity: 0, duration: 0.25 });
  el.remove();
}
