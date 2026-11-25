# CLAUDE.md: AuraHire project brief

Read this first. It explains what we're building, who it's for, how the code is organised, and what's left to do.

## What this is

**AuraHire** is a brainrot parody of a job portal (think student LinkedIn culture), built for **NEBULITH: The Brainrot Ideathon & Hackathon** by Celestial Biscuit, IGDTUW. We're entering **Track 2: SUPERNOVA, The Code Chaos** (development track).

**Tagline:** "stop applying. start aura farming."

**The joke:** BTech LinkedIn is a flex competition (14 hackathon participation certificates, core member of 6 clubs, "humbled and honoured" posts). AuraHire makes it official:
- your resume is rated in **aura points** by "AuraGPT"
- every job listing is a red flag ("Cracked Intern, zero yapping, unpaid")
- **applying is a boss fight** against HR
- HR only replies in **stickers**
- you pick **5 brainrot stickers** to describe yourself, dating-app style

**The brief's key line:** the goal is "not to create a random or cluttered interface" but to turn an unusual idea into a thoughtfully designed, engaging experience. Chaos in the *copy and interactions*; clarity in the *layout and user journey*.

## Hackathon rules that matter

**Submission (all required):**
1. Live deployed website URL (must stay public during evaluation)
2. Public GitHub repository with the source code
3. A short project description (concept + key features)
4. A 2-minute video showcasing the site

**Expected:** an original brainrot-inspired website, a creative and visually engaging UI, functional interactions, animations and transitions, a responsive layout across screen sizes, and full deployment.

**Judging (Track 2):**

| Criteria | Weight |
| --- | --- |
| Creativity and originality | 25% |
| Functionality and implementation | 25% |
| UI/UX and visual design | 20% |
| Code quality and structure | 15% |
| Deployment and responsiveness | 10% |
| Theme interpretation | 5% |

**Implications:**
- Features must *actually work*, not be faked.
- Code must stay clean, readable and explainable. The builder must be able to explain it to judges, so prefer simple and well-commented over clever.
- It must work well on phone and desktop.
- Originality counts: take *inspiration* from references, never copy designs or assets.

**Time budget:** about 12 hours total. Prioritise polish of what exists over adding lots of new things.

**Audience:** the judges are college seniors at IGDTUW, a chill, meme-literate crowd. Edgy slang is fine.

## Tech stack and constraints

