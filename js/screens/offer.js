import { go } from "../router.js";
import * as S from "../state.js";
import { $, esc, pick, confetti, typewriter, sticker } from "../fx.js";
import { JOBS, POST_TEMPLATES } from "../data.js";
import { earn } from "../aura.js";

export default function offer(root) {
  const j = JOBS.find((x) => x.id === S.get().currentJob) || JOBS[0];
  let alive = true;
  let post = "";

  earn("bossWin");
  confetti(120);

  root.innerHTML = `
    <section>
      <p class="label">${esc(j.company)} · offer letter</p>
      <h1 class="mega num">offer<br>unlocked.</h1>
      ${sticker("+1,000 AURA. ABSOLUTE W.", "yellow", { rot: -4 })}
      <div class="card" data-tilt>
        <dl class="letter">
          <dt>role</dt><dd>${esc(j.title)}</dd>
          <dt>package</dt><dd>${esc(j.stipend)} + unlimited unpaid overtime</dd>
          <dt>joining</dt><dd>yesterday</dd>
          <dt>perks</dt><dd>free wi-fi (password not provided)</dd>
          <dt>work-life</dt><dd>what is life?</dd>
        </dl>
      </div>
      <div class="card" id="postCard" hidden>
        <p class="label" style="margin-bottom:10px">your humbled and honoured post</p>
        <p class="post-text" id="post"></p>
      </div>
      <div class="row">
        <button class="btn btn-ghost" id="write">write my post</button>
        <button class="btn btn-cta" id="share">post to profile →</button>
      </div>
    </section>`;

  async function write() {
    post = pick(POST_TEMPLATES)(j);
    $("#postCard", root).hidden = false;
    $("#write", root).textContent = "regenerate";
    await typewriter($("#post", root), post, 12, () => !alive);
  }

  $("#write", root).addEventListener("click", write);
  $("#share", root).addEventListener("click", () => {
    S.set({ post: post || POST_TEMPLATES[0](j) });
    go("/profile");
  });

  return () => { alive = false; };
}
