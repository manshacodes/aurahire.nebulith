// AuraGPT regression tests. Run with: node --test tests/*.test.mjs
// They lock in the scores we tuned by hand, so a future change can't silently break the scorer.
// If you change scoring on purpose, update the expected numbers here in the same commit.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { scoreResume, scoreLine, tidyLines, tierFor, eduFacts, perksFor, toneOf, verdictOf, stampFor } from "../js/aura-engine.js";
import { DEMO_RESUMES } from "../js/data.js";

const persona = (id) => DEMO_RESUMES.find((p) => p.id === id).lines.join("\n");
const fixture = (name) => readFileSync(new URL(`./fixtures/${name}.txt`, import.meta.url), "utf8");

test("demo personas keep their tuned scores", () => {
  const expected = { tourist: 2685, nepo: 1505, monk: 5220, lunatic: 2535, founder: 2715, president: 3795 };
  for (const [id, total] of Object.entries(expected)) assert.equal(scoreResume(persona(id)).total, total, id);
});

test("sample resumes keep their tuned scores", () => {
  const expected = { avg: 3284, sde: 5262, designer: 3980, hopper: 2780, aibro: 2255 };
  for (const [name, total] of Object.entries(expected)) assert.equal(scoreResume(fixture(name)).total, total, name);
});

test("a strong resume beats a padded one", () => {
  const sde = scoreResume(fixture("sde")).total;
  assert.ok(sde > scoreResume(fixture("hopper")).total);
  assert.ok(sde > scoreResume(fixture("aibro")).total);
  assert.equal(tierFor(scoreResume(persona("nepo")).total).name, "certified npc");   // nepotism stays harsh
});

test("the linkedin lunatic: sketchy-but-real lines are MIDs, real cap is an L", () => {
  const lines = scoreResume(persona("lunatic")).allLines;
  const line = (start) => lines.find((l) => l.text.startsWith(start));
  assert.equal(line("LinkedIn Top Voice").points, -250);
  assert.equal(line("LinkedIn Top Voice").kind, "cap");
  assert.equal(toneOf(line("Completed 47 Coursera")), "mid");
  assert.equal(line("Completed 47 Coursera").points, -20);
  assert.equal(stampFor(line("Hello World in 12")).at(0), "L");        // small, but stamped L (it's basic)
  assert.equal(stampFor(line("Participated in 22")).at(0), "TOURIST");
  assert.equal(toneOf(line("Participated in 22")), "mid");
});

test("verdicts and colours", () => {
  assert.equal(verdictOf(300), "W");
  assert.equal(verdictOf(120), "BASED");
  assert.equal(verdictOf(80), "MID");
  assert.equal(verdictOf(-100), "L");
  assert.equal(toneOf({ points: 80 }), "mid");   // a positive MID is grey, not green
  assert.equal(toneOf({ points: 150 }), "good");
});

test("tidyLines rejoins wrapped PDF lines and drops headings, contact info and page footers", () => {
  const raw = [
    "Jane Doe", "jane@example.com · github.com/jane", "Projects",
    "Built an exam notice tracker that scrapes boards and sorts notices into JEE, NEET,",
    "Class 10 and Class 12.", "Page 1 of 2",
  ];
  const lines = tidyLines(raw);
  assert.ok(lines.some((l) => l.includes("NEET, Class 10 and Class 12.")), "wrapped line was rejoined");
  assert.ok(!lines.some((l) => /@|Page 1|^Projects$/.test(l)), "contact, footer and heading dropped");
});

test("scoreLine stacks real work into a W", () => {
  const r = scoreLine("Runs serverless: a GitHub Actions cron job scrapes every 30 minutes; covered by 169 automated tests.");
  assert.ok(r.points >= 300, `got ${r.points}`);
});

test("eduFacts reads branch and grad year, and ignores clubs", () => {
  const now = new Date("2026-11-17");
  const label = (t) => { const e = eduFacts(t, now); return `${e.branch || e.degree} '${String(e.gradYear).slice(-2)}`; };
  assert.equal(label("B.Tech, Computer Science & Engineering (Artificial Intelligence) · 2026 – 2030 (expected)"), "CSE-AI '30");
  assert.equal(label("Rohan\nECE, 3rd year, NSUT"), "ECE '28");
  assert.equal(label("BBA (final year), some college"), "BBA '27");
  assert.equal(eduFacts("Member, Computer Science Club", now).branch, null);
});

test("perksFor: resume moves, and flagged lines don't unlock the good ones", () => {
  assert.deepEqual(perksFor(scoreResume(persona("monk")).allLines), ["winner", "intern", "prs", "algo"]);
  const tourist = perksFor(scoreResume(persona("tourist")).allLines);
  assert.ok(!tourist.includes("winner"), "won SIH (internal round) is not a win");
  assert.ok(tourist.includes("uncle"));
});
