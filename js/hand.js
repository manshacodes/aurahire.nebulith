// The "HR said:" moment on the Ghosted screen: the text cracks and shatters,
// and a hand slams up and flips you off. Uses your own image if HAND_IMAGE is set in data.js,
// otherwise an original cartoon hand drawn below in SVG.

import { HAND_IMAGE } from "./data.js";
import { gsap } from "./motion.js";
import { rand, reducedMotion } from "./fx.js";

// Six shards that together cover the whole "HR said:" text (clip-path polygons, in %)
const SHARDS = [
  "0 0, 40 0, 30 45, 0 60",
  "40 0, 75 0, 55 50, 30 45",
  "75 0, 100 0, 100 40, 55 50",
  "0 60, 30 45, 45 100, 0 100",
  "30 45, 55 50, 70 100, 45 100",
  "55 50, 100 40, 100 100, 70 100",
];

// "40 0, 75 0" -> "40% 0%, 75% 0%"
const toPercent = (poly) => poly.replace(/(\d+(\.\d+)?)/g, "$1%");

const CARTOON_HAND = `
  <svg class="hand-svg" viewBox="0 0 220 320" aria-hidden="true">
    <g stroke="#fff" stroke-width="22" stroke-linejoin="round" fill="#fff">
      <rect x="62" y="236" width="96" height="90" rx="20"/>
      <rect x="42" y="140" width="136" height="118" rx="34"/>
      <rect x="92" y="18" width="38" height="160" rx="19"/>
      <rect x="46" y="118" width="40" height="64" rx="20"/><rect x="134" y="118" width="40" height="64" rx="20"/>
      <rect x="160" y="140" width="32" height="54" rx="16"/>
    </g>
    <g stroke="#1A1A1A" stroke-width="6" stroke-linejoin="round">
      <rect x="62" y="236" width="96" height="90" rx="20" fill="#F2B98F"/>
      <rect x="42" y="140" width="136" height="118" rx="34" fill="#F7C9A1"/>
      <rect x="160" y="140" width="32" height="54" rx="16" fill="#F7C9A1"/>
      <rect x="134" y="118" width="40" height="64" rx="20" fill="#F7C9A1"/>
      <rect x="46" y="118" width="40" height="64" rx="20" fill="#F7C9A1"/>
      <rect x="92" y="18" width="38" height="160" rx="19" fill="#F7C9A1"/>
      <rect x="99" y="26" width="24" height="26" rx="10" fill="#FFE3CF" stroke-width="4"/>
      <path d="M52 206 C 80 190, 112 192, 132 208" fill="none" stroke-linecap="round"/>
      <path d="M100 150 L 100 176 M 122 150 L 122 176" fill="none" stroke-linecap="round" stroke-width="4"/>
    </g>
  </svg>`;

export function playHand({ onClose, onRevenge }) {
  const handHTML = HAND_IMAGE ? `<img class="hand-img" src="${HAND_IMAGE}" alt="" />` : CARTOON_HAND;
  document.body.insertAdjacentHTML("beforeend", `
    <div class="hr-said" role="dialog" aria-label="Application status">
      <div class="hr-rays" aria-hidden="true"></div>
      <div class="hr-text-wrap">
        <p class="hr-label">application status:</p>
        <div class="hr-text" aria-label="HR said:">
          ${SHARDS.map((poly) => `<span class="shard" style="clip-path:polygon(${toPercent(poly)})">HR said:</span>`).join("")}
          <svg class="cracks" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
            <path pathLength="1" d="M40 0 L30 18 L0 24" /><path pathLength="1" d="M75 0 L55 20 L30 18" />
            <path pathLength="1" d="M55 20 L100 16" /><path pathLength="1" d="M30 18 L45 40" /><path pathLength="1" d="M55 20 L70 40" />
          </svg>
        </div>
      </div>
      <div class="hand">${handHTML}</div>
      <div class="hr-after">
        <p class="hr-verdict">rejected. emotionally.</p>
        <div class="row">
          <button class="btn btn-ghost" id="hrOk">ok fair</button>
          <button class="btn btn-cta" id="hrRevenge">get revenge →</button>
        </div>
      </div>
    </div>`);

  const el = document.querySelector(".hr-said");
  const close = (then) => {
    gsap ? gsap.to(el, { opacity: 0, duration: 0.3, onComplete: () => { el.remove(); then && then(); } }) : (el.remove(), then && then());
  };
  el.querySelector("#hrOk").addEventListener("click", () => close(onClose));
  el.querySelector("#hrRevenge").addEventListener("click", () => close(onRevenge));

  if (!gsap || reducedMotion()) {
    el.classList.add("static");
    return () => el.remove();
  }

  const tl = gsap.timeline();
  tl.from(el, { opacity: 0, duration: 0.25 })
    .from(".hr-rays", { opacity: 0, scale: 0.6, duration: 0.8, ease: "power2.out" }, 0)
    .from(".hr-label", { y: 20, opacity: 0, duration: 0.3 }, 0.15)
    .from(".hr-text", { scale: 1.6, opacity: 0, duration: 0.4, ease: "back.out(2.2)" }, 0.2)
    .to(".cracks path", { strokeDashoffset: 0, duration: 0.22, stagger: 0.06, ease: "power1.in" }, 0.9)
    .addLabel("slam", 1.35)
    .fromTo(".hand", { yPercent: 120, rotation: -12 }, { yPercent: 0, rotation: 0, duration: 0.45, ease: "back.out(1.7)" }, "slam")
    .to(".shard", {
      x: () => rand(-320, 320), y: () => rand(-260, 120), rotation: () => rand(-120, 120),
      opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.02,
    }, "slam+=0.05")
    .to(".cracks", { opacity: 0, duration: 0.1 }, "slam")
    .to(".hr-label", { opacity: 0, duration: 0.2 }, "slam")
    .fromTo(el, { x: 0 }, { x: 12, repeat: 7, yoyo: true, duration: 0.04, clearProps: "x" }, "slam+=0.4")
    .to(".hand", { rotation: 4, yoyo: true, repeat: 3, duration: 0.12, ease: "sine.inOut" }, "slam+=0.5")
    .from(".hr-after", { y: 30, opacity: 0, duration: 0.4 }, "slam+=0.9");

  if (navigator.vibrate) setTimeout(() => navigator.vibrate([60, 40, 120]), 1400);

  return () => { tl.kill(); el.remove(); };
}
