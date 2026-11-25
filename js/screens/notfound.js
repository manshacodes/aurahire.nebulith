// 404: a link that matches no route (a typo, an old link) lands here instead of silently showing home
import { go } from "../router.js";
import { $, esc, sticker } from "../fx.js";
import { NOT_FOUND as T } from "../data.js";

export default function notFound(root) {
  root.innerHTML = `
    <section class="not-found">
      <p class="label">${esc(T.label)}</p>
      <div class="nf-num num" aria-hidden="true">404</div>
      <span class="nf-stk">${sticker(T.sticker, "pink", { rot: -8, size: "lg" })}</span>
      <h1 class="h1">${esc(T.title)}</h1>
      <p class="sub">${esc(T.sub)}</p>
      <div class="row">
        <button class="btn btn-ghost" id="nfJobs">${esc(T.jobs)}</button>
        <button class="btn btn-cta" id="nfHome">${esc(T.home)}</button>
      </div>
    </section>`;
  $("#nfHome", root).addEventListener("click", () => go("/"));
  $("#nfJobs", root).addEventListener("click", () => go("/jobs"));
}
