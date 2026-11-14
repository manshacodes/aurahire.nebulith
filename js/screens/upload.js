import { go } from "../router.js";
import * as S from "../state.js";
import { $, $$, esc, pick, toast, shake, sticker } from "../fx.js";
import { DEMO_RESUMES, SURNAME_LINES, DEFAULT_FIRST } from "../data.js";
import { surnameFor, cleanFirst } from "../identity.js";
import { earn } from "../aura.js";
import { readResumeFile, autoGrow } from "../resume-file.js";

export default function upload(root) {
  // Your saved name is "First Surname"; we only ask for the first part.
  // Until you type one, the box stays empty (Aarav is just the placeholder).
  // (names saved before this flag existed count as typed, unless it's still the default Aarav)
  const saved = S.get();
  const ownName = saved.nameSet || !saved.name.startsWith(`${DEFAULT_FIRST} `);
  const typedName = ownName ? saved.name.split(" ")[0] : "";
  let first = typedName || DEFAULT_FIRST;
  let roll = S.get().surnameRoll || 0;

  root.innerHTML = `
    <section>
      <p class="label">step 1 of 3 · the resume</p>
      <h1 class="h1" data-scramble>drop your resume.<br>we'll calculate your worth.</h1>

      <div class="split"><div class="split-main">
      <div class="card name-card">
        <label class="label" for="first">your first name</label>
        <div class="name-row">
          <input class="text-input" id="first" maxlength="16" autocomplete="given-name" placeholder="e.g. ${esc(DEFAULT_FIRST)}" value="${esc(typedName)}" />
          <button class="btn btn-ghost reroll" id="reroll" aria-label="Reroll surname">reroll 🎲</button>
        </div>
        <p class="name-preview">you'll be known as <b id="fullName"></b></p>
        <p class="fine" id="nameLine" style="text-align:left"></p>
      </div>

      <label class="dropzone" id="drop">
        <input type="file" id="file" accept=".pdf,application/pdf,.txt,text/plain" hidden />
        <span class="dz-icon" aria-hidden="true">↑</span>
        <strong>upload your own resume</strong>
        <span class="sub"><b>PDF or .txt</b>. AuraGPT reads it right here in your browser. nothing gets uploaded anywhere.</span>
      </label>

      <p class="or">or paste it below, one achievement per line</p>
      <textarea id="text" data-lenis-prevent aria-label="Your resume, one line per achievement"
        placeholder="Won a hackathon&#10;Core member of 6 clubs&#10;Proficient in MS Word">${esc(S.get().resume)}</textarea>

      </div><div class="split-side">
      <div>
        <p class="or" style="margin-bottom:10px">no resume? be someone else for a bit</p>
        <div class="personas" id="personas">
          ${DEMO_RESUMES.map((p, i) => `
            <button class="persona" data-id="${p.id}" aria-pressed="false">
              ${sticker(p.name, p.c, { rot: i % 2 ? 2 : -2, size: "sm" })}
              <small>${esc(p.tag)}</small>
            </button>`).join("")}
        </div>
      </div>

      <button class="btn btn-cta btn-xl" id="scan">scan my aura</button>
      <p class="fine">by uploading, you agree to be judged. AuraGPT runs on vibes and regex, entirely in your browser.</p>
      </div></div>
    </section>`;

  const text = $("#text", root);
  const drop = $("#drop", root);

  // Name: you type a first name, AuraGPT assigns a (funny) surname
  const saveName = () => {
    const full = `${first} ${surnameFor(first, roll)}`;
    $("#fullName", root).textContent = full;
    S.set({ name: full, surnameRoll: roll });
  };
  $("#nameLine", root).textContent = pick(SURNAME_LINES);
  saveName();
  $("#first", root).addEventListener("input", (e) => {
    const typed = cleanFirst(e.target.value);
    first = typed || DEFAULT_FIRST;
    roll = 0;
    S.set({ nameSet: Boolean(typed) });
    saveName();
  });
  $("#reroll", root).addEventListener("click", () => {
    roll += 1;
    earn("reroll");
    saveName();
    $("#nameLine", root).textContent = pick(SURNAME_LINES);
    const b = $("#fullName", root);
    b.classList.remove("pop");
    void b.offsetWidth;
    b.classList.add("pop");
  });

  // The box grows as you type or paste
  const fitText = autoGrow(text);

  async function readFile(file) {
    if (!file) return;
    if (/\.pdf$/i.test(file.name)) toast("AuraGPT is reading your PDF…");
    try {
      text.value = await readResumeFile(file);
      fitText();
      markPicked(null);
      toast(`read "${file.name}". lowkey nervous for you.`);
    } catch (err) {
      shake(drop);
      toast(err.message);
    }
  }

  $("#file", root).addEventListener("change", (e) => readFile(e.target.files[0]));
  drop.addEventListener("dragover", (e) => { e.preventDefault(); drop.classList.add("over"); });
  drop.addEventListener("dragleave", () => drop.classList.remove("over"));
  drop.addEventListener("drop", (e) => {
    e.preventDefault();
    drop.classList.remove("over");
    readFile(e.dataTransfer.files[0]);
  });

  // Pick a demo persona: fills the textarea with their resume
  const personaBtns = $$(".persona", root);
  const markPicked = (id) => personaBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.id === id)));
  $("#personas", root).addEventListener("click", (e) => {
    const btn = e.target.closest(".persona");
    if (!btn) return;
    const p = DEMO_RESUMES.find((x) => x.id === btn.dataset.id);
    text.value = p.lines.join("\n");
    fitText();
    markPicked(p.id);
    toast(`loaded ${p.name}. ${p.tag}`);
  });
  // Typing your own resume un-picks the persona
  text.addEventListener("input", () => markPicked(null));
  // Coming back with a persona's resume loaded? Show it as picked.
  const current = DEMO_RESUMES.find((p) => p.lines.join("\n") === text.value.trim());
  if (current) markPicked(current.id);

  $("#scan", root).addEventListener("click", () => {
    const resume = text.value.trim();
    if (!resume) {
      shake(text);
      toast("an empty resume? that's −1000 aura. paste something.");
      return;
    }
    S.set({ resume });
    go("/scan");
  });
}
