// Fighting-game moments for the boss fight: the VS intro, HR's speech bubble,
// the block timing minigame, the ultimate flash and the K.O. splash.
// Each returns a Promise, so boss.js can simply `await` them in order.
import { gsap } from "./motion.js";
import { esc, sleep, rand, reducedMotion, sticker } from "./fx.js";
import { FIGHT_TEXT as T } from "./data.js";
import { sfx } from "./sound.js";

const animate = () => gsap && !reducedMotion();

// ---------- VS intro: you vs HR, then ROUND 1 → FIGHT! (tap to skip) ----------
export function vsIntro({ youHTML, youName, bossName, level }) {
  if (!animate()) return Promise.resolve();
  document.body.insertAdjacentHTML("beforeend", `
    <div class="vs-intro" role="dialog" aria-label="${esc(youName)} versus ${esc(bossName)}">
      <div class="vs-side vs-left">${youHTML}<b>${esc(youName)}</b></div>
      <div class="vs-mid">${T.vs}</div>
      <div class="vs-side vs-right"><span class="avatar boss-av vs-boss" aria-hidden="true"><span class="visor"></span><span class="mouth"></span></span><b>${esc(bossName)}</b>${level ? `<span class="vs-level">${sticker(level.label, level.c, { rot: -6, size: "sm" })}</span><small class="vs-level-line">${esc(level.intro)}</small>` : ""}</div>
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

// ---------- HR's speech bubble ----------
// A big comic bubble next to HR. The text types out while HR's mouth moves.
// It doesn't hold up the fight: the returned promise resolves after `wait` ms, and the bubble
// stays up a little longer so you can finish reading. A new line replaces the old one; a tap skips it.
export function taunt(fighterEl, text, { wait = 900 } = {}) {
  fighterEl._endTaunt?.();   // a new line replaces the one still on screen
  const bubble = document.createElement("div");
  bubble.className = "taunt";
  bubble.setAttribute("aria-live", "polite");
  fighterEl.appendChild(bubble);
  fighterEl.classList.add("talking");
  const arena = fighterEl.closest(".arena") || fighterEl;

  return new Promise((resolve) => {
    let typer = 0, timer = 0;
    const gate = setTimeout(resolve, wait);   // the fight moves on after `wait`
    function done() {
      clearInterval(typer); clearTimeout(timer); clearTimeout(gate);
      arena.removeEventListener("click", done);
      fighterEl.classList.remove("talking");
      bubble.remove();
      if (fighterEl._endTaunt === done) fighterEl._endTaunt = null;
      resolve();
    }
    fighterEl._endTaunt = done;
    arena.addEventListener("click", done);
    const hold = Math.min(1600, 700 + text.length * 16);   // how long it stays after typing
    if (reducedMotion()) { bubble.textContent = text; timer = setTimeout(done, hold + 400); return; }
    let i = 0;
    typer = setInterval(() => {
      i += 2;   // two letters per tick: quick, still readable
      bubble.textContent = text.slice(0, i);
      if (i >= text.length) { clearInterval(typer); fighterEl.classList.remove("talking"); timer = setTimeout(done, hold); }
    }, 20);
  });
}

// ---------- Block minigame (full screen) ----------
// 1. A warning + a 3, 2, 1 countdown ("3… lock in 🔒") so you know it's coming (taps don't count yet)
// 2. "NOW. BLOCK IT, TWIN." and a marker sweeps across a big bar, speeding up as it goes
//    (it creeps at the start and rips across the end: that's the adrenaline).
//    Tap anywhere (or press space/enter) while it's in the green zone.
// Resolves "perfect" (dead centre), "good" (in the zone) or "miss" (outside / too late).
const ACCEL = 1.8;                                 // >1 = the marker speeds up as it travels
const markerAt = (t) => Math.pow(Math.min(1, Math.max(0, t)), ACCEL) * 100;   // time 0-1 -> position 0-100%

export function blockQTE({ sweepMs = 900, attack = "", stepMs = 450 } = {}) {
  const zoneW = 24, perfectW = 9;                 // widths in % of the bar
  const zoneAt = rand(25, 100 - zoneW - 4);        // where the zone sits (further right = it's moving faster = harder)
  document.body.insertAdjacentHTML("beforeend", `
    <div class="qte qte-full warn" role="dialog" aria-label="Block the attack">
      <div class="qte-inner">
        <p class="qte-warn">${esc(T.blockWarn)}</p>
        ${attack ? `<p class="qte-attack">${esc(attack)}</p>` : ""}
        <p class="qte-count" aria-live="assertive">${esc(T.blockReady)}</p>
        <div class="qte-bar">
          <span class="qte-zone" style="left:${zoneAt}%;width:${zoneW}%"><i style="left:${(zoneW - perfectW) / 2}%;width:${perfectW}%"></i></span>
          <span class="qte-marker"></span>
        </div>
        <button class="btn btn-cta qte-btn">${esc(T.blockPrompt)}</button>
        <p class="qte-hint">${esc(T.blockHint)}</p>
      </div>
    </div>`);
  const el = document.querySelector(".qte-full");
  const marker = el.querySelector(".qte-marker");
  el.querySelector(".qte-btn").focus({ preventScroll: true });
  sfx.thunk();

  return new Promise((resolve) => {
    let start = 0, raf = 0, live = false, finished = false, timeout = 0;

    const end = (result) => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
      removeEventListener("keydown", onKey);
      el.classList.add(`done-${result}`);
      setTimeout(() => el.remove(), 500);
      resolve(result);
    };
    const judge = () => {
      if (!live) return;                            // still in the warning: ignore early taps
      const p = markerAt((performance.now() - start) / sweepMs);   // same curve as the marker you see
      const centre = zoneAt + zoneW / 2;
      if (Math.abs(p - centre) <= perfectW / 2) return end("perfect");
      if (p >= zoneAt && p <= zoneAt + zoneW) return end("good");
      return end("miss");
    };
    const onKey = (e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); judge(); } };
    const tick = (now) => {
      const t = (now - start) / sweepMs;
      marker.style.left = `${markerAt(t)}%`;
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    el.addEventListener("pointerdown", judge);      // tap anywhere on the screen
    addEventListener("keydown", onKey);

    // 3… 2… 1… then GO: the marker starts moving
    const count = el.querySelector(".qte-count");
    const steps = [...T.countdown, T.blockGo];
    steps.forEach((text, i) => setTimeout(() => {
      if (finished) return;
      count.textContent = text;
      count.classList.remove("tick"); void count.offsetWidth; count.classList.add("tick");
      if (i < steps.length - 1) { sfx.thunk(); return; }
      sfx.ding();
      live = true;
      start = performance.now();
      el.classList.remove("warn");
      raf = requestAnimationFrame(tick);
      timeout = setTimeout(() => end("miss"), sweepMs + 60);   // too slow = no block
    }, 300 + i * stepMs));
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
