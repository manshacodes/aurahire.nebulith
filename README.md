# AuraHire: stop applying. start aura farming.

A brainrot job portal built for **NEBULITH: The Brainrot Ideathon & Hackathon** (Celestial Biscuit, IGDTUW), Track 2: **SUPERNOVA, The Code Chaos**.

**Live site:** https://aurahire-nebulith.vercel.app/
**Repo:** https://github.com/manshacodes/aurahire.nebulith

## About

AuraHire is a brainrot parody of LinkedIn culture: stop applying, start aura farming. Upload your resume (PDF, text, or one of six personas) and AuraGPT judges it line by line, slamming stamps like CAP and NEPO and scoring you in aura, with a breakdown for yap, nepo, delulu, grind and cap. Swipe through red-flag listings (Tralalero Tralala Pvt Ltd is hiring), chase a runaway Apply button, then face HR in a fighting-game boss battle with chiptune music, timed blocks and an aura ultimate. Win and memes slam onto the screen; lose and HR flips you off. HR interviews you in memes, every action farms aura to climb the batch leaderboard, and you can roast your friends' resumes too. Five switchable vibes, synthesized sound, plain HTML, CSS and JavaScript with GSAP, fully responsive and live on Vercel. Chaos in the copy, clarity in the journey.

## The idea

Every BTech student knows the LinkedIn grind: 14 hackathon participation certificates, core member of 6 clubs, "humbled and honoured" posts. AuraHire stops pretending and makes it official. Your resume is rated in aura, every listing is a red flag, applying is a boss fight, and HR only replies in stickers.

The brief asked for an unusual idea turned into a thoughtfully designed experience, not a cluttered one. So the chaos lives in the **copy, stickers and interactions**, while the **layout and user journey stay clean**: one clear path from landing page to offer (or ghosting), with a tab bar for everything else.

## The journey

1. **Intro:** a believable LinkedIn feed gets crossed out with a red marker, "nah.", stickered, scrambled into brainrot, and wiped away to reveal AuraHire.
2. **Landing page:** a scroll story (see below), ending in a live theme picker and a feature grid.
3. **Upload:** type your first name and AuraGPT assigns you a surname (Grindwala, Mogwani, Rizzvi…, reroll-able). Then paste your resume, upload a `.txt`, or pick a persona: the hackathon tourist, the nepo intern, the dsa monk, the linkedin lunatic, the founder (19) or the club president.
4. **Scan:** AuraGPT reads every line live, with a thinking orb, a terminal log, a highlighter sweep, verdict stamps (W, BASED, MID, L, CAP, NEPO, GLAZE, LARP, TOURIST) and points flying into a counter and graph.
5. **Score:** a count-up, a rank from "certified npc" to "mogging the whole batch", a roast, rizz (6-7/10 only when earned), and the **AuraGPT breakdown**: yap level, nepo index, delulu meter, grind, touch grass and a cap detector, each scored 0–10 from what's actually in your resume.
6. **Pick your 5:** describe yourself in 5 stickers, choosing from text stickers and meme stickers mixed together (try a 6th: "this isn't 6-7, twin").
7. **Swipe:** 12 red-flag listings in a new order every visit. Swipe right to apply, left to ghost them first.
8. **Apply:** the Apply button runs away from your cursor, then gives up and becomes a press-and-hold ring.
9. **Boss fight:** a turn-based fight against that company's HR boss. You're dealt 3 random moves from a pool of 11 each turn, plus "ask about salary" (always there, always backfires). Dodge, stun and 2× charge effects; HR enters rage mode below 40 HP.
10. **Win:** the meme slam. Memes slam onto the screen faster and faster until they cover it, then "OFFER UNLOCKED", then an offer letter and a typewriter "humbled and honoured" post.
11. **Lose:** the app drains to grey, "HR is typing" forever, then "HR said:" shatters and a hand flips you off.

## Features

| Feature | What it does |
| --- | --- |
| **AuraGPT** | A rule-based resume scorer (regex rules + roasts per line) and a 0–10 breakdown across six factors. No servers, no API keys, runs in your browser |
| **Swipe feed** | Drag-to-swipe card stack with APPLY / GHOST stamps; 12 listings, each with its own boss and signature attack (BOMBARDIRO CROCODILO, FANUM TAX, SKIBIDI DOP DOP…) |
| **Boss fight** | Fighting-game style: a VS intro, HR taunts, a block timing bar (perfect blocks counter-attack), an aura meter that unlocks the AURA FARM ULTIMATE, rage mode, a K.O. splash, and chiptune battle music that speeds up in rage mode |
| **Roast a friend** | Paste or upload anyone's resume (PDF or .txt), get AuraGPT's full verdict, then add them to the batch to race their aura |
| **Aura farming** | Every action earns or costs aura with a "+12 aura" pop; pass a classmate and you get told your new rank |
| **Sound** | Synthesized sound effects, battle music and a victory jingle (Web Audio, no audio files), with a mute button |
| **Meme slam** | On a win, memes slam in on a shuffled grid sized to your screen (about 30 on a phone), each gap 86% of the last, until the screen is covered |
| **HR chat** | An interview over memes: 8 HR questions with tap-to-answer replies. HR replies in context: each meme gets its own reaction (often a meme back), typed messages get keyword replies, and HR notices repeats, reads your answer to its opening question, and logs off once at "4:30pm" |
| **The batch** | A leaderboard of you + 5 fictional classmates. On their profiles: a mog check against your aura, cap-or-fax votes on each resume line, a diss thread with a diss generator where they clap back, and "larp as them" predicted posts. Your disses and votes are saved |
| **Your profile** | A LinkedIn-style circle in the top-left (pick a colour and an emoji face), your 5 stickers, your post and sticker reactions |
| **Sticker ratings** | Drag and drop stickers (RED FLAG, COOKED, MID…) onto a company; the rating bars update live |
| **5 vibes** | Clean Clout, Wrapped Mode, Pastel Bento, AI Slop Chrome and Corporate Deadpan. Switch from the topbar or from live previews on the landing page; every colour and font is a CSS variable |
| **Motion** | Scramble-text headings, a springy cursor and 3D tilt cards on desktop, haptics on phones, and a full reduced-motion fallback |

