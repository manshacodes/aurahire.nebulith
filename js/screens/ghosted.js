import { go } from "../router.js";
import * as S from "../state.js";
import { $, sticker } from "../fx.js";
import { mountHold } from "../hold.js";
import { playHand } from "../hand.js";

// params.how === "lost" means we came straight from losing the boss fight
export default function ghosted(root, params = {}) {
  S.addAura(-800);
  let stopHold = null, stopHand = null, autoTimer = null;

  root.innerHTML = `
    <section>
      <p class="label">application status</p>
      <h1 class="ghost-title" data-scramble>ghosted.</h1>
      <div class="card seen">
        <b>your application has been seen.</b>
        <small>seen 47 days ago</small>
      </div>
      <p style="text-align:center;font-weight:700">HR is typing <span class="typing" aria-label="typing"><i></i><i></i><i></i></span></p>
      <div class="hold-zone" id="statusHold"></div>
      <p class="fine" id="holdHint">(hold to find out what HR really thinks)</p>
      <div style="text-align:center">${sticker("−800 AURA. WOMP WOMP, BRUZZ.", "pink", { rot: -3 })}</div>
      <button class="btn btn-cta btn-xl" id="again">try again, bestie</button>
      <button class="btn btn-ghost btn-block" id="rate">get revenge: rate them with stickers</button>
    </section>`;

  // Hold the ring -> the "HR said:" hand moment. Closing it lets you check again.
  const startHold = () => {
    stopHold = mountHold($("#statusHold", root), {
      title: "check", sub: "hold to check status", doneText: "checking…", ms: 1500,
      roasts: ["scared of the answer?", "HR felt that.", "hold longer. like your hope."],
      onDone: showHand,
    });
  };

  // The "HR said:" hand. Closing it brings the ring back so you can check again.
  function showHand() {
    if (stopHold) { stopHold(); stopHold = null; }
    stopHand = playHand({
      onClose: () => { $("#holdHint", root).textContent = "(you can check again. it won't change.)"; startHold(); },
      onRevenge: () => go("/rate"),
    });
  }

  startHold();
  // Just lost the fight? HR answers on its own after a beat, no hold needed.
  if (params.how === "lost") autoTimer = setTimeout(showHand, 1400);

  $("#again", root).addEventListener("click", () => go("/jobs"));
  $("#rate", root).addEventListener("click", () => go("/rate"));

  return () => { clearTimeout(autoTimer); if (stopHold) stopHold(); if (stopHand) stopHand(); };
}
