// "AuraGPT": a rule-based resume scorer. No servers, no LLM, just vibes and regex.
//
// How a resume gets judged:
//   1. tidyLines()  glues wrapped lines back together and drops headings, contact info and page numbers
//   2. scoreLine()  checks every line against ALL the signals below: the best good signal counts
//                   fully, extra good ones at 40%, and every bad one in full
//   3. contextPass() reads the resume as a whole (7 societies = larping, the same flex twice = worth less)
//   4. scoreResume() shows 14 lines with the same mix of W / BASED / MID / L as the whole resume

// ---------- line scoring ----------
// Each signal: { re, points, roast, kind? }. `kind` picks a special stamp on the scan screen.
// A few signals are functions of the match (m) so numbers can change the verdict.
// Calibration: a typical project bullet should be BASED (100-299), a W (300+) needs a win,
// a real internship, real users, or a project that stacks several strong signals.
// Career signals (internships, wins, cp ratings, open source) are worth the most: they're the
// hardest to get, so a first-year with lots of projects still sits below an intern or a dsa monk.
const SIGNALS = [
  // --- real wins ---
  { re: /\b(won|winners?|1st|first place|champions?|gold medal)\b/i, points: 450, roast: "actual W. respect." },
  { re: /\b(runner.?up|2nd|3rd|second place|third place|finalists?|top \d+|silver|bronze)\b/i, points: 220, roast: "podium aura" },
  { re: /out of (\d+)\+? teams/i, rule: (m) => (Number(m[1]) >= 50 ? { points: 100, roast: `beat ${m[1]} teams. respect.` } : { points: -100, roast: `out of ${m[1]} teams is a group project`, kind: "cap" }) },
  { re: /\bintern(ship)?s?\b/i, points: 350, roast: "a real job. HR is shaking." },
  { re: /open.?source|\bgsoc\b|merged (prs|pull)|pull requests?|\bprs\b/i, points: 320, roast: "open source mogger" },
  { re: /leetcode|\bdsa\b|codeforces|codechef|\bicpc\b/i, points: 200, roast: "dsa grind. unc behaviour, respect" },
  { re: /(\d[\d,]*)\+?\s*(leetcode\s+)?problems|\b[4-7]\s*star|expert|specialist|candidate master/i,
    rule: (m) => (m[1] && Number(m[1].replace(/,/g, "")) < 300 ? { points: 0, roast: "a few problems. a start." } : { points: 180, roast: "rated. sweaty. respect." }) },
  { re: /\bc?gpa\b\s*[:\-]?\s*(\d+(\.\d+)?)|(\d\.\d+)\s*c?gpa/i,
    rule: (m) => { const g = Number(m[1] || m[3]); return g >= 9 ? { points: 150, roast: "nerd aura (complimentary)" }
      : g >= 8 ? { points: 50, roast: "decent gpa. unc-approved." } : { points: -60, roast: "gpa mentioned. brave." }; } },

  // --- actually built something ---
  { re: /^(built|developed|created|designed|shipped|launched|deployed|engineered|automated|implemented|wrote|trained|architected|scrapes?|sends?|runs?|tracks?|led|started|organi[sz]ed|reduced|improved|increased|optimi[sz]ed|integrated|programmed|prototyped|redesigned)\b/i,
    points: 40, roast: "verb first. resume-coded." },
  { re: /\b(live|deployed|in production|hosted on|vercel|netlify|github pages|play store|app store)\b/i, points: 80, roast: "it's live. not a localhost larp." },
  { re: /serverless|cron|github actions|\bci\b|\bci\/cd\b|docker|kubernetes|pipeline|webhooks?|service workers?|push notifications?|web push/i,
    points: 100, roast: "infra girlie / infra bro. scary." },
  { re: /scrap(e|es|er|ers|ing)\b|crawl(s|er|ing)?\b/i, points: 110, roast: "scrapes the internet so you don't have to. menace." },
  { re: /\bapi\b|backend|database|websockets?|real.?time|auto.?sorts?|automat\w+/i, points: 50, roast: "the code does stuff on its own." },
  { re: /(\d[\d,]*)\s*(automated\s+)?(unit\s+)?tests?\b|test suite|test coverage/i,
    rule: (m) => (m[1] && Number(m[1].replace(/,/g, "")) >= 50 ? { points: 220, roast: `${m[1]} tests. unc-level discipline.` } : { points: 120, roast: "writes tests. rare." }) },
  { re: /\barduino|raspberry pi|robot\w*|rover|sensors?|\biot\b|drone|microcontroller|motor drivers?|esp32/i,
    points: 110, roast: "touches circuits instead of grass" },
  { re: /\b(\d+)\+?\s*years?\b/i,
    rule: (m) => (Number(m[1]) >= 3 ? { points: 80, roast: `${m[1]} years? that's lore.` } : { points: 20, roast: "a fresh arc" }) },
  { re: /\bsolo\b|single.?handed|by myself|in one day|in 24 ?h(ou)?rs/i, points: 70, roast: "solo carry" },
  { re: /([\d,]+)\+?\s*(users|downloads|installs|stars|visitors|customers|signups|subscribers|github stars)\b/i,
    rule: (m) => (Number(m[1].replace(/,/g, "")) >= 50
      ? { points: 250, roast: "real users?? go touch them." }
      : { points: -120, roast: `${m[1]} users is a group chat` }) },
  { re: /\b(cut|reduced|saved|increased|improved|boosted)\b.*\d+\s*(%|x\b|hours|minutes)|\d+\s*%\s*(faster|less|more|fewer)/i,
    points: 150, roast: "impact metric. HR just woke up." },
  { re: /\b\d[\d,]*\+?\s*(students|members|people|participants|staff|attendees|minutes|hours)/i,
    points: 60, roast: "numbers. HR loves numbers." },

  // --- leadership & clubs ---
  { re: /(\d+)\s*(?:more\s+)?(?:college\s+)?(clubs?|societ(y|ies))/i,
    rule: (m) => (Number(m[1]) > 3
      ? { points: -300, roast: `${m[1]} ${m[2]}. larping as everyone's teammate.`, kind: "larp" }
      : { points: 40, roast: "a normal amount of clubs. suspicious." }) },
  { re: /president|\bhead\b|\blead(er)?\b|captain|founded the|started the initiative/i, points: 140, roast: "main character (club edition)" },
  { re: /coordinator|organi[sz]er|\bvp\b|secretary|core member/i, points: 70, roast: "title farming (respectfully)" },
  { re: /\b(team )?member\b|\bteam\b,/i, points: 0, roast: "member #47 of the team" },
  { re: /\bhackathons?\b/i, points: 40, roast: "showed up. respect, kind of." },
  { re: /organi[sz](ed|er|ing).*hackathon|hackathon.*organi[sz](ed|er)/i, points: 320, roast: "ran a whole hackathon. that's a W." },
  { re: /\bparticipated\b/i, points: -40, roast: "participation trophy unlocked" },
  { re: /\b(\d{2,})\s*hackathons?/i, points: -150, roast: "hackathon tourist detected", kind: "tourist" },
  { re: /startup|founder|\bceo\b/i, points: 100, roast: "founder arc" },
  { re: /stealth|pre.?revenue|idea stage|future founder|aspiring/i, points: -200, roast: "idea stage is not a stage", kind: "cap" },

  // --- skills that count for a little ---
  { re: /\bai\b|artificial intelligence|machine learning|\bml\b|\bllm\b|deep learning|computer vision|\bnlp\b/i, points: 30, roast: "'no thanks i use ai' energy" },
  { re: /chatgpt clone|openai api|llm wrapper|gpt wrapper/i, points: -150, roast: "an api wrapper. mogged by one curl command." },
  { re: /react|javascript|typescript|python|\bjava\b|c\+\+|node(\.js)?|\bgo(lang)?\b|rust|kotlin|swift/i, points: 20, roast: "skill diff" },
  { re: /figma|ui\/?ux|photograph\w*|illustrat\w*|brand identity|after effects|animation/i, points: 60, roast: "has taste. rare in cse." },
  { re: /volunteer|\bngo\b|\bnss\b|special school|charity|fundrais|teaching drive/i, points: 80, roast: "kind aura" },
  { re: /\b(dance|singing|singer|sports|cricket|football|basketball|gym|marathon|trek\w*|theatre|band)\b/i, points: 80, roast: "touches grass. rare." },
  { re: /certificat|\bcourses?\b|udemy|coursera|nptel/i, points: 0, roast: "they were 2 hrs long, twin" },
  { re: /\b(\d{2,})\s*(free\s+)?(\w+\s+)?(certificat\w*|courses?)/i, points: -180, roast: "certificate collector. none were read." },

  // --- the Ls ---
  { re: /uncle|aunt|dad'?s|papa|mom'?s|cousin|family friend|relatives/i, points: -250, roast: "nepotism detected", kind: "nepo" },
  { re: /ms word|microsoft word|ms office|powerpoint|\bexcel\b/i, points: -120, roast: "proficient in word. groundbreaking." },
  { re: /hello world/i, points: -100, roast: "7 languages, 0 projects" },
  { re: /full.?stack|mern stack/i, points: -150, roast: "larping as full-stack", kind: "larp" },
  { re: /to.?do app|calculator|weather app|tic.?tac.?toe|portfolio website using html|library management|student management|house prices?|titanic|kaggle dataset/i,
    points: -150, roast: "the college project starter pack" },
  { re: /passionate|hard.?working|team player|motivated|go.?getter|detail.?oriented|enthusiast|self.?starter|quick learner/i,
    points: -120, roast: "glazing yourself detected", kind: "glaze" },
  { re: /communication skills|public speaking|leadership skills|people skills|time management/i, points: -100, roast: "soft skills section. hard pass." },
  { re: /hobbies:.*\b(reading|music|movies|travel\w*|netflix)\b/i, points: -110, roast: "reading and music. the npc hobby combo." },
  { re: /linkedin|followers|influencer|top voice/i, points: -120, roast: "linkedin lunatic" },
  { re: /internal round|fixed a typo|self.?nominated|mostly relatives|all co.?founders|\(\d+ teams?\)|imports only|\(college project\)/i,
    points: -300, roast: "the brackets are doing a lot of work", kind: "cap" },
  { re: /\[[^\]]*\]/, points: -150, roast: "forgot to fill in the template, twin" },
  { re: /attendance/i, points: -120, roast: "attendance mentioned. sus." },
];

