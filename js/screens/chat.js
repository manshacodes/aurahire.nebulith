// HR chat: an interview over memes and stickers. HR opens with a random question, asks another
// every few messages, and replies in context (often with a meme back).
// Context it keeps: the question it's waiting on, repeats, and how long you've been chatting.
// Quick-reply chips under the thread let you answer in one tap.
import { $, esc, pick, sleep, sticker, shuffle } from "../fx.js";
import {
  STICKERS, MEMES, HR_QUESTIONS, HR_QUICK_CHIPS, HR_ASK_EVERY, HR_STICKER_REPLIES, HR_DEFAULT_REPLIES,
  HR_TEXT_REPLIES, HR_MEME_REPLIES, HR_REPEAT_REPLY, HR_LOGOFF, HR_BACK,
} from "../data.js";
import { memeImg, mix } from "../memes.js";
import { earn } from "../aura.js";
import { scrollToY } from "../motion.js";

const TRAY = ["SIX7", "W", "L", "COOKED", "TWIN", "UNC", "SEVEN", "DELULU", "CRASH", "GLAZER", "HUZZ", "WOMP"];
const AI_MEME_SRC = "assets/no-thanks-i-use-ai.png";
const LOGOFF_AFTER = 9;   // HR "logs off" once after this many of your messages

export default function chat(root) {
  let alive = true, typing = false;
  let sent = 0, sinceQuestion = 0, last = null, loggedOff = false;
  const questions = shuffle(HR_QUESTIONS);   // a different interview every visit
  let pending = null;                        // the question HR is waiting on

  root.innerHTML = `
    <section>
      <div class="chat-head">
        <span class="avatar">HR</span>
        <div><b>HR unc · Ohio Ventures</b><small>interviewing you. in memes.</small></div>
      </div>
      <div class="chat-thread" id="thread" aria-live="polite"></div>
      <div class="card composer">
        <div class="quick-row" id="quick" aria-label="Quick replies"></div>
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
    scrollToLatest(el);
    // memes load a moment later and push things down, so scroll again once they're in
    el.querySelectorAll("img").forEach((img) => img.addEventListener("load", () => scrollToLatest(el), { once: true }));
    return el;
  }

  // Keep the newest message in view, just above whatever sits at the bottom of the screen
  // (on phones: the sticky composer + tab bar; on desktop the composer is a side panel, so just the tab bar)
  function scrollToLatest(el) {
    if (!alive || !el.isConnected) return;
    const composer = $(".composer", root).getBoundingClientRect();
    const msg = el.getBoundingClientRect();
    const besideChat = composer.left >= msg.right - 1;            // desktop: composer is beside the thread
    const covered = besideChat ? 120 : innerHeight - composer.top + 16;
    const y = scrollY + msg.bottom - (innerHeight - covered);
    if (y > scrollY + 2) scrollToY(y);
  }

  // Quick replies: answers to the current question, or general asks when HR isn't waiting
  function renderQuick() {
    const chips = pending ? pending.chips : HR_QUICK_CHIPS;
    $("#quick", root).innerHTML = chips.map((c) => `<button class="quick-chip" data-text="${esc(c)}">${esc(c)}</button>`).join("");
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

  // HR asks the next question from this visit's shuffled list
  async function ask() {
    const next = questions.shift();
    if (!next) return;
    pending = next;
    sinceQuestion = 0;
    await hrSay([{ text: next.q }]);
    if (alive) renderQuick();
  }

  // Decide HR's reply from what you sent + the conversation so far
  async function respond(key, parts) {
    sent += 1;
    sinceQuestion += 1;
    const repeat = key === last;
    last = key;
    await hrSay(repeat ? HR_REPEAT_REPLY : parts);
    if (!alive) return;
    // After a while HR logs off (once), then grudgingly comes back
    if (sent >= LOGOFF_AFTER && !loggedOff) {
      loggedOff = true;
      await hrSay(HR_LOGOFF);
      await sleep(1600);
      if (alive) add(HR_BACK, "hint");
    }
    // Every few messages, HR moves on to its next interview question
    if (alive && !pending && sinceQuestion >= HR_ASK_EVERY) await ask();
  }

  // Your typed (or quick-reply) message: an answer if HR asked something, else keyword replies
  function sendText(text) {
    if (!text || typing) return;
    add(esc(text), "me");
    let parts;
    if (pending) {
      const match = pending.answers.find(([re]) => re.test(text));
      parts = match ? match[1] : pending.other;
      pending = null;
      earn("answer");
    } else {
      parts = HR_TEXT_REPLIES.find(([re]) => re.test(text))[1];
    }
    renderQuick();
    respond(`text:${text.toLowerCase()}`, parts);
  }

  // One tray, two kinds of buttons: memes (data-meme) and text stickers (data-id)
  $("#tray", root).addEventListener("click", (e) => {
    const btn = e.target.closest("[data-meme], [data-id]");
    if (!btn || typing) return;
    const meme = btn.dataset.meme, id = btn.dataset.id;
    if (meme === "AI") {
      add(aiMeme(), "me", "sticker");
      earn("aiMeme");
      respond("AI", HR_STICKER_REPLIES.MEME);
    } else if (meme) {
      add(memeImg(meme, "meme", rot()), "me", "sticker");
      earn("meme");
      respond(meme, pick(HR_MEME_REPLIES[meme]));
    } else {
      add(sticker(STICKERS[id].label, STICKERS[id].c, { rot: rot(), size: "lg" }), "me", "sticker");
      earn("sticker");
      respond(id, HR_STICKER_REPLIES[id] || pick(HR_DEFAULT_REPLIES));
    }
  });

  // A mouse wheel only scrolls up/down, so turn it into sideways scrolling on the trays
  // (on phones you swipe them; on a computer this is the only way to reach every meme)
  root.querySelectorAll("#tray, #quick").forEach((row) => {
    row.addEventListener("wheel", (e) => {
      const sideways = row.scrollWidth > row.clientWidth + 2 && getComputedStyle(row).overflowX !== "visible";
      if (!sideways || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const atEnd = (e.deltaY > 0 && row.scrollLeft + row.clientWidth >= row.scrollWidth - 1) || (e.deltaY < 0 && row.scrollLeft <= 0);
      if (atEnd) return;   // at the end of the tray, let the page scroll as normal
      e.preventDefault();
      row.scrollLeft += e.deltaY;
    }, { passive: false });
  });

  $("#quick", root).addEventListener("click", (e) => {
    const chip = e.target.closest(".quick-chip");
    if (chip) sendText(chip.dataset.text);
  });

  $("#form", root).addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#input", root);
    const text = input.value.trim();
    input.value = "";
    sendText(text);
  });

  (async () => {
    await ask();
    if (alive) add("tip: tap a reply, send a meme, or type if you're brave", "hint");
  })();

  return () => { alive = false; };
}
