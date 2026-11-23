# AuraHire roadmap: next features (handoff doc)

This doc is the plan for AuraHire after the NEBULITH hackathon. It's written so a new chat (or a new person) can pick it up with no other context. Read `CLAUDE.md` first for the project brief; this doc covers what's been done since, how the owner likes to work, and the features planned next.

**Paste this to start a new chat:**

> Read `CLAUDE.md` and `docs/ROADMAP.md` in the aurahire.nebulith repo. We're building the features in the roadmap, in the order it suggests. Before changing anything, show me a plan for the feature and wait for my OK.

---

## 1. Where things stand (Nov 2026)

- **Hackathon:** submitted and graded; results pending. There are no deadlines now, so the goal is just to make the site better.
- **Live site:** https://aurahire-nebulith.vercel.app/. Vercel deploys automatically from the `main` branch on GitHub.
- **Repo:** https://github.com/manshacodes/aurahire.nebulith
- **How changes ship:** work on a branch → push → open a pull request → the owner clicks **Merge** on GitHub → Vercel redeploys within a minute or two.
- **Tech:** plain HTML/CSS/JS ES modules, no framework, no build step. GSAP and Lenis are in `vendor/`. A hash router, and all state in `localStorage`. All copy (jokes, roasts, lines) lives in `js/data.js`. See `CLAUDE.md` for every convention.

### Done since the hackathon submission (all merged and live)

