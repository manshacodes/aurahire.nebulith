import * as S from "../state.js";
import { $, esc, pick, sleep, sticker } from "../fx.js";
import { STICKERS, HR_OPENERS, HR_STICKER_REPLIES, HR_DEFAULT_REPLIES, HR_TEXT_REPLIES } from "../data.js";

const TRAY = ["SIX7", "W", "L", "COOKED", "TWIN", "UNC", "SEVEN", "DELULU", "CRASH", "GLAZER", "HUZZ", "WOMP"];
const MEME_SRC = "assets/no-thanks-i-use-ai.png";

export default function chat(root) {
  let alive = true, typing = false;

  root.innerHTML = `
    <section>
      <div class="chat-head">
        <span class="avatar">HR</span>
        <div><b>HR unc · Ohio Ventures</b><small>replies only in stickers (mostly)</small></div>
      </div>
      <div class="thread" id="thread" aria-live="polite"></div>
      <div class="card composer">
        <p class="label">stickers · memes · words are banned</p>
        <div class="tray-row" id="tray">
          <button class="meme-btn" data-id="MEME" aria-label="Send the 'no thanks I use AI' meme">
            <img src="${MEME_SRC}" alt="" onerror="this.parentElement.innerHTML='<span class=&quot;stk sm&quot; data-c=&quot;yellow&quot;>NO THANKS I USE AI</span>'" />
          </button>
          ${TRAY.map((id, i) => sticker(STICKERS[id].label, STICKERS[id].c, { tag: "button", size: "sm", rot: i % 2 ? 3 : -3, attrs: `data-id="${id}"` })).join("")}
        </div>
        <form id="form">
          <input id="input" placeholder="type at your own risk…" autocomplete="off" aria-label="Message" />
          <button class="btn btn-cta" type="submit">send</button>
        </form>
      </div>
    </section>`;

  const thread = $("#thread", root);

  function add(html, who, extra = "") {
    const el = document.createElement("div");
    el.className = `msg ${who} ${extra}`;
    el.innerHTML = html;
    thread.appendChild(el);
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return el;
  }

  const stickerMsg = (id) => id === "MEME"
    ? `<img class="meme" src="${MEME_SRC}" alt="No thanks, I use AI meme" />`
    : sticker(STICKERS[id].label, STICKERS[id].c, { rot: pick([-6, -3, 4, 7]), size: "lg" });

  async function hrSay(parts) {
    if (!alive) return;
    typing = true;
    const dots = add(`<span class="typing"><i></i><i></i><i></i></span>`, "hr");
    await sleep(900 + Math.random() * 700);
    if (!alive) return;
    dots.remove();
    for (const part of parts) {
      if (part.stk) add(stickerMsg(part.stk), "hr", "sticker");
      else add(esc(part.text), "hr");
      await sleep(450);
      if (!alive) return;
    }
    typing = false;
  }

  $("#tray", root).addEventListener("click", (e) => {
    const btn = e.target.closest("[data-id]");
    if (!btn || typing) return;
    const id = btn.dataset.id;
    add(stickerMsg(id), "me", "sticker");
    S.addAura(id === "MEME" ? 49 : 7);
    hrSay(HR_STICKER_REPLIES[id] || pick(HR_DEFAULT_REPLIES));
  });

  $("#form", root).addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#input", root);
    const text = input.value.trim();
    if (!text || typing) return;
    add(esc(text), "me");
    input.value = "";
    const reply = HR_TEXT_REPLIES.find(([re]) => re.test(text))[1];
    hrSay([{ text: reply }]);
  });

  (async () => {
    await hrSay([{ text: HR_OPENERS[0] }]);
    if (alive) add("tip: answer with the meme", "hint");
  })();

  return () => { alive = false; };
}
