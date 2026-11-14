// HR chat: you reply in stickers and memes, HR replies in context (sometimes with a meme back).
// Context it keeps: your answer to its opening question, repeats, and how long you've been chatting.
import * as S from "../state.js";
import { $, esc, pick, sleep, sticker } from "../fx.js";
import {
  STICKERS, MEMES, HR_OPENERS, HR_STICKER_REPLIES, HR_DEFAULT_REPLIES, HR_TEXT_REPLIES,
  HR_OPENER_ANSWERS, HR_MEME_REPLIES, HR_REPEAT_REPLY, HR_LOGOFF, HR_BACK,
} from "../data.js";
import { memeImg, mix } from "../memes.js";

const TRAY = ["SIX7", "W", "L", "COOKED", "TWIN", "UNC", "SEVEN", "DELULU", "CRASH", "GLAZER", "HUZZ", "WOMP"];
const AI_MEME_SRC = "assets/no-thanks-i-use-ai.png";
const LOGOFF_AFTER = 7;   // HR "logs off" once after this many of your messages

export default function chat(root) {
  let alive = true, typing = false;
  let sent = 0, last = null, answeredOpener = false, loggedOff = false;

  root.innerHTML = `
    <section>
      <div class="chat-head">
        <span class="avatar">HR</span>
        <div><b>HR unc · Ohio Ventures</b><small>replies only in stickers (mostly)</small></div>
      </div>
      <div class="chat-thread" id="thread" aria-live="polite"></div>
      <div class="card composer">
        <p class="label">stickers + memes · words are banned</p>
        <div class="tray-row tray-mixed" id="tray">
          ${mix(
            [`<button class="meme-btn" data-meme="AI" aria-label="Send the 'no thanks I use AI' meme"><img class="meme-thumb" src="${AI_MEME_SRC}" alt="" /></button>`,
              ...Object.keys(MEMES).map((id, i) => `<button class="meme-btn" data-meme="${id}" aria-label="Send meme: ${esc(MEMES[id].alt)}">${memeImg(id, "meme-thumb", i % 2 ? 3 : -3)}</button>`)],
            TRAY.map((id, i) => sticker(STICKERS[id].label, STICKERS[id].c, { tag: "button", size: "sm", rot: i % 2 ? 3 : -3, attrs: `data-id="${id}"` })),
          ).join("")}
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

  const rot = () => pick([-6, -3, 4, 7]);
  const aiMeme = () => `<img class="meme" src="${AI_MEME_SRC}" alt="No thanks, I use AI meme" style="--rot:3deg" />`;
  // One chat message part: a sticker, a meme, or text
  const partHTML = (part) => (part.stk ? sticker(STICKERS[part.stk].label, STICKERS[part.stk].c, { rot: rot(), size: "lg" })
    : part.img ? memeImg(part.img, "meme", rot())
    : esc(part.text));

  async function hrSay(parts) {
    if (!alive) return;
    typing = true;
    const dots = add(`<span class="typing"><i></i><i></i><i></i></span>`, "hr");
    await sleep(900 + Math.random() * 700);
    if (!alive) return;
    dots.remove();
    for (const part of parts) {
      add(partHTML(part), "hr", part.text ? "" : "sticker");
      await sleep(450);
      if (!alive) return;
    }
    typing = false;
  }

  // Decide HR's reply from what you sent + the conversation so far
  async function respond(key, defaultParts) {
    sent += 1;
    const repeat = key === last;
    last = key;
    if (repeat) return hrSay(HR_REPEAT_REPLY);
    await hrSay(defaultParts);
    // After a while HR logs off (once), then grudgingly comes back
    if (alive && sent >= LOGOFF_AFTER && !loggedOff) {
      loggedOff = true;
      await hrSay(HR_LOGOFF);
      await sleep(1600);
      if (alive) add(HR_BACK, "hint");
    }
  }

  // One tray, two kinds of buttons: memes (data-meme) and text stickers (data-id)
  $("#tray", root).addEventListener("click", (e) => {
    const btn = e.target.closest("[data-meme], [data-id]");
    if (!btn || typing) return;
    const meme = btn.dataset.meme, id = btn.dataset.id;
    if (meme === "AI") {
      add(aiMeme(), "me", "sticker");
      S.addAura(49);
      respond("AI", HR_STICKER_REPLIES.MEME);
    } else if (meme) {
      add(memeImg(meme, "meme", rot()), "me", "sticker");
      S.addAura(13);
      respond(meme, pick(HR_MEME_REPLIES[meme]));
    } else {
      add(sticker(STICKERS[id].label, STICKERS[id].c, { rot: rot(), size: "lg" }), "me", "sticker");
      S.addAura(7);
      respond(id, HR_STICKER_REPLIES[id] || pick(HR_DEFAULT_REPLIES));
    }
  });

  // Typed messages: your first one is read as the answer to HR's opening question
  $("#form", root).addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#input", root);
    const text = input.value.trim();
    if (!text || typing) return;
    add(esc(text), "me");
    input.value = "";
    const opener = !answeredOpener && HR_OPENER_ANSWERS.find(([re]) => re.test(text));
    answeredOpener = true;
    const parts = opener ? opener[1] : HR_TEXT_REPLIES.find(([re]) => re.test(text))[1];
    respond(`text:${text.toLowerCase()}`, parts);
  });

  (async () => {
    await hrSay([{ text: HR_OPENERS[0] }]);
    if (alive) add("tip: answer with a meme. or type yes/no if you're brave", "hint");
  })();

  return () => { alive = false; };
}
