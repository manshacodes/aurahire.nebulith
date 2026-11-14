// The HR boss fight, fighting-game style:
// VS intro → ROUND 1 → FIGHT! → you pick a move from a reshuffled hand → HR taunts and attacks,
// and you can BLOCK it with a timing tap → repeat until someone is K.O.
// An aura meter fills as you deal and take damage; when full it unlocks the AURA FARM ULTIMATE.
import { go } from "../router.js";
import * as S from "../state.js";
import { $, esc, pick, rand, sleep, floatText, confetti, reducedMotion } from "../fx.js";
import { JOBS, MOVES, BOSS_ATTACKS, BOSS_HP, YOUR_HP, FIGHT_TEXT, BOSS_TAUNTS } from "../data.js";
import { hasGsap } from "../motion.js";
import { memeSlam, preloadMemes } from "../slam.js";
import { sfx } from "../sound.js";
import { startMusic, stopMusic, setRage } from "../music.js";
import { vsIntro, taunt, blockQTE, ultFlash, koSplash } from "../fight-fx.js";
import { avatarHTML } from "../identity.js";

const HAND = 3;            // random moves dealt per turn (plus "ask about salary")
const RAGE_AT = 40;        // boss HP that triggers rage mode
const RAGE_MULT = 1.3;     // rage attacks hit this much harder
const METER_MAX = 100;     // aura meter: full = ultimate unlocked
const BLOCK_SWEEP = 1600, RAGE_SWEEP = 1250;   // how long the block marker takes to cross (ms), faster in rage mode
const BLOCK_DAMAGE = { perfect: 0, good: 0.5, miss: 1 };

// The ultimate is a move like the others, so it uses the same code path
const ULT = { id: "ult", name: FIGHT_TEXT.ult.name, hint: FIGHT_TEXT.ult.hint, ult: true, run: () => ({ dmg: rand(45, 60), text: FIGHT_TEXT.ult.text }) };

// Deal a fresh hand: 3 random moves + the cursed salary button
function deal() {
  const pool = MOVES.filter((m) => m.id !== "salary").sort(() => Math.random() - 0.5);
  return [...pool.slice(0, HAND), MOVES.find((m) => m.id === "salary")];
}

