import { go } from "../router.js";
import * as S from "../state.js";
import { $, esc, pick, shuffle, toast } from "../fx.js";
import { JOBS, GHOST_TOASTS } from "../data.js";

const THRESHOLD = 110; // px you need to drag to count as a swipe

export default function jobs(root) {
  let index = 0;
  const order = shuffle(JOBS);   // new order every visit, so the feed never feels the same
  let busy = false;

  root.innerHTML = `
    <section>
      <div>
        <p class="label">jobs for your aura level</p>
        <h1 class="h1" data-scramble>swipe right to apply.</h1>
        <p class="sub" style="margin-top:6px">swipe left to ghost them before they ghost you, twin.</p>
      </div>
      <div class="stack" id="stack"></div>
      <div class="row">
        <button class="btn btn-ghost" id="ghost">ghost</button>
        <button class="btn btn-cta" id="apply">apply →</button>
      </div>
      <nav class="mini-links" aria-label="More">
        <a href="#/rate">rate companies with stickers</a>
      </nav>
    </section>`;

  const stack = $("#stack", root);

  const cardHTML = (j, depth) => `
    <article class="card job-card" style="--depth:${depth}" data-id="${j.id}" aria-label="${esc(j.title)} at ${esc(j.company)}">
      <div class="job-top">
        <span class="logo-badge" style="background:${j.color}">${j.logo}</span>
        <div><b>${esc(j.company)}</b><small>${j.posted} · ${j.applicants} applicants</small></div>
      </div>
      <h2>${esc(j.title)}</h2>
      <div class="chips">${j.tags.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>
      <p class="stipend">stipend: ${esc(j.stipend)}</p>
      <div class="vibe"><small>vibe match ${j.vibe}%</small><div class="bar"><span style="width:${j.vibe}%"></span></div></div>
      <span class="stamp yes">APPLY</span>
      <span class="stamp no">GHOST</span>
    </article>`;

  function render() {
    const visible = [0, 1, 2].map((k) => order[(index + k) % order.length]);
    // Last child = top card, so render back-to-front
    stack.innerHTML = visible.map((j, depth) => cardHTML(j, depth)).reverse().join("");
    bindDrag(stack.lastElementChild);
  }

  function swipe(card, direction) {
    if (busy) return;
    busy = true;
    const x = direction === "right" ? 600 : -600;
    card.style.transition = "transform 0.35s ease-in";
    card.style.transform = `translate(${x}px, 40px) rotate(${x / 20}deg)`;
    setTimeout(() => {
      busy = false;
      if (direction === "right") {
        S.set({ currentJob: card.dataset.id });
        go(`/job/${card.dataset.id}`);
      } else {
        S.addAura(10);
        toast(pick(GHOST_TOASTS));
        index++;
        render();
      }
    }, 320);
  }

  function bindDrag(card) {
    let startX = 0, dx = 0, dragging = false;
    const yes = card.querySelector(".stamp.yes");
    const no = card.querySelector(".stamp.no");

    card.addEventListener("pointerdown", (e) => {
      dragging = true;
      startX = e.clientX;
      card.setPointerCapture(e.pointerId);
      card.classList.add("dragging");
    });
    card.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      dx = e.clientX - startX;
      card.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`;
      yes.style.opacity = Math.max(0, dx / THRESHOLD);
      no.style.opacity = Math.max(0, -dx / THRESHOLD);
    });
    const end = () => {
      if (!dragging) return;
      dragging = false;
      card.classList.remove("dragging");
      if (dx > THRESHOLD) swipe(card, "right");
      else if (dx < -THRESHOLD) swipe(card, "left");
      else { card.style.transform = ""; yes.style.opacity = no.style.opacity = 0; }
      dx = 0;
    };
    card.addEventListener("pointerup", end);
    card.addEventListener("pointercancel", end);
  }

  $("#ghost", root).addEventListener("click", () => swipe(stack.lastElementChild, "left"));
  $("#apply", root).addEventListener("click", () => swipe(stack.lastElementChild, "right"));
  render();
}
