// "AuraGPT": a rule-based resume scorer. No servers, no LLM, just vibes and regex.
//
// How a resume gets judged:
//   1. tidyLines()  glues wrapped lines back together and drops headings, contact info and page numbers
//   2. scoreLine()  checks every line against ALL the signals below and adds up the points
//                   (so "built X, live, 169 tests" stacks up instead of stopping at the first match)
//   3. scoreResume() keeps the 14 lines that say the most (good or bad), in their original order

// ---------- line scoring ----------
// Each signal: { re, points, roast, kind? }. `kind` picks a special stamp on the scan screen.
// A few signals are functions of the match (m) so numbers can change the verdict.
const SIGNALS = [
  // --- real wins ---
  { re: /\b(won|winners?|1st|first place|champions?|gold medal)\b/i, points: 450, roast: "actual W. respect." },
  { re: /\b(runner.?up|2nd|3rd|second place|finalists?|top \d+|silver|bronze)\b/i, points: 220, roast: "podium aura" },
  { re: /\bintern(ship)?s?\b/i, points: 200, roast: "under investigation" },
  { re: /open.?source|\bgsoc\b|merged (prs|pull)|pull requests?|\bprs\b/i, points: 280, roast: "open source mogger" },
  { re: /leetcode|\bdsa\b|codeforces|codechef|\bicpc\b/i, points: 220, roast: "dsa grind. unc behaviour, respect" },
  { re: /\bc?gpa\b\s*[:\-]?\s*(\d+(\.\d+)?)/i,
    rule: (m) => (Number(m[1]) >= 9
      ? { points: 150, roast: "nerd aura (complimentary)" }
      : { points: 40, roast: "gpa mentioned. bold." }) },
  { re: /\b9\.\d\b|10\/10/i, points: 120, roast: "nerd aura (complimentary)" },

  // --- actually built something ---
  { re: /^(built|developed|created|designed|shipped|launched|deployed|engineered|automated|implemented|made|wrote|trained|architected|scrapes?|sends?|runs?|tracks?|led|started|organi[sz]ed|coordinat\w*|reduced|improved|increased|optimi[sz]ed|integrated|programmed|prototyped)\b/i,
    points: 60, roast: "verb first. resume-coded." },
  { re: /\b(live|deployed|in production|hosted on|vercel|netlify|github pages|play store|app store)\b/i, points: 120, roast: "it's live. not a localhost larp." },
  { re: /serverless|cron|github actions|\bci\b|\bci\/cd\b|docker|kubernetes|pipeline|webhooks?|service workers?|push notifications?|web push/i,
    points: 110, roast: "infra girlie / infra bro. scary." },
  { re: /scrap(e|es|er|ers|ing)\b|crawl(s|er|ing)?\b/i, points: 120, roast: "scrapes the internet so you don't have to. menace." },
  { re: /\bapi\b|backend|database|websockets?|real.?time|auto.?sorts?|automat\w+/i, points: 90, roast: "the code does stuff on its own. W." },
  { re: /(\d[\d,]*)\s*(automated\s+)?(unit\s+)?tests?\b|test suite|test coverage/i, points: 160, roast: "writes tests. unc-level discipline." },
  { re: /\barduino|raspberry pi|robot\w*|rover|sensors?|\biot\b|drone|microcontroller|motor drivers?|esp32/i,
    points: 150, roast: "touches circuits instead of grass" },
  { re: /\b(\d+)\+?\s*years?\b/i,
    rule: (m) => (Number(m[1]) >= 3 ? { points: 120, roast: `${m[1]} years? that's lore.` } : { points: 30, roast: "a fresh arc" }) },
  { re: /\bsolo\b|single.?handed|by myself|in one day|in 24 ?h(ou)?rs/i, points: 90, roast: "solo carry" },
  { re: /([\d,]+)\+?\s*(users|downloads|installs|stars|visitors|customers|signups|subscribers)\b/i,
    rule: (m) => (Number(m[1].replace(/,/g, "")) >= 50
      ? { points: 220, roast: "real users?? go touch them." }
      : { points: -120, roast: `${m[1]} users is a group chat` }) },
  { re: /\b\d[\d,]*\s*(students|members|people|participants|teams|attendees|%|x faster|ms\b|minutes|hours)/i,
    points: 70, roast: "numbers. HR loves numbers." },

  // --- leadership & clubs ---
  { re: /(\d+)\s*(?:more\s+)?clubs?/i,
    rule: (m) => (Number(m[1]) > 3
      ? { points: -300, roast: `${m[1]} clubs is physically impossible`, kind: "cap" }
      : { points: 120, roast: "club aura" }) },
  { re: /president|\bhead\b|\blead(er)?\b|captain|founded the|started the initiative|core member/i, points: 130, roast: "main character (club edition)" },
  { re: /coordinator|organi[sz]er|\bvp\b|secretary/i, points: 90, roast: "title farming (respectfully)" },
  { re: /\b(team )?member\b/i, points: 20, roast: "member #47 of the team" },
  { re: /\bhackathon/i, points: 110, roast: "grind acknowledged" },
  { re: /\b(\d{2,})\s*hackathons?/i, points: -60, roast: "hackathon tourist detected", kind: "tourist" },
  { re: /startup|founder|\bceo\b/i, points: 150, roast: "founder of a startup with 0 users" },
  { re: /stealth|pre.?revenue|incubated/i, points: -90, roast: "pre-revenue, pre-product, pre-everything" },

  // --- skills that count for a little ---
  { re: /\bai\b|artificial intelligence|machine learning|\bml\b|\bllm\b|deep learning|computer vision|\bnlp\b/i, points: 70, roast: "'no thanks i use ai' energy" },
  { re: /react|javascript|typescript|python|\bjava\b|c\+\+|node(\.js)?|\bgo(lang)?\b|rust|kotlin|swift/i, points: 40, roast: "skill diff" },
  { re: /figma|ui\/?ux|photograph\w*|canva|video edit\w*|illustrat\w*|animation/i, points: 60, roast: "has taste. rare in cse." },
  { re: /volunteer|\bngo\b|\bnss\b|special school|charity|fundrais/i, points: 100, roast: "kind aura" },
  { re: /\b(dance|music|singing|singer|sports|cricket|football|basketball|gym|marathon|trek\w*|theatre|band)\b/i, points: 140, roast: "touches grass. rare." },
  { re: /certificat|\bcourses?\b|udemy|coursera|nptel/i, points: 10, roast: "they were 2 hrs long, twin" },
  { re: /\b(\d{2,})\s*(free\s+)?(\w+\s+)?(certificat\w*|courses?)/i, points: -150, roast: "certificate collector. none were read." },

  // --- the Ls ---
  { re: /uncle|aunt|dad'?s|papa|mom'?s|cousin|family friend|relatives/i, points: -250, roast: "nepotism detected", kind: "nepo" },
  { re: /ms word|microsoft word|powerpoint|\bexcel\b/i, points: -100, roast: "proficient in word. groundbreaking." },
  { re: /hello world/i, points: -40, roast: "7 languages, 0 projects" },
  { re: /full.?stack/i, points: -150, roast: "larping as full-stack", kind: "larp" },
  { re: /to.?do app|calculator|weather app|tic.?tac.?toe/i, points: -150, roast: "the to-do app strikes again" },
  { re: /passionate|hard.?working|team player|motivated|go.?getter|detail.?oriented|enthusiast|self.?starter|quick learner/i,
    points: -80, roast: "glazing yourself detected", kind: "glaze" },
  { re: /linkedin|followers|influencer|top voice/i, points: -90, roast: "linkedin lunatic" },
  { re: /internal round|fixed a typo|self.?nominated|mostly relatives|all co.?founders|\(\d+ teams?\)|imports only/i,
    points: -300, roast: "the brackets are doing a lot of work", kind: "cap" },
  { re: /\[[^\]]*\]/, points: -40, roast: "forgot to fill in the template, twin" },
  { re: /attendance/i, points: -120, roast: "attendance mentioned. sus." },
];

