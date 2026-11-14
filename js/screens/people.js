// "the batch": you + the mock profiles, ranked by aura. Tap a row to stalk (and roast) their profile.
import * as S from "../state.js";
import { esc, signed } from "../fx.js";
import { MOCK_PROFILES } from "../data.js";
import { tierFor } from "../aura-engine.js";
import { initials, avatarHTML } from "../identity.js";

export default function people(root) {
  const s = S.get();
  const rows = [
    ...MOCK_PROFILES.map((p) => ({ ...p, href: `#/u/${p.id}` })),
    { id: "you", name: `${s.name} (you)`, aura: s.aura, href: "#/profile", you: true },
  ].sort((a, b) => b.aura - a.aura);

  // Mock profiles use their own colour; your row uses your profile circle
  const circle = (p) => (p.you
    ? avatarHTML(s, "avatar-sm")
    : `<span class="avatar-sm" style="background:${p.color};color:${p.ink}">${esc(initials(p.name))}</span>`);

  root.innerHTML = `
    <section>
      <div>
        <p class="label">people you may mog</p>
        <h1 class="h1" data-scramble>the batch.</h1>
        <p class="sub" style="margin-top:6px">ranked by aura. tap anyone to stalk their profile, call cap on their resume and diss them.</p>
      </div>
      <ol class="people">
        ${rows.map((p, i) => `
          <li>
            <a class="card person-row${p.you ? " is-you" : ""}" href="${p.href}">
              <span class="rank">#${i + 1}</span>
              ${circle(p)}
              <span class="person-meta">
                <b>${esc(p.name)}</b>
                <small>${esc(tierFor(p.aura).name)}</small>
              </span>
              <span class="person-aura">${signed(p.aura)}</span>
            </a>
          </li>`).join("")}
      </ol>
      ${s.aura ? "" : `<a class="btn btn-cta btn-block" href="#/upload">scan your resume to join the ranking →</a>`}
    </section>`;
}
