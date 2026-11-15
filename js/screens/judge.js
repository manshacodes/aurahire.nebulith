// Roast a friend: judge someone else's resume (paste, .txt or PDF) with the same AuraGPT engine,
// see their score, breakdown and worst lines, then add them to the batch to race their aura.
import { go } from "../router.js";
import * as S from "../state.js";
import { $, esc, signed, sticker, toast, shake, countUp } from "../fx.js";
import { JUDGE_TEXT as T, AVATAR_COLORS } from "../data.js";
import { scoreResume, analyzeResume, toneOf, isCrashOut } from "../aura-engine.js";
import { readResumeFile, autoGrow } from "../resume-file.js";
import { breakdownHTML, fillBreakdown, rizzText } from "../breakdown.js";
import { earn } from "../aura.js";

const fill = (text, vars) => text.replace(/\{(\w+)\}/g, (_, k) => vars[k]);

export default function judge(root) {
  let result = null, fillTimer = 0;

  root.innerHTML = `
    <section>
      <a class="back-link" href="#/people">← the batch</a>
      <div>
        <p class="label">${esc(T.label)}</p>
        <h1 class="h1" data-scramble>${esc(T.title)}</h1>
        <p class="sub" style="margin-top:6px">${esc(T.sub)}</p>
      </div>

      <div class="split"><div class="split-main">
      <div class="card name-card">
        <label class="label" for="friendName">${esc(T.nameLabel)}</label>
        <input class="text-input" id="friendName" maxlength="24" placeholder="${esc(T.namePlaceholder)}" />
      </div>

      <label class="dropzone dropzone-sm" id="drop">
        <input type="file" id="file" accept=".pdf,application/pdf,.txt,text/plain" hidden />
        <strong>upload their resume</strong>
        <span class="sub"><b>PDF or .txt</b>. read in your browser, never uploaded.</span>
      </label>
      <textarea id="text" data-lenis-prevent aria-label="Their resume, one line per achievement" placeholder="${esc(T.pastePlaceholder.replace(/\n/g, "&#10;"))}"></textarea>

      <button class="btn btn-cta btn-xl" id="go">${esc(T.judge)}</button>
      </div><div class="split-side">
      <div id="result"></div>
      </div></div>
    </section>`;

  const text = $("#text", root), drop = $("#drop", root);
  const fitText = autoGrow(text);

  async function readFile(file) {
    if (!file) return;
    try {
      text.value = await readResumeFile(file);
      fitText();
      toast(`read "${file.name}". they're cooked.`);
    } catch (err) {
      shake(drop);
      toast(err.message);
    }
  }
  $("#file", root).addEventListener("change", (e) => readFile(e.target.files[0]));
  drop.addEventListener("dragover", (e) => { e.preventDefault(); drop.classList.add("over"); });
  drop.addEventListener("dragleave", () => drop.classList.remove("over"));
  drop.addEventListener("drop", (e) => { e.preventDefault(); drop.classList.remove("over"); readFile(e.dataTransfer.files[0]); });

  // Judge: same engine as your own scan, then show the verdict below
  $("#go", root).addEventListener("click", () => {
    const name = $("#friendName", root).value.trim();
    const resume = text.value.trim();
    if (!name) { shake($("#friendName", root)); toast(T.emptyName); return; }
    if (!resume) { shake(text); toast(T.emptyResume); return; }

    const { lines, allLines, total, tier } = scoreResume(resume);
    const { scores, rizz } = analyzeResume(allLines);   // the breakdown reads the whole resume
    const worst = [...lines].sort((a, b) => a.points - b.points).slice(0, 3);
    result = { name, aura: total, lines, scores, rizz };
    earn("judge");

    $("#result", root).innerHTML = `
      <div class="card judge-card">
        <p class="label">${esc(T.verdictTitle)}</p>
        <div class="judge-top">
          <div><b class="judge-name">${esc(name)}</b><span class="pill">${esc(tier.name)}</span></div>
          <div class="big-num num judge-num" id="judgeNum">+0</div>
        </div>
        <p class="roast">${esc(tier.roast)}</p>
        <div class="stats" style="margin-top:12px">
          <div class="stat"><small>rizz</small><b>${rizzText(rizz)}</b></div>
          <div class="stat"><small>lines</small><b>${lines.length}</b></div>
          <div class="stat"><small>crash outs</small><b>${lines.filter(isCrashOut).length}</b></div>
        </div>
      </div>
      <div class="card">${breakdownHTML(scores)}</div>
      <div class="card">
        <p class="label" style="margin-bottom:12px">${esc(T.worstTitle)}</p>
        <ul class="judged-lines">${worst.map((l) => `
          <li><span>${esc(l.text)}</span><b class="${toneOf(l)}">${signed(l.points)}</b><small>${esc(l.roast)}</small></li>`).join("")}</ul>
      </div>
      <div class="row">
        <button class="btn btn-ghost" id="again">${esc(T.again)}</button>
        <button class="btn btn-cta" id="add">${esc(T.add)}</button>
      </div>`;

    countUp($("#judgeNum", root), total, { duration: 1200 });
    clearTimeout(fillTimer);
    fillTimer = fillBreakdown(root, 300);
    $("#result", root).scrollIntoView({ behavior: "smooth", block: "start" });

    $("#again", root).addEventListener("click", () => {
      $("#friendName", root).value = ""; text.value = ""; fitText();
      $("#result", root).innerHTML = "";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    $("#add", root).addEventListener("click", addToBatch);
  });

  // Save them as a rival on the leaderboard
  function addToBatch() {
    if (!result) return;
    const id = `f${Date.now().toString(36)}`;
    const color = AVATAR_COLORS[(S.get().friends || []).length % AVATAR_COLORS.length];
    S.set({ friends: [...(S.get().friends || []), { id, color, ...result }] });
    toast(fill(T.added, { name: result.name }));
    go("/people");
  }

  return () => clearTimeout(fillTimer);
}