- **Plain HTML, CSS and JavaScript (ES modules). No framework, no build step, no npm runtime dependencies.** Keep it that way unless there's a very strong reason.
- **GSAP 3.15** (core, ScrollTrigger, ScrambleTextPlugin) and **Lenis 1.3** are bundled locally in `vendor/` and loaded as globals in `index.html` (`window.gsap`, `window.ScrollTrigger`, `window.Lenis`). GSAP is free for everyone, including its plugins. More GSAP plugins can be copied from the npm `gsap` package's `dist/` folder.
- A **hash router** (`#/jobs`, `#/boss/ohio`), so it runs on any static host (GitHub Pages, Netlify, Vercel).
- **State** lives in `localStorage` via `js/state.js`, wrapped in try/catch.
- Fonts: Inter, Space Grotesk and Silkscreen from Google Fonts.
- Run locally with `python3 -m http.server 8000` (ES modules need a server; opening the file directly won't work).

## Project structure

```
index.html            app shell: topbar (logo, aura pill, vibe button), #screen, vibe sheet, toast
css/
  themes.css          design tokens for the 5 "vibes" (ALL colours, radii and fonts live here)
  base.css            reset, layout shell, type scale, buttons, toast, vibe sheet, background blobs
  components.css      stickers, bars, chips, stats, confetti, shake/float/typing helpers
  screens.css         per-screen styles
  landing.css         scroll-story landing page, custom cursor, 3D tilt
  desktop.css         tablet (768px+) and desktop (1024px+) layouts; screens use .split/.split-main/.split-side wrappers (display: contents on phones)
  intro.css           the fake LinkedIn intro (fixed palette on purpose)
js/
  main.js             entry: theme switching, aura pill, route table, withMotion() wrapper
  router.js           route(pattern, screen) + go(path); each screen returns an optional cleanup fn
  state.js            get / set / addAura / subscribe / reset, persisted to localStorage
  motion.js           Lenis + ScrollTrigger setup, scramble-text headings, springy cursor, tilt
  intro.js            the "LinkedIn gets crossed out" intro timeline
  identity.js         funny surname generator (surnameFor) + profile circle (avatarHTML)
  hold.js             reusable press-and-hold ring (used by Apply and Ghosted)
  hand.js             the "HR said:" shatter + hand flip-off overlay
  slam.js             the accelerating meme slam (boss fight win)
  sound.js            synthesized sound effects (Web Audio) + mute
  music.js            boss fight chiptune loop (speeds up in rage mode) + the victory jingle
  fight-fx.js         boss fight extras: VS intro, HR taunt bubble, block timing minigame, ultimate flash, K.O. splash
  resume-file.js      reads .txt and PDF resumes (pdf.js from cdnjs, loaded only when a PDF is picked) + auto-growing text boxes
  breakdown.js        the AuraGPT breakdown meters, shared by score, roast-a-friend and friend profiles
  share-card.js       "share my aura": draws a 1080×1350 card on a canvas in the current vibe (gradients included), shares it (share sheet, or download + copied link), and encodes/decodes "beat my aura" challenge links (#/vs/<code>: name, aura, tier, colour + a checksum; never resume text)
  linkedify.js        "LinkedIn-ify my resume": writePost() turns what AuraGPT found (scraper, tests, robotics, societies, cgpa, nepo…) into a peak cringe LinkedIn post at 3 cringe levels (humble / thought leader / top voice: fake-humble opener, sad-story hook, "3 things this taught me about B2B sales", @-tagging God, "I'm hiring!! (I'm not.)", unicode-bold words, hashtags); openLinkedify() shows it as a pop-up post card with a cringe dial, reroll, copy, a fake "post it", fake reactions and fake comments (HR unc: "we'll circle back"). All copy is LINKEDIFY in data.js
  aura.js             earn(id): aura for every action (AURA_EARN in data.js), "+N aura" pops, leaderboard overtakes
  memes.js            meme sticker <img> helper + mix/mixGroups for mixing memes with text stickers
  fx.js               $, $$, esc, toast, confetti, countUp, typewriter, shake, floatText, sticker()
  aura-engine.js      "AuraGPT": tidyLines() rejoins wrapped lines and drops headers; scoreLine() stacks signals (best in full, extras at 40%, bad ones in full); contextPass() grades each society by type, role and what you did there (5+ societies taxes the extras) and discounts repeated flexes; the scan shows 14 lines with the same W/BASED/MID/L mix as the whole resume; verdictOf/toneOf colour lines (MID is grey); "sketchy but real" lines are MIDs, not Ls (the owner's rule: be funny, not harsh): 10+ courses −20, 10+ hackathons −10 (grey TOURIST), LinkedIn flexing +50, MS Office +10; Hello World is a small −30 but stamped L (kind "basic"); real Ls are cap (−250), larping, glazing (−70) and nepotism; analyzeResume() gives the 0-10 breakdown from the whole resume
  data.js             ALL copy: jobs, stickers, slang, boss moves, HR chat replies, post templates
  screens/            one file per screen (see the flow below)
vendor/               gsap, ScrollTrigger, ScrambleTextPlugin, lenis (+ lenis.css)
assets/               no-thanks-i-use-ai.webp (meme used as a chat sticker, 11 KB), og.png (link preview image), stickers/ (image stickers)
tools/make_sticker.py turns any image into a die-cut sticker PNG (needs: pip install "rembg[cpu]" pillow)
tests/                aura-engine.test.mjs + features.test.mjs (node:test, no installs: `node --test tests/*.test.mjs`; they lock in the tuned scores, so update the numbers when you change scoring on purpose) and smoke.mjs (Playwright clicks through the main flow; needs a server, BASE=http://localhost:8765/). fixtures/ holds made-up resumes only: never commit the owner's real resume (public repo)
.github/workflows/ci.yml  syntax check + unit tests + smoke test on every push to main and every PR. No package.json on purpose (Vercel would try to build it)
vercel.json           week-long cache headers for assets/ and vendor/
robots.txt, sitemap.xml  SEO; OG/Twitter tags + JSON-LD live in index.html (og image: assets/og.png, 1200×630)
```

## User flow (screens)

**Intro (every page load, `js/intro.js` + `css/intro.css`):** a believable fake LinkedIn feed (the name in text, no real logo image) gets a red marker X, "nah.", stickers slapped on the posts, the post text scrambled into brainrot, a shake and grey-out, then an acid-lime circle wipe reveals AuraHire. Skippable, and replayable from the landing footer.

`#/` **home**: scroll-story landing page.
→ `#/upload`: type your first name (AuraGPT assigns a funny surname like "Grindwala", reroll-able), then paste your resume, upload a .txt (only .txt is accepted), or pick one of 6 demo personas (`DEMO_RESUMES` in data.js: hackathon tourist, nepo intern, dsa monk, linkedin lunatic, founder (19), club president), each tuned to land in a different aura tier.
→ `#/scan`: AuraGPT v6.7 judges line by line: a sticky HUD with a thinking orb (turns green or pink per verdict) and a live counter + sparkline, a terminal log of its "thoughts", a highlighter sweep on each line, verdict stamps slamming on (W, BASED, MID, L, CAP, NEPO, GLAZE, LARP, TOURIST), points flying into the counter, a shake on big Ls, confetti on big Ws, a "SCAN COMPLETE" stamp, and a skip button.
→ `#/score`: count-up, confetti, rank tier, roast, rizz / Ws / crash outs, best + worst line, and the **AuraGPT breakdown**: yap, nepo, delulu, grind, touch grass and cap, each 0-10 from signals in the resume (`SIGNALS` in aura-engine.js, copy in `FACTORS`), "copy my flex", **share my aura** (the share card; `SHARE_TEXT` in data.js), and **LinkedIn-ify my resume 🚀** (`js/linkedify.js`; also on roast-a-friend as "LinkedIn-ify their resume"). If you came from a friend's challenge link, a head-to-head card sits on top ("you mogged them by N" / "challenge them back").
→ `#/vs/:code` (`js/screens/vs.js`): a friend's "beat my aura" challenge: their score and tier, then "scan my resume" (or "use my last scan"); stores `state.challenge` for the score page. An edited link shows "that's cap"; a broken one goes home.
→ `#/stickers`: pick exactly 5 personality stickers (a 6th shakes: "this isn't 6-7, twin").
→ `#/jobs`: swipeable card stack (drag right to apply, left to ghost).
→ `#/job/:id`: details; the **Apply button runs from your cursor** (6 escapes with taunts on mouse, 3 on touch), then gives up and turns into a **"hold to apply" ring** (1.6s press-and-hold, inspired by zero.university's tap-hold; letting go early resets it with a roast).
→ `#/boss/:id`: turn-based fight (you have 120 HP). **HR difficulty depends on the job:** every job in `JOBS` has a `level` from `HR_LEVELS` in data.js, shown as a sticker on the job card, the job page, the VS intro and HR's HP card: 🌶️ chill HR (115 HP, attacks ×1.35, a simulated normal player wins ~61%), 🌶️🌶️ mid HR (130, ×1.42, ~44%), 🌶️🌶️🌶️ sweaty HR (140, ×1.48, ~33%), ☠️ final boss (150, ×1.5, ~24%, the ohio final boss). Across the original 12 jobs that's ~44%. There are 23 jobs: the original 12, 6 italian-brainrot ones (tung tung tung sahur, bombardiro crocodilo, brr brr patapim, chimpanzini bananini, lirili larila, cappuccino assassino) and 5 from other brainrot/slang trends (six seven data analyst, crash out coordinator, NPC streamer, lock in specialist, professional AI reel watcher at Fruit Love Island Productions). The owner cut a bedsheet consultant and a chief delulu officer (too close to chief vibe officer). **Resume moves:** `perksFor()` in aura-engine.js turns what AuraGPT found into up to 4 special moves (`PERK_MOVES` in data.js: winner cert, internship name-drop, merged PRs, O(n), test suite, live link, robot arm, portal redesign, 9+ cgpa, pitch deck, plus joke ones: "core member of every society", call uncle, "passionate team player"). They're saved as `state.perks` at the end of the scan, listed on the score page ("your resume unlocked these fight moves"), and one replaces a card in your hand about 30% of turns (tagged "from your resume"). A strong resume only adds a few percent to the win rate. Wins and losses are saved as `state.record` and shown on the profile ("HR record: 4W – 6L"). Each turn you're dealt a hand of 3 random moves from a pool of 11 (excel, hackathon cert crit, glaze, github link, "i'm a quick learner" heal (+16), fake wifi drop = dodge, "any questions for me?" = boss skips a turn, aura farm = 2× next hit, say 6-7 (rare 67 dmg), startup pitch, chatgpt live), plus "ask about salary", which is always there and always backfires. Status chips show under the HP bars, and below 40 HP the boss enters rage mode (+30% damage) and takes one chai break (+25 HP). About 35% of HR's turns are a special (skipped the turn after the robot arm "scares" HR) instead of an attack: TAKE-HOME ASSIGNMENT (6 HP a turn for 3 turns) or GHOSTING (your next attack misses; heals and effects still work).
→ win: the **meme slam** (`js/slam.js`): meme stickers slam onto the screen one by one, each gap 86% of the last (about 420ms down to 35ms), on a jittered grid until the screen is covered, then "OFFER UNLOCKED" slams on top with confetti. Skipped with reduced motion. Then `#/offer` (confetti, offer letter, typewriter "humbled and honoured" post generator, then the profile)
→ lose: `#/ghosted` (the app drains to grayscale; "HR is typing" forever; −800 aura). Losing the fight lands on `#/ghosted/lost`, which plays the **"HR said:" moment** automatically after a beat; the **"hold to check status" ring** replays it (`js/hand.js`): a dark red overlay, "HR said:" cracks and shatters into clip-path shards, and a hand slams up and flips you off, then "rejected. emotionally." with ok fair / get revenge buttons
**Tab bar** (bottom, on jobs / people / u / chat / rate / profile, shown by CSS via `body[data-route]`): swipe, the batch, hr chat, me. **Top-left profile circle** (LinkedIn style) links to your profile.
**Boss fight** is fighting-game style: a VS intro (ROUND 1 → FIGHT!), HR talks in a big typed-out speech bubble (tap to skip; lines in `HR_LINES` + each job's `taunts` in data.js): it reacts to every move you make (landed or flopped), to your ultimate, perfect blocks, rage mode and low HP, and sometimes trash-talks before attacking, a block timing bar (perfect = no damage + counter, good = half), an aura meter that unlocks the AURA FARM ULTIMATE (30–40 dmg, once per fight, can't be doubled by aura farm), and a K.O. splash. **Roast a friend** (`#/judge`, `#/f/:id`): judge anyone's resume (paste, .txt or PDF), then add them to the batch as a rival (`state.friends`). **Aura farming:** every action calls `earn(id)` (amounts and reasons in `AURA_EARN`), which shows a "+12 aura · reason" pop under the aura pill and toasts when you pass (or drop below) a classmate. **HR chat** is an interview: a random question from `HR_QUESTIONS` opens it, a new one comes every `HR_ASK_EVERY` messages, each with quick-reply chips and tailored answers. **Boss fight** has a looping chiptune track (rage mode speeds it up) and a victory jingle with the win confetti.
Side screens: `#/people` ("the batch": you + 5 mock classmates ranked by aura, with a climb card: your rank, aura needed to pass the next person, and how to farm aura), `#/u/:id` (a mock profile built for roasting: mog check, cap-or-fax votes on each resume line, a diss thread with a diss generator where they clap back, "larp as them" predicted posts, sticker reactions, connect/endorse; disses and votes persist in `state.social`), `#/rate` (drag-and-drop stickers onto a company, live rating bars), `#/chat` (sticker-only HR chatbot with keyword replies), `#/profile` (headline shows your branch + grad year read from your resume by `eduFacts` in aura-engine.js, e.g. "CSE-AI '30", or "branch: vibes '??"; profile circle colour + emoji picker, 5 stickers, editable name, post, clickable sticker reactions, reset).

**Landing page chapters** (`js/screens/home.js`, all GSAP ScrollTrigger):
1. Hero: scramble-text logo, parallax stickers scattered all over the hero (`data-speed`; the owner likes them everywhere, and the text sits on a layer above them so they never cover the words), the title lifts away on scroll.
2. A velocity marquee that skews and speeds up with scroll velocity.
3. "Your resume, rated in aura" (pinned): the counter scrubs 0 → 4,606 while 6 judged lines slide in, their points pop and their stamps (CAP, W, MID, LARP, NEPO, GLAZE) slam down, then the tier sticker lands, then two glassy **phone notifications** from "AuraHire" drop in under the text ("your aura card is ready ↗ +4,606…" for share your aura, "riya challenged you: +3,980…" for beat my aura; one line each on phones). The lines, real scores and notifications are `LANDING_SCORE` in data.js. On phones each line is just text + stamp, and short phones show 4 lines so the pinned card fits.
4. "Every listing is a red flag" (pinned): job cards flip away one by one (rotateX). Which 4 jobs show is `LANDING_JOBS` in data.js (cracked intern, italian brainrot intern, junior fanum tax officer, chief vibe officer).
5. "Applying is a boss fight" (pinned): HR's line types out (mouth moving), a TAKE-HOME ASSIGNMENT chip flashes, a "from your resume" move card flips in, the HP bar drains from 135, damage numbers pop, "OFFER UNLOCKED"; a **live-preview row** sits under the text: two lilac resume-move cards deal into a little preview box, then "your resume is your moveset" and an arrow (`LANDING_BOSS.moveset` in data.js). Short phones hide these two chapters' subtitles so the pinned cards fit.
6. "HR only replies in stickers": a sticker storm flies in and assembles into a wall.
7. "Pick your vibe" (`home-extras.js`): the 5 themes as live mini previews (each card has its own `data-theme`); tapping one really switches the site theme (`setTheme` in `js/theme.js`). Cards deal in on scroll.
8. "Everything else in the grind": a bento grid of 6 features (breakdown, roast the batch, meme HR chat, AuraGPT surname, profile circle, meme slam), each with a tiny demo and a link to the feature. Tiles pop in as they scroll into view (no pinning, cheap on phones). Share your aura, beat my aura and your resume moveset are *feature lines* in chapters 3 and 5, not extra tiles (the owner's call: keep the grid at 6, no swipe row).
9. Finale: "your aura is waiting." zooms in, plus the CTA.

## Conventions (please follow)

- **Copy goes in `js/data.js`**, logic in screens. Don't hardcode jokes in logic files.
- **Colours and fonts come from CSS variables** in `themes.css`. Never hardcode theme colours in screens. Sticker colours are fixed (`data-c="lime|pink|lilac|orange|sky|yellow|black|grey|red"`), independent of the theme.
- **Each screen** is `export default function name(root, params)`: it sets `root.innerHTML`, binds events, and returns a cleanup function if it starts timers or async loops (use an `alive` / `cancelled` flag).
- **Escape user text** with `esc()` before inserting HTML.
- **Animations:** use GSAP inside `gsap.context(() => {...}, root)` and return `() => ctx.revert()`. Always check `hasGsap` and `reducedMotion()` and degrade gracefully.
- **Known GSAP gotchas we hit:**
  - Pinning inside a flex parent disables pin spacing, so the landing `<section>` is `display: block`.
  - Don't GSAP-animate the `transform` of `.stk` or `.tag`, because they already use CSS transform and transition. Animate a wrapper element instead, or use `fromTo` with `transition: none`.
  - Mobile: Lenis is skipped on touch devices (`isTouch` in motion.js); the landing page turns on `ScrollTrigger.normalizeScroll` only while it's open, and `ignoreMobileResize` stops address-bar resizes from re-measuring pins. Pinned chapters must fit in one phone screen (test at 375×667), and landing heights use `svh`, not `dvh`.
  - Elements with the `hidden` attribute need `[hidden] { display: none !important; }`, already in base.css.
- **Accessibility:** real `<button>`s, `aria-label`s on icon-only controls, a `prefers-reduced-motion` fallback, and toasts in a `role="status"` element.
- **Mobile first:** app screens are designed as a 460px column, then `css/desktop.css` widens them (760px on tablets, 1180px with two columns on desktop). The landing page goes wide (max-width 1180px) on desktop. Test at 390px and 1440px widths.
- Keep comments short and human. They help the builder explain the code to judges.

## Design direction

- **Modern, clean and funny, not 2010s.** The humour lives in the copy, the stickers and the interactions; layouts stay clean.
- **Five vibes** are switchable from the topbar: Clean Clout (default: off-white, acid lime `#C8FF2E`, lilac `#CDBEFF`, huge tight Inter type), Wrapped Mode (dark, glowing blobs, glass), Pastel Bento, AI Slop Chrome (mesh gradient, chrome text, Silkscreen labels) and Corporate Deadpan (serious blue UI, unhinged copy).
- **The builder loves:** gradients, Apple-style **liquid glass**, playful dashboard UIs (Behance "Clocky", "SmartLearn"), and smooth scroll storytelling (gsap.com/scroll, plus her own site manshacodes.github.io/designverse-fest, which uses Lenis, ScrollTrigger scrub/pin, data-speed parallax, scramble text, a spring cursor and tilt cards).
- She also loves the **hand-gesture animation** on why.zero.university (a hand that flips you off). Recreate the *idea* with our own asset; never reuse theirs.
- **Stickers** are die-cut: a bold Inter Black label, a white 4px outline (`box-shadow: 0 0 0 4px #fff`), a soft shadow and a slight rotation.

## Tone and slang

Lowercase, deadpan, chronically online. Current slang to use: **aura / aura farming, mogging, 6-7, crash out, glazing, larping, chopped, twin, unc, bruzz, huzz / "for the huzz", womp womp, delulu is the solulu, cooked, NPC, sigma, W / L, 7x7=49 (means attractive), navy blue** (part of the 7x7=49 "attractive vibes" meme; also, navy blue *bedsheets* are a meme red flag). Running bits: HR unc, "we'll circle back", "it's a learning opportunity", unpaid but "exposure", "legally distinct, please do not sue". The judges are chill, so edgy is fine, but keep it a parody of *culture*, never mean about real people.

## Status

Done and tested end to end in headless Chrome (no console errors):
- [x] all screens and the flow above
- [x] AuraGPT scoring, boss fight, swipe stack, dodge button, sticker drag and drop, chat bot, post generator
- [x] 5 vibes, localStorage persistence
- [x] scroll-story landing page, scramble headings, spring cursor, tilt cards, reduced-motion fallback
- [x] "LinkedIn gets crossed out" intro animation
- [x] runaway Apply button, then "hold to apply"
- [x] Ghosted "hold to check status", then the "HR said:" hand flip-off
- [x] launch polish: a 404 screen for unknown links (`notFound()` in router.js, `js/screens/notfound.js`), `#/privacy` (`js/screens/privacy.js`; copy in `NOT_FOUND` / `PRIVACY` in data.js), a crash toast (`CRASH_TEXT`, window error handler at the end of main.js), SRI on pdf.js, link previews, caching, tests + CI

## Next up (priority order)

1. [x] **Deploy (live at https://aurahire-nebulith.vercel.app/):** push to a public GitHub repo, enable GitHub Pages (or Netlify/Vercel), and add the live URL to the README.
2. [ ] **Liquid glass vibe** (6th theme, maybe the new default): animated gradient background, frosted cards (`backdrop-filter: blur(24px) saturate(180%)`), bright 1px top edge, inner highlight, glossy pill buttons. Optional SVG displacement refraction in Chromium.
3. [x] **Real brainrot stickers (done):** 20 meme stickers in `assets/stickers/*.jpg` (320px, resized from the originals in `/stickers`, which is gitignored), described in `MEMES` in data.js with alt text and a personality label. Used in the HR chat (meme tray; HR replies in context via `HR_MEME_REPLIES`, can send memes back, notices repeats, reads your answer to its opener, logs off once with the goodnight meme) and in the pick-5 screen (saved as `img:<id>`, shown on the profile). The "ni hao" cat was left out on purpose (stereotype). Old plan: the builder will supply Pinterest meme/reaction images. Convert each with `python3 tools/make_sticker.py in.jpg assets/stickers/name.png` (cutout: removes the background and adds a white die-cut outline; `--style card` keeps the whole image, for memes with text). Then add them to an image-sticker list in `data.js` and use them in the chat tray, rating tray, profile reactions and landing sticker storm alongside the text stickers.
4. [x] **Hand gesture animation (done, as the "HR said:" moment on Ghosted).** It uses an original cartoon SVG hand. To swap in your own render or GIF, set `HAND_IMAGE = "assets/hand.png"` in `data.js` (a transparent PNG/WebP/GIF looks best; `tools/make_sticker.py` can cut one out). Old plan, for reference: a scroll-scrubbed image sequence (canvas + GSAP, Apple style) of a 3D hand. On the Ghosted screen it flips you off; on a low score it does an "L". Frames go in `assets/hand/frame-0001.webp …`, made by the builder (Spline or an AI video tool), with placeholders until then.
5. [ ] Polish pass on mobile: tap targets, the swipe feel, the boss-fight pacing.
6. [~] Small delights: **sound effects done** (`js/sound.js`, synthesized with the Web Audio API, no files: stamp thunk, W ding, L womp womp, swipe whoosh, boss hit/crit, rage rumble, a slap per meme in the slam + fanfare, the "HR said:" shatter; 🔊/🔇 toggle in the topbar saved as `state.muted`; silent until the first tap). Haptics via `buzz()` in fx.js. Still to do: a share card image for the aura score.
7. [ ] README screenshots/GIF, and a 150-word project description for submission.
8. [ ] Record the 2-minute video: tell it as one user's story (upload → score → swipe → boss fight → ghosted → sticker revenge).

## Don'ts

- Don't add a framework or build step.
- Don't copy reference designs or assets (Behance shots, X posts, the zero.university hand).
- Naming LinkedIn in text is fine (the builder asked for it so people get the parody); don't use the real logo image.
- Don't break the reduced-motion fallback or the no-GSAP fallback.
- Don't make the core flow confusing. Chaos is in the details, not the navigation.
