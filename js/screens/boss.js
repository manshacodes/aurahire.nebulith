// The HR boss fight, fighting-game style:
// VS intro → ROUND 1 → FIGHT! → you pick a move from a reshuffled hand → HR taunts and attacks,
// and you can BLOCK it with a timing tap → repeat until someone is K.O.
// An aura meter fills as you deal and take damage; when full it unlocks the AURA FARM ULTIMATE (once per fight).
// Sometimes HR uses a special instead of attacking: a take-home assignment (damage over 3 turns)
// or ghosting (your next attack misses). At rage mode HR takes one chai break (+20 hp).
// Your resume can unlock special moves (PERK_MOVES); one shows up in your hand about 30% of turns.
// Tuned with a simulation: a "normal" simulated player wins about 4 in 10 (real people do better),
// and a strong resume only adds a few percent.
import { go } from "../router.js";
import * as S from "../state.js";
import { $, esc, pick, rand, sleep, floatText, confetti, reducedMotion } from "../fx.js";
import { JOBS, MOVES, BOSS_ATTACKS, YOUR_HP, FIGHT_TEXT, BOSS_TAUNTS, HR_LINES, PERK_MOVES, levelOf } from "../data.js";
import { perksFor } from "../aura-engine.js";
import { hasGsap } from "../motion.js";
import { memeSlam, preloadMemes } from "../slam.js";
import { sfx } from "../sound.js";
import { startMusic, stopMusic, setRage } from "../music.js";
import { vsIntro, taunt, blockQTE, ultFlash, koSplash } from "../fight-fx.js";
import { avatarHTML } from "../identity.js";

const HAND = 3;            // random moves dealt per turn (plus "ask about salary")
const RAGE_AT = 40;        // boss HP that triggers rage mode
const RAGE_MULT = 1.3;     // rage attacks hit this much harder
const SPECIAL_CHANCE = 0.35;           // how often HR uses a special move instead of attacking
const TAKEHOME = { dmg: 6, turns: 3 }; // take-home assignment: 6 hp a turn for 3 turns
const CHAI_HEAL = 25;                  // HR's one chai break when rage mode starts
const PERK_CHANCE = 0.3;               // how often one of your resume moves is in your hand
// Aura meter: how much each source fills it
const METER_DEALT = 0.5, METER_TAKEN = 0.6, METER_PERFECT = 15;
const LOW_BOSS = 30, LOW_YOU = 35;     // hp at which HR's "low hp" lines kick in (once each)
const TAUNT_CHANCE = 0.4;              // how often HR also talks trash before attacking (only if it didn't just react)
const METER_MAX = 100;     // aura meter: full = ultimate unlocked
const BLOCK_SWEEP = 900, RAGE_SWEEP = 750;     // how long the block marker takes to cross (ms), faster in rage mode
const BLOCK_DAMAGE = { perfect: 0, good: 0.5, miss: 1, none: 1 };
// The block minigame doesn't come on every attack: always on HR's first one (so you learn it),
// then about 1 in 3, never twice in a row, and at least once every 4 attacks.
const BLOCK_CHANCE = 0.25, BLOCK_AT_LEAST_EVERY = 4;

// The ultimate is a move like the others, so it uses the same code path
const ULT = { id: "ult", name: FIGHT_TEXT.ult.name, hint: FIGHT_TEXT.ult.hint, ult: true, run: () => ({ dmg: rand(30, 40), text: FIGHT_TEXT.ult.text }) };

// Deal a fresh hand: 3 random moves + the cursed salary button.
// Sometimes one of the 3 is swapped for a move your resume unlocked.
function deal(perks) {
  const pool = MOVES.filter((m) => m.id !== "salary").sort(() => Math.random() - 0.5);
  const hand = pool.slice(0, HAND);
  if (perks.length && Math.random() < PERK_CHANCE) hand[rand(0, HAND - 1)] = pick(perks);
  return [...hand, MOVES.find((m) => m.id === "salary")];
}

