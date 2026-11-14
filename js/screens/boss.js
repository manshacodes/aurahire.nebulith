import { go } from "../router.js";
import * as S from "../state.js";
import { $, esc, pick, rand, sleep, floatText, confetti, reducedMotion } from "../fx.js";
import { JOBS, MOVES, BOSS_ATTACKS, BOSS_HP, YOUR_HP, FIGHT_TEXT } from "../data.js";
import { hasGsap } from "../motion.js";
import { memeSlam, preloadMemes } from "../slam.js";

const HAND = 3;            // random moves dealt per turn (plus "ask about salary")
const RAGE_AT = 40;        // boss HP that triggers rage mode
const RAGE_MULT = 1.3;     // rage attacks hit this much harder

// Deal a fresh hand: 3 random moves + the cursed salary button
function deal() {
  const pool = MOVES.filter((m) => m.id !== "salary").sort(() => Math.random() - 0.5);
  return [...pool.slice(0, HAND), MOVES.find((m) => m.id === "salary")];
}

export default function boss(root, { id }) {
  const j = JOBS.find((x) => x.id === id) || JOBS[0];
  let bossHp = BOSS_HP, you = YOUR_HP, busy = false, alive = true, turn = 1;
  // Status effects: dodge (block next attack), charge (2× next hit), stun (boss skips a turn), rage
  const fx = { dodge: false, charge: false, stun: false, rage: false };
  let hand = deal();

  root.innerHTML = `
    <section class="boss">
      <p class="label">applying = boss fight · a wild ${esc(j.boss)} appeared!</p>
      <div class="card arena">
        <div class="fighter" id="enemy">
          <div class="hpcard"><b>${esc(j.boss)}</b><small>lv.99</small><div class="hp"><span id="bossHp"></span></div><div class="fx-row" id="bossFx"></div></div>
          <div class="avatar boss-av" aria-hidden="true"><span class="visor"></span><span class="mouth"></span></div>
        </div>
        <div class="fighter" id="me">
          <div class="avatar me-av">you</div>
          <div class="hpcard"><b>you</b><small id="youHpText"></small><div class="hp me"><span id="youHp"></span></div><div class="fx-row" id="youFx"></div></div>
        </div>
      </div>
      <div class="card log" id="log" aria-live="polite">${esc(FIGHT_TEXT.opener(j.boss))}</div>
      <p class="label moves-label" id="turnLabel"></p>
      <div class="moves" id="moves"></div>
    </section>`;

  const log = (text) => { $("#log", root).textContent = text; };
  const enemy = $("#enemy", root), me = $("#me", root), movesEl = $("#moves", root);
  const setButtons = (on) => movesEl.querySelectorAll(".move").forEach((b) => { b.disabled = !on; });

  // Draw the current hand (re-dealt every turn)
  function renderHand() {
    $("#turnLabel", root).textContent = `turn ${turn} · your hand reshuffles every turn`;
    movesEl.innerHTML = hand.map((m) => `<button class="move" data-id="${m.id}"><b>${esc(m.name)}</b><small>${esc(m.hint)}</small></button>`).join("");
    movesEl.classList.remove("deal");
    void movesEl.offsetWidth;   // restart the deal animation
    movesEl.classList.add("deal");
  }

  function paint() {
    $("#bossHp", root).style.width = `${(bossHp / BOSS_HP) * 100}%`;
    $("#youHp", root).style.width = `${(you / YOUR_HP) * 100}%`;
    $("#youHpText", root).textContent = `lv.1 · ${you}/${YOUR_HP} hp`;
    const chip = (key) => `<span class="fx fx-${key}">${FIGHT_TEXT.fx[key]}</span>`;
    $("#youFx", root).innerHTML = ["dodge", "charge"].filter((k) => fx[k]).map(chip).join("");
    $("#bossFx", root).innerHTML = ["stun", "rage"].filter((k) => fx[k]).map(chip).join("");
  }

  function hit(fighter, amount) {
    fighter.classList.remove("hit");
    void fighter.offsetWidth;
    fighter.classList.add("hit");
    floatText(fighter, `−${amount}`);
  }

  async function finish(won) {
    if (!alive) return;
    setButtons(false);
    if (won) {
      log(`${j.boss} has 0 HP left. HR is drafting your offer…`);
      S.set({ currentJob: j.id });
      await sleep(700);
      if (!alive) return;
      // The win moment: memes slam onto the screen faster and faster, then "OFFER UNLOCKED"
      if (hasGsap && !reducedMotion()) await memeSlam({ finale: FIGHT_TEXT.slamFinale });
      else { confetti(60); await sleep(1500); }
      if (alive) go("/offer");
    } else {
      log("your aura has been fully depleted. womp womp.");
      await sleep(1500);
      if (alive) go("/ghosted/lost");
    }
  }

  // Your move: apply damage, healing and effects
  function applyMove(move) {
    const r = move.run();
    let text = r.text;
    if (r.dmg) {
      let dmg = r.dmg;
      if (fx.charge) { dmg *= 2; fx.charge = false; text += ` ${FIGHT_TEXT.charged(dmg)}`; }
      bossHp = Math.max(0, bossHp - dmg);
      hit(enemy, dmg);
    }
    if (r.self) { you = Math.max(0, you - r.self); hit(me, r.self); }
    if (r.heal) { you = Math.min(YOUR_HP, you + r.heal); floatText(me, `+${r.heal}`, true); }
    if (r.effect) fx[r.effect] = true;
    log(text);
  }

  // The boss strikes back (unless stunned or dodged)
  function bossTurn() {
    if (fx.stun) { fx.stun = false; log(FIGHT_TEXT.stunned(j.boss)); return; }
    const attack = pick([...j.attacks, ...BOSS_ATTACKS]);
    const dmg = Math.round(rand(attack.min, attack.max) * (fx.rage ? RAGE_MULT : 1));
    if (fx.dodge) { fx.dodge = false; log(`${j.boss} used ${attack.name}! ${FIGHT_TEXT.dodged}`); return; }
    you = Math.max(0, you - dmg);
    log(`${j.boss} used ${attack.name}! ${attack.text}`);
    hit(me, dmg);
  }

  async function play(move) {
    if (busy || !alive) return;
    busy = true;
    setButtons(false);

    applyMove(move);
    paint();
    await sleep(1000);
    if (!alive) return;
    if (bossHp <= 0) return finish(true);
    if (you <= 0) return finish(false);

    // Low on HP? The boss gets angry once.
    if (!fx.rage && bossHp <= RAGE_AT) {
      fx.rage = true;
      log(FIGHT_TEXT.rage(j.boss));
      paint();
      await sleep(1100);
      if (!alive) return;
    }

    bossTurn();
    paint();
    await sleep(1000);
    if (!alive) return;
    if (you <= 0) return finish(false);

    turn += 1;
    hand = deal();
    renderHand();
    busy = false;
  }

  // One listener for all move buttons, since the hand is re-rendered every turn
  movesEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".move");
    if (btn) play(hand.find((m) => m.id === btn.dataset.id));
  });

  renderHand();
  preloadMemes();   // so the win slam is instant
  paint();

  return () => { alive = false; };
}