// Lines that match nothing land in MID: a repeatable joke, small points either way
const FALLBACK = [
  [12, "mid line, ngl"], [-20, "giving npc energy"], [35, "lowkey cooking"],
  [-8, "womp womp"], [6, "6-7 line"], [49, "7x7=49 vibes"], [-30, "chopped wording"],
];

// "Languages: JS, Python, C++" style lines: a small flex per tool (9+ tools reaches BASED)
const SKILLS_LINE = /^(languages?|skills|tech(nical)?( skills| stack)?|tools?( & \w+)?|frameworks?|web|hardware|design|libraries|databases?|platforms?)\s*:/i;

const LINE_MIN = -500, LINE_MAX = 500;
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7) >>> 0;
const round5 = (n) => Math.round(n / 5) * 5;

function scoreSkillsLine(text) {
  const items = text.split(":").slice(1).join(":").split(/[,;/]|\band\b/).filter((s) => s.trim()).length;
  if (/ms office|ms word|powerpoint|\bexcel\b|public speaking/i.test(text)) return { points: -100, roast: "ms office in the skills section. HR felt that." };
  return { points: Math.min(100, items * 12), roast: items >= 8 ? `${items} tools listed. tutorial count unknown.` : "skills section. noted." };
}

export function scoreLine(text) {
  if (SKILLS_LINE.test(text)) return scoreSkillsLine(text);

  const hits = [];
  for (const s of SIGNALS) {
    const m = text.match(s.re);
    if (m) hits.push({ ...(s.rule ? s.rule(m) : s), re: s.re });
  }
  if (!hits.length) {
    const [points, roast] = FALLBACK[hash(text) % FALLBACK.length];
    return { points, roast };
  }

  // Good stuff stacks with diminishing returns: the best signal counts fully, the rest at 40%.
  // Bad stuff always counts in full. A cap / nepo / glaze / larp line keeps only a quarter of its good points.
  const flagged = hits.some((h) => h.kind && h.points < 0);
  const pos = hits.filter((h) => h.points > 0).map((h) => h.points).sort((a, b) => b - a);
  const neg = hits.filter((h) => h.points < 0).reduce((sum, h) => sum + h.points, 0);
  let good = pos.length ? pos[0] + 0.4 * pos.slice(1).reduce((a, b) => a + b, 0) : 0;
  if (flagged) good /= 4;
  const points = round5(Math.max(LINE_MIN, Math.min(LINE_MAX, good + neg)));

  // The roast comes from whichever signal mattered most, but a special "kind" (nepo, cap…) always wins
  const loudest = hits.find((h) => h.kind && h.points < 0)
    || [...hits].sort((a, b) => Math.abs(b.points) - Math.abs(a.points))[0];
  const roast = pos.length >= 3 && points >= 300 ? `stacked W: ${loudest.roast}` : loudest.roast;
  return { points, roast, signal: String(loudest.re), ...(loudest.kind && loudest.points < 0 ? { kind: loudest.kind } : {}) };
}

