// The meme slam: meme stickers slam onto the screen one by one, faster and faster,
// until they cover it. Then a big sticker slams on top. Plays when you win the boss fight.
// Returns a Promise that resolves when it's done (instantly with reduced motion / no GSAP).
import { gsap } from "./motion.js";
import { rand, reducedMotion, shuffle, sticker, confetti, sleep, buzz } from "./fx.js";
import { MEMES, memeSrc } from "./data.js";

const FIRST_GAP = 420;   // ms before the 2nd slam
const SPEED_UP = 0.86;   // each gap is 86% of the one before -> the pace keeps increasing
const MIN_GAP = 35;      // fastest it gets

// Load the images early so the slam isn't waiting on the network
export function preloadMemes() {
  Object.keys(MEMES).forEach((id) => { const img = new Image(); img.src = memeSrc(id); });
}

// Spread slams over a jittered grid so the whole screen gets covered, then a few random extras on top
function spots() {
  const cols = innerWidth < 600 ? 3 : 5;
  const rows = Math.ceil(innerHeight / (innerWidth / cols)) + 1;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ x: ((c + 0.5) / cols) * 100 + rand(-6, 6), y: ((r + 0.5) / rows) * 100 + rand(-5, 5) });
    }
  }
  const extras = Array.from({ length: 8 }, () => ({ x: rand(8, 92), y: rand(8, 92) }));
  return [...shuffle(cells), ...extras];
}

export async function memeSlam({ finale = "OFFER UNLOCKED", color = "lime" } = {}) {
  if (!gsap || reducedMotion()) return;

  const layer = document.createElement("div");
  layer.className = "meme-slam";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);

  const ids = Object.keys(MEMES);
  const size = innerWidth < 600 ? 44 : 24;   // sticker width, in vw
  let gap = FIRST_GAP;

  for (const [i, spot] of spots().entries()) {
    const img = document.createElement("img");
    img.className = "slam-meme";
    img.src = memeSrc(ids[i % ids.length]);
    img.alt = "";
    img.style.cssText = `left:${spot.x}vw;top:${spot.y}vh;width:${size + rand(-6, 6)}vw`;
    layer.appendChild(img);

    // Slam: drop in from huge, overshoot a little, and jolt the whole layer
    gsap.fromTo(img,
      { xPercent: -50, yPercent: -50, scale: 2.8, rotation: rand(-40, 40), opacity: 0 },
      { scale: 1, rotation: rand(-14, 14), opacity: 1, duration: 0.22, ease: "power4.in" });
    gsap.fromTo(layer, { x: rand(-10, 10), y: rand(-8, 8) }, { x: 0, y: 0, duration: 0.18, ease: "power2.out", delay: 0.2 });
    buzz(8);

    await sleep(gap);
    gap = Math.max(MIN_GAP, gap * SPEED_UP);
  }

  // Finale: one huge sticker on top of the pile
  await sleep(300);
  layer.insertAdjacentHTML("beforeend", `<div class="slam-finale">${sticker(finale, color, { rot: -6, size: "lg" })}</div>`);
  gsap.fromTo(layer.querySelector(".slam-finale"), { scale: 5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "power4.in" });
  gsap.fromTo(layer, { x: -18 }, { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)", delay: 0.33 });
  buzz([30, 40, 60]);
  await sleep(350);
  confetti(70);
  await sleep(1300);

  await gsap.to(layer, { opacity: 0, scale: 1.08, duration: 0.4, ease: "power2.in" });
  layer.remove();
}
