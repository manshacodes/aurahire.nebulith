// The scroll-story landing page. Each "chapter" is a ScrollTrigger scene:
// parallax stickers, a velocity marquee, a pinned aura counter, cards that flip away,
// a scrubbed boss fight and a sticker storm.

import { go } from "../router.js";
import { $, $$, esc, sticker, signed, rand } from "../fx.js";
import { SLANG, JOBS, STICKERS, LANDING_SCORE as LS, LANDING_BOSS as LB, LANDING_JOBS } from "../data.js";
import { stampFor, toneOf } from "../aura-engine.js";
import { gsap, ScrollTrigger, hasGsap, scrollTo } from "../motion.js";
import { reducedMotion } from "../fx.js";
import { playIntro, shouldPlayIntro } from "../intro.js";
import { extrasHTML, bindExtras, animateExtras } from "./home-extras.js";

const HERO_STICKERS = [
  // [label, colour, tilt, size, parallax speed, top, left]: scattered all over; the text sits on a layer above them
  ["W", "lime", -14, "lg", 1.8, "8%", "6%"],
  ["6-7", "lilac", 12, "", 1.3, "14%", "78%"],
  ["100% linkedin-free*", "yellow", -8, "sm", 0.7, "60%", "70%"],
  ["MOGGED", "pink", 8, "", 2.2, "90%", "6%"],
  ["7x7=49", "sky", -6, "", 1.5, "36%", "88%"],
  ["CRASH OUT", "orange", 10, "sm", 0.6, "92%", "64%"],
];

// Chapter 01 add-ons: they pop in like phone notifications from "AuraHire" (**text** = bold).
// Each has its own icon: a tiny aura card, or the profile circle of whoever challenged you.
const notifIcon = (spec) => {
  const [kind, a, b] = spec.split(":");
  return kind === "person"
    ? `<span class="notif-icon ni-person av" data-c="${esc(b)}" aria-hidden="true">${esc(a)}</span>`
    : `<span class="notif-icon ni-card" aria-hidden="true"><span class="ni-mini">${esc(a)}<i></i></span></span>`;
};
const bold = (text) => esc(text).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
const notifsHTML = () => `
  <div class="notifs">${LS.notifs.map(([time, msg, href, icon]) => `
    <a class="notif-wrap" href="#${href}"><span class="notif">${notifIcon(icon)}
      <span class="notif-meta"><span>${esc(LS.notifApp)}</span><span>${esc(time)}</span></span>
      <span class="notif-text">${bold(msg)}</span></span></a>`).join("")}
  </div>`;

// Chapter 03 add-on: a row with a live preview (your resume moves dealing in), a title and an arrow
const movesetHTML = () => {
  const m = LB.moveset;
  return `
  <a class="preview-row" href="#${m.go}">
    <span class="pr-preview" aria-hidden="true">${m.preview.map((name, i) => `
      <span class="pr-card-wrap"><span class="pr-card" style="--rot:${i ? 4 : -5}deg"><i>${esc(LB.perkTag)}</i>${esc(name)}</span></span>`).join("")}</span>
    <span class="pr-text"><b>${esc(m.title)}</b><small>${esc(m.line)}</small></span>
    <span class="pr-go" aria-hidden="true">→</span>
  </a>`;
};

const STORM = ["W", "L", "MID", "COOKED", "RED_FLAG", "GREEN_FLAG", "NPC", "AURA", "DELULU", "SIGMA", "RATIO", "SIX7", "TWIN", "UNC", "MOGGED", "CRASH", "SEVEN", "CHOPPED", "HUZZ", "WOMP"];

