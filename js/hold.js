// A press-and-hold ring button (inspired by zero.university's "tap hold").
// mountHold(container, options) puts the ring inside `container` and returns a cleanup fn.

import { pick, toast } from "./fx.js";

const DEFAULT_ROASTS = ["commitment issues?", "you let go. HR noticed.", "hold it, twin. like a grudge."];

export function mountHold(container, { title, sub, doneText = "done.", ms = 1600, roasts = DEFAULT_ROASTS, onDone }) {
  container.innerHTML = `
    <button class="hold-btn" style="--p:0%" aria-label="${sub} (press and hold)">
      <span><b>${title}</b><small>${sub}</small></span>
    </button>`;
  const hold = container.querySelector(".hold-btn");
  let holding = false, done = false, start = 0, raf = 0, timer = 0;

  const tick = (now) => {
    const p = Math.min(1, (now - start) / ms);
    hold.style.setProperty("--p", `${p * 100}%`);
    if (navigator.vibrate && p < 1 && Math.round(p * 20) % 5 === 0) navigator.vibrate(5);
    if (p >= 1) {
      done = true;
      hold.classList.remove("holding");
      hold.classList.add("done");
      hold.querySelector("small").textContent = doneText;
      timer = setTimeout(onDone, 350);
    } else if (holding) {
      raf = requestAnimationFrame(tick);
    }
  };

  const down = (e) => {
    if (done) return;
    e.preventDefault();
    holding = true;
    start = performance.now();
    hold.classList.add("holding");
    raf = requestAnimationFrame(tick);
  };

  const up = () => {
    if (!holding || done) return;
    holding = false;
    cancelAnimationFrame(raf);
    hold.classList.remove("holding");
    hold.style.setProperty("--p", "0%");
    toast(pick(roasts));
  };

  // Keyboard users: hold Space or Enter
  const keyDown = (e) => { if ((e.key === " " || e.key === "Enter") && !e.repeat) down(e); };
  const keyUp = (e) => { if (e.key === " " || e.key === "Enter") up(); };

  hold.addEventListener("pointerdown", down);
  hold.addEventListener("pointerup", up);
  hold.addEventListener("pointerleave", up);
  hold.addEventListener("pointercancel", up);
  hold.addEventListener("keydown", keyDown);
  hold.addEventListener("keyup", keyUp);
  hold.addEventListener("contextmenu", (e) => e.preventDefault()); // long-press menu on phones

  return () => { cancelAnimationFrame(raf); clearTimeout(timer); };
}
