// "the batch": you + the mock profiles, ranked by aura. Tap a row to stalk (and roast) their profile.
// The climb card shows your rank and how much aura you need to pass the next person.
import * as S from "../state.js";
import { esc, signed } from "../fx.js";
import { AURA_RANK, JUDGE_TEXT } from "../data.js";
import { tierFor } from "../aura-engine.js";
import { initials, avatarHTML } from "../identity.js";
import { rankOf, nextTarget, rivals } from "../aura.js";

export default function people(root) {
  const s = S.get();
  const rows = [
    ...rivals().map((p) => ({ ...p, href: p.lines ? `#/f/${p.id}` : `#/u/${p.id}`, friend: Boolean(p.lines) })),
    { id: "you", name: `${s.name} (you)`, aura: s.aura, href: "#/profile", you: true },
  ].sort((a, b) => b.aura - a.aura || (b.you ? 1 : 0) - (a.you ? 1 : 0));   // ties go your way

  // Mock profiles use their own colour, friends a sticker colour, and you your profile circle
  const circle = (p) => (p.you ? avatarHTML(s, "avatar-sm")
    : p.friend ? `<span class="av avatar-sm" data-c="${p.color}">${esc(initials(p.name))}</span>`
    : `<span class="avatar-sm" style="background:${p.color};color:${p.ink}">${esc(initials(p.name))}</span>`);

  // Climb card: your rank, and a bar towards the person just above you
  const rank = rankOf(s.aura);
  const target = nextTarget(s.aura);
  const below = rivals().filter((p) => p.aura <= s.aura).sort((a, b) => b.aura - a.aura)[0];
  const floor = below ? below.aura : Math.min(0, s.aura);
  const progress = target ? Math.max(4, Math.min(100, ((s.aura - floor) / (target.aura - floor)) * 100)) : 100;
  const climb = `
    <div class="card climb-card">
      <div class="climb-top"><span class="climb-rank">#${rank}</span><span class="climb-of">of ${rows.length} in the batch</span></div>
      <div class="bar"><span style="width:${progress}%"></span></div>
      <p class="climb-next">${esc(target
        ? AURA_RANK.next.replace("{gap}", (target.aura - s.aura + 1).toLocaleString("en-US")).replace("{name}", target.name)
        : AURA_RANK.top)}</p>
      <details class="farm-tips">
        <summary>${esc(AURA_RANK.tipsTitle)}</summary>
        <ul>${AURA_RANK.tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      </details>
    </div>`;

  root.innerHTML = `
    <section>
      <div>
        <p class="label">people you may mog</p>
        <h1 class="h1" data-scramble>the batch.</h1>
        <p class="sub" style="margin-top:6px">ranked by aura. farm aura to climb. tap anyone to stalk their profile, call cap on their resume and diss them.</p>
      </div>
      <div class="split"><div class="split-main">
      ${climb}
      <a class="btn btn-ghost btn-block" href="#/judge">${esc(JUDGE_TEXT.cta)}</a>
      </div><div class="split-side">
      <ol class="people">
        ${rows.map((p, i) => `
          <li>
            <a class="card person-row${p.you ? " is-you" : ""}" href="${p.href}">
              <span class="rank">#${i + 1}</span>
              ${circle(p)}
              <span class="person-meta">
                <b>${esc(p.name)}</b>
                <small>${p.friend ? `${esc(JUDGE_TEXT.friendTag)} · ` : ""}${esc(tierFor(p.aura).name)}</small>
              </span>
              <span class="person-aura">${signed(p.aura)}</span>
            </a>
          </li>`).join("")}
      </ol>
      ${s.aura ? "" : `<a class="btn btn-cta btn-block" href="#/upload">scan your resume to join the ranking →</a>`}
      </div></div>
    </section>`;
}
