// Entry point: theme ("vibe") switcher, live aura pill, and the route table.

import { route, start } from "./router.js";
import * as S from "./state.js";
import { $, signed } from "./fx.js";
import { THEMES } from "./data.js";
import { initMotion, afterRender } from "./motion.js";

import home from "./screens/home.js";
import upload from "./screens/upload.js";
import scan from "./screens/scan.js";
import score from "./screens/score.js";
import pick from "./screens/pick.js";
import jobs from "./screens/jobs.js";
import job from "./screens/job.js";
import boss from "./screens/boss.js";
import offer from "./screens/offer.js";
import ghosted from "./screens/ghosted.js";
import rate from "./screens/rate.js";
import chat from "./screens/chat.js";
import profile from "./screens/profile.js";

// ---------- vibes ----------
function applyTheme(id) {
  document.documentElement.dataset.theme = id;
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) { meta = document.createElement("meta"); meta.name = "theme-color"; document.head.appendChild(meta); }
  meta.content = getComputedStyle(document.documentElement).getPropertyValue("--meta").trim();
}

function setupVibes() {
  const btn = $("#vibeBtn"), sheet = $("#vibeSheet"), scrim = $("#scrim"), list = $("#vibeList");

  const render = () => {
    const current = S.get().theme;
    list.innerHTML = THEMES.map((t) => `
      <button class="vibe-opt" data-id="${t.id}" aria-pressed="${t.id === current}">
        <span class="swatches">${t.swatches.map((c) => `<i style="background:${c}"></i>`).join("")}</span>
        <span><b>${t.name}</b><small>${t.desc}</small></span>
      </button>`).join("");
  };

  const open = () => { render(); sheet.hidden = scrim.hidden = false; btn.setAttribute("aria-expanded", "true"); };
  const close = () => { sheet.hidden = scrim.hidden = true; btn.setAttribute("aria-expanded", "false"); };

  btn.addEventListener("click", () => (sheet.hidden ? open() : close()));
  scrim.addEventListener("click", close);
  addEventListener("keydown", (e) => e.key === "Escape" && close());
  list.addEventListener("click", (e) => {
    const opt = e.target.closest(".vibe-opt");
    if (!opt) return;
    S.set({ theme: opt.dataset.id });
    applyTheme(opt.dataset.id);
    render();
    setTimeout(close, 250);
  });
}

// ---------- aura pill ----------
function setupAuraPill() {
  const pill = $("#auraPill");
  let last = S.get().aura;
  const paint = (aura) => { pill.textContent = `aura: ${signed(aura)}`; };
  paint(last);
  S.subscribe(({ aura }) => {
    if (aura === last) return;
    last = aura;
    paint(aura);
    pill.classList.remove("bump");
    void pill.offsetWidth;
    pill.classList.add("bump");
  });
}

// Wrap every screen so the motion layer runs after it renders and cleans up after it leaves.
const withMotion = (screen) => (root, params) => {
  const cleanupScreen = screen(root, params);
  const cleanupMotion = afterRender(root);
  return () => { if (typeof cleanupScreen === "function") cleanupScreen(); cleanupMotion(); };
};

applyTheme(S.get().theme);
initMotion();
setupVibes();
setupAuraPill();

route("/", withMotion(home));
route("/upload", withMotion(upload));
route("/scan", withMotion(scan));
route("/score", withMotion(score));
route("/stickers", withMotion(pick));
route("/jobs", withMotion(jobs));
route("/job/:id", withMotion(job));
route("/boss/:id", withMotion(boss));
route("/offer", withMotion(offer));
route("/ghosted", withMotion(ghosted));
route("/ghosted/:how", withMotion(ghosted));   // "/ghosted/lost" auto-plays the HR hand
route("/rate", withMotion(rate));
route("/chat", withMotion(chat));
route("/profile", withMotion(profile));

start($("#screen"));
