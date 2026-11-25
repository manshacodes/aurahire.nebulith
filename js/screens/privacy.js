// Privacy: what AuraHire keeps (only your own browser's localStorage) and how to wipe it
import { esc } from "../fx.js";
import { PRIVACY as T } from "../data.js";

export default function privacy(root) {
  root.innerHTML = `
    <section class="privacy">
      <a class="back" href="#/">← ${esc(T.back)}</a>
      <p class="label">${esc(T.label)}</p>
      <h1 class="h1">${esc(T.title)}</h1>
      <div class="card"><ul class="privacy-list">${T.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>
      <p class="fine">${esc(T.footer)}</p>
    </section>`;
}
