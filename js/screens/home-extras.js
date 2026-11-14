// Two extra landing page sections:
//  05 "pick your vibe": the 5 themes as live mini previews. Tapping one really switches the theme.
//  06 "everything else": a bento grid of the other features, each with a tiny demo, tapping goes there.
// Each vibe card sets its own data-theme, so it renders with that theme's CSS variables (a real preview).
import { go } from "../router.js";
import * as S from "../state.js";
import { $, $$, esc, sticker, toast, rand } from "../fx.js";
import { THEMES, LANDING_VIBES as V, LANDING_FEATURES as F, CAP_FAX } from "../data.js";
import { memeImg } from "../memes.js";
import { setTheme } from "../theme.js";

export function extrasHTML() {
  const current = S.get().theme;
  return `
    <div class="chapter ch-vibes" id="ch-vibes">
      <div class="chapter-copy">
        <p class="label">${V.label}</p>
        <h2 class="display">${V.title}</h2>
        <p class="sub">${V.sub}</p>
      </div>
      <div class="vibe-cards" id="vibeCards">
        ${THEMES.map((t, i) => `
          <div class="vibe-card-wrap">
            <button class="vibe-card" data-theme="${t.id}" data-id="${t.id}" aria-pressed="${t.id === current}" aria-label="Switch to ${esc(t.name)}">
              <span class="vc-top"><span class="vc-dot"></span><span class="vc-pill">aura: +4,200</span></span>
              <span class="vc-title">${esc(t.name)}</span>
              <span class="vc-desc">${esc(t.desc)}</span>
              <span class="vc-row"><span class="vc-btn">apply →</span>${sticker(["W", "6-7", "SLAY", "AI", "MID"][i], ["lime", "lilac", "orange", "sky", "grey"][i], { rot: -8, size: "sm" })}</span>
            </button>
          </div>`).join("")}
      </div>
    </div>

    <div class="chapter ch-bento">
      <div class="chapter-copy">
        <p class="label">${F.label}</p>
        <h2 class="display">${F.title}</h2>
      </div>
      <div class="bento">
        ${F.cards.map((c) => `
          <div class="bento-wrap">
            <a class="card bento-card bento-${c.id}" href="#${c.go}" data-tilt>
              <div class="bento-demo" aria-hidden="true">${demo(c.id)}</div>
              <h3>${esc(c.title)}</h3>
              <p>${esc(c.line)}</p>
            </a>
          </div>`).join("")}
      </div>
    </div>`;
}

// The little demo inside each feature card (decorative, so aria-hidden above)
function demo(id) {
  switch (id) {
    case "breakdown":
      return F.meters.map(([label, v]) => `
        <div class="mini-meter"><span>${label}</span><div class="bar"><span style="width:${v * 10}%"></span></div><b>${v}/10</b></div>`).join("");
    case "batch":
      return `<div class="mini-claim"><span>speaker at 0 conferences</span><b class="mini-cap">cap</b></div>
        <small class="mini-note">${CAP_FAX.cap[0]}</small>
        <div class="mini-bubble">${esc(F.diss)}</div>`;
    case "chat":
      return `<div class="mini-chat">${memeImg("crashout", "meme-thumb", -4)}<span class="mini-bubble hr">noted: "handles pressure poorly".</span>${memeImg("zen", "meme-thumb", 5)}</div>`;
    case "names":
      return F.names.map(([first, last]) => `<div class="mini-name">${first} <b>${last}</b></div>`).join("");
    case "circle":
      return `<div class="mini-circles">${[["lilac", "AG"], ["orange", "🗿"], ["lime", "😎"], ["pink", "💀"], ["sky", "🐸"]]
        .map(([c, face]) => `<span class="av" data-c="${c}">${face}</span>`).join("")}</div>`;
    case "slam":
      // each meme sits in a .slam-item wrapper so GSAP can scale the wrapper, not the tilted image
      return `<div class="mini-slam">${["six7", "erm", "lockin"].map((m, i) => `<span class="slam-item">${memeImg(m, "meme-thumb", [-12, 6, -3][i])}</span>`).join("")}
        <span class="mini-unlock">${sticker("OFFER UNLOCKED", "lime", { rot: -6, size: "sm" })}</span></div>`;
    default:
      return "";
  }
}

// Vibe cards switch the theme for real
export function bindExtras(root) {
  $("#vibeCards", root).addEventListener("click", (e) => {
    const card = e.target.closest(".vibe-card");
    if (!card) return;
    setTheme(card.dataset.id);
    $$(".vibe-card", root).forEach((c) => c.setAttribute("aria-pressed", String(c === card)));
    toast(V.picked);
  });
}

// Scroll animations: vibe cards deal in like a hand of cards, bento tiles pop in as they appear.
// We animate the *-wrap elements, so the cards keep their own CSS transforms (tilt, hover).
export function animateExtras(gsap) {
  gsap.from(".vibe-card-wrap", {
    y: 90, rotation: () => rand(-14, 14), opacity: 0, scale: 0.85, ease: "back.out(1.6)", duration: 0.7, stagger: 0.09,
    scrollTrigger: { trigger: ".vibe-cards", start: "top 85%", toggleActions: "play none none reverse" },
  });
  gsap.utils.toArray(".bento-wrap").forEach((el, i) => {
    gsap.from(el, {
      y: 60, opacity: 0, scale: 0.94, duration: 0.6, ease: "power3.out", delay: (i % 3) * 0.08,
      scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" },
    });
  });
  // the meters fill and the slam stack thuds in when their card shows up
  gsap.from(".bento-breakdown .mini-meter .bar > span", {
    width: 0, duration: 1, ease: "power3.out", stagger: 0.15,
    scrollTrigger: { trigger: ".bento-breakdown", start: "top 80%", toggleActions: "play none none reverse" },
  });
  gsap.from(".mini-slam .slam-item, .mini-unlock", {
    scale: 2.4, opacity: 0, duration: 0.25, ease: "power4.in", stagger: 0.18,
    scrollTrigger: { trigger: ".bento-slam", start: "top 80%", toggleActions: "play none none reverse" },
  });
}