// ---------- reading the resume as a whole ----------
// Some things only make sense across lines: being in 7 societies, or 5 lines that all say "robot".
// A society role line: a role word ("member", "coordinator", "team"…) plus a society word or "– present"
const ORG_LINE = /\b(member|coordinator|head|lead(er)?|president|secretary|core|team|volunteer)\b.*\b(club|society|societies|cell|chapter|committee|council|tedx|enactus|rotaract|model united nations|mun|nss|present)\b/i;
// Each society is graded on its own: what kind of society, what you did there, and whether you built anything
const ROLE_LEADER = /president|\bhead\b|\blead(er)?\b|captain|founder|founded|started the initiative/i;
const ROLE_TITLE = /coordinator|organi[sz]er|core member|secretary|\bvp\b|convenor/i;
const ROLE_MAKER = /\b(tech(nical)?|game dev\w*|development|developer|web|design|robotics|coding|ai|ml|app)\b/i;   // roles that build stuff
const BIG_SOCIETY = /tedx|microsoft|google|gdsc|gdg|\bacm\b|ieee|mlsa|e-?cell|entrepreneurship|coding|robotics|\bai\b|game|hackathon|neutron/i;
const DID_THERE = /^(built|building|designed|designing|developed|developing|made|making|created|creating|wrote|ran|organi[sz]ed|launched|shipped|led|managed|handled)\b/i;
// posts, decks and posters count as a small contribution, not as building something
const SMALL_STUFF = /instagram|posts?\b|carousel|poster|deck|banner|reel|story|stories|social media|caption/i;
const SOCIETY_KEEP = 4;   // your best 4 societies count in full; 5+ and the rest get taxed