**AuraGPT resume scorer rewrite** (`js/aura-engine.js`, PRs #1 and #2):
- Rejoins lines that wrap in a PDF, and drops headings, contact info, page footers and repeated name headers (`tidyLines`).
- Every signal on a line counts: the best good signal in full, extra good ones at 40%, and bad ones in full. A cap/nepo/glaze/larp flag keeps only a quarter of the good points.
- Career signals weigh the most (internship 350, win 450, open source 320, CP 200, rating 180), so a first-year with lots of projects ranks below an SDE intern or a DSA monk.
- **Societies are graded one by one** (`contextPass` → `scoreSociety`):
  - by role: leader 300 (a W), title 110 with something listed under it or 50 with nothing, maker role 90, member 20
  - +60 for big-name societies (TEDx, Microsoft, GDSC, coding, robotics, game dev…)
  - +70 for building something there, +20 for posts or decks
  - with 5+ societies, the best 4 count in full and the extras are taxed: big-name or built-something keeps 60%; a title with nothing listed under it is −50; a few posts is +10; a plain membership with nothing to show is LARP −100
- Repeated flexes: the 3rd use of the same flex is worth 85%, the 4th 72%…
- The scan shows 14 lines with the **same W/BASED/MID/L mix as the whole resume** (`pickLines`). The breakdown meters read the **whole** resume (`state.allLines`).
- Verdicts: W ≥300, BASED ≥100, L ≤−100, else MID. `verdictOf` / `toneOf` / `isW` / `isCrashOut` are exported helpers.
- **MID shows grey** everywhere (scan tag, highlight, flying number, a "meh" orb, roast-a-friend, friend profiles).
- Tiers: npc <1800 · unc energy 1800 · aura farmer 2800 · certified linkedin sigma 3300 · mogging the whole batch 4700 · placement cell's final boss 5200.
- All the **original roasts are kept word for word**, at their old frequency ("under investigation", "title farming", "they were 2 hrs long, twin", "N clubs is physically impossible"…). Hackathon lines say "showed up. respect, kind of." (the owner chose this over "grind acknowledged").
- Reference results: the owner's own resume scores **4,606, certified linkedin sigma**. An SDE intern scores 5,262, the dsa monk demo 5,220, and the club president demo 3,535 (with 2 Ws on club lines).

**HR boss fight** (`js/screens/boss.js`, `js/fight-fx.js`, PR #2):
- It was too easy: aura farm (2×) + the ultimate one-shot HR, so a sensible player won 100% of the time.
- Now:
  - **Ultimate:** 30–40 dmg, once per fight, and aura farm can't double it.
  - **Meter:** fills at 0.5× damage dealt, 0.6× damage taken, and +15 per perfect block.
  - **HR:** 120 HP, and its attacks hit 1.45× the numbers in `data.js`.
  - **HR specials** (30% of HR's turns): TAKE-HOME ASSIGNMENT (6 HP a turn for 3 turns) and GHOSTING (your next attack misses).
  - **Chai break:** +20 HP once, when rage mode starts.
- Tuned with a 20,000-fight Monte Carlo simulation: a **normal player wins about 61%** (52–71% depending on blocking skill). This was the owner's target: "win about 6 in 10".
- **HR talks back:** a big typed-out comic speech bubble (HR's mouth moves, tap to skip).
  - It reacts to every move, with different lines when the move lands or flops (`HR_LINES.reactions`).
  - It also has lines for the ultimate, attacking while ghosted, perfect blocks, rage, and low HP for HR or for you.
  - Each of the 12 HRs has its own `taunts` in `JOBS`.

---

## 2. How the owner likes to work (important)

- **Never change anything without running it by her first.** For every feature: investigate, then show a plan in plain language (what changes, which files, examples), then wait for "go". Small tweaks to an approved plan also get shown first.
- Explain things simply, without jargon. She's a first-year BTech student and she's building this to learn and show off.
- **Test before saying it works.** The habits that worked:
  - For anything with numbers (scoring, fight balance): write a quick Node script that imports the real modules from `js/` and runs many cases (12 sample resumes, or 20,000 simulated fights), and show a before/after table.
  - For UI: a Playwright script (`require('playwright')` works in the cloud sandbox) at 390px (phone) and 1440px (desktop). Check for console errors and take screenshots.
- Keep the humour: lowercase, deadpan, chronically online (see "Tone and slang" in `CLAUDE.md`). **Don't remove or reword existing jokes** without asking. New copy goes in `data.js`.
- Keep the scoring honest but not harsh. She pushed back when MIDs took over and when her real work (Lurk, a scraper with 169 tests) got Ls.
- She likes pull requests she can merge herself.

---

## 3. Planned features

Suggested order: **A → B → C → D → E**, then **F** and **G** later. Each one is independent once A exists.

### A. Shareable aura card + "beat my aura" challenge link (build these together) — ✅ DONE

Built as planned: `js/share-card.js` + `js/screens/vs.js`. The owner chose portrait 4:5, all 6 meters on the card, and the fight result card later. Tested in all 5 vibes and end to end (challenge link → scan → head-to-head; an edited link shows "that's cap"; a broken one goes home). The original plan is kept below for reference.

**What it is**
- A **"share my aura"** button on the score page (next to "copy my flex"). It makes an image, a card with:
  - your name (with the AuraGPT surname) and profile circle
  - your aura score and tier
  - your best line and worst line, with their stamps
  - 3 of the breakdown meters
  - the site URL and a challenge link
- The card uses the current vibe's colours.
- On phones it opens the share sheet (WhatsApp, Instagram…) with the image + link. On desktop it downloads the image and copies the link.
- The **challenge link** carries your score: when a friend opens it, they see "Mansha challenged you: +4,606 aura (certified linkedin sigma). think you can mog that?" → they scan their own resume → the score page shows a head-to-head ("you got mogged by 1,200 aura" / "you mogged them"). They can then share back.

**How to build it (proposal)**
- **Image:** draw the card on a `<canvas>` by hand (about 1080×1350, Instagram portrait). No library needed. Read the colours from the CSS variables with `getComputedStyle(document.documentElement)`. Fonts are already loaded (Inter, Space Grotesk), so call `document.fonts.ready` before drawing. Meme sticker images can be drawn with `drawImage` (same origin, so no canvas tainting).
- **Share:** use `navigator.canShare({ files: [file] })` → `navigator.share({ files, text, url })`. If that's not supported, download with an `<a download>` link from `canvas.toBlob`, plus `navigator.clipboard.writeText(link)`. Wrap it all in try/catch; a user cancelling the share is not an error.
- **Challenge link:** a new route `#/vs/:code`. The router already supports params (`route("/vs/:code", …)` in `js/main.js`).
  - `code` is a small URL-safe encoding of `{ name, aura, tier }`, using base64url of a short JSON (keep it small; no resume text, for privacy).
  - New screen `js/screens/vs.js`: shows the challenger, then a "scan my resume" button that saves `state.challenge = { name, aura }` and goes to `#/upload`.
  - On the score screen: if `state.challenge` is set, show a head-to-head card (bars like the existing "mog check" in `friend.js`), then clear it.
  - Anyone can edit the link to fake a score. That's fine for a joke site (maybe even make a joke about it: "edited the link? that's cap.").
- **Files:**
  - new: `js/share-card.js` (draw + share), `js/screens/vs.js`
  - edit: `js/screens/score.js`, `js/main.js` (route), `js/state.js` (`challenge` default), `js/data.js` (all copy), `css/screens.css`
- **Copy ideas:** button "share my aura"; challenge headline "{name} has +4,606 aura. you? probably not."; results "mogged." / "got mogged." / "dead even. 6-7.".
- **Test:**
  - The card renders in all 5 vibes (take screenshots of the canvas).
  - The challenge link round-trips: open the link → scan a demo persona → see the head-to-head.
  - Phone and desktop.

**Open questions for the owner**
- Which 3 meters go on the card?
- Square or portrait image?
- Should the fight result also be shareable later ("hired by Tralalero Tralala in 9 turns" / "ghosted by recruiter karen")?

### B. Your resume powers your fight moves — ✅ DONE

Built: `perksFor()` in `aura-engine.js`, `PERK_MOVES` / `PERK_TEXT` in `data.js`, the hand logic in `boss.js`, and the list on the score page. Moves are weaker than first sketched below and appear about 30% of turns. The owner asked for the fight to be harder overall at the same time: HR 135 HP, specials 35%, quick learner heals 16, perfect-block counter 5, chai +25. Simulated win rates for a normal player: 38% with no moves, 40% with the owner's resume, 45% with an intern/winner resume. Also added an HR record on the profile. The copy says "your resume unlocked these fight moves" and never promises the fight is easier (the owner's call). The original sketch is kept below for reference.

**What it is:** what AuraGPT found in your resume unlocks special moves in the HR fight. They're added to the move pool (not guaranteed each turn), so your real resume changes how the fight plays. This ties the two halves of the site together.

**Example unlocks** (the signal from the scorer → the move):
- robotics / hardware → **"bring the robot arm"**: solid damage, and HR is "intimidated" (skips its special next turn)
- 50+ tests → **"169 tests"**: a shield that blocks the next take-home tick or attack
- live / deployed project → **"send the live link"**: reliable damage ("it actually works. HR is confused.")
- CP / DSA → **"solve it in O(n)"**: high damage if you pass a tiny timing tap
- internship → **"previous company name-drop"**: big damage
- 5+ societies → **"core member of 7 clubs"**: random effect each time (larping)
- nepo → **"call uncle"**: huge damage, but HR roasts you and you lose aura
- glaze words in your resume → **"passionate team player"**: does 1 damage (a joke move)

**How to build it (proposal)**
- In `aura-engine.js`, export a `perksFor(allLines)` that returns perk ids from the signals already detected (reuse the same regexes / `kind`s; don't duplicate logic).
- Save the perks in state at the end of the scan (`state.perks`). Show them on the score page as "unlocked fight moves" stickers so people know.
- In `boss.js`, `deal()` adds the unlocked moves to the pool. The moves live in `data.js` next to `MOVES`, in the same shape (`{ id, name, hint, run }`), plus HR reaction lines in `HR_LINES.reactions`.
- **Re-run the fight simulation** with perks so the win rate stays about 6 in 10. Perks should help, not guarantee a win. A demo persona with no perks shouldn't be punished.

**Open questions:** which unlocks, and how strong they should be.

### C. "Fix my L": tips to turn L/MID lines into Ws

**What it is:** tap any L or MID line (on the scan result, the score page's worst line, or roast-a-friend) to see a short, funny but genuinely useful tip and an example rewrite. For example:
- "add a number. 'built a website' → 'built a website used by 300 students'"
- "say what it does, not what you used"
- "a list of tools isn't an achievement; tie them to a project"
- "you're a member of 7 societies. list the 2 where you did something."

**How to build it:** each signal in `aura-engine.js` (or its roast) maps to a tip id. Tips and examples live in `data.js` (`FIX_TIPS`). Lines with no matching signal get a generic tip ("lead with a verb, end with a number"). Show it as a small expandable panel under the line. No new scoring logic.

### D. LinkedIn-ify my resume — ✅ DONE

Built in `js/linkedify.js` with all copy in `LINKEDIFY` (data.js). The owner asked for it to be much funnier than the first sketch, so it got 3 cringe levels, every LinkedIn trope, fake reactions and a fake comments section. It's on the score page and roast-a-friend. The original sketch is kept below.

**What it is:** a button that turns your resume lines into peak cringe LinkedIn speak, with a copy button.
- "Built an exam notice scraper" → "Humbled to share that I single-handedly disrupted the exam notification space 🚀 #grateful"
- "Media team member, Rotaract" → "Proud to serve as a Media Visionary at Rotaract, where I learned 7 lessons about leadership 🙏"

**How to build it:** a template system in `data.js`:
- openers ("humbled to share", "thrilled to announce"), verb upgrades (built → "architected", member → "visionary"), hashtag and emoji pools
- pick per line with the seeded `hash()` already in `aura-engine.js`, so it's repeatable
- it could live on the score page or the post generator in `offer.js`

Pure comedy, small.

### E. Resume vs resume

**What it is:** two resumes side by side (yours vs a friend's from "roast a friend", or two pasted ones), compared category by category (projects, societies, career signals, Ls), with a winner and a roast for each section. It reuses `scoreResume` and the friend data already in `state.friends` (`#/f/:id`), and could be a "compare with me" button on a friend profile.

### F. Global leaderboard (later; the owner really wants this)

**What it is:** a real shared leaderboard (for example "top aura at IGDTUW") instead of the mock classmates on `#/people`.

**What it needs:** a small backend. Everything is currently in each person's own browser.
- **Options:** Supabase (free Postgres + a REST API, callable straight from the browser with row-level security) or Vercel KV / a Vercel serverless function.
- **Things to decide:**
  - What gets stored: just name + aura + tier. **Never resume text** (privacy).
  - How to stop fake scores: anyone can POST a number. Options: accept it as a joke, rate-limit, or recompute the score server-side from the resume (heavier).
  - Moderation for names.
  - A college/batch filter.
  - Opt-in: a "post my aura to the leaderboard" button, never automatic.
- This breaks the "no backend" rule in `CLAUDE.md`. That was a hackathon constraint, so it's fine to change now, but update `CLAUDE.md` when it happens.

---

### G. Not just BTech: personalise the site for other degrees (later)

**Why:** right now everything assumes a BTech/CSE student: the job listings (SDE-1, prompt engineer…), the 5 mock classmates in "the batch", the HR chat questions, the boss attacks ("IS THIS YOUR FINAL CGPA?"), the demo personas and most AuraGPT signals (LeetCode, GitHub, hackathons). The owner wants BBA, B.Com, design, law, medical, arts, science and other students to get a version that roasts *their* world.

**What exists already:** `eduFacts(resume)` in `js/aura-engine.js` detects the branch and degree (B.Tech branches, plus BCA, BBA, B.Com, B.Sc, B.Des, B.Arch, BA, MBA, MCA, M.Tech) and the grad year. It drives the profile headline today ("CSE-AI '30"). It's the natural place to derive a **sector**.

**Proposal**
1. **Sectors:** `tech` (default, today's content), `business` (BBA, B.Com, MBA), `design` (B.Des, B.Arch, fine arts), `law`, `medical`, `science` (B.Sc), `arts` (BA, humanities). Map each degree/branch to a sector, and let people pick or override it on the upload screen ("not a btech? pick your world"), since many resumes won't say.
2. **Content per sector in `data.js`,** keeping today's content as `tech`:
   - **Job listings + HR bosses.** business: "brand strategy intern (unpaid, but it's for the brand)" at a D2C startup, boss "the LinkedIn growth coach"; design: "junior designer (must know 14 tools)", boss "the client who wants it to pop"; law: "legal intern (photocopy division)", boss "senior partner who bills in 6-minute units"; medical: "intern on a 36-hour shift", boss "the HOD on rounds".
   - **The batch** (`#/people`): 5 mock classmates per sector.
   - **HR chat questions:** "walk me through your case competition", "why law? and don't say Suits".
   - **Boss attacks and HR lines** per sector (keep the shared generic ones).
   - **Demo personas** for each sector (the case competition tourist, the moot court monk, the Behance portfolio larper…).
3. **AuraGPT signals per sector,** added alongside the tech ones so mixed resumes still work:
   - business: case competitions, CFA/CA levels, internships at the Big 4, "managed ₹X budget", marketing campaigns with numbers
   - design: portfolio links, Behance/Dribbble, clients, exhibitions
   - law: moot courts, MUNs, publications, internships at firms/chambers
   - science/medical: research papers, labs, olympiads, NEET/AIIMS mentions
   - Re-run the multi-resume benchmark per sector so tiers stay fair across sectors (a strong BBA resume should be able to reach the top tier).
4. **Keep it one site:** the same screens and flow; only the copy and data swap by `state.sector`. A sector switcher on the profile page.

**Open questions for the owner:** which sectors first (probably business + design), whether people pick their sector or it's auto-detected (or both), and whether rivals from other sectors can appear in the batch.

## 4. Other ideas we discussed (not chosen yet)

- **Offer letter collection:** a wall of the 12 companies showing which you've beaten, lost to or not fought, plus badges.
- **Secret final boss:** "the placement cell", unlocked after beating 5 companies.
- **Daily challenge:** the same HR boss and moves for everyone each day, with streaks.
- **Achievements:** pop-ups ("first W", "survived a take-home", "asked about salary 5 times").
- **Liquid glass vibe:** a 6th theme (see `CLAUDE.md`, "Next up" #2).
- **Visitor stats:** turn on Vercel Web Analytics in the Vercel dashboard (Analytics tab), and add `<script defer src="/_vercel/insights/script.js"></script>` before `</body>` in `index.html`. Hash routes may only count as home page views.
- **Phone polish pass:** tap targets, swipe feel, and the fight in all 5 vibes. HR's speech bubble covers HR's HP bar for a second or two while it talks.
- **Profile headline bug (fixed):** the profile always said "CSE '29". It now reads the branch and grad year from the resume with `eduFacts` (e.g. "CSE-AI '30"), and shows "branch: vibes '??" when they're not there.
- **Housekeeping:** `CLAUDE.md` still says the upload screen only accepts `.txt` (PDF works). The README's features section predates the scorer rewrite and the fight changes.
