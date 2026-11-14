import { go } from "../router.js";
import * as S from "../state.js";
import { $, $$, esc, toast, shake, sticker } from "../fx.js";
import { DEMO_RESUME, DEMO_RESUMES } from "../data.js";

export default function upload(root) {
  root.innerHTML = `
    <section>
      <p class="label">step 1 of 3 · the resume</p>
      <h1 class="h1" data-scramble>drop your resume.<br>we'll calculate your worth.</h1>

      <label class="dropzone" id="drop">
        <input type="file" id="file" accept=".txt,.md,.pdf,.doc,.docx" hidden />
        <span class="dz-icon" aria-hidden="true">↑</span>
        <strong>drag your 4-page resume here</strong>
        <span class="sub">(it should be 1 page, but go off)</span>
      </label>

      <p class="or">or paste it below, one achievement per line</p>
      <textarea id="text" aria-label="Your resume, one line per achievement"
        placeholder="Won a hackathon&#10;Core member of 6 clubs&#10;Proficient in MS Word">${esc(S.get().resume)}</textarea>

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
    </section>`;

  const text = $("#text", root);
  const drop = $("#drop", root);

  async function readFile(file) {
    if (!file) return;
    if (/\.(txt|md)$/i.test(file.name) || file.type.startsWith("text/")) {
      text.value = await file.text();
      toast(`read "${file.name}". lowkey nervous for you.`);
    } else {
      text.value = DEMO_RESUME;
      toast("AuraGPT can't read PDFs, it's on unpaid leave. loading the demo instead, twin.");
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
