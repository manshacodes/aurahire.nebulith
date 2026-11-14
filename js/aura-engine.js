// "AuraGPT": a rule-based resume scorer. No servers, no LLM, just vibes and regex.
// Each resume line is checked against the rules in order; the first match wins.

const RULES = [
  { re: /\b(won|winner|1st|first place|champion)\b/i, points: 500, roast: "actual W. respect." },
  { re: /uncle|dad'?s|papa|cousin|family friend/i, points: -150, roast: "nepotism detected" },
  { re: /\b\d{2,}\s*hackathons?/i, points: 50, roast: "hackathon tourist detected" },
  { re: /hackathon/i, points: 120, roast: "grind acknowledged" },
  {
    re: /(\d+)\s*clubs?/i,
    rule: (m) => (Number(m[1]) > 3
      ? { points: -400, roast: `${m[1]} clubs is physically impossible` }
      : { points: 150, roast: "club aura" }),
  },
  { re: /core member|coordinator|\bhead\b|\blead\b|president/i, points: 150, roast: "title farming" },
  { re: /ms word|microsoft word|powerpoint|excel/i, points: -100, roast: "proficient in word. groundbreaking." },
  { re: /hello world/i, points: 7, roast: "7 languages, 0 projects" },
  { re: /certificat|courses?|udemy|coursera|nptel/i, points: 1, roast: "they were 2 hrs long, twin" },
  { re: /full.?stack/i, points: -300, roast: "larping as full-stack" },
  { re: /to.?do app|calculator|weather app/i, points: -120, roast: "the to-do app strikes again" },
  { re: /passionate|hard.?working|team player|motivated|go.?getter|detail.?oriented/i, points: -50, roast: "glazing yourself detected" },
  { re: /intern(ship)?/i, points: 200, roast: "under investigation" },
  { re: /leetcode|\bdsa\b|codeforces|codechef/i, points: 250, roast: "dsa grind. unc behaviour, respect" },
  { re: /open.?source|github|contribut|gsoc/i, points: 300, roast: "open source mogger" },
  { re: /\bc?gpa\b|\b9\.\d\b|10\/10/i, points: 120, roast: "nerd aura (complimentary)" },
  { re: /\bai\b|machine learning|\bml\b|chatgpt|llm/i, points: 80, roast: "'no thanks i use ai' energy" },
  { re: /startup|founder|\bceo\b/i, points: 333, roast: "founder of a startup with 0 users" },
  { re: /react|javascript|python|\bjava\b|c\+\+|figma/i, points: 90, roast: "skill diff" },
  { re: /volunteer|\bngo\b|\bnss\b/i, points: 100, roast: "kind aura" },
  { re: /dance|music|sing|sports|cricket|football|gym/i, points: 150, roast: "touches grass. rare." },
  { re: /linkedin|followers|influencer/i, points: -69, roast: "linkedin lunatic" },
];

// Lines that match nothing get a "random" (but repeatable) verdict.
const FALLBACK = [
  [12, "mid line, ngl"], [-20, "giving npc energy"], [35, "lowkey cooking"],
  [-8, "womp womp"], [6, "6-7 line"], [49, "7x7=49 vibes"], [-30, "chopped wording"],
];

export const BASE_AURA = 3000; // everyone starts with some aura for existing

export const TIERS = [
  { min: -Infinity, name: "certified npc", roast: "negative vibes. HR is crying. so are we." },
  { min: 2000, name: "unc energy", roast: "you're giving 'reply all' in the class group." },
  { min: 2800, name: "aura farmer", roast: "solid grind. suspicious amount of certificates tho." },
  { min: 3300, name: "certified linkedin sigma", roast: "you're mogging most of your batch. participation certs carrying hard." },
  { min: 4300, name: "mogging the whole batch", roast: "seniors are taking notes. 7x7=49 resume." },
];

const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7) >>> 0;

export function scoreLine(text) {
  for (const r of RULES) {
    const m = text.match(r.re);
    if (m) return r.rule ? r.rule(m) : { points: r.points, roast: r.roast };
  }
  const [points, roast] = FALLBACK[hash(text) % FALLBACK.length];
  return { points, roast };
}

export const tierFor = (total) => [...TIERS].reverse().find((t) => total >= t.min);

export function scoreResume(text) {
  const lines = text
    .split(/\n+/)
    .map((l) => l.replace(/^[\s•\-*·]+/, "").trim())
    .filter(Boolean)
    .slice(0, 14)
    .map((line) => ({ text: line, ...scoreLine(line) }));
  const total = BASE_AURA + lines.reduce((sum, l) => sum + l.points, 0);
  return { lines, total, tier: tierFor(total) };
}
