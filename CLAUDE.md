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
  intro.css           the fake "LinkedOut" intro (fixed palette on purpose)
js/
  main.js             entry: theme switching, aura pill, route table, withMotion() wrapper
  router.js           route(pattern, screen) + go(path); each screen returns an optional cleanup fn
  state.js            get / set / addAura / subscribe / reset, persisted to localStorage
  motion.js           Lenis + ScrollTrigger setup, scramble-text headings, springy cursor, tilt
  intro.js            the "LinkedOut gets crossed out" intro timeline
  hold.js             reusable press-and-hold ring (used by Apply and Ghosted)
  hand.js             the "HR said:" shatter + hand flip-off overlay
  fx.js               $, $$, esc, toast, confetti, countUp, typewriter, shake, floatText, sticker()
  aura-engine.js      "AuraGPT": a regex rule list that scores each resume line (+ roast)
  data.js             ALL copy: jobs, stickers, slang, boss moves, HR chat replies, post templates
  screens/            one file per screen (see the flow below)
vendor/               gsap, ScrollTrigger, ScrambleTextPlugin, lenis (+ lenis.css)
assets/               no-thanks-i-use-ai.png (meme used as a chat sticker), stickers/ (image stickers)
tools/make_sticker.py turns any image into a die-cut sticker PNG (needs: pip install "rembg[cpu]" pillow)
```

## User flow (screens)

**Intro (first visit per session, `js/intro.js` + `css/intro.css`):** a believable fake "LinkedOut" feed (parody name, no real logo) gets a red marker X, "nah.", stickers slapped on the posts, the post text scrambled into brainrot, a shake and grey-out, then an acid-lime circle wipe reveals AuraHire. Skippable, and replayable from the landing footer.

`#/` **home**: scroll-story landing page.
→ `#/upload`: paste your resume, upload a .txt, or use the demo.
→ `#/scan`: AuraGPT v6.7 judges line by line: a sticky HUD with a thinking orb (turns green or pink per verdict) and a live counter + sparkline, a terminal log of its "thoughts", a highlighter sweep on each line, verdict stamps slamming on (W, BASED, MID, L, CAP, NEPO, GLAZE, LARP, TOURIST), points flying into the counter, a shake on big Ls, confetti on big Ws, a "SCAN COMPLETE" stamp, and a skip button.
→ `#/score`: count-up, confetti, rank tier, roast, stats, "copy my flex".
→ `#/stickers`: pick exactly 5 personality stickers (a 6th shakes: "this isn't 6-7, twin").
→ `#/jobs`: swipeable card stack (drag right to apply, left to ghost).
→ `#/job/:id`: details; the **Apply button runs from your cursor** (6 escapes with taunts on mouse, 3 on touch), then gives up and turns into a **"hold to apply" ring** (1.6s press-and-hold, inspired by zero.university's tap-hold; letting go early resets it with a roast).
→ `#/boss/:id`: turn-based fight (you have 120 HP, the boss 100). Moves: mention excel, show hackathon cert (risky crit), glaze the manager (costs dignity), ask about salary (backfires).
→ win: `#/offer` (confetti, offer letter, typewriter "humbled and honoured" post generator, then the profile)
→ lose: `#/ghosted` (the app drains to grayscale; "HR is typing" forever; −800 aura). Losing the fight lands on `#/ghosted/lost`, which plays the **"HR said:" moment** automatically after a beat; the **"hold to check status" ring** replays it (`js/hand.js`): a dark red overlay, "HR said:" cracks and shatters into clip-path shards, and a hand slams up and flips you off, then "rejected. emotionally." with ok fair / get revenge buttons
Side screens: `#/rate` (drag-and-drop stickers onto a company, live rating bars), `#/chat` (sticker-only HR chatbot with keyword replies), `#/profile` (5 stickers, editable name, post, clickable sticker reactions, reset).

**Landing page chapters** (`js/screens/home.js`, all GSAP ScrollTrigger):
1. Hero: scramble-text logo, parallax stickers (`data-speed`), the title lifts away on scroll.
2. A velocity marquee that skews and speeds up with scroll velocity.
3. "Your resume, rated in aura" (pinned): the counter scrubs 0 → 4,200 while lines and tags reveal.
4. "Every listing is a red flag" (pinned): job cards flip away one by one (rotateX).
5. "Applying is a boss fight" (pinned): the HP bar drains, damage numbers pop, "OFFER UNLOCKED".
6. "HR only replies in stickers": a sticker storm flies in and assembles into a wall.
7. Finale: "your aura is waiting." zooms in, plus the CTA.

## Conventions (please follow)

- **Copy goes in `js/data.js`**, logic in screens. Don't hardcode jokes in logic files.
- **Colours and fonts come from CSS variables** in `themes.css`. Never hardcode theme colours in screens. Sticker colours are fixed (`data-c="lime|pink|lilac|orange|sky|yellow|black|grey|red"`), independent of the theme.
- **Each screen** is `export default function name(root, params)`: it sets `root.innerHTML`, binds events, and returns a cleanup function if it starts timers or async loops (use an `alive` / `cancelled` flag).
- **Escape user text** with `esc()` before inserting HTML.
- **Animations:** use GSAP inside `gsap.context(() => {...}, root)` and return `() => ctx.revert()`. Always check `hasGsap` and `reducedMotion()` and degrade gracefully.
- **Known GSAP gotchas we hit:**
  - Pinning inside a flex parent disables pin spacing, so the landing `<section>` is `display: block`.
  - Don't GSAP-animate the `transform` of `.stk` or `.tag`, because they already use CSS transform and transition. Animate a wrapper element instead, or use `fromTo` with `transition: none`.
  - Elements with the `hidden` attribute need `[hidden] { display: none !important; }`, already in base.css.
- **Accessibility:** real `<button>`s, `aria-label`s on icon-only controls, a `prefers-reduced-motion` fallback, and toasts in a `role="status"` element.
- **Mobile first:** app screens use a max-width 460px column. The landing page goes wide (max-width 1180px) on desktop. Test at 390px and 1440px widths.
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
- [x] "LinkedOut gets crossed out" intro animation
- [x] runaway Apply button, then "hold to apply"
- [x] Ghosted "hold to check status", then the "HR said:" hand flip-off

## Next up (priority order)

1. [x] **Deploy (live at https://aurahire-nebulith.vercel.app/):** push to a public GitHub repo, enable GitHub Pages (or Netlify/Vercel), and add the live URL to the README.
2. [ ] **Liquid glass vibe** (6th theme, maybe the new default): animated gradient background, frosted cards (`backdrop-filter: blur(24px) saturate(180%)`), bright 1px top edge, inner highlight, glossy pill buttons. Optional SVG displacement refraction in Chromium.
3. [ ] **Real brainrot stickers:** the builder will supply Pinterest meme/reaction images. Convert each with `python3 tools/make_sticker.py in.jpg assets/stickers/name.png` (cutout: removes the background and adds a white die-cut outline; `--style card` keeps the whole image, for memes with text). Then add them to an image-sticker list in `data.js` and use them in the chat tray, rating tray, profile reactions and landing sticker storm alongside the text stickers.
4. [x] **Hand gesture animation (done, as the "HR said:" moment on Ghosted).** It uses an original cartoon SVG hand. To swap in your own render or GIF, set `HAND_IMAGE = "assets/hand.png"` in `data.js` (a transparent PNG/WebP/GIF looks best; `tools/make_sticker.py` can cut one out). Old plan, for reference: a scroll-scrubbed image sequence (canvas + GSAP, Apple style) of a 3D hand. On the Ghosted screen it flips you off; on a low score it does an "L". Frames go in `assets/hand/frame-0001.webp …`, made by the builder (Spline or an AI video tool), with placeholders until then.
5. [ ] Polish pass on mobile: tap targets, the swipe feel, the boss-fight pacing.
6. [ ] Small delights: sound effects (with a mute toggle), haptics (`navigator.vibrate`) on swipe and hits, a share card image for the aura score.
7. [ ] README screenshots/GIF, and a 150-word project description for submission.
8. [ ] Record the 2-minute video: tell it as one user's story (upload → score → swipe → boss fight → ghosted → sticker revenge).

## Don'ts

- Don't add a framework or build step.
- Don't copy reference designs or assets (Behance shots, X posts, the zero.university hand).
- Don't use real LinkedIn branding or logos.
- Don't break the reduced-motion fallback or the no-GSAP fallback.
- Don't make the core flow confusing. Chaos is in the details, not the navigation.
