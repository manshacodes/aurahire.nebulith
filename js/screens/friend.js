// A friend you judged with "roast a friend": their score, mog check, breakdown and every judged line.
import { go } from "../router.js";
import * as S from "../state.js";
import { $, esc, signed, toast } from "../fx.js";
import { JUDGE_TEXT as T, MOG_VERDICTS } from "../data.js";
import { tierFor, toneOf } from "../aura-engine.js";
import { initials } from "../identity.js";
import { breakdownHTML, fillBreakdown, rizzText } from "../breakdown.js";

export default function friend(root, { id }) {
  const f = (S.get().friends || []).find((x) => x.id === id);
  if (!f) { go("/people"); return; }
  const mine = S.get().aura;
  const tier = tierFor(f.aura);

  // Mog check, same rules as the mock profiles
  const top = Math.max(mine, f.aura, 1);
  const verdict = !mine ? MOG_VERDICTS.none
    : Math.abs(mine - f.aura) <= 300 ? MOG_VERDICTS.tie
    : mine > f.aura ? MOG_VERDICTS.win : MOG_VERDICTS.lose;
  const bar = (label, value) => `
    <div class="mog-bar"><span>${esc(label)}</span><div class="bar"><span style="width:${Math.max(0, (value / top) * 100)}%"></span></div><b>${signed(value)}</b></div>`;

  root.innerHTML = `
    <section>
      <a class="back-link" href="#/people">← the batch</a>
      <div class="split"><div class="split-main">
      <div class="cover"></div>
      <div class="avatar-lg-wrap"><span class="av av-lg" data-c="${f.color}">${esc(initials(f.name))}</span></div>
      <div>
        <h1 class="person-name">${esc(f.name)}</h1>
        <p class="headline">judged by AuraGPT · ${f.lines.length} lines · rizz ${rizzText(f.rizz)}</p>
      </div>
      <div class="chips"><span class="pill">${esc(tier.name)}</span><span class="pill alt">${signed(f.aura)} aura</span><span class="pill">${esc(T.friendTag)}</span></div>

      <div class="card">
        <p class="label" style="margin-bottom:12px">mog check</p>
        ${bar("you", mine)}
        ${bar(f.name.split(" ")[0], f.aura)}
        <p class="mog-verdict">${esc(verdict)}</p>
      </div>

      <div class="card">
        <p class="label" style="margin-bottom:14px">AuraGPT breakdown</p>
        ${breakdownHTML(f.scores)}
      </div>

      </div><div class="split-side">
      <div class="card">
        <p class="label" style="margin-bottom:12px">${esc(T.linesTitle)}</p>
        <ul class="judged-lines">${f.lines.map((l) => `
          <li><span>${esc(l.text)}</span><b class="${toneOf(l)}">${signed(l.points)}</b><small>${esc(l.roast)}</small></li>`).join("")}</ul>
      </div>

      <button class="link-btn" id="remove">${esc(T.remove)}</button>
      </div></div>
    </section>`;

  const fillTimer = fillBreakdown(root, 300);

  $("#remove", root).addEventListener("click", () => {
    S.set({ friends: S.get().friends.filter((x) => x.id !== id) });
    toast(T.removed.replace("{name}", f.name));
    go("/people");
  });

  return () => clearTimeout(fillTimer);
}
