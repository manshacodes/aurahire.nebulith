// Motion layer: Lenis smooth scrolling + GSAP ScrollTrigger, scramble-text headings,
// a springy custom cursor and 3D tilt cards. Everything degrades gracefully:
// if the libraries fail to load or the user prefers reduced motion, the app still works.

import { reducedMotion } from "./fx.js";

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
export const hasGsap = Boolean(gsap && ScrollTrigger);
// Phones and tablets: native touch scrolling is already smooth, so we skip Lenis there
export const isTouch = matchMedia("(pointer: coarse)").matches;
let lenis = null;

export function initMotion() {
  if (!hasGsap) document.documentElement.classList.add("no-gsap");
  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    if (window.ScrambleTextPlugin) gsap.registerPlugin(window.ScrambleTextPlugin);
    // On phones the address bar shows/hides while you scroll, which resizes the screen.
    // Don't recalculate every pin when that happens (it makes pinned chapters jump).
    ScrollTrigger.config({ ignoreMobileResize: true });
  }
  if (hasGsap && window.Lenis && !reducedMotion() && !isTouch) {
    // Lenis runs off GSAP's ticker so it and ScrollTrigger never disagree about scroll position
    lenis = new window.Lenis({
      duration: 1.1, easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)), smoothWheel: true,
      // let text boxes and inner scrollers use the normal mouse wheel (Lenis was swallowing it)
      prevent: (node) => node.nodeName === "TEXTAREA" || Boolean(node.closest?.("[data-lenis-prevent], .tray-row, .quick-row")),
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  initCursor();
  initTilt();
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}

// Freeze / unfreeze scrolling (used while the intro plays)
export function pauseScroll() {
  if (lenis) lenis.stop();
  document.documentElement.style.overflow = "hidden";
}
export function resumeScroll() {
  document.documentElement.style.overflow = "";
  if (lenis) lenis.start();
}

// Smoothly scroll the page to a y position (through Lenis when it's running, so they don't fight)
let scrollFallback = 0;
export function scrollToY(y) {
  if (lenis) {
    lenis.resize();   // the page just got taller (new chat message), so Lenis must re-measure first
    lenis.scrollTo(y, { duration: 0.6, force: true });
  } else {
    window.scrollTo({ top: y, behavior: reducedMotion() ? "auto" : "smooth" });
  }
  // some browsers skip smooth scrolling: if we haven't arrived shortly after, just jump there
  clearTimeout(scrollFallback);
  scrollFallback = setTimeout(() => {
    const target = Math.min(y, document.documentElement.scrollHeight - innerHeight);
    if (Math.abs(scrollY - target) <= 4) return;
    if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
    else window.scrollTo(0, target);
  }, 900);
}

export function scrollTo(target) {
  if (lenis) lenis.scrollTo(target, { offset: -70, duration: 1.4 });
  else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
}

// Runs after every screen renders: scramble the main heading, refresh triggers.
export function afterRender(root) {
  scrollToTop();
  if (!hasGsap || reducedMotion()) return () => {};
  const ctx = gsap.context(() => {
    root.querySelectorAll("[data-scramble]").forEach((el, i) => {
      // Scramble line by line so <br> line breaks survive
      const lines = el.innerHTML.split(/<br\s*\/?>/i);
      if (lines.length > 1) el.innerHTML = lines.map((l) => `<span class="scr-line">${l}</span>`).join("<br>");
      const targets = lines.length > 1 ? el.querySelectorAll(".scr-line") : [el];
      targets.forEach((t, j) => {
        gsap.to(t, { duration: 1.1, delay: 0.1 + (i + j) * 0.12, ease: "none", scrambleText: { text: t.textContent, chars: "upper", revealDelay: 0.15, speed: 0.4 } });
      });
    });
  }, root);
  setTimeout(() => ScrollTrigger.refresh(), 300);
  return () => ctx.revert();
}

// ---------- springy cursor (mouse/trackpad only) ----------
function initCursor() {
  if (!matchMedia("(pointer: fine)").matches || reducedMotion()) return;
  const ball = document.createElement("div");
  const ring = document.createElement("div");
  ball.className = "cursor-ball";
  ring.className = "cursor-ring";
  document.body.append(ball, ring);
  document.documentElement.classList.add("has-cursor");

  let mx = -100, my = -100, bx = -100, by = -100;
  addEventListener("pointermove", (e) => {
    mx = e.clientX; my = e.clientY;
    ring.style.transform = `translate(${mx}px, ${my}px)`;
    const hot = e.target instanceof Element && e.target.closest("a, button, input, textarea, label, .job-card, .stk");
    document.documentElement.classList.toggle("cursor-hot", Boolean(hot));
  }, { passive: true });

  // The ball lags behind the pointer with a simple spring-ish lerp
  const loop = () => {
    bx += (mx - bx) * 0.18;
    by += (my - by) * 0.18;
    ball.style.transform = `translate(${bx}px, ${by}px)`;
    requestAnimationFrame(loop);
  };
  loop();
}

// ---------- 3D tilt + light sheen on anything with [data-tilt] ----------
function initTilt() {
  if (!matchMedia("(pointer: fine)").matches || reducedMotion()) return;
  addEventListener("pointermove", (e) => {
    const el = e.target instanceof Element && e.target.closest("[data-tilt]");
    document.querySelectorAll("[data-tilt].tilting").forEach((t) => { if (t !== el) resetTilt(t); });
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.classList.add("tilting");
    el.style.setProperty("--ry", `${(px - 0.5) * 12}deg`);
    el.style.setProperty("--rx", `${(0.5 - py) * 10}deg`);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  }, { passive: true });
}
function resetTilt(el) {
  el.classList.remove("tilting");
  el.style.setProperty("--rx", "0deg");
  el.style.setProperty("--ry", "0deg");
}

export { gsap, ScrollTrigger };
