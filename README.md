# AuraHire: stop applying. start aura farming.

A brainrot job portal built for **NEBULITH: The Brainrot Ideathon & Hackathon** (Celestial Biscuit, IGDTUW). It's a parody of student LinkedIn culture. Your resume is rated in aura points, every job listing is a red flag, applying is a boss fight, and HR only replies in stickers.

**Live demo:** https://aurahire-nebulith.vercel.app/

## The idea

Every BTech student knows the LinkedIn grind: 14 hackathon participation certificates, core member of 6 clubs, "humbled and honoured" posts. AuraHire stops pretending and makes it official. The interface takes a clean, modern job-portal layout and fills it with internet-brainrot energy, but the user journey stays clear and easy to follow.

## Features

| Feature | What it does |
| --- | --- |
| **"LinkedOut" intro** | A believable fake professional-network feed gets crossed out with a red marker, stickered, scrambled into brainrot and wiped away to reveal AuraHire |
| **Scroll-story landing page** | Smooth scrolling (Lenis) with GSAP ScrollTrigger scenes: parallax stickers, a marquee that skews with your scroll speed, a pinned aura counter, job cards that flip away, a scrubbed boss fight and a sticker storm |
| **AuraGPT resume scanner** | Paste your resume (or upload a .txt) and a rule-based scorer judges every line: a thinking orb, a live terminal log, a highlighter sweep, verdict stamps (W, CAP, NEPO, GLAZE…), points flying into a live counter and graph |
| **Aura Score reveal** | Animated count-up, confetti, a rank from "certified npc" to "mogging the whole batch", and a copy-to-clipboard flex |
| **Pick your 5 stickers** | Dating-app style: choose exactly 5 brainrot stickers that describe you (try picking a 6th) |
| **Swipeable job feed** | Drag cards right to apply or left to ghost them first. Listings include "Cracked Intern, zero yapping" and "Senior Vibe Engineer, must have 7x7=49 energy" |
| **The Apply button runs away** | It flees your cursor with taunts, then gives up and becomes a "hold to apply" ring |
| **Boss fight** | A playable turn-based fight against HR with real HP, random damage and crits. Mention Excel, glaze the manager, never ask about salary |
| **Offer or Ghosted** | Win for confetti and a generated "humbled and honoured" post. Lose and the whole app drains to grey; hold to check your status and "HR said:" shatters as a hand flips you off |
| **Sticker ratings** | Drag and drop stickers (RED FLAG, COOKED, MID…) onto a company; the rating bars update live |
| **Sticker-only HR chat** | A tiny rule-based chatbot. Reply with the "no thanks I use AI" meme, or type and HR answers with keyword replies ("salary" → "it's a learning opportunity") |
| **Profile** | Your 5 stickers, aura, editable name, your post and clickable sticker reactions |
| **5 switchable vibes** | Clean Clout, Wrapped Mode, Pastel Bento, AI Slop Chrome and Corporate Deadpan. Every colour and font comes from CSS variables |
| **Motion extras** | Scramble-text headings, a springy custom cursor and 3D tilt cards (desktop), with everything turned off for people who prefer reduced motion |

## Tech

- Plain **HTML, CSS and JavaScript (ES modules)**. No framework and no build step.
- **GSAP 3** (ScrollTrigger, ScrambleText) and **Lenis**, bundled locally in `vendor/`.
- A small **hash router** (`js/router.js`), so it works on any static host.
- State is saved in **localStorage**, so your aura survives a refresh.
- Responsive: phone-first app screens, and a wide scroll-story landing page on desktop.

## Project structure

```
index.html            app shell
css/
  themes.css          the 5 vibes (design tokens)
  base.css            layout, type, buttons, vibe sheet
  components.css      stickers, bars, chips, confetti, motion helpers
  screens.css         styles for each screen
  landing.css         scroll-story landing page, cursor, tilt
  intro.css           the fake "LinkedOut" intro
js/
  main.js             entry point: vibes, aura pill, routes
  router.js           hash router
  state.js            app state + localStorage
  motion.js           Lenis + ScrollTrigger setup, scramble text, cursor, tilt
  intro.js            the "LinkedOut gets crossed out" intro
  hold.js             press-and-hold ring
  hand.js             the "HR said:" hand moment
  fx.js               helpers: toast, confetti, count-up, typewriter
  aura-engine.js      AuraGPT: rule-based resume scoring
  data.js             all the jokes, jobs, stickers and replies
  screens/            one file per screen
vendor/               GSAP, ScrollTrigger, ScrambleText, Lenis
assets/               images
```

## Run it locally

ES modules need a local server (opening the file directly won't work):

```bash
cd aurahire
python3 -m http.server 8000
# then open http://localhost:8000
```

or `npx serve .`

## Put it on GitHub and deploy it

1. Create a new **public** repository on GitHub called `aurahire`.
2. In this folder, run:
   ```bash
   git init
   git add .
   git commit -m "AuraHire for NEBULITH"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/aurahire.git
   git push -u origin main
   ```
3. Deploy one of these ways (all free):
   - **GitHub Pages:** repo **Settings → Pages →** Source: *Deploy from a branch*, Branch: `main` / root → Save. Your site will be at `https://YOUR-USERNAME.github.io/aurahire/`.
   - **Netlify:** drag this folder onto [app.netlify.com/drop](https://app.netlify.com/drop).
   - **Vercel:** *Add New → Project*, import the repo, and keep the default settings.

## Keep building with Claude Code

Open a terminal in this folder and run `claude`. Example asks: "add a new job listing to data.js", "make the boss fight harder", "add a sound effect when a sticker is slapped".

## Credits

Built for NEBULITH '26. GSAP by GreenSock (free for everyone, including its plugins). Lenis by darkroom.engineering. AuraHire is a parody and isn't affiliated with any real job platform. Legally distinct, please do not sue.
