// Small helpers: DOM shortcuts, randomness, and all the juicy effects.

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

// Escape anything a user typed before putting it into HTML.
export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// "+4,200" / "−800"
export const signed = (n) => (n >= 0 ? "+" : "−") + Math.abs(Math.round(n)).toLocaleString("en-US");

export function sticker(label, color, { rot = 0, size = "", tag = "span", attrs = "" } = {}) {
  return `<${tag} class="stk ${size}" data-c="${color}" style="--rot:${rot}deg" ${attrs}>${esc(label)}</${tag}>`;
}

export function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.remove("show");
  void el.offsetWidth; // restart the animation
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 2400);
}

export function shake(el) {
  el.classList.remove("shake");
  void el.offsetWidth;
  el.classList.add("shake");
}

export function floatText(parent, text, good = false) {
  const span = document.createElement("span");
  span.className = "float-text" + (good ? " good" : "");
  span.textContent = text;
  parent.appendChild(span);
  setTimeout(() => span.remove(), 1200);
}

// Animate a number from `from` to `to` with an ease-out curve.
export function countUp(el, to, { from = 0, duration = 1800, format = signed } = {}) {
  return new Promise((resolve) => {
    if (reducedMotion()) { el.textContent = format(to); return resolve(); }
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = format(from + (to - from) * eased);
      t < 1 ? requestAnimationFrame(tick) : resolve();
    };
    requestAnimationFrame(tick);
  });
}

export function confetti(count = 90) {
  if (reducedMotion()) return;
  const colors = ["#C8FF2E", "#FF5FC1", "#CDBEFF", "#FFE45C", "#8FD3FF", "#FF8A3D", "#111111"];
  const box = document.createElement("div");
  box.className = "confetti";
  box.innerHTML = Array.from({ length: count }, () =>
    `<i style="--x:${rand(0, 100)}vw;--dx:${rand(-120, 120)}px;--r:${rand(0, 180)}deg;--d:${rand(1800, 3200)}ms;--c:${pick(colors)};--w:${rand(7, 12)}px"></i>`
  ).join("");
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 3500);
}

// Reveal text one character at a time.
export async function typewriter(el, text, speed = 14, isCancelled = () => false) {
  el.classList.add("caret");
  el.textContent = "";
  for (let i = 0; i < text.length; i++) {
    if (isCancelled()) return;
    el.textContent += text[i];
    if (!reducedMotion()) await sleep(speed);
  }
  el.classList.remove("caret");
}