// did: "big" (built something real there), "small" (a few posts or a deck), or "" (nothing listed)
function scoreSociety(line, did) {
  const t = line.text;
  let points, roast;
  if (ROLE_LEADER.test(t)) [points, roast] = [300, "runs the whole society. actual main character"];
  else if (ROLE_TITLE.test(t)) [points, roast] = did ? [110, "has a title (and receipts)"] : [50, "has a title. no receipts tho"];
  else if (ROLE_MAKER.test(t)) [points, roast] = [90, "the member who actually builds stuff"];
  else [points, roast] = [20, "member #47 of the team"];
  if (BIG_SOCIETY.test(t)) { points += 60; roast = `${roast}, big-name society too`; }
  if (did === "big") { points += 70; roast = "actually built something there. real member"; }
  if (did === "small") { points += 20; roast = "made a few posts there. we saw them"; }
  const builtSomething = did === "big";
  // signal: null so the "same flex again" discount below leaves societies alone
  return { points, roast, kind: undefined, signal: null, built: builtSomething, big: BIG_SOCIETY.test(t), titled: ROLE_LEADER.test(t) || ROLE_TITLE.test(t) };
}

function contextPass(lines) {
  // 1. societies: grade each one, then tax the extras if you're in 5+
  const orgIdx = lines.map((l, i) => (ORG_LINE.test(l.text) ? i : -1)).filter((i) => i >= 0);
  orgIdx.forEach((i, k) => {
    // the next few lines under a society, before the next society, count as "what you did there"
    const until = Math.min(orgIdx[k + 1] ?? lines.length, i + 4);
    const under = lines.slice(i + 1, until).filter((l) => DID_THERE.test(l.text));
    const did = under.some((l) => !SMALL_STUFF.test(l.text)) ? "big" : under.length ? "small" : "";
    Object.assign(lines[i], scoreSociety(lines[i], did));
  });
  if (orgIdx.length > SOCIETY_KEEP) {
    const n = orgIdx.length;
    const extras = [...orgIdx].sort((a, b) => lines[b].points - lines[a].points).slice(SOCIETY_KEEP);
    extras.forEach((i) => {
      const l = lines[i];
      if (l.built || l.big) {                 // still worth something, just less
        l.points = round5(l.points * 0.6);
        l.roast = `${l.roast} (society #${n} energy tho)`;
      } else if (l.titled && l.points <= 50) { // a title with nothing under it
        l.points = -50;
        l.roast = `a title in society #${n}. that's the whole contribution`;
      } else if (l.points > 20) {              // a few posts: it counts, barely
        l.points = 10;
        l.roast = `a few posts in society #${n}. it counts. barely.`;
      } else {                                // nothing to show for it: larping
        l.points = -100; l.kind = "larp";
        l.roast = `one of ${n} societies. do you even go to the meetings?`;
      }
    });
  }
  // 2. repeats: the 3rd time you use the same flex it's worth 85%, the 4th 72%…
  const seen = {};
  for (const l of lines) {
    if (l.points <= 0 || !l.signal) continue;
    const n = (seen[l.signal] = (seen[l.signal] || 0) + 1);
    if (n > 2) { l.points = round5(l.points * 0.85 ** (n - 2)); l.roast = `${l.roast} (again)`; }
  }
  return lines;
}

