import { go } from "../router.js";
import * as S from "../state.js";
import { $, esc, toast, shake } from "../fx.js";
import { DEMO_RESUME } from "../data.js";

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

      <div class="row">
        <button class="btn btn-ghost" id="demo">use demo resume</button>
        <button class="btn btn-cta" id="scan">scan my aura</button>
      </div>
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

  $("#demo", root).addEventListener("click", () => {
    text.value = DEMO_RESUME;
    toast("demo resume loaded. it's giving 14 hackathons.");
  });

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