export default function boss(root, { id }) {
  const j = JOBS.find((x) => x.id === id) || JOBS[0];
  let bossHp = BOSS_HP, you = YOUR_HP, busy = true, alive = true, turn = 1, meter = 0;
  // Status effects: dodge (block next attack), charge (2× next hit), stun (boss skips a turn), rage
  const fx = { dodge: false, charge: false, stun: false, rage: false };
  let hand = deal();

  root.innerHTML = `
    <section class="boss">
      <p class="label">applying = boss fight · a wild ${esc(j.boss)} appeared!</p>
      <div class="split"><div class="split-main">
      <div class="card arena" id="arena">
        <div class="fighter" id="enemy">
          <div class="hpcard"><b>${esc(j.boss)}</b><small>lv.99</small><div class="hp"><span id="bossHp"></span></div><div class="fx-row" id="bossFx"></div></div>
          <div class="avatar boss-av" aria-hidden="true"><span class="visor"></span><span class="mouth"></span></div>
        </div>
        <div class="fighter" id="me">
          <div class="avatar me-av">you</div>
          <div class="hpcard">
            <b>you</b><small id="youHpText"></small><div class="hp me"><span id="youHp"></span></div>
            <div class="meter-row"><span class="meter-label">${FIGHT_TEXT.meterLabel}</span><div class="meter"><span id="meter"></span></div></div>
            <div class="fx-row" id="youFx"></div>
          </div>
        </div>
      </div>
      <div class="card log" id="log" aria-live="polite">${esc(FIGHT_TEXT.opener(j.boss))}</div>
      </div><div class="split-side">
      <p class="label moves-label" id="turnLabel"></p>
      <div class="moves" id="moves"></div>
      </div></div>
    </section>`;

  const log = (text) => { $("#log", root).textContent = text; };
  const enemy = $("#enemy", root), me = $("#me", root), movesEl = $("#moves", root);
  const setButtons = (on) => movesEl.querySelectorAll(".move").forEach((b) => { b.disabled = !on; });

  // Draw the current hand (re-dealt every turn). A full meter adds the ultimate on top.
  function renderHand() {
    const cards = meter >= METER_MAX ? [ULT, ...hand] : hand;
    $("#turnLabel", root).textContent = meter >= METER_MAX ? FIGHT_TEXT.ultReady : `turn ${turn} · your hand reshuffles every turn`;
    movesEl.innerHTML = cards.map((m) => `<button class="move${m.ult ? " move-ult" : ""}" data-id="${m.id}"><b>${esc(m.name)}</b><small>${esc(m.hint)}</small></button>`).join("");
    movesEl.classList.remove("deal");
    void movesEl.offsetWidth;   // restart the deal animation
    movesEl.classList.add("deal");
  }

  function paint() {
    $("#bossHp", root).style.width = `${(bossHp / BOSS_HP) * 100}%`;
    $("#youHp", root).style.width = `${(you / YOUR_HP) * 100}%`;
    $("#youHpText", root).textContent = `lv.1 · ${you}/${YOUR_HP} hp`;
    $("#meter", root).style.width = `${(meter / METER_MAX) * 100}%`;
    $("#meter", root).parentElement.classList.toggle("full", meter >= METER_MAX);
    const chip = (key) => `<span class="fx fx-${key}">${FIGHT_TEXT.fx[key]}</span>`;
    $("#youFx", root).innerHTML = ["dodge", "charge"].filter((k) => fx[k]).map(chip).join("");
    $("#bossFx", root).innerHTML = ["stun", "rage"].filter((k) => fx[k]).map(chip).join("");
  }

  const addMeter = (n) => { meter = Math.min(METER_MAX, meter + n); };

  function hit(fighter, amount) {
    amount >= 28 ? sfx.crit() : sfx.hit();   // big numbers get the crunchy crit sound
    fighter.classList.remove("hit");
    void fighter.offsetWidth;
    fighter.classList.add("hit");
    floatText(fighter, `−${amount}`);
  }

  async function finish(won) {
    if (!alive) return;
    setButtons(false);
    stopMusic();   // the music cuts on the K.O.
    await koSplash(won);
    if (!alive) return;
    if (won) {
      log(`${j.boss} has 0 HP left. HR is drafting your offer…`);
      S.set({ currentJob: j.id });
      // The win moment: memes slam onto the screen faster and faster, then "OFFER UNLOCKED"
      if (hasGsap && !reducedMotion()) await memeSlam({ finale: FIGHT_TEXT.slamFinale });
      else { confetti(60); await sleep(1500); }
      if (alive) go("/offer");
    } else {
      log("your aura has been fully depleted. womp womp.");
      await sleep(600);
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
      if (!move.ult) addMeter(dmg);
    }
    if (r.self) { you = Math.max(0, you - r.self); hit(me, r.self); addMeter(r.self * 0.8); }
    if (r.heal) { you = Math.min(YOUR_HP, you + r.heal); floatText(me, `+${r.heal}`, true); }
    if (r.effect) fx[r.effect] = true;
    log(text);
  }

  // HR's turn: a taunt, then an attack you can block with a timing tap
  async function bossTurn() {
    if (fx.stun) { fx.stun = false; log(FIGHT_TEXT.stunned(j.boss)); return; }
    const attack = pick([...j.attacks, ...BOSS_ATTACKS]);
    if (fx.dodge) { fx.dodge = false; log(`${j.boss} used ${attack.name}! ${FIGHT_TEXT.dodged}`); return; }

    await taunt(enemy, pick(BOSS_TAUNTS));
    if (!alive) return;
    log(`${j.boss} used ${attack.name}!`);
    const result = await blockQTE({ sweepMs: fx.rage ? RAGE_SWEEP : BLOCK_SWEEP, attack: `${j.boss} used ${attack.name}` });
    if (!alive) return;

    const dmg = Math.round(rand(attack.min, attack.max) * (fx.rage ? RAGE_MULT : 1) * BLOCK_DAMAGE[result]);
    if (result === "perfect") {
      sfx.ding();
      bossHp = Math.max(0, bossHp - FIGHT_TEXT.counter);   // a perfect block reflects some damage
      hit(enemy, FIGHT_TEXT.counter);
      addMeter(20);
      log(FIGHT_TEXT.block.perfect(j.boss));
    } else {
      you = Math.max(0, you - dmg);
      hit(me, dmg);
      addMeter(dmg * 0.8);
      log(`${attack.text} ${result === "good" ? FIGHT_TEXT.block.good : FIGHT_TEXT.block.miss}`);
    }
  }

  async function play(move) {
    if (busy || !alive) return;
    busy = true;
    setButtons(false);

    if (move.ult) { meter = 0; await ultFlash(move.name); if (!alive) return; }
    applyMove(move);
    paint();
    await sleep(1000);
    if (!alive) return;
    if (bossHp <= 0) return finish(true);
    if (you <= 0) return finish(false);

    // Low on HP? The boss gets angry once.
    if (!fx.rage && bossHp <= RAGE_AT) {
      fx.rage = true;
      sfx.rumble();
      setRage(true);   // final-round music: faster, with a lead on top
      log(FIGHT_TEXT.rage(j.boss));
      paint();
      await sleep(1100);
      if (!alive) return;
    }

    await bossTurn();
    if (!alive) return;
    paint();
    await sleep(900);
    if (!alive) return;
    if (bossHp <= 0) return finish(true);   // K.O. by perfect-block counter
    if (you <= 0) return finish(false);

    turn += 1;
    hand = deal();
    renderHand();
    busy = false;
  }

  // One listener for all move buttons, since the hand is re-rendered every turn
  movesEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".move");
    if (!btn) return;
    play(btn.dataset.id === "ult" ? ULT : hand.find((m) => m.id === btn.dataset.id));
  });

  renderHand();
  setButtons(false);
  paint();
  preloadMemes();   // so the win slam is instant

  // VS intro, then the music and the first turn
  (async () => {
    const s = S.get();
    await vsIntro({ youHTML: avatarHTML(s, "vs-av"), youName: s.name, bossName: j.boss });
    if (!alive) return;
    startMusic();
    busy = false;
    setButtons(true);
  })();

  return () => { alive = false; stopMusic(); document.querySelectorAll(".vs-intro, .ult-flash, .ko, .qte-full").forEach((el) => el.remove()); };
}