// ---------- cleaning up the text ----------
const BULLET = /^[\s•●▪◦\-*·–—>]+/;
const HEADING = /^(education|experience|work experience|projects?|skills|technical skills|achievements|certifications?|summary|objective|profile|contact|interests|hobbies|languages|positions? of responsibility|extra.?curricular|activities|awards|publications|references|coursework|leadership|robotics)\b/i;
const JUNK = [
  /@|https?:|www\.|linkedin\.com|github\.com/i,   // contact + links
  /(\+?\d[\d\s-]{8,}\d)/,                         // phone numbers
  /^page \d+( of \d+)?$/i,                        // page footers
];
// A line ending like this probably wraps onto the next one
const WRAPS = /([,&(\-–:]|\b(and|or|with|to|into|of|the|a|an|for|in|on|at|by|plus|from|using|via))$/i;

// Glue wrapped lines together and drop headings, contact info, page numbers and repeats.
export function tidyLines(rawLines) {
  const seen = new Set();
  const out = [];
  for (const raw of rawLines) {
    const isBullet = BULLET.test(raw) && /\S/.test(raw.match(BULLET)[0]);   // starts with a real bullet mark
    const line = raw.replace(BULLET, "").replace(/\s+/g, " ").trim();
    if (!line || JUNK.some((re) => re.test(line))) continue;
    const key = line.toLowerCase();
    if (seen.has(key)) continue;                  // repeated page headers (your name on every page)
    seen.add(key);
    if (HEADING.test(line) && line.split(" ").length <= 4) continue;   // section titles

    const prev = out[out.length - 1];
    const continues = prev && (
      line.split(" ").length === 1 ||             // a lone word like "Live"
      (!isBullet && (
        /^[a-z]/.test(line) ||                    // starts lowercase: it's the rest of a sentence
        WRAPS.test(prev)                          // previous line was cut off mid-thought
      ))
    );
    if (continues) out[out.length - 1] = `${prev} ${line}`;
    else out.push(line);
  }
  // Short lines with nothing to judge are headings or your name ("Robotics & Hardware", "Mansha Goel")
  return out.filter((l) => l.split(" ").length > 3 || SIGNALS.some((s) => s.re.test(l)));
}

// ---------- the whole resume ----------
export const BASE_AURA = 3000; // everyone starts with some aura for existing
export const MAX_LINES = 14;   // the scan animates each line, so long resumes show a 14-line sample

export const TIERS = [
  { min: -Infinity, name: "certified npc", roast: "negative vibes. HR is crying. so are we." },
  { min: 1800, name: "unc energy", roast: "you're giving 'reply all' in the class group." },
  { min: 2800, name: "aura farmer", roast: "solid grind. suspicious amount of certificates tho." },
  { min: 3300, name: "certified linkedin sigma", roast: "you're mogging most of your batch. participation certs carrying hard." },
  { min: 4700, name: "mogging the whole batch", roast: "seniors are taking notes. 7x7=49 resume." },
  { min: 5200, name: "placement cell's final boss", roast: "you actually ship things. HR is scared of you." },
];

export const tierFor = (total) => [...TIERS].reverse().find((t) => total >= t.min);

// One place decides the verdict, so the stamps, colours and stats on every screen agree
export const verdictOf = (p) => (p >= 300 ? "W" : p >= 100 ? "BASED" : p <= -100 ? "L" : "MID");
// Colour of a judged line: green for W / BASED, grey for MID, red for L or any special stamp (CAP, LARP…)
export const toneOf = (line) => {
  if (line.kind) return "bad";
  const v = verdictOf(line.points);
  return v === "W" || v === "BASED" ? "good" : v === "MID" ? "mid" : "bad";
};
// Ws and crash outs only count real Ws and real Ls
export const isW = (line) => !line.kind && line.points >= 300;
export const isCrashOut = (line) => toneOf(line) === "bad";

// Pick 14 lines that mirror the whole resume: if a third of your lines are mid, a third of the scan is mid.
function pickLines(all) {
  if (all.length <= MAX_LINES) return all;
  const buckets = { W: [], BASED: [], MID: [], L: [] };
  all.forEach((l, i) => buckets[verdictOf(l.points)].push(i));
  const quota = {};
  for (const [v, idx] of Object.entries(buckets)) quota[v] = idx.length ? Math.max(1, Math.round((idx.length / all.length) * MAX_LINES)) : 0;
  // fix rounding so the quotas add up to exactly 14 (trim or grow the biggest bucket)
  let diff = MAX_LINES - Object.values(quota).reduce((a, b) => a + b, 0);
  while (diff !== 0) {
    const v = Object.keys(quota).filter((k) => (diff > 0 ? quota[k] < buckets[k].length : quota[k] > 1))
      .sort((a, b) => buckets[b].length - buckets[a].length)[0];
    if (!v) break;
    quota[v] += Math.sign(diff); diff -= Math.sign(diff);
  }
  const keep = new Set();
  for (const [v, idx] of Object.entries(buckets)) {
    idx.sort((a, b) => Math.abs(all[b].points) - Math.abs(all[a].points)).slice(0, quota[v]).forEach((i) => keep.add(i));
  }
  return all.filter((_, i) => keep.has(i));   // back in the order you wrote them
}

export function scoreResume(text) {
  const scored = contextPass(tidyLines(text.split(/\n+/)).map((line) => ({ text: line, ...scoreLine(line) })));
  // keep only what the screens need (these get saved in localStorage)
  const allLines = scored.map(({ text: t, points, roast, kind }) => ({ text: t, points, roast, ...(kind ? { kind } : {}) }));
  const lines = pickLines(allLines);
  const total = BASE_AURA + lines.reduce((sum, l) => sum + l.points, 0);
  return { lines, allLines, total, tier: tierFor(total) };
}

// ---------- the AuraGPT breakdown ----------
// Each factor counts "signals" in your resume. Every signal is [regex, weight].
// The score is 0-10: more signals = higher. Copy for each factor lives in data.js (FACTORS).
const FACTOR_SIGNALS = {
  yap: [
    [/passionate|hard.?working|team player|motivated|go.?getter|detail.?oriented|enthusiast|visionary|thought leader|synergy|humbled|honou?red|leadership|wealth/gi, 2],
    [/core member|coordinator|president|\bvp\b|\bhead\b|\blead\b|organi[sz]er|society|societies/gi, 1.5],
    [/linkedin|followers|influencer|top voice|\bposts?\b/gi, 2],
    [/\([a-z0-9 ,+\-']+\)/g, 0.5],          // every "(lowercase disclaimer)" is extra yapping
  ],
  nepo: [[/uncle|aunt|dad'?s|papa|mom'?s|cousin|family friend|relatives?|father'?s/gi, 3]],
  delulu: [
    [/startup|founder|\bceo\b|stealth|pre.?revenue|investors?|incubat/gi, 2],
    [/\bai\b|\bagi\b|llm|machine learning|prompt engineer/gi, 1.5],
    [/top voice|self.?nominated|influencer|thought leader|visionary|generational wealth/gi, 2.5],
    [/full.?stack|rockstar|ninja|10x/gi, 1.5],
  ],
  grind: [
    [/leetcode|\bdsa\b|codeforces|codechef|icpc|problems/gi, 2],
    [/hackathons?/gi, 1],
    [/open.?source|\bprs?\b|gsoc|merged/gi, 1.5],
    [/\bc?gpa\b|\bintern(ship)?\b|research/gi, 1],
    [/\b(built|shipped|deployed|live|tests?|automated|serverless|scrap\w+|robot\w*|arduino)\b/gi, 1],
    [/c\+\+|java\b|python|react|backend|node/gi, 0.5],
  ],
  grass: [[/\b(gym|cricket|football|sports|dance|music|singing|volunteer|nss|ngo|trek\w*|plunge|outdoor|photograph\w*|travel)\b/gi, 3]],
  cap: [
    [/\([a-z0-9 ,+\-']+\)/g, 1.5],          // "won SIH (internal round)" is doing a lot; "(ES modules)" isn't
    [/internal round|fixed a typo|self.?nominated|self.?taught, \d+ days|0 users|none deployed|imports only|all co.?founders|mostly relatives/gi, 3],
    [/\b(\d{2,}|\d{1,3},\d{3})\s*(hackathons?|certificat\w*|courses?|clubs?|followers|languages)/gi, 2],
    [/\b(1[1-9]|[2-9]\d)\s*clubs?/gi, 2],
  ],
};

const clamp10 = (n) => Math.max(0, Math.min(10, Math.round(n)));

// "Core member of 9 clubs" is 9 times the yapping
const clubCount = (text) => [...text.matchAll(/(\d+)\s*(?:more\s+)?clubs?/gi)].reduce((n, m) => n + Number(m[1]), 0);

// Pass every line of the resume (scoreResume's allLines), not just the 14 the scan shows
export function analyzeResume(lines) {
  const text = lines.map((l) => l.text).join("\n");
  const count = (id) => FACTOR_SIGNALS[id].reduce((sum, [re, w]) => sum + (text.match(re) || []).length * w, 0);
  // the multipliers keep a normal resume away from 10 so the meters actually differ
  const scores = {
    yap: clamp10((1 + count("yap") + clubCount(text) * 0.5) * 0.6),
    nepo: clamp10(count("nepo")),
    delulu: clamp10((1 + count("delulu")) * 0.8),
    grind: clamp10(count("grind") * 0.6),
    grass: clamp10((1 + count("grass")) * 0.8),
    cap: clamp10((1 + count("cap")) * 0.6),
  };
  // Rizz: touching grass helps, being delulu helps a little, plus a pinch of chaos per resume
  const rizz = clamp10(2 + scores.grass * 0.5 + scores.delulu * 0.2 + (hash(text) % 4));
  return { scores, rizz };
}