export default function home(root) {
  const marquee = [...SLANG, ...SLANG, ...SLANG].map((s) => `<span>${s}</span>`).join("");

  root.innerHTML = `
    <section class="landing">
      <header class="hero">
        <div class="hero-stickers" aria-hidden="true">
          ${HERO_STICKERS.map(([l, c, r, size, speed, top, left]) =>
            `<span class="hero-stk" data-speed="${speed}" style="top:${top};left:${left}">${sticker(l, c, { rot: r, size })}</span>`).join("")}
        </div>
        <p class="label">nebulith '26 · the anti job portal</p>
        <h1 class="hero-title glitch" data-text="aurahire">aurahire</h1>
        <p class="tagline">stop applying.<br><span class="hl">start aura farming,</span> twin.</p>
        <div class="hero-cta">
          <button class="btn btn-cta" id="start">enter the grind →</button>
          <button class="btn btn-ghost" id="how">how it works ↓</button>
        </div>
        <div class="scroll-cue" aria-hidden="true"><span></span>scroll</div>
      </header>

      <div class="velo-marquee" aria-hidden="true"><div class="velo-track">${marquee}</div></div>

      <div class="chapter ch-score" id="ch-score">
        <div class="chapter-copy">
          <p class="label">01 · the resume</p>
          <h2 class="display">your resume,<br>rated in aura.</h2>
          <p class="sub">${esc(LS.sub)}</p>
          ${notifsHTML()}
        </div>
        <div class="card score-demo" data-tilt>
          <p class="label">your aura score</p>
          <div class="score-top"><div class="big-num num" id="demoNum">${signed(LS.target)}</div>
            <span class="demo-tier">${sticker(LS.tier, "lime", { rot: -4 })}</span></div>
          <ul class="demo-lines">
            ${LS.lines.map(([t, p, r, kind]) => {
              const line = { points: p, roast: r, kind: kind || undefined };
              const [stamp, c] = stampFor(line);
              return `
              <li class="demo-line"><span class="demo-text">${esc(t)}</span><span class="tag ${toneOf(line)}">${signed(p)} <em>${esc(r)}</em></span>
                <span class="demo-stamp">${sticker(stamp, c, { rot: p >= 0 ? -8 : 8, size: "sm" })}</span></li>`;
            }).join("")}
          </ul>
        </div>
      </div>

      <div class="chapter ch-flip">
        <div class="chapter-copy">
          <p class="label">02 · the jobs</p>
          <h2 class="display">every listing<br>is a red flag.</h2>
          <p class="sub">swipe right to apply. swipe left to ghost them first.</p>
        </div>
        <div class="flip-stack">
          ${LANDING_JOBS.map((id) => JOBS.find((j) => j.id === id)).filter(Boolean).reverse().map((j) => `
            <article class="card flip-card">
              <div class="job-top"><span class="logo-badge" style="background:${j.color}">${j.logo}</span><div><b>${j.company}</b><small>${j.applicants} applicants</small></div></div>
              <h3>${j.title}</h3>
              <div class="chips">${j.tags.slice(0, 3).map((t) => `<span class="chip">${t}</span>`).join("")}</div>
              <p class="stipend">stipend: ${j.stipend}</p>
            </article>`).join("")}
        </div>
      </div>

      <div class="chapter ch-boss" id="ch-boss">
        <div class="chapter-copy">
          <p class="label">03 · the application</p>
          <h2 class="display">applying is a<br>boss fight.</h2>
          <p class="sub">${esc(LB.sub)}</p>
          ${movesetHTML()}
        </div>
        <div class="card boss-demo" data-tilt>
          <div class="flex-row"><b>HR unc · lv.99</b><span class="label" id="hpLabel">${LB.hp} hp</span></div>
          <div class="hp big"><span id="demoHp"></span></div>
          <div class="boss-stage">
            <div class="demo-talk" id="demoTalk" aria-hidden="true">${esc(LB.line)}</div>
            <span class="fx fx-takehome demo-special" id="demoSpecial">${esc(LB.special)}</span>
            <div class="avatar boss-av" id="demoBoss"><span class="visor"></span><span class="mouth"></span></div>
            <div class="demo-perk-wrap"><div class="move move-perk demo-perk"><i class="perk-tag">${esc(LB.perkTag)}</i><b>${esc(LB.perk[0])}</b><small>${esc(LB.perk[1])}</small></div></div>
            ${LB.dmg.map((d, i) => `<span class="dmg dmg-${i}">${d}</span>`).join("")}
            <span class="boss-w">${sticker("OFFER UNLOCKED", "lime", { rot: -8, size: "lg" })}</span>
          </div>
        </div>
      </div>

      <div class="chapter ch-storm">
        <div class="chapter-copy center">
          <p class="label">04 · the replies</p>
          <h2 class="display">HR only replies<br>in stickers.</h2>
        </div>
        <div class="storm-wall">
          ${STORM.map((id, i) => `<span class="storm-item">${sticker(STICKERS[id].label, STICKERS[id].c, { rot: (i % 5) * 4 - 8 })}</span>`).join("")}
        </div>
      </div>

      ${extrasHTML()}

      <div class="final">
        <h2 class="final-text">your aura<br>is waiting.</h2>
        <button class="btn btn-cta btn-xl" id="start2">enter the grind →</button>
        <button class="link-btn" id="replay">replay the intro</button>
        <p class="fine">*legally distinct. please do not sue.</p>
      </div>
    </section>`;

  $("#start", root).addEventListener("click", () => go("/upload"));
  $("#start2", root).addEventListener("click", () => go("/upload"));
  $("#how", root).addEventListener("click", () => scrollTo("#ch-score"));
  bindExtras(root);   // vibe cards switch the theme (works even without animations)

  if (!hasGsap || reducedMotion()) return;

  let alive = true;
  // Hero entrance: stickers pop in and the logo unscrambles (after the intro, if it plays)
  const heroIn = () => {
    if (!alive) return;
    gsap.from(".hero-stk", { scale: 0, rotation: () => rand(-90, 90), duration: 0.8, ease: "back.out(2)", stagger: 0.08 });
    gsap.to(".hero-title", { duration: 1.2, ease: "none", scrambleText: { text: "aurahire", chars: "upper", revealDelay: 0.2, speed: 0.4 } });
  };
  $("#replay", root).addEventListener("click", () => { window.scrollTo(0, 0); playIntro().then(heroIn); });
  if (shouldPlayIntro()) playIntro().then(heroIn); else heroIn();

  const ctx = gsap.context(() => {
    // Hero: stickers drift at their own speeds, title lifts away as you scroll
    $$("[data-speed]", root).forEach((el) => {
      const speed = parseFloat(el.dataset.speed);
      gsap.to(el, { y: () => (1 - speed) * window.innerHeight * 0.45, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.8, invalidateOnRefresh: true } });
    });
    gsap.to(".hero-title", { yPercent: -30, scale: 0.92, opacity: 0.2, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

    // Marquee that speeds up and skews with your scroll velocity
    const track = $(".velo-track", root);
    const loop = gsap.to(track, { xPercent: -33.33, duration: 26, ease: "none", repeat: -1 });
    const skew = gsap.quickTo(track, "skewX", { duration: 0.4, ease: "power3" });
    ScrollTrigger.create({
      trigger: ".velo-marquee", start: "top bottom", end: "bottom top",
      onUpdate: (self) => {
        const v = self.getVelocity();
        skew(gsap.utils.clamp(-14, 14, v / -220));
        gsap.to(loop, { timeScale: 1 + Math.min(5, Math.abs(v) / 400), duration: 0.2, overwrite: true });
        gsap.to(loop, { timeScale: 1, duration: 1, delay: 0.25 });
      },
    });

    // Chapter 1: pinned. The aura counts up, each line slides in, its points pop and its stamp slams down,
    // then the tier sticker lands. (Stamps animate a wrapper: the sticker keeps its own CSS tilt.)
    const num = $("#demoNum", root);
    const counter = { v: 0 };
    num.textContent = "+0";
    gsap.timeline({ scrollTrigger: { trigger: ".ch-score", start: "top top", end: "+=1500", scrub: 1, pin: true, anticipatePin: 1 } })
      .to(counter, { v: LS.target, ease: "none", duration: 1, onUpdate: () => { num.textContent = signed(counter.v); } }, 0)
      .from(".demo-line", { opacity: 0, x: 40, stagger: 0.13, duration: 0.18 }, 0)
      .fromTo(".demo-line .tag", { scale: 0 }, { scale: 1, stagger: 0.13, duration: 0.12, ease: "back.out(3)" }, 0.06)
      .from(".demo-stamp", { scale: 3, opacity: 0, rotation: -25, stagger: 0.13, duration: 0.08, ease: "power4.in" }, 0.1)
      .from(".demo-tier", { scale: 0, rotation: -30, opacity: 0, duration: 0.12, ease: "back.out(2.5)" }, 0.88)
      // then the notifications drop in: your card is ready, someone challenged you
      .from(".notif-wrap", { y: -24, opacity: 0, scale: 0.96, stagger: 0.035, duration: 0.07, ease: "back.out(1.6)" }, 0.9);

    // Chapter 03's moveset row: the two move cards deal into its preview when it comes into view
    gsap.from(".pr-card-wrap", { y: 30, rotation: -20, opacity: 0, duration: 0.5, stagger: 0.12, ease: "back.out(1.8)",
      scrollTrigger: { trigger: ".ch-boss", start: "top 60%", toggleActions: "play none none reverse" } });

    // Chapter 2: job cards flip away one by one (top card first)
    const cards = $$(".flip-card", root).reverse();
    const flip = gsap.timeline({ scrollTrigger: { trigger: ".ch-flip", start: "top top", end: `+=${cards.length * 380}`, scrub: 1, pin: true, anticipatePin: 1 } });
    cards.slice(0, -1).forEach((card) => {
      flip.to(card, { rotateX: -88, y: -60, opacity: 0, transformOrigin: "50% 0%", ease: "power2.in", duration: 1 });
    });

    // Chapter 3: scrub through a fight. HR talks (typed out, mouth moving), assigns a take-home,
    // your resume move flips in, damage pops, HR goes down, offer unlocked.
    const hp = { v: LB.hp }, typed = { n: 0 };
    const talk = $("#demoTalk", root), boss = $("#demoBoss", root);
    talk.textContent = "";
    gsap.timeline({ scrollTrigger: { trigger: ".ch-boss", start: "top top", end: "+=1600", scrub: 1, pin: true, anticipatePin: 1 } })
      .to(hp, { v: 0, ease: "none", duration: 1, onUpdate: () => {
        $("#demoHp", root).style.width = `${(hp.v / LB.hp) * 100}%`;
        $("#hpLabel", root).textContent = `${Math.round(hp.v)} hp`;
      } }, 0)
      .fromTo(talk, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.05, ease: "back.out(2)" }, 0)
      .to(typed, { n: LB.line.length, duration: 0.18, ease: "none", onUpdate: () => {
        talk.textContent = LB.line.slice(0, Math.round(typed.n));
        boss.classList.toggle("talking", typed.n > 0 && typed.n < LB.line.length);
      } }, 0.02)
      .to(talk, { opacity: 0, y: -10, duration: 0.05 }, 0.3)
      .fromTo("#demoSpecial", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.06, ease: "back.out(3)" }, 0.32)
      .to("#demoSpecial", { opacity: 0, duration: 0.05 }, 0.5)
      .fromTo(".demo-perk-wrap", { rotationY: 90, opacity: 0 }, { rotationY: 0, opacity: 1, duration: 0.08, ease: "power2.out" }, 0.5)
      .to(".demo-perk-wrap", { y: -30, opacity: 0, duration: 0.06 }, 0.68)
      .to("#demoBoss", { rotation: 20, scale: 0.7, ease: "none", duration: 1 }, 0)
      .from(".dmg", { opacity: 0, y: 20, scale: 0.5, stagger: 0.22, duration: 0.12, ease: "back.out(3)" }, 0.05)
      .to(".dmg", { opacity: 0, y: -40, stagger: 0.22, duration: 0.12 }, 0.2)
      .from(".boss-w", { scale: 0, rotation: -40, duration: 0.15, ease: "back.out(2)" }, 0.9);

    // Chapter 4: stickers fly in from everywhere and slap onto the wall
    // (we animate a wrapper, because the sticker itself already uses CSS transform for its tilt)
    gsap.fromTo(".storm-item",
      { x: () => rand(-320, 320), y: () => rand(120, 420), rotation: () => rand(-200, 200), scale: 0.3, opacity: 0 },
      { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, ease: "power3.out", stagger: { each: 0.03, from: "random" },
        scrollTrigger: { trigger: ".ch-storm", start: "top 85%", end: "center 55%", scrub: 1 } });

    // Chapters 5 + 6: vibe cards and the feature bento (in home-extras.js)
    animateExtras(gsap);

    // Finale zooms in
    gsap.from(".final-text", { scale: 0.55, opacity: 0, ease: "none",
      scrollTrigger: { trigger: ".final", start: "top 95%", end: "top 35%", scrub: true } });
  }, root);

  return () => { alive = false; ctx.revert(); };
}
