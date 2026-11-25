// Tests for the share links and LinkedIn-ify. Run with: node --test tests/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { encodeChallenge, decodeChallenge } from "../js/share-card.js";
import { writePost } from "../js/linkedify.js";
import { scoreResume } from "../js/aura-engine.js";
import { DEMO_RESUMES, JOBS, HR_LEVELS } from "../js/data.js";

test("challenge links round-trip, and an edited link is flagged as cap", () => {
  const code = encodeChallenge({ name: "Riya Rizzvi", aura: 3980, tier: "certified linkedin sigma", color: "lilac" });
  const back = decodeChallenge(code);
  assert.equal(back.name, "Riya Rizzvi");
  assert.equal(back.aura, 3980);
  assert.equal(back.edited, false);

  const data = JSON.parse(Buffer.from(code.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
  data.a = 99999;
  const edited = Buffer.from(JSON.stringify(data)).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  assert.equal(decodeChallenge(edited).edited, true);
  assert.equal(decodeChallenge("garbage!!"), null);
});

test("LinkedIn-ify writes a post from the resume, and the same seed gives the same post", () => {
  const lines = scoreResume(DEMO_RESUMES.find((p) => p.id === "monk").lines.join("\n")).allLines;
  const post = writePost(lines, 3, 0);
  assert.equal(post, writePost(lines, 3, 0));
  assert.notEqual(post, writePost(lines, 3, 1));
  assert.match(post, /I'm hiring!! \(I'm not\.\)/);   // top voice has the hiring bait
  assert.match(post, /#\w+/);
  assert.ok(!/\*\*/.test(post), "**bold** markers are turned into unicode bold");
  assert.ok(writePost(lines, 1, 0).length < post.length, "humble is shorter than top voice");
});

test("every job is complete and has an HR level", () => {
  const ids = new Set();
  for (const j of JOBS) {
    for (const key of ["id", "title", "company", "logo", "color", "tags", "stipend", "reqs", "boss", "attacks", "taunts", "level"]) {
      assert.ok(j[key] !== undefined, `${j.id} is missing ${key}`);
    }
    assert.ok(HR_LEVELS[j.level], `${j.id} has an unknown level "${j.level}"`);
    assert.ok(!ids.has(j.id), `duplicate job id ${j.id}`);
    ids.add(j.id);
  }
});
