// "LinkedIn-ify my resume": writes a peak cringe LinkedIn post from what AuraGPT found in a resume,
// and shows it in a pop-up post card with a cringe dial, fake reactions and fake comments.
// All the words live in LINKEDIFY (data.js); this file only picks and arranges them.
import { LINKEDIFY as L } from "./data.js";
import { $, esc, toast } from "./fx.js";
import { earn } from "./aura.js";
import { societyCount } from "./aura-engine.js";

// A small seeded random generator, so the same resume + reroll number always gives the same post
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7) >>> 0;

// **text** → 𝐛𝐨𝐥𝐝 unicode (that's how people bold words on LinkedIn); level 1 stays plain
function boldify(text, on) {
  return text.replace(/\*\*(.+?)\*\*/g, (_, inner) => (on ? [...inner].map((ch) => {
    const c = ch.codePointAt(0);
    if (c >= 65 && c <= 90) return String.fromCodePoint(0x1D400 + c - 65);
    if (c >= 97 && c <= 122) return String.fromCodePoint(0x1D41A + c - 97);
    if (c >= 48 && c <= 57) return String.fromCodePoint(0x1D7CE + c - 48);
    return ch;
  }).join("") : inner));
}

// What the resume gives us to work with: the matching topics, in priority order
function findTopics(lines) {
  const text = lines.map((l) => l.text).join("\n");
  const societies = societyCount(lines);   // the same count AuraGPT uses
  const found = [];
  for (const t of L.topics) {
    if (t.societies) { if (societies >= 3) found.push({ ...t, text: t.line(societies) }); continue; }
    const m = text.match(t.re);
    if (m && !found.some((f) => f.tag === t.tag)) found.push({ ...t, text: t.line(m), source: t.source?.(text) });
  }
  // an uncle-powered internship doesn't also get the "interned somewhere you've heard of" line
  return found.some((f) => f.tag === "#networking") ? found.filter((f) => f.tag !== "#internship") : found;
}

// level: 1 humble, 2 thought leader, 3 top voice. Returns the post as plain text (with unicode bold).
export function writePost(lines, level = 3, seed = 0) {
  const text = lines.map((l) => l.text).join("\n");
  const rand = rng(hash(text) + seed * 7919 + level);
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];
  const shuffled = (arr) => [...arr].sort(() => rand() - 0.5);

  const topics = findTopics(lines);
  const count = level + 1;   // 2, 3 or 4 resume lines
  // keep the strongest few, in a different order on each reroll
  const chosen = shuffled(topics.slice(0, count + 1)).slice(0, count);
  let body = chosen.map((t) => t.text);
  if (body.length < count) body = [...body, ...shuffled(L.generic).slice(0, count - body.length)];

  const parts = [pick(L.openers[level])];
  if (level >= 2) parts.push(pick(L.hooks));
  parts.push(...body);
  if (level >= 2) {
    const source = topics.find((t) => t.source)?.source || "This journey";
    const lessonPool = [...topics.filter((t) => t.lesson).map((t) => t.lesson), ...shuffled(L.lessons)];
    parts.push(`${L.lessonsIntro(source, level)}\n${lessonPool.slice(0, 3).map((x, i) => `${i + 1}. ${x}`).join("\n")}`);
  }
  if (level === 3) parts.push(L.thanks, L.hiring);
  if (L.cta[level]) parts.push(L.cta[level]);
  const tags = [...new Set([...chosen.map((t) => t.tag), ...shuffled(L.hashtags)])].slice(0, level * 2 + 1);   // tags match the lines in the post
  parts.push(tags.join(" "));
  return boldify(parts.join("\n\n"), level >= 2);
}

// The pop-up: a fake LinkedIn-style post card. who = { name, avatarHTML, headline }.
// Returns a function that closes it (screens call it in their cleanup).
export function openLinkedify(lines, who) {
  $(".li-sheet")?.remove();
  let level = 3, seed = 0;
  const sheet = document.createElement("div");
  sheet.className = "li-sheet";
  sheet.setAttribute("role", "dialog");
  sheet.setAttribute("aria-modal", "true");
  sheet.setAttribute("aria-label", L.title);
  document.body.appendChild(sheet);

  function render() {
    const post = writePost(lines, level, seed);
    const rand = rng(seed + 99);
    const pick = (arr) => arr[Math.floor(rand() * arr.length)];
    const others = [...L.comments].sort(() => rand() - 0.5).slice(0, 2);
    sheet.innerHTML = `
      <div class="li-panel">
        <div class="li-top"><p class="label">${esc(L.title)}</p><button class="icon-btn li-close" aria-label="Close">✕</button></div>
        <div class="li-dial" role="group" aria-label="cringe level">${L.levels.map((label, i) => `
          <button class="li-level" data-level="${i + 1}" aria-pressed="${level === i + 1}">${esc(label)}</button>`).join("")}</div>
        <article class="li-post">
          <header class="li-head">${who.avatarHTML}
            <div class="li-who"><span class="li-name"><b>${esc(who.name)}</b> <span>· 1st</span></span>
              <small>${esc(who.headline)}</small><small>${esc(L.meta)}</small></div>
          </header>
          <div class="li-body is-collapsed">${esc(post).replace(/\n/g, "<br>")}</div>
          <button class="li-more">${esc(L.seeMore)}</button>
          <div class="li-reacts"><span>👍❤️💡 ${pick(L.reactions)}</span><span>${pick(L.commentCounts)} comments · ${pick(L.reposts)} reposts</span></div>
          <small class="li-you">${esc(L.you)}</small>
          <ul class="li-comments">${[L.hrComment, ...others].map(([name, said]) => `
            <li><b>${esc(name)}</b><span>${esc(said)}</span></li>`).join("")}</ul>
        </article>
        <div class="li-actions">
          <button class="btn btn-ghost" data-act="reroll">${esc(L.reroll)}</button>
          <button class="btn btn-ghost" data-act="copy">${esc(L.copy)}</button>
          <button class="btn btn-cta" data-act="post">${esc(L.post)}</button>
        </div>
      </div>`;
    sheet._post = post;
    $(".li-close", sheet).focus({ preventScroll: true });
  }

  function close() {
    document.removeEventListener("keydown", onKey);
    sheet.remove();
  }
  const onKey = (e) => { if (e.key === "Escape") close(); };
  document.addEventListener("keydown", onKey);

  sheet.addEventListener("click", async (e) => {
    if (e.target === sheet || e.target.closest(".li-close")) return close();
    const lvl = e.target.closest(".li-level");
    if (lvl) { level = Number(lvl.dataset.level); return render(); }
    if (e.target.closest(".li-more")) {
      $(".li-body", sheet).classList.remove("is-collapsed");
      e.target.closest(".li-more").remove();
      return;
    }
    const act = e.target.closest("[data-act]")?.dataset.act;
    if (act === "reroll") { seed += 1; render(); }
    if (act === "copy") {
      try { await navigator.clipboard.writeText(sheet._post); toast(L.copied); earn("linkedify"); } catch { toast(sheet._post.slice(0, 140) + "…"); }
    }
    if (act === "post") toast(L.posted);
  });

  render();
  return close;
}

// For tests and the console: every level's post for a resume
export const allLevels = (lines, seed = 0) => [1, 2, 3].map((lvl) => writePost(lines, lvl, seed));
