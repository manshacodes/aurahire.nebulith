import { go } from "../router.js";
import * as S from "../state.js";
import { $, $$, esc, rand, toast, sticker } from "../fx.js";
import { JOBS, STICKERS } from "../data.js";

const TRAY = ["W", "L", "MID", "COOKED", "RED_FLAG", "GREEN_FLAG", "NPC", "MOGGED", "CRASH", "SEVEN", "CHOPPED", "WOMP"];

export default function rate(root) {
  const j = JOBS.find((x) => x.id === S.get().currentJob) || JOBS[0];
  const ratings = { ...S.get().ratings };

  root.innerHTML = `
    <section>
      <p class="label">glassdoor, but brainrot</p>
      <h1 class="h1" data-scramble>rate them with stickers.</h1>
      <div class="card drop-card" id="card">
        <p style="font-family:var(--font-display);font-weight:var(--display-weight);font-size:28px;letter-spacing:-.04em">${esc(j.company)}</p>
        <p style="font-weight:700" id="overall"></p>
        <p class="sub" style="font-size:13px" id="total"></p>
        <div class="rbars" id="bars"></div>
      </div>
      <p class="label">drag a sticker onto the card (or tap it)</p>
      <div class="tray" id="tray">
        ${TRAY.map((id, i) => sticker(STICKERS[id].label, STICKERS[id].c, { tag: "button", rot: (i % 2 ? 4 : -4), attrs: `data-id="${id}"` })).join("")}
      </div>
      <button class="btn btn-cta btn-xl" id="done">slap & submit</button>
    </section>`;

  const card = $("#card", root);

  function paintBars() {
    const total = Object.values(ratings).reduce((a, b) => a + b, 0);
    const top = Object.entries(ratings).sort((a, b) => b[1] - a[1]).slice(0, 4);
    $("#overall", root).textContent = `overall vibe: ${STICKERS[top[0][0]].label.toLowerCase()}`;
    $("#total", root).textContent = `${total.toLocaleString("en-US")} stickers slapped`;
    $("#bars", root).innerHTML = top.map(([id, n]) => `
      <div class="rbar"><span>${STICKERS[id].label}</span><div class="bar"><span style="width:${(n / total) * 100}%"></span></div><span>${Math.round((n / total) * 100)}%</span></div>`).join("");
  }

  function slap(id, x, y) {
    ratings[id] = (ratings[id] || 0) + 1;
    S.set({ ratings });
    S.addAura(5);
    const wrap = document.createElement("span");
    wrap.className = "placed";
    wrap.innerHTML = sticker(STICKERS[id].label, STICKERS[id].c, { rot: rand(-18, 18), size: "sm" });
    wrap.firstElementChild.classList.add("pop");
    const rect = card.getBoundingClientRect();
    wrap.style.left = `${Math.min(Math.max(x - rect.left - 30, 0), rect.width - 70)}px`;
    wrap.style.top = `${Math.min(Math.max(y - rect.top - 14, 0), rect.height - 30)}px`;
    card.appendChild(wrap);
    paintBars();
    toast(`slapped ${STICKERS[id].label}. +5 aura.`);
  }

  // Drag and drop with pointer events (works for mouse and touch).
  $$(".tray .stk", root).forEach((btn) => {
    btn.addEventListener("pointerdown", (down) => {
      down.preventDefault();
      const id = btn.dataset.id;
      let ghost = null, moved = false;

      const move = (e) => {
        if (!moved && Math.hypot(e.clientX - down.clientX, e.clientY - down.clientY) < 6) return;
        if (!ghost) {
          moved = true;
          ghost = btn.cloneNode(true);
          ghost.classList.add("drag-ghost");
          document.body.appendChild(ghost);
        }
        ghost.style.left = `${e.clientX}px`;
        ghost.style.top = `${e.clientY}px`;
        const r = card.getBoundingClientRect();
        card.classList.toggle("over", e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom);
      };

      const up = (e) => {
        removeEventListener("pointermove", move);
        removeEventListener("pointerup", up);
        card.classList.remove("over");
        if (ghost) ghost.remove();
        const r = card.getBoundingClientRect();
        if (!moved) {
          slap(id, rand(r.left + 20, r.right - 60), rand(r.top + 20, r.bottom - 40)); // simple tap
        } else if (e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom) {
          slap(id, e.clientX, e.clientY);
        }
      };

      addEventListener("pointermove", move);
      addEventListener("pointerup", up);
    });
  });

  $("#done", root).addEventListener("click", () => { toast("review submitted. HR has been humbled."); go("/jobs"); });
  paintBars();
}
