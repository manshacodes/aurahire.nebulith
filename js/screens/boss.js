import { go } from "../router.js";
import * as S from "../state.js";
import { $, $$, esc, pick, rand, sleep, floatText, confetti } from "../fx.js";
import { JOBS, MOVES, BOSS_ATTACKS, BOSS_HP, YOUR_HP } from "../data.js";

export default function boss(root, { id }) {
  const j = JOBS.find((x) => x.id === id) || JOBS[0];
  let bossHp = BOSS_HP, you = YOUR_HP, busy = false, alive = true;

  root.innerHTML = `
    <section class="boss">
      <p class="label">applying = boss fight · a wild ${esc(j.boss)} appeared!</p>
      <div class="card arena">
        <div class="fighter" id="enemy">
          <div class="hpcard"><b>${esc(j.boss)}</b><small>lv.99</small><div class="hp"><span id="bossHp"></span></div></div>
          <div class="avatar boss-av" aria-hidden="true"><span class="visor"></span><span class="mouth"></span></div>
        </div>
        <div class="fighter" id="me">
          <div class="avatar me-av">you</div>
          <div class="hpcard"><b>you</b><small>lv.1 · ${YOUR_HP} hp</small><div class="hp me"><span id="youHp"></span></div></div>
        </div>
      </div>
      <div class="card log" id="log" aria-live="polite">${esc(j.boss)} wants to know your expected stipend. choose wisely.</div>
      <div class="moves">
        ${MOVES.map((m) => `<button class="move" data-id="${m.id}"><b>${m.name}</b><small>${m.hint}</small></button>`).join("")}
      </div>
    </section>`;

  const log = (text) => { $("#log", root).textContent = text; };
  const enemy = $("#enemy", root), me = $("#me", root);
  const buttons = $$(".move", root);
  const setButtons = (on) => buttons.forEach((b) => { b.disabled = !on; });

  function paint() {
    $("#bossHp", root).style.width = `${(bossHp / BOSS_HP) * 100}%`;
    $("#youHp", root).style.width = `${(you / YOUR_HP) * 100}%`;
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
      confetti(60);
      S.set({ currentJob: j.id });
      await sleep(1500);
      if (alive) go("/offer");
    } else {
      log("your aura has been fully depleted. womp womp.");
      await sleep(1500);
      if (alive) go("/ghosted/lost");
    }
  }

  async function play(move) {
    if (busy || !alive) return;
    busy = true;
    setButtons(false);

    const r = move.run();
    log(r.text);
    if (r.dmg) { bossHp = Math.max(0, bossHp - r.dmg); hit(enemy, r.dmg); }
    if (r.self) { you = Math.max(0, you - r.self); hit(me, r.self); }
    paint();
    await sleep(1000);
    if (!alive) return;
    if (bossHp <= 0) return finish(true);
    if (you <= 0) return finish(false);

    // The boss strikes back
    const attack = pick([...j.attacks, ...BOSS_ATTACKS]);
    const dmg = rand(attack.min, attack.max);
    you = Math.max(0, you - dmg);
    log(`${j.boss} used ${attack.name}! ${attack.text}`);
    hit(me, dmg);
    paint();
    await sleep(1000);
    if (!alive) return;
    if (you <= 0) return finish(false);

    busy = false;
    setButtons(true);
  }

  buttons.forEach((b) => b.addEventListener("click", () => play(MOVES.find((m) => m.id === b.dataset.id))));
  paint();

  return () => { alive = false; };
}