// Lines that match nothing: long ones are probably real work, short ones get a repeatable joke
const FALLBACK = [
  [12, "mid line, ngl"], [-20, "giving npc energy"], [35, "lowkey cooking"],
  [-8, "womp womp"], [6, "6-7 line"], [49, "7x7=49 vibes"], [-30, "chopped wording"],
];
const FALLBACK_LONG = [[40, "lowkey cooking"], [30, "it's giving effort"], [45, "AuraGPT is intrigued"]];

// "Languages: JS, Python, C++" style lines: a small flex per tool, capped
const SKILLS_LINE = /^(languages?|skills|tech(nical)?( skills| stack)?|tools?( & \w+)?|frameworks?|web|hardware|design|libraries|databases?|platforms?)\s*:/i;

const LINE_MIN = -500, LINE_MAX = 500;
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7) >>> 0;

function scoreSkillsLine(text) {
  const items = text.split(":").slice(1).join(":").split(/[,;/]|\band\b/).filter((s) => s.trim()).length;
  const points = Math.min(150, items * 15);
  return { points, roast: items >= 6 ? `${items} tools listed. tutorial count unknown.` : "skills section. noted." };
}

export function scoreLine(text) {
  if (SKILLS_LINE.test(text)) return scoreSkillsLine(text);

  const hits = [];
  for (const s of SIGNALS) {
    const m = text.match(s.re);
    if (m) hits.push(s.rule ? s.rule(m) : s);
  }
  if (!hits.length) {
    const pool = text.split(/\s+/).length >= 8 ? FALLBACK_LONG : FALLBACK;
    const [points, roast] = pool[hash(text) % pool.length];
    return { points, roast };
  }

  // A cap / nepo / glaze / larp line keeps only a quarter of its good points:
  // "won SIH (internal round)" is not a win, it's a bracket doing a lot of work.
  const flagged = hits.some((h) => h.kind);
  const total = hits.reduce((sum, h) => sum + (flagged && h.points > 0 ? h.points / 4 : h.points), 0);
  const points = Math.round(Math.max(LINE_MIN, Math.min(LINE_MAX, total)) / 5) * 5;
  // The roast comes from whichever signal mattered most, but a special "kind" (nepo, cap…) always wins
  const loudest = hits.find((h) => h.kind && h.points < 0)
    || [...hits].sort((a, b) => Math.abs(b.points) - Math.abs(a.points))[0];
  // Stacked a lot of good stuff? Say so.
  const roast = hits.length >= 3 && points >= 300 ? `stacked W: ${loudest.roast}` : loudest.roast;
  return { points, roast, ...(loudest.kind ? { kind: loudest.kind } : {}) };
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
export const MAX_LINES = 14;   // the scan animates each line, so long resumes get trimmed to 14
const ROAST_SLOTS = 3;         // ...but the 3 weakest lines always stay in, so there's something to roast

export const TIERS = [
  { min: -Infinity, name: "certified npc", roast: "negative vibes. HR is crying. so are we." },
  { min: 1800, name: "unc energy", roast: "you're giving 'reply all' in the class group." },
  { min: 2800, name: "aura farmer", roast: "solid grind. suspicious amount of certificates tho." },
  { min: 3300, name: "certified linkedin sigma", roast: "you're mogging most of your batch. participation certs carrying hard." },
  { min: 4300, name: "mogging the whole batch", roast: "seniors are taking notes. 7x7=49 resume." },
  { min: 5600, name: "placement cell's final boss", roast: "you actually ship things. HR is scared of you." },
];

export const tierFor = (total) => [...TIERS].reverse().find((t) => total >= t.min);

export function scoreResume(text) {
  const all = tidyLines(text.split(/\n+/)).map((line) => ({ text: line, ...scoreLine(line) }));
  // Too many lines? Keep the 3 weakest, then the loudest ones (biggest + or −), in the order they were written
  const byPoints = all.map((l, i) => i).sort((a, b) => all[a].points - all[b].points);
  const keep = new Set(byPoints.slice(0, ROAST_SLOTS));
  byPoints.sort((a, b) => Math.abs(all[b].points) - Math.abs(all[a].points))
    .forEach((i) => { if (keep.size < MAX_LINES) keep.add(i); });
  const lines = all.filter((_, i) => keep.has(i));
  const total = BASE_AURA + lines.reduce((sum, l) => sum + l.points, 0);
  return { lines, total, tier: tierFor(total) };
}

// ---------- the AuraGPT breakdown ----------
// Each factor counts "signals" in your resume. Every signal is [regex, weight].
// The score is 0-10: more signals = higher. Copy for each factor lives in data.js (FACTORS).
const FACTOR_SIGNALS = {
  yap: [
    [/passionate|hard.?working|team player|motivated|go.?getter|detail.?oriented|enthusiast|visionary|thought leader|synergy|humbled|honou?red|leadership|wealth/gi, 2],
    [/core member|coordinator|president|\bvp\b|\bhead\b|\blead\b|organi[sz]er|society|societies/gi, 1.5],
    [/linkedin|followers|influencer|top voice|\bposts?\b/gi, 2],
    [/\(.+?\)/g, 0.5],                      // every "(disclaimer)" is extra yapping
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
    [/\(.+?\)/g, 1.5],                      // "won SIH (internal round)" is doing a lot
    [/internal round|fixed a typo|self.?nominated|self.?taught, \d+ days|0 users|none deployed|imports only|all co.?founders|mostly relatives/gi, 3],
    [/\b(\d{2,}|\d{1,3},\d{3})\s*(hackathons?|certificat\w*|courses?|clubs?|followers|languages)/gi, 2],
    [/\b(1[1-9]|[2-9]\d)\s*clubs?/gi, 2],
  ],
};

const clamp10 = (n) => Math.max(0, Math.min(10, Math.round(n)));

// "Core member of 9 clubs" is 9 times the yapping
const clubCount = (text) => [...text.matchAll(/(\d+)\s*(?:more\s+)?clubs?/gi)].reduce((n, m) => n + Number(m[1]), 0);

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
