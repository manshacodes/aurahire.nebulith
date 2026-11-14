// Entry point: theme ("vibe") switcher, live aura pill, and the route table.

import { route, start } from "./router.js";
import * as S from "./state.js";
import { $, signed } from "./fx.js";
import { THEMES } from "./data.js";
import { initMotion, afterRender } from "./motion.js";
import { avatarHTML } from "./identity.js";
import { applyTheme, setTheme } from "./theme.js";

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
import people from "./screens/people.js";
import person from "./screens/person.js";
import rate from "./screens/rate.js";
import chat from "./screens/chat.js";
import profile from "./screens/profile.js";

// ---------- vibes ----------
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
    setTheme(opt.dataset.id);
    render();
    setTimeout(close, 250);
  });
}

// ---------- your profile circle (top left, like LinkedIn) ----------
function setupMeLink() {
  const link = $("#meLink");
  const paint = (s) => { link.innerHTML = avatarHTML(s, "av-top"); };
  paint(S.get());
  S.subscribe(paint);
}

// ---------- bottom tabs: highlight the current one ----------
// ("/u/kabir" counts as the batch tab)
function setupTabs() {
  const paint = () => {
    const page = location.hash.split("/")[1] || "";
    const current = page === "u" ? "people" : page;
    document.querySelectorAll(".tab").forEach((t) => {
      if (t.dataset.tab === current) t.setAttribute("aria-current", "page");
      else t.removeAttribute("aria-current");
    });
  };
  addEventListener("hashchange", paint);
  paint();
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
setupMeLink();
setupTabs();

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
route("/people", withMotion(people));
route("/u/:id", withMotion(person));

start($("#screen"));