### The landing page (all GSAP ScrollTrigger)

1. Hero: scramble-text logo, parallax stickers, a title that lifts away as you scroll.
2. A marquee that skews and speeds up with your scroll velocity.
3. "Your resume, rated in aura" (pinned): the counter scrubs 0 → 4,200 while lines get judged.
4. "Every listing is a red flag" (pinned): job cards flip away one by one.
5. "Applying is a boss fight" (pinned): the HP bar drains, damage numbers pop, "OFFER UNLOCKED".
6. "HR only replies in stickers": a sticker storm flies in and assembles into a wall.
7. "Pick your vibe": the 5 themes as live previews; tapping one switches the whole site.
8. "Everything else in the grind": a bento grid of features, each with a tiny demo, linking to the feature.
9. Finale: "your aura is waiting."

## For the judges

| Criterion | Where to look |
| --- | --- |
| **Creativity & Originality (25%)** | A job portal where applying is a boss fight and HR replies in memes. Original copy, characters, listings and stickers, built on current brainrot (Italian brainrot, 6-7, aura farming, fanum tax, skibidi, clanker) |
| **Functionality & Implementation (25%)** | Nothing is faked: AuraGPT scoring and breakdown (`js/aura-engine.js`), the swipe stack, the dodge button and hold ring, the boss fight (`js/screens/boss.js`), the context-aware chat (`js/screens/chat.js`), cap/fax and disses that persist, drag-and-drop ratings, a live theme switcher |
| **UI/UX & Visual Design (20%)** | 5 complete themes from one set of design tokens (`css/themes.css`), die-cut stickers, a clean single-column app with a tab bar, and chaos kept to copy and interactions |
| **Code Quality & Structure (15%)** | No framework, no build step. One file per screen, all copy in `js/data.js`, small single-purpose modules, CSS variables for theming, every screen cleans up its timers and animations, user text is escaped |
| **Deployment & Responsiveness (10%)** | Live on Vercel (auto-deploys on push). Phone-first app screens that switch to wider two-column layouts on tablets and laptops (`css/desktop.css`), tested at 390px, 768px, 1024px and 1440px. Mobile-specific performance work: no smooth-scroll library on touch, no heavy blur filters, pinned scenes sized to fit a small phone |
| **Theme Interpretation (5%)** | Brainrot as the language of the whole product: aura points instead of skills, stickers instead of messages, memes instead of feedback |

## Tech

- Plain **HTML, CSS and JavaScript (ES modules)**. No framework and no build step.
- **GSAP 3** (ScrollTrigger, ScrambleText) and **Lenis**, bundled locally in `vendor/`.
- A small **hash router** (`js/router.js`), so it works on any static host.
- State is saved in **localStorage** (aura, name, avatar, stickers, disses, theme), wrapped in try/catch.
- Accessibility: real buttons, aria labels on icon-only controls, alt text on every meme, toasts in a `role="status"` region, and a `prefers-reduced-motion` fallback.

## Project structure

```
index.html            app shell: topbar, screen, tab bar, vibe sheet, toast
css/
  themes.css          the 5 vibes (all colours, radii and fonts)
  base.css            layout, type, buttons, tab bar, avatar, toast
  components.css      stickers, bars, chips, confetti, motion helpers
  screens.css         styles for each screen
  landing.css         scroll-story landing page, cursor, tilt
  intro.css           the LinkedIn intro (fixed palette on purpose)
js/
  main.js             entry point: routes, vibe sheet, aura pill, tabs
  router.js           hash router (each screen returns a cleanup function)
  state.js            app state + localStorage
  theme.js            switching vibes
  motion.js           Lenis + ScrollTrigger setup, scramble text, cursor, tilt
  intro.js            the "LinkedIn gets crossed out" intro
  aura-engine.js      AuraGPT: per-line scoring + the 0-10 breakdown
  identity.js         funny surname generator + profile circle
  memes.js            meme sticker helper + mixing memes with text stickers
  slam.js             the accelerating meme slam
  hold.js             press-and-hold ring
  hand.js             the "HR said:" hand moment
  fx.js               helpers: toast, confetti, count-up, typewriter, shuffle
  data.js             all the copy: jobs, stickers, memes, replies, personas
  screens/            one file per screen
vendor/               GSAP, ScrollTrigger, ScrambleText, Lenis
assets/stickers/      the meme stickers (320px)
tools/make_sticker.py turns an image into a die-cut sticker
```

## Run it locally

ES modules need a local server (opening the file directly won't work):

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deployment

The site is deployed on **Vercel**, connected to this repo: every push to `main` redeploys https://aurahire-nebulith.vercel.app/ automatically. Because it's a static site with a hash router, it also runs on GitHub Pages or Netlify with no configuration.

## Credits

Built for NEBULITH '26. GSAP by GreenSock (free for everyone, including its plugins). Lenis by darkroom.engineering. Meme images are popular internet reaction memes, used here for parody. The intro and copy parody LinkedIn culture; AuraHire isn't affiliated with LinkedIn or any real company. Legally distinct, please do not sue.