// Your resume moves, as move objects (older saves didn't store perks, so work them out)
function myPerks() {
  const s = S.get();
  const ids = s.perks?.length ? s.perks : perksFor(s.allLines || []);
  return ids.filter((id) => PERK_MOVES[id]).map((id) => ({ id, perk: true, ...PERK_MOVES[id] }));
}

export default function boss(root, { id }) {
  const j = JOBS.find((x) => x.id === id) || JOBS[0];
  // How tough this HR is depends on the job (HR_LEVELS in data.js): its hp and how hard it hits
  const level = levelOf(j), BOSS_HP = level.hp, ATK_MULT = level.atk;
  let bossHp = BOSS_HP, you = YOUR_HP, busy = true, alive = true, turn = 1, meter = 0;
  let attacks = 0, sinceBlock = 0;   // for deciding when the block minigame shows up
  let ultUsed = false, chaiUsed = false, takehome = 0;   // takehome = turns of take-home damage left
  const perks = myPerks();
  // Status effects: dodge (block next attack), charge (2× next hit), stun (boss skips a turn), rage,
  // ghost (HR is ghosting you: your next attack misses)
  // scared (HR can't use a special next turn, from the robot arm)
  const fx = { dodge: false, charge: false, stun: false, rage: false, ghost: false, scared: false };
  const ultReady = () => meter >= METER_MAX && !ultUsed;
  const said = { lowBoss: false, lowYou: false };   // the one-off "low hp" lines
  let reacted = false;                              // HR already said something this turn
  const say = (text) => taunt(enemy, text);

  // What HR says after your move: about that move, whether it landed or flopped
  function reactionTo(move, r, ghosted) {
    if (ghosted) return pick(HR_LINES.ghosted);
    if (move.ult) return pick(HR_LINES.ult);
    const lines = HR_LINES.reactions[move.id];
    if (!lines) return null;
    const flopped = r.self || (r.dmg && r.dmg <= 8 && !r.effect);   // backfired, or a tiny hit
    return pick((flopped && lines.bad) || lines.good || lines.bad);
  }

  // What HR says right before attacking: a "low hp" line once, else sometimes its own trash talk
  function tauntLine() {
    if (!said.lowBoss && bossHp <= LOW_BOSS) { said.lowBoss = true; return pick(HR_LINES.lowBoss); }
    if (!said.lowYou && you <= LOW_YOU) { said.lowYou = true; return pick(HR_LINES.lowYou); }
    if (reacted || Math.random() > TAUNT_CHANCE) return null;   // one random line per turn is plenty
    return j.taunts && Math.random() < 0.6 ? pick(j.taunts) : pick(BOSS_TAUNTS);
  }
  let hand = deal(perks);

  root.innerHTML = `
    <section class="boss">
      <p class="label">applying = boss fight · a wild ${esc(j.boss)} appeared!</p>
      <div class="split"><div class="split-main">
      <div class="card arena" id="arena">
        <div class="fighter" id="enemy">
          <div class="hpcard"><b>${esc(j.boss)}</b><small>${esc(level.label)}</small><div class="hp"><span id="bossHp"></span></div><div class="fx-row" id="bossFx"></div></div>
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
    const cards = ultReady() ? [ULT, ...hand] : hand;
    $("#turnLabel", root).textContent = ultReady() ? FIGHT_TEXT.ultReady
      : `turn ${turn} · ${ultUsed ? FIGHT_TEXT.ultSpent : "your hand reshuffles every turn"}`;
    movesEl.innerHTML = cards.map((m) => `<button class="move${m.ult ? " move-ult" : ""}${m.perk ? " move-perk" : ""}" data-id="${m.id}">${m.perk ? `<i class="perk-tag">${esc(FIGHT_TEXT.perkTag)}</i>` : ""}<b>${esc(m.name)}</b><small>${esc(m.hint)}</small></button>`).join("");
    movesEl.classList.remove("deal");
    void movesEl.offsetWidth;   // restart the deal animation
    movesEl.classList.add("deal");
  }

  function paint() {
    $("#bossHp", root).style.width = `${(bossHp / BOSS_HP) * 100}%`;
    $("#youHp", root).style.width = `${(you / YOUR_HP) * 100}%`;
    $("#youHpText", root).textContent = `lv.1 · ${you}/${YOUR_HP} hp`;
    $("#meter", root).style.width = `${(meter / METER_MAX) * 100}%`;
    $("#meter", root).parentElement.classList.toggle("full", ultReady());
    $("#meter", root).parentElement.classList.toggle("spent", ultUsed);
    const chip = (key) => `<span class="fx fx-${key}">${FIGHT_TEXT.fx[key]}</span>`;
    $("#youFx", root).innerHTML = ["dodge", "charge"].filter((k) => fx[k]).map(chip).join("") + (takehome ? chip("takehome") : "");
    $("#bossFx", root).innerHTML = ["stun", "rage", "ghost", "scared"].filter((k) => fx[k]).map(chip).join("");
  }

  const addMeter = (n) => { if (!ultUsed) meter = Math.min(METER_MAX, meter + n); };   // stops after the one ultimate

  function hit(fighter, amount) {
    amount >= 28 ? sfx.crit() : sfx.hit();   // big numbers get the crunchy crit sound
    fighter.classList.remove("hit");
    void fighter.offsetWidth;
    fighter.classList.add("hit");
    floatText(fighter, `−${amount}`);
  }

  async function finish(won) {
    if (!alive) return;
    const rec = S.get().record || { w: 0, l: 0 };
    S.set({ record: won ? { ...rec, w: rec.w + 1 } : { ...rec, l: rec.l + 1 } });   // HR record on your profile
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

  // Your move: apply damage, healing and effects. Returns what happened, for HR's reaction.
  function applyMove(move) {
    const r = move.run();
    let text = r.text, ghosted = false;
    if (r.dmg && fx.ghost) {
      ghosted = true;
      fx.ghost = false;                 // HR was ghosting you: the attack hits nothing
      text = FIGHT_TEXT.ghostWhiff;
    } else if (r.dmg) {
      let dmg = r.dmg;
      if (fx.charge && move.ult) text += ` ${FIGHT_TEXT.ultNoFarm}`;   // the 2× is saved for your next normal hit
      else if (fx.charge) { dmg *= 2; fx.charge = false; text += ` ${FIGHT_TEXT.charged(dmg)}`; }
      bossHp = Math.max(0, bossHp - dmg);
      hit(enemy, dmg);
      if (!move.ult) addMeter(dmg * METER_DEALT);
    }
    if (r.self) { you = Math.max(0, you - r.self); hit(me, r.self); addMeter(r.self * METER_TAKEN); }
    if (r.heal) { you = Math.min(YOUR_HP, you + r.heal); floatText(me, `+${r.heal}`, true); }
    if (r.effect) fx[r.effect] = true;
    log(text);
    return { r, ghosted };
  }

  // HR's turn: a taunt, then an attack you can block with a timing tap
  async function bossTurn() {
    if (fx.stun) { fx.stun = false; log(FIGHT_TEXT.stunned(j.boss)); return; }

    // Sometimes HR plays dirty instead of attacking
    const scared = fx.scared;
    fx.scared = false;   // the robot arm only scares HR for one turn
    if (!scared && Math.random() < SPECIAL_CHANCE) {
      const kind = pick(["takehome", "ghost"]);
      if (kind === "ghost" || takehome === 0) {
        const s = FIGHT_TEXT.special[kind];
        await taunt(enemy, `${s.name}!`);
        if (!alive) return;
        if (kind === "ghost") fx.ghost = true; else takehome = TAKEHOME.turns;
        sfx.rumble();
        log(`${j.boss} used ${s.name}! ${s.text}`);
        return;
      }
    }

    const attack = pick([...j.attacks, ...BOSS_ATTACKS]);
    if (fx.dodge) { fx.dodge = false; log(`${j.boss} used ${attack.name}! ${FIGHT_TEXT.dodged}`); return; }

    const line = tauntLine();
    if (line) { await say(line); if (!alive) return; }
    log(`${j.boss} used ${attack.name}!`);
    const offerBlock = attacks === 0 || (sinceBlock >= 1 && (Math.random() < BLOCK_CHANCE || sinceBlock >= BLOCK_AT_LEAST_EVERY - 1));
    attacks += 1;
    sinceBlock = offerBlock ? 0 : sinceBlock + 1;
    const result = offerBlock
      ? await blockQTE({ sweepMs: fx.rage ? RAGE_SWEEP : BLOCK_SWEEP, attack: `${j.boss} used ${attack.name}` })
      : "none";   // a normal attack: no minigame, full damage
    if (!alive) return;

    const dmg = Math.round(rand(attack.min, attack.max) * ATK_MULT * (fx.rage ? RAGE_MULT : 1) * BLOCK_DAMAGE[result]);
    if (result === "perfect") {
      sfx.ding();
      bossHp = Math.max(0, bossHp - FIGHT_TEXT.counter);   // a perfect block reflects some damage
      hit(enemy, FIGHT_TEXT.counter);
      addMeter(METER_PERFECT);
      log(FIGHT_TEXT.block.perfect(j.boss));
      paint();
      await say(pick(HR_LINES.perfectBlock));
    } else {
      you = Math.max(0, you - dmg);
      hit(me, dmg);
      addMeter(dmg * METER_TAKEN);
      log(result === "none" ? `${j.boss} used ${attack.name}! ${attack.text}` : `${attack.text} ${result === "good" ? FIGHT_TEXT.block.good : FIGHT_TEXT.block.miss}`);
    }
  }

  async function play(move) {
    if (busy || !alive) return;
    busy = true;
    setButtons(false);

    if (move.ult) { meter = 0; ultUsed = true; await ultFlash(move.name); if (!alive) return; }
    const { r, ghosted } = applyMove(move);
    paint();
    if (bossHp <= 0) { await sleep(1000); return alive && finish(true); }
    // HR reacts to your move (this is also the pause before HR's turn)
    const reaction = reactionTo(move, r, ghosted);
    reacted = Boolean(reaction);
    if (reaction) await say(reaction); else await sleep(900);
    if (!alive) return;
    if (you <= 0) return finish(false);

    // Low on HP? The boss gets angry once, and takes one chai break.
    if (!fx.rage && bossHp <= RAGE_AT) {
      fx.rage = true;
      sfx.rumble();
      setRage(true);   // final-round music: faster, with a lead on top
      log(FIGHT_TEXT.rage(j.boss));
      paint();
      await say(pick(HR_LINES.rage));
      if (!alive) return;
      if (!chaiUsed) {
        chaiUsed = true;
        bossHp = Math.min(BOSS_HP, bossHp + CHAI_HEAL);
        floatText(enemy, `+${CHAI_HEAL}`, true);
        log(FIGHT_TEXT.chai(j.boss));
        paint();
        await sleep(1100);
        if (!alive) return;
      }
    }

    await bossTurn();
    if (!alive) return;
    paint();
    await sleep(900);
    if (!alive) return;
    if (bossHp <= 0) return finish(true);   // K.O. by perfect-block counter
    if (you <= 0) return finish(false);

    // The take-home assignment eats some hp every turn until it's "submitted"
    if (takehome > 0) {
      takehome -= 1;
      you = Math.max(0, you - TAKEHOME.dmg);
      hit(me, TAKEHOME.dmg);
      log(FIGHT_TEXT.takehomeTick(TAKEHOME.dmg, takehome));
      paint();
      await sleep(900);
      if (!alive) return;
      if (you <= 0) return finish(false);
    }

    turn += 1;
    hand = deal(perks);
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
    await vsIntro({ youHTML: avatarHTML(s, "vs-av"), youName: s.name, bossName: j.boss, level });
    if (!alive) return;
    startMusic();
    busy = false;
    setButtons(true);
  })();

  return () => { alive = false; stopMusic(); document.querySelectorAll(".vs-intro, .ult-flash, .ko, .qte-full").forEach((el) => el.remove()); };
}
