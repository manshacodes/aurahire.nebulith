// The intro: a believable fake LinkedIn feed (parody, text only, no real logo) gets crossed out, stickered,
// scrambled into brainrot, and wiped away to reveal AuraHire.
// Plays once per browser session (and on "replay intro").

import { esc, sticker, rand } from "./fx.js";
import { gsap, pauseScroll, resumeScroll } from "./motion.js";


const POSTS = [
  {
    name: "Riya Sharma", initials: "RS", color: "#7C3AED", meta: "CSE '27 | 14x Hackathon Participant | Aspiring SDE @ FAANG",
    time: "2h", text: "I'm humbled and honoured to announce that I've completed my 47th certificate course! 🙏 Grateful for this journey. Agree?",
    rot: "I'm mogging and aura farming to announce my 47th crash out. Agree, twin?",
    stats: "1,204 · 87 comments", stk: ["COOKED", "orange"],
  },
  {
    name: "Aarav Grindwala", initials: "AG", color: "#0EA5E9", meta: "Open to Work | Leader | Visionary | 2nd year", otw: true,
    time: "5h", text: "Day 1 of learning DSA. 🚀 Consistency is key. #100DaysOfCode #grind",
    rot: "Day 1 of glazing my own resume. womp womp. #6-7",
    stats: "312 · 41 comments", stk: ["GLAZER", "pink"],
  },
  {
    name: "Synergy Inc", initials: "SI", color: "#0F766E", meta: "Promoted",
    time: "", text: "We're hiring! Unpaid internship with great exposure. Requirements: 5+ years of experience.",
    rot: "we're hiring an NPC. stipend: vibes. requirements: aura. ",
    stats: "4 · 2,031 comments", stk: ["RED FLAG", "red"],
  },
];

// Plays once per page load: opening or refreshing the site shows it again,
// but going back to the landing page from inside the app doesn't.
let played = false;
export const shouldPlayIntro = () => !played;

function markSeen() {
  played = true;
}

// A hand-drawn-ish red X sized to the screen in real pixels (so the marker stroke stays even)
function crossOut() {
  const w = innerWidth, h = innerHeight;
  const p = (x, y) => `${Math.round(x * w)} ${Math.round(y * h)}`;
  return `
    <svg class="lo-x" viewBox="0 0 ${w} ${h}" aria-hidden="true">
      <path pathLength="1" d="M${p(0.08, 0.1)} C ${p(0.3, 0.32)}, ${p(0.62, 0.6)}, ${p(0.92, 0.9)}" />
      <path pathLength="1" d="M${p(0.9, 0.09)} C ${p(0.68, 0.36)}, ${p(0.36, 0.62)}, ${p(0.09, 0.91)}" />
    </svg>`;
}

function markup() {
  return `
    <div class="intro" role="dialog" aria-label="Intro animation">
      <div class="lo-page">
        <header class="lo-top">
          <span class="lo-logo" aria-hidden="true">in</span>
          <span class="lo-word">LinkedIn</span>
          <span class="lo-search">search jobs, people, delusion</span>
          <nav class="lo-nav" aria-hidden="true">
            <span>home</span><span>my network</span><span>jobs</span><span>messaging</span><span class="lo-badge">notifications</span>
          </nav>
        </header>
        <main class="lo-feed">
          ${POSTS.map((p) => `
            <article class="lo-post">
              <div class="lo-head">
                <span class="lo-av ${p.otw ? "otw" : ""}" style="background:${p.color}">${p.initials}</span>
                <div><b>${esc(p.name)}</b><small>${esc(p.meta)}</small>${p.time ? `<small>${p.time} · edited</small>` : ""}</div>
              </div>
              <p class="lo-text" data-rot="${esc(p.rot)}">${esc(p.text)}</p>
              <div class="lo-stats">👏❤️💡 ${p.stats}</div>
              <div class="lo-actions"><span>like</span><span>comment</span><span>repost</span><span>send</span></div>
              <span class="lo-stk">${sticker(p.stk[0], p.stk[1], { rot: rand(-12, 12), size: "lg" })}</span>
            </article>`).join("")}
        </main>
        ${crossOut()}
        <p class="lo-nah" aria-hidden="true">nah.</p>
      </div>
      <div class="intro-wipe" aria-hidden="true"><span>aurahire</span></div>
      <button class="intro-skip">skip intro →</button>
    </div>`;
}

// Returns a promise that resolves when the intro is gone.
export function playIntro() {
  markSeen();
  if (!gsap) return Promise.resolve();

  document.body.insertAdjacentHTML("beforeend", markup());
  const intro = document.querySelector(".intro");
  pauseScroll();

  return new Promise((resolve) => {
    const finish = () => {
      tl.kill();
      intro.remove();
      resumeScroll();
      resolve();
    };

    const tl = gsap.timeline({ onComplete: finish });
    tl.from(".lo-post", { y: 30, opacity: 0, stagger: 0.12, duration: 0.5, ease: "power2.out" })
      .to({}, { duration: 0.7 })                                                    // let them read it
      .to(".lo-x path", { strokeDashoffset: 0, duration: 0.32, stagger: 0.18, ease: "power2.in" })
      .from(".lo-nah", { scale: 3, opacity: 0, rotation: -25, duration: 0.35, ease: "back.out(2)" }, "-=0.1")
      .from(".lo-stk", { scale: 0, rotation: () => rand(-80, 80), stagger: 0.14, duration: 0.35, ease: "back.out(3)" })
      .add(() => {
        intro.querySelectorAll(".lo-text").forEach((el) => {
          gsap.to(el, { duration: 0.8, scrambleText: { text: el.dataset.rot, chars: "lowerCase", speed: 0.6 } });
        });
      }, "<")
      .to(".lo-page", { x: "+=10", repeat: 7, yoyo: true, duration: 0.04 }, "+=0.5")
      .to(".lo-page", { filter: "grayscale(1) blur(1px)", duration: 0.3 })
      .fromTo(".intro-wipe", { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(150% at 50% 50%)", duration: 0.8, ease: "power3.inOut" })
      .to(".lo-page", { scale: 0.85, rotation: -6, opacity: 0, duration: 0.6, ease: "power2.in" }, "<")
      .from(".intro-wipe span", { scale: 0.4, opacity: 0, duration: 0.5, ease: "back.out(2)" }, "-=0.4")
      .to(".intro", { opacity: 0, duration: 0.45 }, "+=0.35");

    intro.querySelector(".intro-skip").addEventListener("click", finish);
  });
}
